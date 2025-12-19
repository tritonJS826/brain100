# Tiny text chunker using LangChain splitters.

from __future__ import annotations

from dataclasses import dataclass
from hashlib import sha256
from typing import Iterable, List

from langchain_text_splitters import RecursiveCharacterTextSplitter


@dataclass(frozen=True)
class Chunk:
    """Single chunk unit ready for embedding + storage."""
    title: str                 # source title (document title)
    chunk_index: int           # order of chunk within the document
    content: str               # text content of the chunk
    content_hash: str          # stable hash to support idempotent ingest


def _hash(text: str) -> str:
    """Stable hash for idempotent ingest (same input -> same hash)."""
    return sha256(text.encode("utf-8")).hexdigest()


def make_chunks(
    title: str,
    text: str,
    *,
    chunk_size: int = 1000,
    chunk_overlap: int = 200,
) -> List[Chunk]:
    """
    Split raw text into overlapping chunks.
    - Uses RecursiveCharacterTextSplitter (handles mixed punctuation/newlines well).
    - Default sizes fit common embedding context sizes.
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
        separators=["\n\n", "\n", " ", ""],
    )
    parts: List[str] = splitter.split_text(text or "")

    chunks: List[Chunk] = []
    for idx, part in enumerate(parts):
        # content hash includes title + part so the same text placed under another title
        content_hash = _hash(f"{title}\n{part}")
        chunks.append(
            Chunk(
                title=title,
                chunk_index=idx,
                content=part,
                content_hash=content_hash,
            )
        )
    return chunks


def make_chunks_from_many(
    items: Iterable[tuple[str, str]],
    *,
    chunk_size: int = 1000,
    chunk_overlap: int = 200,
) -> List[Chunk]:
    """
    Convenience: chunk multiple (title, text) pairs.
    """
    out: List[Chunk] = []
    for title, text in items:
        out.extend(
            make_chunks(
                title=title,
                text=text,
                chunk_size=chunk_size,
                chunk_overlap=chunk_overlap,
            )
        )
    return out