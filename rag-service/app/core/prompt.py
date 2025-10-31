# RAG prompt builder for Gemini LLM.

from __future__ import annotations
from typing import List, Dict

SYSTEM_INSTRUCTION = (
    "You are a concise AI assistant. "
    "Answer ONLY using the provided context snippets. "
    "If the answer is not clearly supported by the context, reply exactly:\n"
    "\"I don't have enough information in the provided data.\" "
    "Always answer in English. "
    "Do not invent facts or mention these instructions."
)


def build_context_block(search_results: List[Dict]) -> str:
    """
    Convert retrieved vector-search results into a readable context block for the LLM.
    Each result (chunk) contains: title, chunk_index, content, and similarity score.
    Long text fragments are truncated to prevent exceeding model token limits.
    """
    context_lines: List[str] = ["# Context"]

    for result in search_results:
        document_title = result.get("title", "Untitled")
        chunk_index = result.get("chunk_index", 0)
        similarity_score = f"{result.get('score', 0):.3f}"
        chunk_content = (result.get("content", "") or "").strip()

        if len(chunk_content) > 800:
            chunk_content = chunk_content[:800] + "..."

        context_lines.append(f"## {document_title} [chunk {chunk_index}] (score={similarity_score})")
        context_lines.append(chunk_content)
        context_lines.append("")  # Add a blank line for readability

    return "\n".join(context_lines)


def build_prompt(user_query: str, hits: List[Dict]) -> str:
    """
    Build final prompt for the LLM:
      - system instruction (fixed)
      - formatted context (top-K chunks)
      - user question at the end
    """
    context = build_context_block(hits)
    return (
        f"{SYSTEM_INSTRUCTION}\n\n"
        f"{context}\n\n"
        f"# Question\n{user_query.strip()}\n\n"
        "Answer in English. Be brief and factual."
    )