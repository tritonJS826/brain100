from __future__ import annotations

from typing import Any, Dict, List, Optional
from prisma import Prisma


# ---------- READ ----------


async def get_test_with_questions_repo(
    db: Prisma, test_id: str
) -> Optional[Dict[str, Any]]:
    """
    Load test with topic, questions and options.
    prisma-client-py: лучше использовать include, а поля доставать в сервисе через атрибуты.
    """
    return await db.test.find_unique(
        where={"id": test_id},
        include={
            "topic": True,  # целиком topic
            "questions": {
                "orderBy": {"createdAt": "asc"},
                "include": {
                    "options": {
                        "orderBy": {"createdAt": "asc"},
                        "include": {},  # целиком option
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
            "test": {"select": {"id": True, "title": True, "topicId": True}},
        },
    )
    return sessions


async def fetch_finished_topics_repo(
    db: Prisma, *, user_id: str
) -> List[Dict[str, Any]]:
    """
    Topics where the user has at least one finished test, with last finished date.
    (No sorting by design — the frontend will sort.)
    """
    sessions = await db.testsession.find_many(
        where={"userId": user_id, "finishedAt": {"not": None}},
        order={"finishedAt": "desc"},
        include={
            "test": {
                "include": {
                    "topic": True,  # вернёт объект Topic или None
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
        # title из связанного topic (если его нет — "Unknown topic")
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


# ---------- WRITE ----------


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
    Persist all answers for a session. Returns number of saved rows.
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
    stats_json: Dict[str, int],
) -> None:
    """
    Attach computed stats and mark session as finished.
    """
    from datetime import datetime, timezone

    await db.testsession.update(
        where={"id": session_id},
        data={
            "stats": stats_json,
            "finishedAt": datetime.now(timezone.utc),
        },
    )
