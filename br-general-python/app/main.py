from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.db import db
from app.api import api_router


# 👇 даёт короткие и понятные имена операциям в Swagger (operationId)
def generate_operation_id(route):
    # пример: тег "User Page" + имя функции → "User_Page_get_user_page"
    tag = (route.tags[0] if route.tags else "api").replace(" ", "_")
    name = route.name or route.path.replace("/", "_")
    return f"{tag}_{name}"


@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()
    yield
    await db.disconnect()


app = FastAPI(
    lifespan=lifespan,
    generate_unique_id_function=generate_operation_id,  # 👈 ключевая строка
)

app.include_router(api_router)
