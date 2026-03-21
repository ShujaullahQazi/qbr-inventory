from fastapi import APIRouter, HTTPException, status, Query, Request
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from bson import ObjectId
from database import listings_collection, users_collection
from models import ListingCreate, ListingUpdate
from utils.matching import find_matches_for_listing, create_matches_and_notify, remove_stale_matches, MATCH_CRITICAL_FIELDS

router = APIRouter(prefix="/listings", tags=["Listings"])


def _get_user_id(request: Request) -> str:
    user_id = getattr(request.state, "user_id", "")
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user_id


async def _require_verified(request: Request) -> str:
    """Get user_id and verify the user is approved."""
    user_id = _get_user_id(request)
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user or not user.get("is_verified", False):
        raise HTTPException(status_code=403, detail="Account pending approval")
    return user_id


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_listing(listing: ListingCreate, request: Request) -> Dict[str, Any]:
    user_id = await _require_verified(request)

    listing_doc = {
        "user_id": user_id,
        "type": listing.type,
        "property_type": listing.property_type,
        "size": listing.size,
        "location": listing.location,
        "budget": listing.budget,
        "description": listing.description,
        "contact_note": listing.contact_note,
        "status": "active",
        "created_at": datetime.now(timezone.utc),
    }

    result = await listings_collection.insert_one(listing_doc)
    listing_doc["_id"] = result.inserted_id

    # Trigger matching
    matched = await find_matches_for_listing(listing_doc)
    match_ids = []
    if matched:
        match_ids = await create_matches_and_notify(listing_doc, matched)

    return {
        "message": "Listing created successfully",
        "listing_id": str(result.inserted_id),
        "matches_found": len(match_ids),
        "match_ids": match_ids,
    }


@router.get("/")
async def get_listings(
    type: Optional[str] = Query(None),
    property_type: Optional[str] = Query(None),
    size: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    budget_min: Optional[float] = Query(None),
    budget_max: Optional[float] = Query(None),
    status: Optional[str] = Query("active"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
) -> Dict[str, Any]:
    """Search and filter listings with pagination."""
    query = {}
    if type:
        query["type"] = type
    if property_type:
        query["property_type"] = property_type
    if size:
        query["size"] = {"$regex": size, "$options": "i"}
    if location:
        query["location"] = {"$regex": location, "$options": "i"}
    if status:
        query["status"] = status
    if budget_min is not None or budget_max is not None:
        budget_query = {}
        if budget_min is not None:
            budget_query["$gte"] = budget_min
        if budget_max is not None:
            budget_query["$lte"] = budget_max
        query["budget"] = budget_query

    skip = (page - 1) * limit
    total = await listings_collection.count_documents(query)
    cursor = listings_collection.find(query).sort("created_at", -1).skip(skip).limit(limit)
    listings = await cursor.to_list(limit)

    enriched = []
    for lst in listings:
        user = None
        if ObjectId.is_valid(lst["user_id"]):
            user = await users_collection.find_one({"_id": ObjectId(lst["user_id"])})
        enriched.append({
            "_id": str(lst["_id"]),
            "user_id": lst["user_id"],
            "dealer_name": user["name"] if user else "Unknown",
            "dealer_phone": user["phone"] if user else "",
            "type": lst["type"],
            "property_type": lst["property_type"],
            "size": lst["size"],
            "location": lst["location"],
            "budget": lst.get("budget"),
            "description": lst.get("description"),
            "contact_note": lst.get("contact_note"),
            "status": lst["status"],
            "created_at": lst["created_at"].isoformat(),
        })

    return {
        "listings": enriched,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": max(1, (total + limit - 1) // limit),
    }


@router.get("/my")
async def get_my_listings(request: Request) -> Dict[str, Any]:
    user_id = _get_user_id(request)
    listings = await listings_collection.find({"user_id": user_id}).sort("created_at", -1).to_list(100)
    result = []
    for lst in listings:
        result.append({
            "_id": str(lst["_id"]),
            "user_id": lst["user_id"],
            "type": lst["type"],
            "property_type": lst["property_type"],
            "size": lst["size"],
            "location": lst["location"],
            "budget": lst.get("budget"),
            "description": lst.get("description"),
            "contact_note": lst.get("contact_note"),
            "status": lst["status"],
            "created_at": lst["created_at"].isoformat(),
        })
    return {"listings": result}


@router.put("/{listing_id}")
async def update_listing(listing_id: str, update: ListingUpdate, request: Request) -> Dict[str, Any]:
    user_id = _get_user_id(request)
    if not ObjectId.is_valid(listing_id):
        raise HTTPException(status_code=400, detail="Invalid listing ID")

    listing = await listings_collection.find_one({"_id": ObjectId(listing_id)})
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if listing["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")

    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    # Check if any match-critical fields changed
    critical_changed = any(
        k in MATCH_CRITICAL_FIELDS and update_data[k] != listing.get(k)
        for k in update_data
    )

    await listings_collection.update_one({"_id": ObjectId(listing_id)}, {"$set": update_data})

    matches_found = 0
    stale_removed = 0

    if critical_changed and listing.get("status") == "active":
        # Remove old matches that are now stale
        stale_removed = await remove_stale_matches(listing_id)

        # Re-fetch the updated listing for fresh matching
        updated_listing = await listings_collection.find_one({"_id": ObjectId(listing_id)})
        if updated_listing:
            matched = await find_matches_for_listing(updated_listing)
            if matched:
                match_ids = await create_matches_and_notify(updated_listing, matched)
                matches_found = len(match_ids)

    return {
        "message": "Listing updated successfully",
        "critical_changed": critical_changed,
        "stale_removed": stale_removed,
        "matches_found": matches_found,
    }


@router.delete("/{listing_id}")
async def delete_listing(listing_id: str, request: Request) -> Dict[str, str]:
    user_id = _get_user_id(request)
    if not ObjectId.is_valid(listing_id):
        raise HTTPException(status_code=400, detail="Invalid listing ID")

    listing = await listings_collection.find_one({"_id": ObjectId(listing_id)})
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if listing["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")

    await listings_collection.delete_one({"_id": ObjectId(listing_id)})
    return {"message": "Listing deleted successfully"}
