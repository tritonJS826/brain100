# app/api/email.py
from fastapi import APIRouter, BackgroundTasks
from app.schemas.email import EmailSendRequest, EmailSendResponse
from app.services.email_service import EmailService

router = APIRouter()

email_service = EmailService()


@router.post("/send", response_model=EmailSendResponse, status_code=202)
async def send_email(payload: EmailSendRequest, bg: BackgroundTasks):
    # Fire-and-forget via background task
    async def _task():
        try:
            await email_service.send(
                to=payload.to,
                subject=payload.subject,
                text=payload.text,
                html=payload.html,
                template=payload.template,
                params=payload.params,
            )
        except Exception:
            # In real life, log this exception (Sentry, logs, etc.)
            # Avoid raising in background to not crash workers
            pass

    bg.add_task(_task)
    return EmailSendResponse(accepted=True)
