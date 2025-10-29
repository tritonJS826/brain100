# REST: ingest plain text/markdown -> chunk -> embed (Gemini) -> store in Postgres.

from __future__ import annotations

from hashlib import sha256
from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.core.chunker import make_chunks
from app.core.embeddings import get_embeddings
from app.db.postgres import fetch_one
from app.db.repo import (
    upsert_document,
    delete_chunks_by_document,
    insert_chunk,
)

router = APIRouter(tags=["rag-ingest"])


# Models

class IngestRequest(BaseModel):
    title: str = Field(..., description="Human-readable title for the document.")
    text: str = Field(..., description="Raw content to index (plain text or markdown).")
    description: Optional[str] = Field(
        default=None,
        description="Optional short description (metadata only).",
    )
    source: Optional[str] = Field(
        default=None,
        description="Optional external source identifier or URL.",
    )
    chunk_size: int = Field(default=1000, ge=200, le=4000)
    chunk_overlap: int = Field(default=200, ge=0, le=1000)


class IngestResponse(BaseModel):
    title: str
    total_chunks: int
    embedded_chunks: int
    inserted_chunks: int
    db_chunks_after: int
    vector_dim: int
    content_hash: str
    note: str


# Helpers

def _to_vector_literal(vector: List[float]) -> str:
    """Convert Python list[float] into pgvector textual literal '[v1,v2,...]'."""
    return "[" + ",".join(f"{value:.6f}" for value in vector) + "]"


# Endpoint

@router.post("", response_model=IngestResponse, summary="Ingest text into the RAG index")
async def ingest_text(payload: IngestRequest) -> IngestResponse:
    # Collecting a unified text for the hash
    parts: List[str] = [payload.title.strip()]
    if payload.description:
        parts.append(payload.description.strip())
    parts.append(payload.text.strip())
    full_content = "\n\n".join(part for part in parts if part)

    if not full_content:
        raise HTTPException(status_code=422, detail="EMPTY_CONTENT")

    content_hash: str = sha256(full_content.encode("utf-8")).hexdigest()

    # Chunking
    chunks = make_chunks(
        title=payload.title,
        text=full_content,
        chunk_size=payload.chunk_size,
        chunk_overlap=payload.chunk_overlap,
    )
    if not chunks:
        raise HTTPException(status_code=422, detail="CHUNKING_YIELDED_NO_DATA")

    # Embeddings (Gemini via LangChain)
    embedder = get_embeddings()
    texts: List[str] = [chunk.content for chunk in chunks]
    vectors: List[List[float]] = embedder.embed_documents(texts)
    if len(vectors) != len(chunks):
        raise HTTPException(status_code=500, detail="EMBEDDINGS_LENGTH_MISMATCH")

    # Upsert + cleanup of old chunks (ingest idempotency)
    document_id = upsert_document(title=payload.title, source=payload.source)
    delete_chunks_by_document(document_id)

    # Inserting chunks
    inserted = 0
    for chunk, vector in zip(chunks, vectors):
        insert_chunk(
            document_id=document_id,
            title=payload.title,
            chunk_index=chunk.chunk_index,
            content=chunk.content,
            content_hash=chunk.content_hash,  # Individual chunk hash
            embedding_literal=_to_vector_literal(vector),
        )
        inserted += 1

    # Checking the number of entries in the database
    row = fetch_one(
        "SELECT COUNT(*) FROM rag_chunks WHERE document_id = %s;",
        (document_id,),
    )
    db_chunks_after = int(row[0]) if row else 0

    return IngestResponse(
        title=payload.title,
        total_chunks=len(chunks),
        embedded_chunks=len(vectors),
        inserted_chunks=inserted,
        db_chunks_after=db_chunks_after,
        vector_dim=len(vectors[0]) if vectors else 0,
        content_hash=content_hash,
        note="Ingest completed: document upserted, previous chunks replaced.",
    )