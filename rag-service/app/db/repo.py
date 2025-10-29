from __future__ import annotations
from typing import Optional
from hashlib import sha256

from app.db.postgres import execute, fetch_one


def _doc_id_from_title(title: str) -> str:
    """Generate stable document_id from title (deterministic SHA-256 hash)."""
    return sha256(title.strip().encode("utf-8")).hexdigest()


# Documents

def upsert_document(*, title: str, source: Optional[str] = None) -> str:
    """Insert or update a document in rag_documents (idempotent by title hash)."""
    document_id = _doc_id_from_title(title)
    execute(
        """
        INSERT INTO rag_documents (document_id, title, source)
        VALUES (%s, %s, %s)
        ON CONFLICT (document_id) DO UPDATE
          SET title = EXCLUDED.title,
              source = COALESCE(EXCLUDED.source, rag_documents.source);
        """,
        (document_id, title, source),
    )
    return document_id


def get_document_id_by_title(title: str) -> Optional[str]:
    """Fetch document_id for given title, or None if not found."""
    row = fetch_one(
        "SELECT document_id FROM rag_documents WHERE title = %s;",
        (title,),
    )
    return row[0] if row else None


# Chunks

def delete_chunks_by_document(document_id: str) -> None:
    """Delete all chunks related to the given document_id."""
    execute("DELETE FROM rag_chunks WHERE document_id = %s;", (document_id,))


def insert_chunk(
    *,
    document_id: str,
    title: str,
    chunk_index: int,
    content: str,
    content_hash: str,
    embedding_literal: str,
) -> None:
    """Insert a single text chunk with its embedding into rag_chunks."""
    execute(
        """
        INSERT INTO rag_chunks
          (document_id, chunk_index, title, content, content_hash, embedding)
        VALUES
          (%s, %s, %s, %s, %s, %s::vector);
        """,
        (document_id, chunk_index, title, content, content_hash, embedding_literal),
    )