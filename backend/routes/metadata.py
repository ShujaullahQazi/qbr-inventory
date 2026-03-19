import time
from fastapi import APIRouter, HTTPException, Request
from typing import Dict, Any
from database import metadata_collection
from constants import PROPERTY_TYPES, PROPERTY_SIZES, SECTORS

router = APIRouter(prefix="/metadata", tags=["Metadata"])

# --- In-memory cache ---
_cache: Dict[str, Any] | None = None
_cache_until: float = 0
CACHE_TTL_SECONDS = 3600  # 1 hour


def _invalidate_cache() -> None:
    """Force refresh on next request (call after admin updates)."""
    global _cache, _cache_until
    _cache = None
    _cache_until = 0


async def _get_or_seed() -> Dict[str, Any]:
    """Return metadata from cache, DB, or seed DB if empty."""
    global _cache, _cache_until

    # Serve from memory if still fresh
    if _cache and time.time() < _cache_until:
        return _cache

    # Try DB
    doc = await metadata_collection.find_one({"_id": "config"})

    if not doc:
        # First run — seed from constants.py
        seed = {
            "_id": "config",
            "property_types": PROPERTY_TYPES,
            "property_sizes": PROPERTY_SIZES,
            "sectors": SECTORS,
        }
        await metadata_collection.insert_one(seed)
        doc = seed

    result = {
        "property_types": doc["property_types"],
        "property_sizes": doc["property_sizes"],
        "sectors": doc["sectors"],
    }

    # Store in cache
    _cache = result
    _cache_until = time.time() + CACHE_TTL_SECONDS
    return result


@router.get("")
async def get_metadata() -> Dict[str, Any]:
    """Public endpoint: returns all dropdown options for forms."""
    return await _get_or_seed()


@router.put("")
async def update_metadata(
    request: Request,
    body: Dict[str, Any],
) -> Dict[str, str]:
    """Admin-only: update property types, sizes, or sectors."""
    user_id = getattr(request.state, "user_id", "")
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    from bson import ObjectId
    from database import users_collection
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    # Only allow updating known fields
    allowed = {"property_types", "property_sizes", "sectors"}
    update = {k: v for k, v in body.items() if k in allowed}
    if not update:
        raise HTTPException(status_code=400, detail="No valid fields to update")

    await metadata_collection.update_one(
        {"_id": "config"},
        {"$set": update},
        upsert=True,
    )

    _invalidate_cache()
    return {"message": "Metadata updated successfully"}
