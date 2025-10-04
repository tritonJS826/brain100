# -----------------------------------------------------------------------------
# Why this file exists (short version):
# We need a single, reusable FastAPI dependency that reliably answers:
# “Who is calling this endpoint?”
#
# What it does:
# - Extracts the Bearer JWT from the `Authorization` header.
# - Verifies the token (signature, expiry) using AuthService.
# - Ensures it is an *access* token (not a refresh token).
# - Returns the current user's ID (`sub`) to the endpoint.
#
# Why it matters:
# - Security: blocks unauthenticated requests with 401 automatically.
# - Data scoping: endpoints can safely load data for *this* user only.
# - Simplicity: no copy-pasting auth checks across endpoints; just use
#   `Depends(current_user_id)` and you get a validated `user_id`.
#
# Swagger bonus:
# - OAuth2PasswordBearer integrates with the “Authorize” button in Swagger.
#   Once authorized, all protected endpoints receive the token automatically.
# -----------------------------------------------------------------------------


from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.services.auth_service import AuthService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")
auth_service = AuthService()


async def current_user_id(token: str = Depends(oauth2_scheme)) -> str:
    """getting user_id from access_token"""
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
