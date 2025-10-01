from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Request, HTTPException
from starlette.responses import JSONResponse, RedirectResponse
from jose import jwt

from app.api.services.oauth import oauth
from app.db import db
from app.settings import settings

# без prefix — его задали в routers/__init__.py
router = APIRouter()
ALGORITHM = "HS256"


def create_access_token(data: dict, expires_minutes: int) -> str:
    now = datetime.now(timezone.utc)
    to_encode = {**data, "iat": now, "exp": now + timedelta(minutes=expires_minutes)}
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)


@router.get("/google/login", name="google_login")
async def google_login(request: Request):
    # Редирект-URI должен совпадать с тем, что в Google Console !!!
    return await oauth.google.authorize_redirect(request, settings.GOOGLE_REDIRECT_URI)


@router.get("/google/callback", name="google_callback")
async def google_callback(request: Request):
    #  Меняем код на токен Google
    token = await oauth.google.authorize_access_token(request)
    if not token:
        raise HTTPException(status_code=400, detail="Failed to obtain token")

    # userinfo может быть в токене; иначе запросим
    userinfo = token.get("userinfo")
    if not userinfo:
        resp = await oauth.google.get("userinfo", token=token)
        userinfo = resp.json()

    # Без email — не продолжаем
    email = userinfo.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="No email from Google")

    #  Запись в БД (find/create)
    user = await db.user.find_unique(where={"email": email})
    if not user:
        user = await db.user.create(data={"email": email, "name": userinfo.get("name")})
    else:
        new_name = userinfo.get("name")
        if new_name and new_name != user.name:
            user = await db.user.update(where={"id": user.id}, data={"name": new_name})

    profile = {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "picture": userinfo.get("picture"),
    }

    access_token = create_access_token(
        {"sub": str(user.id), "email": user.email, "name": user.name},
        settings.ACCESS_TOKEN_MINUTES,
    )
    return JSONResponse(
        {"access_token": access_token, "token_type": "bearer", "user": profile}
    )


@router.get("/logout")
async def logout(_: Request):
    # Для JWT логаут — задача клиента (удалить токен).
    resp = JSONResponse({"ok": True})
    resp.delete_cookie("access_token", path="/")
    return RedirectResponse(url=str(settings.FRONTEND_APP_URL), status_code=303)
