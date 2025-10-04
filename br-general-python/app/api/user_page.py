from fastapi import APIRouter, Depends
from app.api.deps import current_user_id
from app.schemas.user_page import UserPageResponse
from app.services.user_page_service import UserPageService
from app.repositories.user_repository import UserRepository
from app.repositories.test_repository import TestRepo

router = APIRouter(tags=["user page"])


@router.get(
    "",
    response_model=UserPageResponse,
    summary="Get current user's page",
    operation_id="getUserPage",
)
async def get_user_page(user_id: str = Depends(current_user_id)):
    service = UserPageService(UserRepository(), TestRepo())
    return await service.build(user_id)
