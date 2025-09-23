from fastapi import APIRouter
from app.db import db

router = APIRouter()


@router.get("/")
async def root():
    users_count = await db.user.count()
    return {
        "status": "Backend with Prisma and FastAPI - working! (/)",
        "users_in_db": users_count,
    }


@router.get("/general")
async def general():
    users_count = await db.user.count()
    return {
        "status": "Backend with Prisma and FastAPI - working! (/general)",
        "users_in_db": users_count,
    }
