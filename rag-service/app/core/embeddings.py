# Embeddings provider (Gemini) with a minimal LangChain-compatible interface.

from __future__ import annotations

from typing import List
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from app.core.settings import settings


def _normalize_model_name(name: str) -> str:
    """
    Gemini embeddings expect full name like 'models/text-embedding-004'.
    If user provided 'text-embedding-004', add the prefix.
    """
    return name if name.startswith("models/") else f"models/{name}"


class GeminiEmbeddings:
    """
    Thin wrapper over GoogleGenerativeAIEmbeddings.
    Exposes two methods:
      - embed_documents(list[str]) -> list[list[float]]
      - embed_query(str) -> list[float]
    """

    def __init__(self, model: str | None = None) -> None:
        raw = model or settings.EMBEDDING_MODEL
        self.model_name = _normalize_model_name(raw)
        self._inner = GoogleGenerativeAIEmbeddings(
            model=self.model_name,
            google_api_key=settings.GEMINI_API_KEY,
        )

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Batch-embed multiple texts."""
        if not texts:
            return []
        return self._inner.embed_documents(texts)

    def embed_query(self, text: str) -> List[float]:
        """Embed a single query string."""
        return self._inner.embed_query(text)


# Singleton factory
_embeddings_singleton: GeminiEmbeddings | None = None


def get_embeddings() -> GeminiEmbeddings:
    """Reuse one embeddings instance per process."""
    global _embeddings_singleton
    if _embeddings_singleton is None:
        _embeddings_singleton = GeminiEmbeddings()
    return _embeddings_singleton