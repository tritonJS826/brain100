from fastapi import APIRouter, Request, HTTPException
from starlette.responses import RedirectResponse, JSONResponse
from app.api.services.oauth import oauth
from app.db import db
from app.settings import settings

router = APIRouter(prefix="/auth/google", tags=["auth"])


@router.get("/login", name="google_login")
async def google_login(request: Request):
    redirect_uri = str(request.url_for("google_callback"))
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/callback", name="google_callback")
async def google_callback(request: Request):
    token = await oauth.google.authorize_access_token(request)
    if not token:
        raise HTTPException(status_code=400, detail="Failed to obtain token")

    userinfo = token.get("userinfo")
    if not userinfo:
        resp = await oauth.google.get("userinfo", token=token)
        userinfo = resp.json()

    if not userinfo.get("email"):
        raise HTTPException(status_code=400, detail="No email from Google")

    existing_user = await db.user.find_unique(where={"email": userinfo["email"]})
    if not existing_user:
        existing_user = await db.user.create(
            data={
                "email": userinfo["email"],
                "name": userinfo.get("name"),
            }
        )

    profile = {
        "id": existing_user.id,
        "email": existing_user.email,
        "name": existing_user.name,
        "picture": userinfo.get("picture"),
    }
    request.session["user"] = profile
    return JSONResponse({"profile": profile})


@router.get("/me")
async def get_me(request: Request):
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return JSONResponse({"user": user})


@router.get("/logout")
async def logout(request: Request):
    request.session.clear()
    return RedirectResponse(url=settings.FRONTEND_APP_URL, status_code=303)
