# RAG chat endpoint:
#  1) embed user question (Gemini embeddings)
#  2) retrieve top-K chunks from pgvector
#  3) build strict prompt ("answer only from context; otherwise say you don't know")
#  4) generate answer via Gemini LLM
#  5) return answer + sources

from __future__ import annotations
from typing import List, Dict, Tuple

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.core.embeddings import get_embeddings
from app.core.llm import get_llm
from app.core.settings import settings
from app.core.prompt import build_prompt
from app.db.postgres import fetch_all

router = APIRouter(tags=["rag-chat"])


# Input/Output models

class ChatRequest(BaseModel):
    question: str = Field(..., description="User question (English or any language).")
    top_k: int = Field(
        default=settings.RAG_TOP_K,
        ge=1,
        le=50,
        description="How many chunks to retrieve for context.",
    )
    score_threshold: float = Field(
        default=settings.DEFAULT_SCORE_THRESHOLD,
        ge=0.0,
        le=1.0,
        description="Min similarity (0..1). Lower => more results.",
    )


class ChatSource(BaseModel):
    title: str
    chunk_index: int
    score: float


class ChatResponse(BaseModel):
    question: str
    answer: str
    sources: List[ChatSource]


# Helpers

def _to_vector_literal(vector: List[float]) -> str:
    """Convert Python list[float] into pgvector text literal '[v1,v2,...]'."""
    return "[" + ",".join(f"{value:.6f}" for value in vector) + "]"


# Endpoint

@router.post("", response_model=ChatResponse, summary="RAG chat: answer using only retrieved context")
async def chat(payload: ChatRequest) -> ChatResponse:
    question = (payload.question or "").strip()
    if not question:
        raise HTTPException(status_code=422, detail="EMPTY_QUESTION")

    # Embed question
    embeddings = get_embeddings()
    query_vector: List[float] = embeddings.embed_query(question)
    query_vector_lit = _to_vector_literal(query_vector)

    # Retrieve context via pgvector (cosine). score = 1 - distance
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
        (query_vector_lit, payload.score_threshold, payload.top_k),
    )

    hits: List[Dict[str, object]] = [
        {
            "title": title,
            "chunk_index": chunk_index,
            "content": content,
            "score": float(score),
        }
        for (title, chunk_index, content, score) in rows
    ]

    # If no context, answer explicitly that we don't have info
    if not hits:
        return ChatResponse(
            question=question,
            answer="I don't have enough information in the provided data.",
            sources=[],
        )

    # Build prompt and run LLM
    prompt = build_prompt(question, hits)
    llm = get_llm()
    answer_text = llm.generate(prompt).strip() or "I don't have enough information in the provided data."

    sources: List[ChatSource] = [
        ChatSource(title=hit["title"], chunk_index=hit["chunk_index"], score=hit["score"])
        for hit in hits
    ]

    return ChatResponse(question=question, answer=answer_text, sources=sources)