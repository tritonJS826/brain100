from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from enum import Enum
from typing import Optional


class Role(str, Enum):
    PATIENT = "PATIENT"
    DOCTOR = "DOCTOR"


class Plan(str, Enum):
    FREE = "FREE"
    BASIC = "BASIC"


class SubscriptionOut(BaseModel):
    id: str
    plan: Plan
    startedAt: datetime
    expiresAt: Optional[datetime] = None


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: Role


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    name: str
    role: Role


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    email: EmailStr
    name: str
    role: Role


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


class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: Role
