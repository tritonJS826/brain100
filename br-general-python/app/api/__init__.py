# Description: API router for the application, including health, user, and email endpoints.
# app/api/__init__.py

from . import users, health, email, auth
from fastapi import APIRouter
from app.settings import settings

api_router = APIRouter()
api_router.include_router(health.router, prefix="/br-general/health", tags=["health"])
# For production, disable email send and user create endpoints
if settings.env_type != "prod":
    api_router.include_router(email.router, prefix="/br-general/email", tags=["email"])

api_router.include_router(users.router, prefix="/br-general/users", tags=["users"])
api_router.include_router(auth.router, prefix="/br-general/auth", tags=["auth"])
