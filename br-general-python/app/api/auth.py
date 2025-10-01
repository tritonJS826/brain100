from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.user import Token
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

    # create token
    access_token = auth_service.create_access_token({"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}
