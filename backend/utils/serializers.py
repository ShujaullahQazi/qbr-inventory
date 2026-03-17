from typing import Dict, Any, Optional

def serialize_listing(lst: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
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

def serialize_dealer(d: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    if not d:
        return None
    return {
        "name": d["name"],
        "phone": d["phone"],
        "sector": d.get("sector", ""),
        "agency_name": d.get("agency_name"),
    }
