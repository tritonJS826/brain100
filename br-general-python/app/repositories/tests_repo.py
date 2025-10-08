from __future__ import annotations

import json
from datetime import datetime, timezone
from prisma import Prisma
from fastapi import HTTPException, status
from typing import Any, Dict, List, Optional


# Read queries


async def get_test_with_questions_repo(
    db: Prisma, test_id: str
) -> Optional[Dict[str, Any]]:
    """
    Load test with topic, questions and options.
    """
    return await db.test.find_unique(
        where={"id": test_id},
        include={
            "topic": True,
            "questions": {
                "orderBy": {"createdAt": "asc"},
                "include": {
                    "options": {
                        "orderBy": {"createdAt": "asc"},
                        "include": {},
                    }
                },
            },
        },
    )


async def fetch_finished_tests_repo(
    db: Prisma,
    *,
    user_id: str,
    topic_id: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """
    Return finished sessions for a user (optionally filter by topic).
    """
    where: Dict[str, Any] = {"userId": user_id, "finishedAt": {"not": None}}
    if topic_id:
        where["test"] = {"topicId": topic_id}

    sessions = await db.testsession.find_many(
        where=where,
        order={"finishedAt": "desc"},
        include={
            "test": True,
        },
    )

    out: List[Dict[str, Any]] = []
    for s in sessions:
        out.append(
            {
                "testTitle": getattr(s.test, "title", "Unknown test")
                if s.test
                else "Unknown test",
                "finishedAt": s.finishedAt,
                "stats": getattr(s, "stats", {}) or {},
            }
        )
    return out


async def fetch_finished_topics_repo(
    db: Prisma, *, user_id: str
) -> List[Dict[str, Any]]:
    """
    Topics where the user has at least one finished test, with last finished date.
    """
    sessions = await db.testsession.find_many(
        where={"userId": user_id, "finishedAt": {"not": None}},
        order={"finishedAt": "desc"},
        include={
            "test": {
                "include": {
                    "topic": True,
                }
            }
        },
    )

    topic_last: Dict[str, Optional[str]] = {}
    topic_title: Dict[str, str] = {}

    for s in sessions:
        t = s.test
        if not t:
            continue
        tid = t.topicId
        topic_title[tid] = (
            t.topic.title if getattr(t, "topic", None) else "Unknown topic"
        )

        last = s.finishedAt
        cur = topic_last.get(tid)
        if cur is None or (last and last > cur):
            topic_last[tid] = last

    return [
        {
            "topicId": tid,
            "topicTitle": topic_title.get(tid, "Unknown topic"),
            "lastFinishedAt": last,
        }
        for tid, last in topic_last.items()
    ]


# Write queries


async def ensure_or_create_session_repo(
    db: Prisma, *, test_id: str, user_id: str, session_id: Optional[str]
) -> Dict[str, Any]:
    """
    Get existing session (by id) or create a new one bound to user & test.
    """
    if session_id:
        session = await db.testsession.find_unique(where={"id": session_id})
        if session is None:
            raise ValueError("SESSION_NOT_FOUND")
        if session.finishedAt is not None:
            raise ValueError("SESSION_ALREADY_FINISHED")
        if session.userId != user_id or session.testId != test_id:
            raise ValueError("SESSION_MISMATCH")
        return session

    # create fresh session
    return await db.testsession.create(
        data={
            "user": {"connect": {"id": user_id}},
            "test": {"connect": {"id": test_id}},
        }
    )


async def save_answers_bulk_repo(
    db: Prisma,
    *,
    session_id: str,
    answers: List[Dict[str, Any]],
) -> int:
    """
    Persist all answers for a session.
    """
    saved = 0
    for a in answers:
        data: Dict[str, Any] = {
            "sessionId": session_id,
            "questionId": a.get("questionId"),
        }
        # Optional fields
        if a.get("answerOptionId") is not None:
            data["answerOptionId"] = a["answerOptionId"]
        if a.get("freeText") is not None:
            data["freeText"] = a["freeText"]

        await db.givenanswer.create(data=data)
        saved += 1
    return saved


async def finish_session_with_stats_repo(
    db: Prisma,
    *,
    session_id: str,
    stats_json: dict,
) -> None:
    """
    Attach computed stats and mark session as finished.
    """
    try:
        await db.testsession.update(
            where={"id": session_id},
            data={
                "stats": json.dumps(stats_json),
                "finishedAt": datetime.now(timezone.utc),
            },
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"DB_ERROR: {e}",
        )
