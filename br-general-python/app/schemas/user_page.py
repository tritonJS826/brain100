from datetime import datetime
from typing import Literal, List, Union
from pydantic import BaseModel


class PassedTestSummary(BaseModel):
    name: str
    times_passed: int


class BaseUserInfo(BaseModel):
    email: str
    name: str
    role: Literal["PATIENT", "DOCTOR"]


class FreeUserPage(BaseUserInfo):
    plan: Literal["FREE"]
    consultations_left: int
    passed_tests: List[PassedTestSummary]


class BasicUserPage(BaseUserInfo):
    plan: Literal["BASIC"]
    subscription_ends_at: datetime
    consultations_left: int
    passed_tests: List[PassedTestSummary]


UserPageResponse = Union[FreeUserPage, BasicUserPage]
