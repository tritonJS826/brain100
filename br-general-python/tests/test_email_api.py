# tests/test_email_api.py
import pytest
from httpx import AsyncClient

from app.main import app


@pytest.mark.asyncio
async def test_send_email(monkeypatch):
    # Mock service to avoid real SMTP calls
    from app.services.email_service import EmailService

    async def fake_send(*args, **kwargs):
        return None

    monkeypatch.setattr(EmailService, "send", fake_send)

    async with AsyncClient(app=app, base_url="http://test") as ac:
        res = await ac.post(
            "/br-general/email/send",
            json={"to": "u@test.com", "subject": "Hello", "text": "Hi there"},
        )
    assert res.status_code == 202
    assert res.json()["accepted"] is True
