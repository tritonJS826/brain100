import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app.db import db
from app.settings import settings

import asyncio

DATABASE_URL = settings.database_url


async def check():
    await db.connect()
    s = await db.subscription.create(
        data={
            "userId": "debug_test_user",
            "plan": "BASIC",
            "startedAt": "2025-10-14T00:00:00Z",
            "endsAt": "2025-11-14T00:00:00Z",
        }
    )
    print("Created subscription plan:", s.plan)
    await db.disconnect()


asyncio.run(check())

if __name__ == "__main__":
    asyncio.run(check())
