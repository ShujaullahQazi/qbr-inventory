from fastapi import APIRouter, HTTPException, Request
from typing import Dict, Any, List
from bson import ObjectId
from database import users_collection, listings_collection

router = APIRouter(prefix="/admin", tags=["Admin"])


async def _require_admin(request: Request) -> str:
    """Verify the current user has admin role."""
    user_id = getattr(request.state, "user_id", "")
    if not user_id or not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=401, detail="Not authenticated")

    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    return user_id


@router.get("/users/pending")
async def get_pending_users(request: Request) -> Dict[str, Any]:
    await _require_admin(request)

    cursor = users_collection.find({"is_verified": False}).sort("created_at", -1)
    users = await cursor.to_list(100)

    result: List[Dict[str, Any]] = []
    for u in users:
        result.append({
            "_id": str(u["_id"]),
            "name": u["name"],
            "phone": u["phone"],
            "sector": u.get("sector", ""),
            "agency_name": u.get("agency_name"),
            "created_at": u["created_at"].isoformat(),
        })

    return {"users": result}


@router.put("/users/{user_id}/approve")
async def approve_user(user_id: str, request: Request) -> Dict[str, str]:
    await _require_admin(request)

    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")

    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"is_verified": True}}
    )

    return {"message": f"User {user['name']} approved successfully"}


@router.delete("/users/{user_id}/reject")
async def reject_user(user_id: str, request: Request) -> Dict[str, str]:
    await _require_admin(request)

    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")

    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Delete user's listings first
    await listings_collection.delete_many({"user_id": str(user["_id"])})
    await users_collection.delete_one({"_id": ObjectId(user_id)})

    return {"message": f"User {user['name']} rejected and removed"}
