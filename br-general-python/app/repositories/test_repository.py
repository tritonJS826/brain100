from app.db import db


class TestRepo:
    async def list_sessions_with_titles(self, user_id: str):
        sessions = await db.testsession.find_many(
            where={"userId": user_id},
            order={"createdAt": "desc"},
            include={"test": True},
        )
        return sessions
