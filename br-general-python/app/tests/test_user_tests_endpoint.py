import pytest
from httpx import AsyncClient, ASGITransport
from jose import jwt
from datetime import datetime, timezone
from app.main import app
from app.settings import settings
from app.db import db


@pytest.mark.asyncio
async def test_get_user_tests_results():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url=settings.base_url) as client:
        # 1 create user & login
        email = "test_user_tests@example.com"
        password = "StrongPass123!"
        name = "User With Tests"
        await client.post(
            "/br-general/auth/register",
            json={
                "email": email,
                "password": password,
                "name": name,
                "role": "PATIENT",
            },
        )

        form_data = {"username": email, "password": password}
        response = await client.post("/br-general/auth/login", data=form_data)
        assert response.status_code == 200
        tokens = response.json()["tokens"]

        decoded = jwt.decode(
            tokens["access_token"],
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm],
        )
        user_id = decoded["sub"]

        # 2 create fake test and session directly in DB
        test = await db.test.create(
            data={
                "title": "Focus Evaluation",
                "description": "Evaluates attention and response speed.",
            }
        )

        session = await db.testsession.create(
            data={
                "user": {"connect": {"id": user_id}},
                "test": {"connect": {"id": test.id}},
                "createdAt": datetime.now(timezone.utc),
                "finishedAt": datetime.now(timezone.utc),
            }
        )

        # 3 call endpoint /me/tests/{test_id}
        headers = {"Authorization": f"Bearer {tokens['access_token']}"}
        url = f"/br-general/users/me/tests/{test.id}"
        response = await client.get(url, headers=headers)
        assert response.status_code == 200, response.text

        data = response.json()

        # 4 assertions
        assert data["test_id"] == test.id
        assert data["title"] == test.title
        assert data["description"] == test.description
        assert "sessions" in data
        assert len(data["sessions"]) >= 1

        s = data["sessions"][0]
        assert s["session_id"] == session.id
        assert s["created_at"]
        assert s["finished_at"]

        # Answers list should exist (empty if no answers)
        assert "answers" in s
        assert isinstance(s["answers"], list)


@pytest.fixture(scope="function", autouse=True)
async def setup_db():
    await db.connect()
    yield
    # cleanup test data
    await db.testsession.delete_many(
        where={"user": {"email": {"contains": "test_user_tests@"}}}
    )
    await db.test.delete_many(where={"title": {"contains": "Focus Evaluation"}})
    await db.user.delete_many(where={"email": {"contains": "test_user_tests@"}})
    await db.disconnect()
