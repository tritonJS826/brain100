# Gemini LLM wrapper (LangChain).

from __future__ import annotations
from typing import Optional

from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.settings import settings


class GeminiLLM:
    """Tiny wrapper around ChatGoogleGenerativeAI for text generation."""

    def __init__(self, model: Optional[str] = None) -> None:
        model_name = model or settings.LLM_MODEL
        api_key = settings.GEMINI_API_KEY or getattr(settings, "GOOGLE_API_KEY", None)

        print(f"[GeminiLLM] Using model='{model_name}' (API v1)")

        # Force stable API v1
        self._inner = ChatGoogleGenerativeAI(
            model=model_name,
            google_api_key=api_key,
            temperature=0.2,
            api_version="v1",
        )

    def generate(self, prompt: str) -> str:
        """Send a text prompt to the Gemini model and return the generated response."""
        try:
            response = self._inner.invoke(prompt)
            generated_text = getattr(response, "content", "")
            return generated_text.strip()

        except Exception as error:
            return f"[LLM error: {error}]"


# Singleton instance
_llm_singleton: Optional[GeminiLLM] = None

def get_llm() -> GeminiLLM:
    global _llm_singleton
    if _llm_singleton is None:
        _llm_singleton = GeminiLLM()
    return _llm_singleton