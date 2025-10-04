from datetime import datetime, timezone
from app.db import db


class UserRepository:
    async def get_by_id(self, user_id: str):
        # базовые поля пользователя (без подписок — хватит для email/name/role)
        return await db.user.find_unique(
            where={"id": user_id},
        )

    async def get_active_subscription(self, user_id: str):
        now = datetime.now(timezone.utc)
        return await db.subscription.find_first(
            where={"userId": user_id, "endsAt": {"gt": now}},
            order={"endsAt": "desc"},
        )
