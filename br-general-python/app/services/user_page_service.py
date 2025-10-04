from collections import Counter
from app.repositories.user_repository import UserRepository
from app.repositories.test_repository import TestRepo
from app.schemas.user_page import (
    FreeUserPage,
    BasicUserPage,
    PassedTestSummary,
    UserPageResponse,
)


class UserPageService:
    def __init__(self, user_repo: UserRepository, test_repo: TestRepo):
        self.user_repo = user_repo
        self.test_repo = test_repo

    async def build(self, user_id: str) -> UserPageResponse:
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            from fastapi import HTTPException

            raise HTTPException(status_code=404, detail="User not found")

        # 1) Активная подписка (Basic)
        sub = await self.user_repo.get_active_subscription(user_id)

        # 2) Сводка по завершённым тестам
        sessions = await self.test_repo.list_sessions_with_titles(user_id)
        finished_titles = [s.test.title for s in sessions if s.finishedAt and s.test]
        counts = Counter(finished_titles)
        passed_tests = [
            PassedTestSummary(name=k, times_passed=v) for k, v in counts.items()
        ]

        # 3) Возвращаем либо BASIC, либо FREE
        role_str = user.role.name if hasattr(user.role, "name") else str(user.role)

        if sub:  # BASIC
            included = int(sub.consultationsIncluded or 0)
            used = int(sub.consultationsUsed or 0)
            return BasicUserPage(
                email=user.email,
                name=user.name,
                role=role_str,
                plan="BASIC",
                subscription_ends_at=sub.endsAt,
                consultations_left=max(0, included - used),
                passed_tests=passed_tests,
            )

        # FREE (активной подписки нет)
        return FreeUserPage(
            email=user.email,
            name=user.name,
            role=role_str,
            plan="FREE",
            consultations_left=0,
            passed_tests=passed_tests,
        )
