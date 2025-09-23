from . import users, health
from fastapi import APIRouter

api_router = APIRouter()
api_router.include_router(health.router, prefix="/api")
api_router.include_router(users.router, prefix="/api")
