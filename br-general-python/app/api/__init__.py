from . import users, health
from fastapi import APIRouter

api_router = APIRouter()
api_router.include_router(health.router, prefix="/br-general/health", tags=["health"])
api_router.include_router(users.router, prefix="/br-general/users", tags=["users"])
