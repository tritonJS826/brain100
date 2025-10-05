from fastapi import APIRouter, Depends, HTTPException, Header
from fastapi.security import OAuth2PasswordBearer

from jose import JWTError, ExpiredSignatureError, jwt

from app.schemas.user import UserWithTokens, UserOut, UserPersonalInfo
from app.services.auth_service import AuthService
from app.repositories.user_repository import UserRepository
from app.db import db

from app.settings import settings

router = APIRouter()

auth_service = AuthService()
user_repo = UserRepository()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/br-general/auth/login")


async def get_current_user(
    access_token: str = Depends(oauth2_scheme),
    x_refresh_token: str | None = Header(default=None),
):
    # try access first
    if access_token:
        try:
            payload = jwt.decode(
                access_token,
                settings.jwt_secret_key,
                algorithms=[settings.jwt_algorithm],
            )
            user_id = payload.get("sub")
            # return existing tokens (still valid)
            return {
                "user_id": user_id,
                "tokens": {
                    "access_token": access_token,
                    # may be None if not sent
                    "refresh_token": x_refresh_token,
                    "token_type": "bearer",
                },
            }

        except ExpiredSignatureError:
            if not x_refresh_token:
                raise HTTPException(status_code=401, detail="Access token expired")
            # will fall back to refresh

        except JWTError:
            if not x_refresh_token:
                raise HTTPException(status_code=401, detail="Invalid token")

    # fallback: refresh token
    if x_refresh_token:
        refresh_payload = auth_service.decode_token(x_refresh_token)
        if not refresh_payload or refresh_payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        user_id = refresh_payload.get("sub")
        new_access = auth_service.create_access_token({"sub": user_id})

        return {
            "user_id": user_id,
            "tokens": {
                "access_token": new_access,
                "refresh_token": x_refresh_token,
                "token_type": "bearer",
            },
        }

    raise HTTPException(status_code=401, detail="Not authenticated")


@router.get("/me", response_model=UserWithTokens)
async def read_users_me(
    current=Depends(get_current_user),
    x_refresh_token: str | None = Header(default=None),
):
    user = await db.user.find_unique(where={"id": str(current["user_id"])})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    user_out = UserOut(
        id=str(user.id), email=user.email, name=user.name, role=user.role
    )

    return UserWithTokens(user=user_out, tokens=current["tokens"])


@router.get("/me/personal", response_model=UserPersonalInfo)
async def get_personal_info(current=Depends(get_current_user)):
    user_id = current["user_id"]
    user = await user_repo.get_personal_info(db, user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    sub = user.subscriptions[0] if user.subscriptions else None

    return {
        "email": user.email,
        "name": user.name,
        "role": user.role,
        "plan": sub.plan if sub else "FREE",
        "consultations_used": sub.consultationsUsed if sub else 0,
        "consultations_included": sub.consultationsIncluded if sub else 0,
        "days_to_end": ((sub.endsAt - sub.startedAt).days if sub else 0),
    }
