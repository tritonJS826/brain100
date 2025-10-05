import random

import pytest
from httpx import AsyncClient, ASGITransport
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
        user_data = {"email": email, "password": password, "name": name, "role": role}
        await client.post("/br-general/auth/register", json=user_data)

        # 2 login
        form_data = {"username": email, "password": password}
        r = await client.post("/br-general/auth/login", data=form_data)
        assert r.status_code == 200, r.text
        tokens = r.json()["tokens"]

        # 3 call /me/personal
        headers = {"Authorization": f"Bearer {tokens['access_token']}"}
        r = await client.get("/br-general/users/me/personal", headers=headers)

        # 4 assertions
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["email"] == email
        assert data["name"] == name
        assert data["role"] == role


@pytest.fixture(scope="function", autouse=True)
async def setup_db():
    await db.connect()
    yield
    # cleanup after test
    await db.user.delete_many(where={"email": {"contains": "personal_user_"}})
    await db.disconnect()
