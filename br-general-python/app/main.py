from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, Response

from app.db import db
from app.api import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    await db.connect()
    yield
    # shutdown
    await db.disconnect()


app = FastAPI(lifespan=lifespan)
app.include_router(api_router)


@app.middleware("http")
async def attach_tokens(request: Request, call_next):
    response: Response = await call_next(request)
    if hasattr(request.state, "new_tokens"):
        tokens = request.state.new_tokens
        response.headers["x-new-access-token"] = tokens["access_token"]
        response.headers["x-new-refresh-token"] = tokens["refresh_token"]
    return response
