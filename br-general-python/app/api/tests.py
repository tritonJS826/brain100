from __future__ import annotations

from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException

from app.db import db
from app.api.users import get_current_user
from app.services.tests_service import (
    get_test_questions_service,
    save_bulk_answers_service,
    get_finished_tests_service,
    get_finished_topics_service,
)


router = APIRouter()


# Get test questions
@router.get("/{test_id}/questions", summary="Get test questions with options and topic")
async def get_test_questions(test_id: str) -> Dict[str, Any]:
    return await get_test_questions_service(db, test_id=test_id)


# Save answers in bulk (auth required)
@router.post(
    "/save-bulk",
    summary="Save all answers for a test session (bulk) and auto-finish",
    description="Anonymous users are not allowed to save; only authenticated users can submit",
)
async def save_bulk_answers(
    payload: Dict[str, Any],
    current=Depends(get_current_user),
) -> Dict[str, Any]:
    user_id: str = current["user_id"]

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
        user_id=user_id,
        session_id=session_id,
    )


# Finished tests for current user
@router.get(
    "/finished",
    summary="Get finished tests for current user by topic",
    description="Provide topicId to filter by a single topic.",
)
async def get_finished_tests(
    topicId: Optional[str] = None,
    current=Depends(get_current_user),
):
    user_id: str = current["user_id"]
    return await get_finished_tests_service(db, user_id=user_id, topic_id=topicId)


# Topics where current user has finished tests
@router.get(
    "/finished/topics",
    summary="Get topics where the current user has finished tests",
    description="Returns { topicId, topicTitle, lastFinishedAt } for each topic.",
)
async def get_finished_topics(
    current=Depends(get_current_user),
):
    user_id: str = current["user_id"]
    return await get_finished_topics_service(db, user_id=user_id)
