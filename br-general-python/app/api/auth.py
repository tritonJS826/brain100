from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.user import Token, RefreshTokenRequest
from app.services.auth_service import AuthService
from app.repositories.user_repository import UserRepository
from app.db import db  # prisma client

router = APIRouter()

auth_service = AuthService()
user_repo = UserRepository()


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # check if user exists
    user = await user_repo.get_by_email(db, form_data.username)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # verify password
    if not auth_service.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # create tokens
    access_token = auth_service.create_access_token({"sub": str(user.id)})
    refresh_token = auth_service.create_refresh_token({"sub": str(user.id)})

    return Token(
        access_token=access_token, refresh_token=refresh_token, token_type="bearer"
    )


@router.post("/refresh", response_model=Token)
async def refresh_tokens(body: RefreshTokenRequest):
    access_payload = auth_service.decode_token(body.access_token)
    refresh_payload = auth_service.decode_token(body.refresh_token)

    if not refresh_payload or refresh_payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    # check sub match
    if access_payload and access_payload.get("sub") != refresh_payload.get("sub"):
        raise HTTPException(status_code=401, detail="Token pair mismatch")

    user_id = refresh_payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    new_access = auth_service.create_access_token({"sub": user_id})
    new_refresh = auth_service.create_refresh_token({"sub": user_id})

    return Token(
        access_token=new_access, refresh_token=new_refresh, token_type="bearer"
    )
