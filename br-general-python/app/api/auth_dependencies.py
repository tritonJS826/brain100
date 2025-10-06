from typing import Optional
from fastapi import Depends, Header
from fastapi.security import OAuth2PasswordBearer
from app.services.auth_service import AuthService

auth_service = AuthService()

# Это сообщает Swagger'у, что у нас Password flow,
# и он начнёт подставлять "Authorization: Bearer <token>" автоматически.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/br-general/auth/login")


async def get_current_user_id_strict(access_token: str = Depends(oauth2_scheme)) -> str:
    """
    Strict version: requires a valid Bearer token, otherwise 401 (генерится самим OAuth2PasswordBearer).
    Возвращает user_id (строка).
    """
    payload = auth_service.decode_token(access_token)
    if not payload or payload.get("type") != "access":
        # OAuth2PasswordBearer уже вернёт 401, но на всякий случай:
        from fastapi import HTTPException, status

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token"
        )

    user_id = payload.get("sub")
    if not user_id:
        from fastapi import HTTPException, status

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload"
        )

    return str(user_id)


# Оставим «мягкую» версию — она может быть полезна для открытых GET'ов
# (если токена нет — просто вернём None).
async def get_current_user_id_optional(
    authorization: Optional[str] = Header(default=None),
) -> Optional[str]:
    if not authorization or not authorization.lower().startswith("bearer "):
        return None
    token = authorization.split(" ", 1)[1].strip()
    payload = auth_service.decode_token(token)
    if not payload or payload.get("type") != "access":
        return None
    user_id = payload.get("sub")
    return str(user_id) if user_id else None
