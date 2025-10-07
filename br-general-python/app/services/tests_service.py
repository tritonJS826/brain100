from __future__ import annotations

from typing import Any, Dict, List, Optional
from fastapi import HTTPException, status
from prisma import Prisma

from app.repositories.tests_repo import (
    get_test_with_questions_repo,
    ensure_or_create_session_repo,
    save_answers_bulk_repo,
    finish_session_with_stats_repo,
    fetch_finished_tests_repo,
    fetch_finished_topics_repo,
)


# Read queries


async def get_test_questions_service(db: Prisma, test_id: str) -> Dict[str, Any]:
    """Return test with topic and questions."""
    test = await get_test_with_questions_repo(db, test_id)
    if not test:
        raise HTTPException(status_code=404, detail="TEST_NOT_FOUND")

    topic_id = getattr(test, "topicId", None)
    if topic_id is None and getattr(test, "topic", None):
        topic_id = test.topic.id

    return {
        "testId": test.id,
        "topicId": topic_id,
        "questions": [
            {
                "id": q.id,
                "text": q.text,
                "type": q.type,
                "options": [
                    {"id": opt.id, "text": opt.text} for opt in (q.options or [])
                ],
            }
            for q in (test.questions or [])
        ],
    }


# Write queries


async def save_bulk_answers_service(
    db: Prisma,
    *,
    test_id: str,
    answers: List[Dict[str, Any]],
    stats: Dict[str, int],
    user_id: Optional[str],
    session_id: Optional[str],
) -> Dict[str, Any]:
    """
    Save answers in bulk for an authenticated user and auto-finish the session.
    Anonymous users cannot save, but they can read questions.
    """
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="AUTH_REQUIRED"
        )

    # validate test exists
    test = await get_test_with_questions_repo(db, test_id)
    if not test:
        raise HTTPException(status_code=404, detail="TEST_NOT_FOUND")

    # open or reuse a session
    try:
        session = await ensure_or_create_session_repo(
            db, test_id=test_id, user_id=user_id, session_id=session_id
        )
    except ValueError as ex:
        # Map repo errors
        code_map = {
            "SESSION_NOT_FOUND": status.HTTP_404_NOT_FOUND,
            "SESSION_ALREADY_FINISHED": status.HTTP_400_BAD_REQUEST,
            "SESSION_MISMATCH": status.HTTP_400_BAD_REQUEST,
        }
        raise HTTPException(status_code=code_map.get(str(ex), 400), detail=str(ex))

    # persist answers
    saved = await save_answers_bulk_repo(db, session_id=session.id, answers=answers)

    await finish_session_with_stats_repo(db, session_id=session.id, stats_json=stats)
    return {"sessionId": session.id, "savedCount": saved, "isFinished": True}


# Reports


async def get_finished_tests_service(
    db: Prisma, *, user_id: str, topic_id: Optional[str]
) -> List[Dict[str, Any]]:
    """
    All finished test attempts for the current user.
    Repo already returns dicts: {testTitle, finishedAt, stats}.
    """
    return await fetch_finished_tests_repo(db, user_id=user_id, topic_id=topic_id)


async def get_finished_topics_service(
    db: Prisma, *, user_id: str
) -> List[Dict[str, Any]]:
    """
    All topics where the user has at least one finished test with last finished date.
    """
    return await fetch_finished_topics_repo(db, user_id=user_id)
