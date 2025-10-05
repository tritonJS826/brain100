import random

import pytest
from httpx import AsyncClient, ASGITransport

from jose import jwt
from datetime import datetime, timedelta

from app.main import app
from app.settings import settings

from app.db import db

BASE_URL = f"http://{settings.webapp_domain}:{settings.server_port}"


@pytest.mark.asyncio
@pytest.mark.parametrize("index", range(1, 6))  # 5 users
async def test_multiple_users_personal(index):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url=BASE_URL) as client:
        # 1 register user
        email = f"personal_user_{index}@example.com"
        password = f"PersonalPass{index}!"
        name = f"PersonalUser {index}"
        role = random.choice(["PATIENT", "DOCTOR"])
        user_data = {
            "email": email,
            "password": password,
            "name": name,
            "role": role,
        }
        await client.post("/br-general/auth/register", json=user_data)

        # 2 login
        form_data = {"username": email, "password": password}
        r = await client.post("/br-general/auth/login", data=form_data)
        assert r.status_code == 200, r.text
        tokens = r.json()["tokens"]

        decoded = jwt.decode(
            tokens["access_token"],
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm],
        )
        user_id = decoded["sub"]

        # 3 create subscription record for the user
        random_day = random.randint(1, 365)
        started_at = datetime(2025, 1, 1) + timedelta(days=random_day)
        ends_at = started_at + timedelta(days=random.randint(15, 90))
        consultations_included = random.randint(1, 10)
        consultations_used = random.randint(0, 5)
        plan = random.choice(["FREE", "BASIC"])

        await db.subscription.create(
            data={
                "user": {"connect": {"id": user_id}},  # ✅ link by relation
                "plan": plan,
                "startedAt": started_at,
                "endsAt": ends_at,
                "consultationsIncluded": consultations_included,
                "consultationsUsed": consultations_used,
            }
        )

        # 4 call /me/personal
        headers = {"Authorization": f"Bearer {tokens['access_token']}"}
        r = await client.get("/br-general/users/me/personal", headers=headers)
        assert r.status_code == 200, r.text
        data = r.json()

        # 5 verify subscription exists in DB
        sub = await db.subscription.find_first(where={"userId": user_id})
        assert sub is not None, f"No subscription found for user {user_id}"

        # 6 check consistency between DB record and API response
        assert sub.plan == plan, f"Plan mismatch: {sub.plan} != {plan}"
        assert sub.consultationsUsed == consultations_used
        assert sub.consultationsIncluded == consultations_included

        expected_days_to_end = (sub.endsAt - sub.startedAt).days
        assert data["days_to_end"] == expected_days_to_end, (
            f"Expected {expected_days_to_end}, got {data['days_to_end']}"
        )
        assert 15 <= expected_days_to_end <= 90


@pytest.fixture(scope="function", autouse=True)
async def setup_db():
    await db.connect()
    yield
    # cleanup after test
    await db.user.delete_many(where={"email": {"contains": "personal_user_"}})
    await db.disconnect()
