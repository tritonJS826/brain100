from . import users, health, email
from fastapi import APIRouter

api_router = APIRouter()
api_router.include_router(health.router, prefix="/br-general/health", tags=["health"])
api_router.include_router(users.router, prefix="/br-general/users", tags=["users"])
api_router.include_router(email.router, prefix="/br-general/email", tags=["email"])
