# br-general-python/app/api/routers/auth.py
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Request, HTTPException
from starlette.responses import JSONResponse
from jose import jwt

from app.api.services.oauth import oauth
from app.db import db
from app.settings import settings

router = APIRouter()

ALGORITHM = "HS256"


def create_access_token(data: dict, expires_minutes: int) -> str:
    now = datetime.now(timezone.utc)
    to_encode = {**data, "iat": now, "exp": now + timedelta(minutes=expires_minutes)}
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)


@router.get("/google/login", name="google_login")
async def google_login(request: Request):
    return await oauth.google.authorize_redirect(request, settings.GOOGLE_REDIRECT_URI)


@router.get("/google/callback", name="google_callback")
async def google_callback(request: Request):
    token = await oauth.google.authorize_access_token(request)
    if not token:
        raise HTTPException(status_code=400, detail="Failed to obtain token")

    userinfo = token.get("userinfo")
    if not userinfo:
        resp = await oauth.google.get("userinfo", token=token)
        userinfo = resp.json()

    email = userinfo.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="No email from Google")

    user = await db.user.find_unique(where={"email": email})
    if not user:
        user = await db.user.create(data={"email": email, "name": userinfo.get("name")})

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
    resp = JSONResponse({"ok": True})
    resp.delete_cookie("access_token", path="/")
    return resp
