from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.services.auth_service import AuthService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")
auth_service = AuthService()


async def current_user_id(token: str = Depends(oauth2_scheme)) -> str:
    """Извлекает user_id из access_token"""
    payload = auth_service.decode_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has no user ID",
        )

    return str(user_id)
