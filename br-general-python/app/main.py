# br-general-python/app/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.sessions import (
    SessionMiddleware,
)  # ← нужен для OAuth handshake

from app.db import db
from app.settings import settings
from app.api import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()
    yield
    await db.disconnect()


app = FastAPI(lifespan=lifespan)
app.router.redirect_slashes = False

# Только для OAuth: хранит state/nonce в подписанной cookie (НЕ серверные сессии)
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY,
    same_site="lax",  # для редиректа с Google
    session_cookie="oauth",
    https_only=(settings.env_type == "prod"),  # в проде True
)

# Весь API под общим префиксом (/br-general/…)
app.include_router(api_router, prefix=settings.API_PREFIX)
