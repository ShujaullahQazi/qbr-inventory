from motor.motor_asyncio import AsyncIOMotorClient
from config import MONGODB_URL, DATABASE_NAME, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
from supabase import create_client, Client

client = AsyncIOMotorClient(MONGODB_URL)
db = client[DATABASE_NAME]

supabase_client: Client | None = None
if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY:
    try:
        supabase_client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    except Exception as e:
        print(f"Failed to initialize Supabase client: {e}")

# Collections
users_collection = db["users"]
listings_collection = db["listings"]
matches_collection = db["matches"]
notifications_collection = db["notifications"]
metadata_collection = db["metadata"]
