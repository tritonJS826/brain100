from fastapi import FastAPI
from app.api import api_router

app = FastAPI(
    title="RAG Service",
    description="RAG backend with LangChain + Gemini + pgvector",
    version="0.1.0",
)

app.include_router(api_router)

@app.get("/health", tags=["system"])
async def health_check():
    return {"status": "ok"}