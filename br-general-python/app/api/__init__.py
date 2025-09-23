from fastapi import APIRouter
from . import health
from . import users

api_router = APIRouter()
api_router.include_router(health.router, prefix="/api")
api_router.include_router(users.router, prefix="/api")
