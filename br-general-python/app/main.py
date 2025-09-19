from contextlib import asynccontextmanager
from fastapi import FastAPI
from prisma import Prisma

db = Prisma()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    await db.connect()
    yield
    # shutdown
    await db.disconnect()


app = FastAPI(lifespan=lifespan)


@app.get("/")
async def root():
    # Simple test query
    users_count = await db.user.count()
    return {
        "status": "Backend with Prisma and FastAPI - working! (/)",
        "users_in_db": users_count,
    }


@app.get("/general")
async def general():
    # Simple test query
    users_count = await db.user.count()
    return {
        "status": "Backend with Prisma and FastAPI - working! (/general)",
        "users_in_db": users_count,
    }
