from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from prisma import Prisma

router = APIRouter(prefix="/tests", tags=["tests"])


class AnswerOptionOut(BaseModel):
    id: str
    text: str


class QuestionOut(BaseModel):
    id: str
    text: str
    type: str
    options: Optional[List[AnswerOptionOut]] = None


class TestOut(BaseModel):
    id: str
    title: str
    description: Optional[str] = None


class TestWithQuestionsOut(TestOut):
    questions: Optional[List[QuestionOut]] = None


class StartSessionResponse(BaseModel):
    sessionId: str


class SaveAnswerIn(BaseModel):
    questionId: str
    answerOptionId: Optional[str] = None  # RADIO
    freeText: Optional[str] = None  # TEXT


class SaveAnswersRequest(BaseModel):
    answers: List[SaveAnswerIn]


@router.get("", response_model=List[TestOut])
async def list_tests():
    db = Prisma()
    await db.connect()
    items = await db.test.find_many()
    await db.disconnect()
    return [TestOut(id=t.id, title=t.title, description=t.description) for t in items]


@router.get("/{test_id}", response_model=TestWithQuestionsOut)
async def get_test(test_id: str):
    db = Prisma()
    await db.connect()
    t = await db.test.find_unique(
        where={"id": test_id},
        include={"questions": {"include": {"options": True}}},
    )
    await db.disconnect()

    if not t:
        raise HTTPException(404, "Test not found")

    return {
        "id": t.id,
        "title": t.title,
        "description": t.description,
        "questions": [
            {
                "id": q.id,
                "text": q.text,
                "type": q.type,
                "options": [{"id": o.id, "text": o.text} for o in (q.options or [])],
            }
            for q in (t.questions or [])
        ],
    }


@router.post("/{test_id}/sessions", response_model=StartSessionResponse)
async def start_session(test_id: str):
    db = Prisma()
    await db.connect()

    exists = await db.test.find_unique(where={"id": test_id})
    if not exists:
        await db.disconnect()
        raise HTTPException(404, "Test not found")

    s = await db.testsession.create(data={"testId": test_id, "userId": 1})
    await db.disconnect()
    return {"sessionId": s.id}


@router.post("/sessions/{session_id}/answers")
async def save_answers(session_id: str, payload: SaveAnswersRequest):
    # надо сделать: сохранять в GivenAnswer
    return {"sessionId": session_id, "saved": payload.answers}


@router.post("/sessions/{session_id}/finish")
async def finish_session(session_id: str):
    db = Prisma()
    await db.connect()
    await getattr(db, "testsession").update(
        where={"id": session_id},
        data={"finishedAt": datetime.utcnow()},
    )
    await db.disconnect()
    return {"sessionId": session_id, "status": "finished"}
