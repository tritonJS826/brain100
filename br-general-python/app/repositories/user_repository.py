# app/repositories/user_repository.py
from app.db import db
from app.schemas.user import UserCreate


class UserRepository:
    @staticmethod
    async def create(user: UserCreate):
        return await db.user.create(data=user.model_dump())
