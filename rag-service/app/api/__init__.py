from fastapi import APIRouter
from .ingest import router as ingest_router
from .search import router as search_router
from .chat import router as chat_router

api_router = APIRouter()
api_router.include_router(ingest_router, prefix="/ingest", tags=["rag-ingest"])
api_router.include_router(search_router, prefix="/search", tags=["rag-search"])
api_router.include_router(chat_router, prefix="/chat", tags=["rag-chat"])