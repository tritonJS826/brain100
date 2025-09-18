import os
from dotenv import load_dotenv
from fastapi import FastAPI
from prisma import Prisma

# Load env file (from prisma/.env or root .env)
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "prisma", ".env"))

app = FastAPI()
db = Prisma()


@app.on_event("startup")
async def startup():
    await db.connect()


@app.on_event("shutdown")
async def shutdown():
    await db.disconnect()


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
