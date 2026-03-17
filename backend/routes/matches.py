from fastapi import APIRouter, HTTPException, Query, Request
from bson import ObjectId
from database import matches_collection, listings_collection, users_collection, notifications_collection

router = APIRouter(prefix="/matches", tags=["Matches"])


def _get_user_id(request: Request) -> str:
    user_id = getattr(request.state, "user_id", "")
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user_id


@router.get("/")
async def get_my_matches(request: Request):
    user_id = _get_user_id(request)
    matches = await matches_collection.find({
        "$or": [{"need_user_id": user_id}, {"available_user_id": user_id}]
    }).sort("created_at", -1).to_list(100)

    enriched = []
    for match in matches:
        need_listing = avail_listing = need_dealer = avail_dealer = None

        if ObjectId.is_valid(match.get("need_listing_id", "")):
            need_listing = await listings_collection.find_one({"_id": ObjectId(match["need_listing_id"])})
        if ObjectId.is_valid(match.get("available_listing_id", "")):
            avail_listing = await listings_collection.find_one({"_id": ObjectId(match["available_listing_id"])})
        if ObjectId.is_valid(match.get("need_user_id", "")):
            need_dealer = await users_collection.find_one({"_id": ObjectId(match["need_user_id"])})
        if ObjectId.is_valid(match.get("available_user_id", "")):
            avail_dealer = await users_collection.find_one({"_id": ObjectId(match["available_user_id"])})

        def listing_dict(lst):
            if not lst:
                return None
            return {
                "_id": str(lst["_id"]),
                "property_type": lst["property_type"],
                "size": lst["size"],
                "location": lst["location"],
                "budget": lst.get("budget"),
                "description": lst.get("description"),
            }

        def dealer_dict(d):
            if not d:
                return None
            return {
                "name": d["name"],
                "phone": d["phone"],
                "sector": d.get("sector", ""),
                "agency_name": d.get("agency_name"),
            }

        enriched.append({
            "_id": str(match["_id"]),
            "need_listing": listing_dict(need_listing),
            "available_listing": listing_dict(avail_listing),
            "need_dealer": dealer_dict(need_dealer),
            "available_dealer": dealer_dict(avail_dealer),
            "status": match["status"],
            "created_at": match["created_at"].isoformat(),
        })

    return {"matches": enriched}


@router.put("/{match_id}/status")
async def update_match_status(match_id: str, request: Request, status: str = Query(...)):
    user_id = _get_user_id(request)
    if not ObjectId.is_valid(match_id):
        raise HTTPException(status_code=400, detail="Invalid match ID")

    match = await matches_collection.find_one({"_id": ObjectId(match_id)})
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    if match["need_user_id"] != user_id and match["available_user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")

    allowed = ["accepted", "rejected", "closed"]
    if status not in allowed:
        raise HTTPException(status_code=400, detail=f"Status must be one of: {allowed}")

    await matches_collection.update_one({"_id": ObjectId(match_id)}, {"$set": {"status": status}})
    return {"message": f"Match status updated to '{status}'"}


# --- Notifications ---

@router.get("/notifications")
async def get_notifications(request: Request, unread_only: bool = Query(False)):
    user_id = _get_user_id(request)
    query = {"user_id": user_id}
    if unread_only:
        query["is_read"] = False

    notifications = await notifications_collection.find(query).sort("created_at", -1).to_list(50)
    result = []
    for n in notifications:
        result.append({
            "_id": str(n["_id"]),
            "user_id": n["user_id"],
            "message": n["message"],
            "match_id": n.get("match_id"),
            "is_read": n["is_read"],
            "created_at": n["created_at"].isoformat(),
        })
    return {"notifications": result}


@router.put("/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str, request: Request):
    user_id = _get_user_id(request)
    if not ObjectId.is_valid(notification_id):
        raise HTTPException(status_code=400, detail="Invalid notification ID")

    notification = await notifications_collection.find_one({"_id": ObjectId(notification_id)})
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    if notification["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")

    await notifications_collection.update_one({"_id": ObjectId(notification_id)}, {"$set": {"is_read": True}})
    return {"message": "Notification marked as read"}


@router.put("/notifications/read-all")
async def mark_all_notifications_read(request: Request):
    user_id = _get_user_id(request)
    await notifications_collection.update_many({"user_id": user_id, "is_read": False}, {"$set": {"is_read": True}})
    return {"message": "All notifications marked as read"}
