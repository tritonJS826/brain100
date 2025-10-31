# Search top-K similar chunks via pgvector using a Gemini embedding for the query.

from __future__ import annotations

from typing import List, Tuple

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.core.embeddings import get_embeddings
from app.core.settings import settings
from app.db.postgres import fetch_all

router = APIRouter(tags=["rag-search"])


# Request / Response models

class SearchRequest(BaseModel):
    query: str = Field(..., description="User query to search against the indexed chunks.")
    top_k: int = Field(
        default=settings.RAG_TOP_K,
        ge=1,
        le=50,
        description="How many chunks to return.",
    )
    score_threshold: float = Field(
        default=settings.DEFAULT_SCORE_THRESHOLD,
        ge=0.0,
        le=1.0,
        description="Min similarity score (0..1). Lower returns more results.",
    )


class SearchHit(BaseModel):
    title: str = Field(..., description="Document title for the chunk.")
    chunk_index: int = Field(..., description="Chunk position within the document.")
    content: str = Field(..., description="Chunk text content.")
    score: float = Field(..., description="Similarity score (1 - cosine distance).")


class SearchResponse(BaseModel):
    query: str
    hits: List[SearchHit]


# Helpers

def _to_vector_literal(vector: List[float]) -> str:
    """Convert Python list[float] into pgvector text literal '[v1,v2,...]'."""
    return "[" + ",".join(f"{value:.6f}" for value in vector) + "]"


# Endpoint

@router.post("", response_model=SearchResponse, summary="Vector search over ingested chunks")
async def search(payload: SearchRequest) -> SearchResponse:
    """ Embed the query with Gemini. Run pgvector ANN search against rag_chunks. Return top-K hits above a similarity threshold.
    """
    query_text = (payload.query or "").strip()
    if not query_text:
        raise HTTPException(status_code=422, detail="EMPTY_QUERY")

    # Embed query
    embeddings = get_embeddings()
    query_vector: List[float] = embeddings.embed_query(query_text)
    vector_literal = _to_vector_literal(query_vector)

    # ANN search with cosine distance (<=>). Convert to similarity via (1 - distance).
    rows: List[Tuple[str, int, str, float]] = fetch_all(
        """
        WITH q AS (SELECT %s::vector AS v)
        SELECT d.title,
               c.chunk_index,
               c.content,
               1 - (c.embedding <=> (SELECT v FROM q)) AS score
        FROM rag_chunks c
        JOIN rag_documents d ON d.document_id = c.document_id
        WHERE (1 - (c.embedding <=> (SELECT v FROM q))) >= %s
        ORDER BY c.embedding <=> (SELECT v FROM q) ASC
        LIMIT %s;
        """,
        (vector_literal, payload.score_threshold, payload.top_k),
    )

    hits: List[SearchHit] = [
        SearchHit(
            title=title,
            chunk_index=chunk_index,
            content=content,
            score=float(score),
        )
        for (title, chunk_index, content, score) in rows
    ]

    return SearchResponse(query=query_text, hits=hits)