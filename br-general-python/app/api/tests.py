from __future__ import annotations

from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status

from app.db import db
from app.api.auth_dependencies import get_current_user_id_strict
from app.services.tests_service import (
    get_test_questions_service,
    save_bulk_answers_service,
    get_finished_tests_service,
    get_finished_topics_service,
)

# --- TEMP DEBUG: whoami ---
from fastapi import Header
from app.services.auth_service import AuthService

router = APIRouter()


# 1) Get test questions
@router.get("/{test_id}/questions", summary="Get test questions with options and topic")
async def get_test_questions(test_id: str) -> Dict[str, Any]:
    return await get_test_questions_service(db, test_id=test_id)


# 2) Save answers in bulk (auth required)
@router.post(
    "/save-bulk",
    summary="Save all answers for a test session (bulk) and auto-finish",
    description="Anonymous users are not allowed to save; only authenticated users can submit.",
)
async def save_bulk_answers(
    payload: Dict[str, Any],
    user_id: Optional[str] = Depends(get_current_user_id_strict),
) -> Dict[str, Any]:
    """
    Expected payload:
    {
      "testId": "cuid",
      "answers": [
        {"questionId": "q1", "selectedOptionIds": ["opt1"]} | {"questionId": "qX", "textAnswer": "..."}
      ],
      "stats": {"depression": 6, "happiness": 3},
      "sessionId": "optional"
    }
    """
    test_id: Optional[str] = payload.get("testId")
    if not test_id:
        raise HTTPException(status_code=422, detail="FIELD_REQUIRED:testId")

    answers: List[Dict[str, Any]] = payload.get("answers") or []
    stats: Dict[str, int] = payload.get("stats") or {}
    session_id: Optional[str] = payload.get("sessionId")

    return await save_bulk_answers_service(
        db=db,
        test_id=test_id,
        answers=answers,
        stats=stats,
        user_id=user_id,  # берётся из Bearer токена; None => 401 внутри сервиса
        session_id=session_id,
    )


# 3) Finished tests for current user (optional topic filter)
@router.get(
    "/finished",
    summary="Get finished tests for current user by topic",
    description="Provide ?topicId=... to filter by a single topic.",
)
async def get_finished_tests(
    topicId: Optional[str] = None,
    user_id: Optional[str] = Depends(get_current_user_id_strict),
):
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="AUTH_REQUIRED"
        )
    return await get_finished_tests_service(db, user_id=user_id, topic_id=topicId)


# 4) Topics where current user has finished tests
@router.get(
    "/finished/topics",
    summary="Get topics where the current user has finished tests",
    description="Returns { topicId, topicTitle, lastFinishedAt } for each topic.",
)
async def get_finished_topics(
    user_id: Optional[str] = Depends(get_current_user_id_strict),
):
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="AUTH_REQUIRED"
        )
    return await get_finished_topics_service(db, user_id=user_id)


# --- TEMP DEBUG: whoami ---


@router.get("/_debug/auth", summary="[TEMP] echo Authorization + decoded JWT")
async def debug_auth(authorization: Optional[str] = Header(default=None)):
    svc = AuthService()
    token = None
    payload = None
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1].strip()
        payload = svc.decode_token(token)
    return {
        "received_header": authorization,
        "parsed_token_prefix": (token[:20] + "...") if token else None,
        "decoded_payload": payload,
    }
