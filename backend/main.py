from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import logging
from jose import JWTError

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="QBR Inventory - Property Dealer Network",
    description="B2B lead-sharing tool for property dealers in Islamabad's developing sectors",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def inject_user_id(request: Request, call_next):
    """Extract user_id from JWT and inject into request state for protected routes."""
    public_paths = ["/auth/register", "/auth/login", "/docs", "/openapi.json", "/redoc", "/"]
    
    is_public = any(request.url.path.rstrip("/") == p.rstrip("/") for p in public_paths)
    
    if not is_public:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            from utils.auth import decode_access_token
            try:
                token = auth_header.split(" ")[1]
                payload = decode_access_token(token)
                request.state.user_id = payload.get("sub", "")
            except JWTError as e:
                logger.warning(f"Invalid JWT Token: {str(e)}")
                request.state.user_id = ""
            except Exception as e:
                logger.error(f"Unexpected error decoding token: {str(e)}")
                request.state.user_id = ""
        else:
            request.state.user_id = ""
    else:
        request.state.user_id = ""

    response = await call_next(request)
    return response


# --- Import and mount routers ---
from routes.auth import router as auth_router
from routes.listings import router as listings_router
from routes.matches import router as matches_router

app.include_router(auth_router)
app.include_router(listings_router)
app.include_router(matches_router)


@app.get("/", tags=["Health"])
async def health_check() -> dict:
    return {"status": "ok", "app": "QBR Inventory - Property Dealer Network"}
