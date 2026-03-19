from motor.motor_asyncio import AsyncIOMotorClient
from config import MONGODB_URL, DATABASE_NAME

client = AsyncIOMotorClient(MONGODB_URL)
db = client[DATABASE_NAME]

# Collections
users_collection = db["users"]
listings_collection = db["listings"]
matches_collection = db["matches"]
notifications_collection = db["notifications"]
metadata_collection = db["metadata"]
