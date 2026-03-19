from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime
from bson import ObjectId


# --- Helper for ObjectId ---
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, _info=None):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type, _handler):
        from pydantic_core import core_schema
        return core_schema.no_info_plain_validator_function(
            cls.validate,
            serialization=core_schema.to_string_ser_schema(),
        )


# ========================
# USER / DEALER MODELS
# ========================
class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., pattern=r"^\+?[0-9]{10,15}$")
    password: str = Field(..., min_length=6)
    sector: str = Field(..., min_length=2, max_length=50)
    agency_name: Optional[str] = None


class UserLogin(BaseModel):
    phone: str = Field(..., pattern=r"^\+?[0-9]{10,15}$")
    password: str


class UserOut(BaseModel):
    id: str = Field(..., alias="_id")
    name: str
    phone: str
    sector: str
    agency_name: Optional[str] = None
    role: str = "dealer"
    is_verified: bool = False
    created_at: datetime

    class Config:
        populate_by_name = True


# ========================
# LISTING MODELS
# ========================
class ListingCreate(BaseModel):
    type: Literal["need", "available"]
    property_type: str = Field(..., description="Must match a known property type from /metadata")
    size: str = Field(..., description="e.g. 5 Marla, 10 Marla, 1 Kanal")
    location: str = Field(..., description="e.g. G-13, G-14/1")
    budget: Optional[float] = None
    description: Optional[str] = None
    contact_note: Optional[str] = None


class ListingOut(BaseModel):
    id: str = Field(..., alias="_id")
    user_id: str
    dealer_name: Optional[str] = None
    dealer_phone: Optional[str] = None
    type: str
    property_type: str
    size: str
    location: str
    budget: Optional[float] = None
    description: Optional[str] = None
    contact_note: Optional[str] = None
    status: str = "active"
    created_at: datetime

    class Config:
        populate_by_name = True


class ListingUpdate(BaseModel):
    type: Optional[Literal["need", "available"]] = None
    property_type: Optional[str] = None
    size: Optional[str] = None
    location: Optional[str] = None
    budget: Optional[float] = None
    description: Optional[str] = None
    contact_note: Optional[str] = None
    status: Optional[Literal["active", "closed", "matched"]] = None


# ========================
# MATCH MODELS
# ========================
class MatchOut(BaseModel):
    id: str = Field(..., alias="_id")
    need_listing: Optional[dict] = None
    available_listing: Optional[dict] = None
    need_dealer: Optional[dict] = None
    available_dealer: Optional[dict] = None
    status: str = "pending"
    created_at: datetime

    class Config:
        populate_by_name = True


# ========================
# NOTIFICATION MODELS
# ========================
class NotificationOut(BaseModel):
    id: str = Field(..., alias="_id")
    user_id: str
    message: str
    match_id: Optional[str] = None
    is_read: bool = False
    created_at: datetime

    class Config:
        populate_by_name = True
