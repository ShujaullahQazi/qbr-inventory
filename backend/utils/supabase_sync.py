import traceback
from typing import Dict, Any
from database import supabase_client

def sync_user_to_supabase(user_doc: Dict[str, Any]) -> None:
    if not supabase_client:
        return
    try:
        pg_user = {
            "legacy_mongo_id": str(user_doc["_id"]),
            "name": user_doc.get("name"),
            "phone": user_doc.get("phone"),
            "sector": user_doc.get("sector"),
            "agency_name": user_doc.get("agency_name"),
            "role": user_doc.get("role", "dealer"),
            "is_verified": user_doc.get("is_verified", False),
            "created_at": user_doc["created_at"].isoformat() if hasattr(user_doc.get("created_at"), 'isoformat') else user_doc.get("created_at")
        }
        supabase_client.table("users").insert(pg_user).execute()
    except Exception as e:
        print(f"Error syncing user to Supabase: {e}")

def sync_listing_to_supabase(listing_doc: Dict[str, Any], action: str) -> None:
    if not supabase_client:
        return
    try:
        legacy_id = str(listing_doc["_id"])
        
        if action == "create":
            pg_listing = {
                "legacy_mongo_id": legacy_id,
                "legacy_user_mongo_id": str(listing_doc.get("user_id", "")),
                "type": listing_doc.get("type"),
                "property_type": listing_doc.get("property_type"),
                "size": listing_doc.get("size"),
                "location": listing_doc.get("location"),
                "budget": listing_doc.get("budget"),
                "description": listing_doc.get("description"),
                "contact_note": listing_doc.get("contact_note"),
                "status": listing_doc.get("status", "active"),
                "created_at": listing_doc["created_at"].isoformat() if hasattr(listing_doc.get("created_at"), 'isoformat') else listing_doc.get("created_at")
            }
            supabase_client.table("listings").insert(pg_listing).execute()

        elif action == "update":
            pg_update = {}
            valid_fields = ["type", "property_type", "size", "location", "budget", "description", "contact_note", "status"]
            for field in valid_fields:
                if field in listing_doc:
                    pg_update[field] = listing_doc[field]
            
            if pg_update:
                supabase_client.table("listings").update(pg_update).eq("legacy_mongo_id", legacy_id).execute()

        elif action == "delete":
            supabase_client.table("listings").delete().eq("legacy_mongo_id", legacy_id).execute()
            
    except Exception as e:
        print(f"Error syncing listing to Supabase ({action}): {e}")
