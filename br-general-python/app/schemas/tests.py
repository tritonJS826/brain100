from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime


class AnswerOption(BaseModel):
    id: str
    text: str


class Question(BaseModel):
    id: str
    text: str
    type: str  # "RADIO" | "CHECKBOX" | "TEXT"
    options: Optional[List[AnswerOption]] = None


class TestQuestionsResponse(BaseModel):
    test_id: str = Field(..., alias="testId")
    topic_id: str = Field(..., alias="topicId")
    questions: List[Question]


class BulkAnswerItem(BaseModel):
    question_id: str = Field(..., alias="questionId")
    selected_option_ids: Optional[List[str]] = Field(
        default=None, alias="selectedOptionIds"
    )
    text_answer: Optional[str] = Field(default=None, alias="textAnswer")


class BulkSaveAnswersRequest(BaseModel):
    test_id: str = Field(..., alias="testId")
    answers: List[BulkAnswerItem]
    stats: Dict[str, int] = Field(
        default_factory=dict,
        description="Generic stats computed on the frontend (int)",
    )
    session_id: Optional[str] = Field(
        default=None,
        description="Optional; attach answers to an existing session. If not provided, the system will start a new one",
    )
    user_id: Optional[str] = Field(default=None, alias="userId")


class BulkSaveAnswersResponse(BaseModel):
    session_id: str = Field(..., alias="sessionId")
    saved_count: int = Field(..., alias="savedCount")
    is_finished: bool = Field(..., alias="isFinished")


class UserTestResult(BaseModel):
    """One finished test summary for a user within a topic"""

    testTitle: str
    finishedAt: datetime
    stats: Dict[str, int]
