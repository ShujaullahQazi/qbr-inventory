from fastapi import APIRouter, HTTPException, status, Request
from typing import Dict, Any
from datetime import datetime, timezone
from bson import ObjectId
from database import users_collection
from models import UserCreate, UserLogin
from utils.auth import hash_password, verify_password, create_access_token
from config import ADMIN_PHONE

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate) -> Dict[str, Any]:
    existing = await users_collection.find_one({"phone": user.phone})
    if existing:
        raise HTTPException(status_code=409, detail="Phone number already registered")

    is_admin = user.phone == ADMIN_PHONE and ADMIN_PHONE != ""
    role = "admin" if is_admin else "dealer"

    user_doc = {
        "name": user.name,
        "phone": user.phone,
        "password": hash_password(user.password),
        "sector": user.sector,
        "agency_name": user.agency_name,
        "role": role,
        "is_verified": is_admin,  # Admin is auto-verified
        "created_at": datetime.now(timezone.utc),
    }

    result = await users_collection.insert_one(user_doc)
    user_id = str(result.inserted_id)
    token = create_access_token({"sub": user_id, "phone": user.phone})

    return {
        "message": "Registration successful",
        "token": token,
        "user": {
            "_id": user_id,
            "name": user.name,
            "phone": user.phone,
            "sector": user.sector,
            "agency_name": user.agency_name,
            "role": role,
            "is_verified": is_admin,
        },
    }


@router.post("/login")
async def login(credentials: UserLogin) -> Dict[str, Any]:
    user = await users_collection.find_one({"phone": credentials.phone})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid phone number or password")

    # Auto-upgrade existing admin user if ADMIN_PHONE matches
    if credentials.phone == ADMIN_PHONE and ADMIN_PHONE != "":
        if user.get("role") != "admin" or not user.get("is_verified"):
            await users_collection.update_one(
                {"_id": user["_id"]},
                {"$set": {"role": "admin", "is_verified": True}}
            )
            user["role"] = "admin"
            user["is_verified"] = True

    user_id = str(user["_id"])
    token = create_access_token({"sub": user_id, "phone": user["phone"]})

    return {
        "message": "Login successful",
        "token": token,
        "user": {
            "_id": user_id,
            "name": user["name"],
            "phone": user["phone"],
            "sector": user["sector"],
            "agency_name": user.get("agency_name"),
            "role": user.get("role", "dealer"),
            "is_verified": user.get("is_verified", False),
        },
    }


@router.get("/me")
async def get_me(request: Request) -> Dict[str, Any]:
    user_id = getattr(request.state, "user_id", "")
    if not user_id or not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=401, detail="Not authenticated")

    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "_id": str(user["_id"]),
        "name": user["name"],
        "phone": user["phone"],
        "sector": user["sector"],
        "agency_name": user.get("agency_name"),
        "role": user.get("role", "dealer"),
        "is_verified": user.get("is_verified", False),
    }
