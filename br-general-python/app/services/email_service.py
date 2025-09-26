# app/services/email_service.py
from email.message import EmailMessage
from pathlib import Path
from typing import Optional, Dict, Any

import aiosmtplib
from jinja2 import Environment, FileSystemLoader, select_autoescape

from app.settings import settings  # noqa F401

_TEMPLATES_DIR = Path(__file__).resolve().parent.parent / "templates"
_env = Environment(
    loader=FileSystemLoader(str(_TEMPLATES_DIR)),
    autoescape=select_autoescape(["html", "xml"]),
)


class EmailService:
    """SMTP-backed email sender."""

    def __init__(self) -> None:
        self.host = settings.smtp_host
        self.port = settings.smtp_port
        self.user = settings.smtp_user
        self.password = settings.smtp_password
        self.use_starttls = settings.smtp_starttls
        self.use_ssl = settings.smtp_ssl
        self.sender_email = str(settings.smtp_sender_email)
        self.sender_name = settings.smtp_sender_name

    def _render_template(self, template: str, params: Dict[str, Any]) -> str:
        tpl = _env.get_template(template)
        return tpl.render(**params)

    def _build_message(
        self,
        to: str,
        subject: str,
        text: Optional[str] = None,
        html: Optional[str] = None,
    ) -> EmailMessage:
        msg = EmailMessage()
        sender = f"{self.sender_name} <{self.sender_email}>"
        msg["From"] = sender
        msg["To"] = to
        msg["Subject"] = subject

        if html and text:
            # Multipart alternative: text + html
            msg.set_content(text)
            msg.add_alternative(html, subtype="html")
        elif html:
            msg.add_alternative(html, subtype="html")
        else:
            msg.set_content(text or "")

        return msg

    async def send(
        self,
        *,
        to: str,
        subject: str,
        text: Optional[str] = None,
        html: Optional[str] = None,
        template: Optional[str] = None,
        params: Optional[Dict[str, Any]] = None,
    ) -> None:
        if template:
            html = self._render_template(template, params or {})

        message = self._build_message(to=to, subject=subject, text=text, html=html)

        # Connect & send
        if self.use_ssl:
            # SMTPS
            await aiosmtplib.send(
                message,
                hostname=self.host,
                port=self.port,
                username=self.user or None,
                password=self.password or None,
                use_tls=True,
                timeout=30,
            )
        else:
            # Plain + STARTTLS optionally
            async with aiosmtplib.SMTP(
                hostname=self.host, port=self.port, timeout=30
            ) as smtp:
                if self.use_starttls:
                    await smtp.starttls()
                if self.user and self.password:
                    await smtp.login(self.user, self.password)
                await smtp.send_message(message)
