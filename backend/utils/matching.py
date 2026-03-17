from datetime import datetime, timezone
from database import listings_collection, matches_collection, notifications_collection, users_collection


async def find_matches_for_listing(listing: dict) -> list:
    """
    When a new listing is created, find potential matches:
    - If listing is a 'need', find 'available' listings with same property_type, size, and location
    - If listing is an 'available', find 'need' listings with same property_type, size, and location
    """
    opposite_type = "available" if listing["type"] == "need" else "need"

    query = {
        "type": opposite_type,
        "property_type": listing["property_type"],
        "size": {"$regex": f"^{listing['size']}$", "$options": "i"},
        "location": {"$regex": f"^{listing['location']}$", "$options": "i"},
        "status": "active",
        "user_id": {"$ne": listing["user_id"]},  # Don't match with own listings
    }

    matching_listings = await listings_collection.find(query).to_list(100)
    return matching_listings


async def create_matches_and_notify(new_listing: dict, matched_listings: list):
    """
    Create match records and notifications for both parties.
    """
    created_matches = []

    for matched in matched_listings:
        # Determine need and available
        if new_listing["type"] == "need":
            need_id = str(new_listing["_id"])
            avail_id = str(matched["_id"])
            need_user_id = new_listing["user_id"]
            avail_user_id = matched["user_id"]
        else:
            need_id = str(matched["_id"])
            avail_id = str(new_listing["_id"])
            need_user_id = matched["user_id"]
            avail_user_id = new_listing["user_id"]

        # Check if match already exists
        existing = await matches_collection.find_one({
            "need_listing_id": need_id,
            "available_listing_id": avail_id,
        })
        if existing:
            continue

        now = datetime.now(timezone.utc)

        match_doc = {
            "need_listing_id": need_id,
            "available_listing_id": avail_id,
            "need_user_id": need_user_id,
            "available_user_id": avail_user_id,
            "status": "pending",
            "created_at": now,
        }

        result = await matches_collection.insert_one(match_doc)
        match_id = str(result.inserted_id)

        # Get dealer names
        need_dealer = await users_collection.find_one({"_id": need_user_id}) if isinstance(need_user_id, str) else None
        avail_dealer = await users_collection.find_one({"_id": avail_user_id}) if isinstance(avail_user_id, str) else None

        need_name = need_dealer["name"] if need_dealer else "A dealer"
        avail_name = avail_dealer["name"] if avail_dealer else "A dealer"

        size = new_listing.get("size", "")
        location = new_listing.get("location", "")
        prop_type = new_listing.get("property_type", "property")

        # Notify the need poster
        await notifications_collection.insert_one({
            "user_id": need_user_id,
            "message": f"🎯 Match found! {avail_name} has a {size} {prop_type} available in {location}.",
            "match_id": match_id,
            "is_read": False,
            "created_at": now,
        })

        # Notify the available poster
        await notifications_collection.insert_one({
            "user_id": avail_user_id,
            "message": f"🎯 Match found! {need_name} needs a {size} {prop_type} in {location}.",
            "match_id": match_id,
            "is_read": False,
            "created_at": now,
        })

        created_matches.append(match_id)

    return created_matches
