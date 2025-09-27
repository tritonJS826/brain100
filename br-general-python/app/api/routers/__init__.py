from fastapi import APIRouter
from app.api.health import router as health_router
from app.api.users import router as users_router
from .auth import router as auth_router

api_router = APIRouter()
api_router.include_router(health_router, prefix="/health", tags=["health"])
api_router.include_router(users_router, prefix="/users", tags=["users"])
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
