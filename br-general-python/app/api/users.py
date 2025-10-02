from fastapi import APIRouter, Depends, HTTPException, Header
from fastapi.security import OAuth2PasswordBearer

from jose import JWTError, ExpiredSignatureError, jwt

from app.schemas.user import UserCreate, UserWithTokens, UserOut
from app.services.auth_service import AuthService
from app.repositories.user_repository import UserRepository
from app.db import db

from app.settings import settings

router = APIRouter()

auth_service = AuthService()
user_repo = UserRepository()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/br-general/auth/login")


@router.post("/register", response_model=UserOut)
async def register(user_in: UserCreate):
    # check if user exists
    existing = await user_repo.get_by_email(db, user_in.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # hash password
    hashed_pw = auth_service.get_password_hash(user_in.password)

    # save new user
    user = await user_repo.create_user(
        db, email=user_in.email, hashed_password=hashed_pw
    )

    return user


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
            return {"user_id": payload.get("sub"), "tokens": None}

        except ExpiredSignatureError:
            pass  # will fall back to refresh

        except JWTError:
            # instead of raising immediately, try refresh if provided
            if not x_refresh_token:
                raise HTTPException(status_code=401, detail="Invalid token")

    # fallback: refresh token
    if x_refresh_token:
        refresh_payload = auth_service.decode_token(x_refresh_token)
        if not refresh_payload or refresh_payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        user_id = refresh_payload.get("sub")
        new_access = auth_service.create_access_token({"sub": user_id})
        # new_refresh = auth_service.create_refresh_token({"sub": user_id})

        return {
            "user_id": user_id,
            "tokens": {
                "access_token": new_access,
                # keep the same refresh token for simplicity
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
    user = await db.user.find_unique(where={"id": int(current["user_id"])})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    user_out = UserOut(id=user.id, email=user.email)

    return UserWithTokens(user=user_out, tokens=current["tokens"])
