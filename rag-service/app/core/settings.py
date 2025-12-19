# rag-service/app/core/settings.py
from __future__ import annotations
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    # --- DB ---
    DATABASE_URL: str = Field(default="postgresql://root:secret@127.0.0.1:5432/phototours_db")

    # --- Gemini / LangChain ---
    GEMINI_API_KEY: str = Field(default="", alias="GEMINI_API_KEY")
    GOOGLE_API_KEY: str = Field(default="", alias="GOOGLE_API_KEY")

    # Embeddings model (Gemini)
    EMBEDDING_MODEL: str = Field(default="text-embedding-004", alias="EMBEDDING_MODEL")

    # LLM model — set 2.5 by default and allow override via .env
    LLM_MODEL: str = Field(default="gemini-2.5-flash", alias="LLM_MODEL")

    # --- RAG knobs ---
    RAG_TOP_K: int = Field(default=3, alias="RAG_TOP_K")
    DEFAULT_SCORE_THRESHOLD: float = Field(default=0.10, alias="RAG_SCORE_THRESHOLD")
    RAG_CHUNK_SIZE: int = Field(default=1000, alias="RAG_CHUNK_SIZE")
    RAG_CHUNK_OVERLAP: int = Field(default=180, alias="RAG_CHUNK_OVERLAP")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()

# Debug prints so we SEE what is loaded at import time
print("[settings] LLM_MODEL =", settings.LLM_MODEL)
print("[settings] EMBEDDING_MODEL =", settings.EMBEDDING_MODEL)
print("[settings] GEMINI_API_KEY set =", bool(settings.GEMINI_API_KEY))