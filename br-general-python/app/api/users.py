from fastapi import APIRouter
from app.db import db

router = APIRouter()

@router.get("/")
async def list_users():
    users = await db.user.find_many()
    return {"users": users}