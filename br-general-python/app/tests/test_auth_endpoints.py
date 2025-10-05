import pytest
from httpx import AsyncClient, ASGITransport

from jose import jwt
from datetime import datetime, timedelta, timezone

from app.main import app
from app.db import db
from app.settings import settings
from app.services.auth_service import AuthService

# build base URL dynamically from settings
BASE_URL = f"http://{settings.webapp_domain}:{settings.server_port}"

auth_service = AuthService()


@pytest.fixture(scope="function", autouse=True)
async def setup_db():
    await db.connect()
    yield
    await db.disconnect()


@pytest.mark.asyncio
async def test_register_and_login_and_me():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url=BASE_URL) as client:
        # register user
        user_data = {"email": "test_auth@example.com", "password": "strongpass123"}
        r = await client.post("/br-general/auth/register", json=user_data)
        assert r.status_code in (200, 400)  # 400 if already exists

        # login user
        form_data = {"username": user_data["email"], "password": user_data["password"]}
        r = await client.post("/br-general/auth/login", data=form_data)
        assert r.status_code == 200, r.text
        tokens = r.json()["tokens"]
        assert "access_token" in tokens
        assert "refresh_token" in tokens

        # get /me using access token
        headers = {"Authorization": f"Bearer {tokens['access_token']}"}
        r = await client.get("/br-general/users/me", headers=headers)
        assert r.status_code == 200, r.text
        me_data = r.json()
        assert me_data["user"]["email"] == user_data["email"]

        # call /refresh
        payload = {
            "access_token": tokens["access_token"],
            "refresh_token": tokens["refresh_token"],
        }
        r = await client.post("/br-general/auth/refresh", json=payload)
        assert r.status_code == 200, r.text
        new_tokens = r.json()["tokens"]
        assert new_tokens["access_token"] != tokens["access_token"]

        # test /me with expired or invalid token (simulate)
        bad_headers = {"Authorization": "Bearer invalidtoken123"}
        r = await client.get("/br-general/users/me", headers=bad_headers)
        assert r.status_code == 401


@pytest.mark.asyncio
async def test_auto_refresh_on_expired_token():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url=BASE_URL) as client:
        # Register user (if not exists)
        user_data = {"email": "test_expire@example.com", "password": "strongpass123"}
        await client.post("/br-general/auth/register", json=user_data)

        # Login user
        form_data = {"username": user_data["email"], "password": user_data["password"]}
        r = await client.post("/br-general/auth/login", data=form_data)
        assert r.status_code == 200
        tokens = r.json()["tokens"]

        # Create an expired access token manually (expired 10 min ago)
        payload = {
            "sub": "1",
            "exp": datetime.now(timezone.utc) - timedelta(minutes=10),
            "type": "access",
        }
        expired_access = jwt.encode(
            payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm
        )

        # Call /me with expired token and valid refresh token
        headers = {
            "Authorization": f"Bearer {expired_access}",
            "x-refresh-token": tokens["refresh_token"],
        }
        r = await client.get("/br-general/users/me", headers=headers)

        assert r.status_code == 200, r.text
        body = r.json()

        # The backend should have issued new tokens
        assert "tokens" in body
        assert body["tokens"]["access_token"] != expired_access
        assert body["tokens"]["refresh_token"] == tokens["refresh_token"]
