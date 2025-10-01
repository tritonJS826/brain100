from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Request, HTTPException
from starlette.responses import JSONResponse, RedirectResponse
from jose import jwt

from app.api.services.oauth import oauth
from app.db import db
from app.settings import settings

# без prefix — его задаёт include_router(..., prefix=settings.API_PREFIX)
router = APIRouter()
ALGORITHM = "HS256"


def create_access_token(data: dict, expires_minutes: int) -> str:
    now = datetime.now(timezone.utc)
    to_encode = {**data, "iat": now, "exp": now + timedelta(minutes=expires_minutes)}
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)


@router.get("/google/login", name="google_login")
async def google_login(request: Request):
    return await oauth.google.authorize_redirect(
        request,
        redirect_uri=settings.GOOGLE_REDIRECT_URI,
    )


@router.get("/google/callback", name="google_callback")
async def google_callback(request: Request):
    # обмен кода на токен
    try:
        token = await oauth.google.authorize_access_token(request)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"OAuth callback error: {e}")

    # профиль: сначала из id_token, иначе — через userinfo из metadata (без хардкода)
    userinfo = None
    try:
        userinfo = await oauth.google.parse_id_token(request, token)
    except Exception:
        pass

    if not userinfo:
        endpoint = oauth.google.server_metadata.get("userinfo_endpoint")
        if not endpoint:
            raise HTTPException(
                status_code=500, detail="Provider metadata missing userinfo_endpoint"
            )
        resp = await oauth.google.get(endpoint, token=token)
        userinfo = resp.json()

    email = userinfo.get("email")
    raw_name = userinfo.get("name")

    if not email:
        raise HTTPException(status_code=400, detail="No email from Google")

    # имя по умолчанию — часть email до @, если провайдер не прислал
    name = raw_name or email.split("@", 1)[0]

    # минималка с БД: только email + name
    user = await db.user.find_unique(where={"email": email})
    if not user:
        user = await db.user.create(data={"email": email, "name": name})
    else:
        if name and user.name != name:
            user = await db.user.update(where={"id": user.id}, data={"name": name})

    # профиль для ответа
    profile = {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        # "created_at": user.createdAt / user.created_at  # при необходимости добавить
    }

    # JWT
    access_token = create_access_token(
        {"sub": str(user.id), "email": user.email, "name": user.name or ""},
        settings.ACCESS_TOKEN_MINUTES,
    )
    return JSONResponse(
        {"access_token": access_token, "token_type": "bearer", "user": profile}
    )


@router.get("/logout")
async def logout(_: Request):
    # Для JWT логаут — задача клиента (удалить токен)
    resp = JSONResponse({"ok": True})
    resp.delete_cookie("access_token", path="/")
    return RedirectResponse(url=str(settings.FRONTEND_APP_URL), status_code=303)
