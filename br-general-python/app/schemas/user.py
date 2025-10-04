from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel, EmailStr):
    email: str
    password: str
    name: str | None = None


class UserResponse(BaseModel):
    id: int
    email: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshTokenRequest(BaseModel):
    access_token: str
    refresh_token: str


class UserWithTokens(BaseModel):
    user: UserOut
    tokens: Token | None = None


class LogoutResponse(BaseModel):
    message: str
