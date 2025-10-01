# app/api/router.py
from fastapi import APIRouter

from app.api.health import router as health_router
from app.api.users import router as users_router
from app.api.routers.auth import router as auth_router

# --- Email router ---
email_router = None
try:
    from app.api.email import router as email_router
except Exception:
    try:
        from app.api.email import router as email_router
    except Exception:
        email_router = None

api_router = APIRouter()
api_router.include_router(health_router, prefix="/health", tags=["health"])
api_router.include_router(users_router, prefix="/users", tags=["users"])
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])

if email_router:
    api_router.include_router(email_router, prefix="/email", tags=["email"])
