from fastapi import APIRouter
from app.schemas.user import UserCreate, UserResponse
from app.services.user_service import UserService

router = APIRouter()



@router.post("/", response_model=UserResponse)
async def create_user(user: UserCreate):
    return await UserService.create_user(user)
