from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.db import db
from app.api import api_router
from app.api.tests import router as tests_router


from fastapi.middleware.cors import CORSMiddleware
from app.settings import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    await db.connect()
    yield
    # shutdown
    await db.disconnect()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.webapp_domain],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
app.include_router(tests_router)
