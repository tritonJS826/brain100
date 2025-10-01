from fastapi import APIRouter, Depends, HTTPException
from app.schemas.user import UserCreate, UserOut
from app.services.auth_service import AuthService
from app.repositories.user_repository import UserRepository
from app.db import db
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
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


def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(
            token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.get("/me")
async def read_users_me(current_user: str = Depends(get_current_user)):
    return {"user_id": current_user}
