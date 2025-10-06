import pytest
from unittest.mock import AsyncMock, patch

from app.services.email_service import EmailService
from app.settings import settings


@pytest.mark.asyncio
async def test_send_email_success_ssl():
    fake_send = AsyncMock(return_value=(250, b"OK"))
    fake_log = AsyncMock()

    with patch(
        "app.services.email_service.aiosmtplib.send", new=fake_send
    ), patch.object(EmailService, "log_email", new=fake_log):
        settings.smtp_host = "smtp.example.com"
        settings.smtp_port = 465
        settings.smtp_user = "user@example.com"
        settings.smtp_password = "secret"
        settings.smtp_ssl = True
        settings.smtp_starttls = False
        settings.smtp_sender_email = "no_reply@brain100.com"
        settings.smtp_sender_name = "Brain100"

        svc = EmailService()
        await svc.send(
            to="vasco@ex.de",
            subject="Hey! What’s up!",
            html="<b>Please do not reply</b>",
        )

        fake_send.assert_awaited_once()
        _, kwargs = fake_send.await_args
        assert kwargs["hostname"] == settings.smtp_host
        assert kwargs["port"] == settings.smtp_port

        fake_log.assert_awaited()
        _, log_kwargs = fake_log.await_args
        assert log_kwargs["status"] == "SENT"
        assert log_kwargs["error"] is None


@pytest.mark.asyncio
async def test_send_email_success_starttls():
    smtp_cm = AsyncMock()
    smtp = AsyncMock()
    smtp_cm.__aenter__.return_value = smtp
    smtp.starttls = AsyncMock()
    smtp.login = AsyncMock()
    smtp.send_message = AsyncMock(return_value=(250, b"OK"))

    fake_log = AsyncMock()

    with patch(
        "app.services.email_service.aiosmtplib.SMTP", return_value=smtp_cm
    ), patch.object(EmailService, "log_email", new=fake_log):
        settings.smtp_ssl = False
        settings.smtp_starttls = True
        settings.smtp_user = "user"
        settings.smtp_password = "secret"

        svc = EmailService()
        await svc.send(
            to="vasco@ex.de",
            subject="Hi",
            html="<b>hi there! Join us!</b>",
        )

        smtp.starttls.assert_awaited_once()
        smtp.login.assert_awaited_once_with("user", "secret")
        smtp.send_message.assert_awaited_once()
        fake_log.assert_awaited()
        _, log_kwargs = fake_log.await_args
        assert log_kwargs["status"] == "SENT"
        assert log_kwargs["error"] is None


@pytest.mark.asyncio
async def test_send_email_failure_ssl_raises_and_logs():
    fake_send = AsyncMock(side_effect=Exception("SMTP failed"))
    fake_log = AsyncMock()

    with patch(
        "app.services.email_service.aiosmtplib.send", new=fake_send
    ), patch.object(EmailService, "log_email", new=fake_log):
        settings.smtp_ssl = True
        settings.smtp_starttls = False

        svc = EmailService()
        with pytest.raises(Exception, match="SMTP failed"):
            await svc.send(
                to="vasco@ex.de",
                subject="Oops",
                html="<b>no</b>",
            )

        fake_send.assert_awaited_once()
        fake_log.assert_awaited()
        _, log_kwargs = fake_log.await_args
        assert log_kwargs["status"] == "FAILED"
        assert "SMTP failed" in (log_kwargs["error"] or "")


@pytest.mark.asyncio
async def test_send_email_failure_starttls_raises_and_logs():
    smtp_cm = AsyncMock()
    smtp = AsyncMock()
    smtp_cm.__aenter__.return_value = smtp

    smtp.starttls = AsyncMock()
    smtp.login = AsyncMock()
    smtp.send_message = AsyncMock(side_effect=RuntimeError("Down"))

    fake_log = AsyncMock()

    with patch(
        "app.services.email_service.aiosmtplib.SMTP", return_value=smtp_cm
    ), patch.object(EmailService, "log_email", new=fake_log):
        settings.smtp_ssl = False
        settings.smtp_starttls = True
        settings.smtp_user = "u"
        settings.smtp_password = "p"

        svc = EmailService()
        with pytest.raises(RuntimeError, match="Down"):
            await svc.send(
                to="vasco@ex.de",
                subject="Oops",
                html="<b>no</b>",
            )

        smtp.starttls.assert_awaited_once()
        smtp.login.assert_awaited_once_with("u", "p")
        smtp.send_message.assert_awaited_once()

        fake_log.assert_awaited()
        _, log_kwargs = fake_log.await_args
        assert log_kwargs["status"] == "FAILED"
        assert "Down" in (log_kwargs["error"] or "")
