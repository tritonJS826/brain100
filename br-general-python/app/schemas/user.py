from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserCreate(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: str
    email: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    email: EmailStr


class Token(BaseModel):
    access_token: str = Field(
        ..., description="JWT access token for API authentication"
    )
    refresh_token: Optional[str] = Field(
        None, description="JWT refresh token for renewing access"
    )
    token_type: str = Field("bearer", description="Type of authentication scheme")


class RefreshTokenRequest(BaseModel):
    access_token: str
    refresh_token: str


class UserWithTokens(BaseModel):
    user: UserOut
    tokens: Token | None = None


class LogoutResponse(BaseModel):
    message: str
