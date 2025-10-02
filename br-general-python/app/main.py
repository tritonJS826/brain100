from contextlib import asynccontextmanager

from fastapi import FastAPI

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
