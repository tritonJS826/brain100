import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.settings import settings
from app.db import db


@pytest.mark.asyncio
async def test_health_check():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url=settings.base_url) as client:
        response = await client.get("/br-general/health/")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data or "healthy" in data or "message" in data


class FakeUserModel:
    async def count(self):
        raise Exception("Simulated DB failure")


@pytest.mark.asyncio
async def test_health_check_failure(monkeypatch):
    fake_user = FakeUserModel()
    monkeypatch.setattr(db, "user", fake_user)

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url=settings.base_url) as client:
        response = await client.get("/br-general/health/")
        assert response.status_code >= 500


@pytest.fixture(scope="function", autouse=True)
async def setup_db():
    await db.connect()
    yield

    await db.disconnect()
