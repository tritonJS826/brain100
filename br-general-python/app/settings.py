# br-general-python/app/settings.py
from typing import Literal
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, field_validator


class Settings(BaseSettings):
    server_port: int = Field(8000, alias="SERVER_PORT")
    env_type: Literal["dev", "prod"] = Field("dev", alias="ENV_TYPE")
    webapp_domain: str = Field("localhost", alias="WEBAPP_DOMAIN")

    # Prisma использует только DATABASE_URL, но оставим и «разложенные» поля,
    # если они тебе где-то нужны.
    database_url: str = Field(..., alias="DATABASE_URL")
    postgres_user: str = Field(..., alias="POSTGRES_USER")
    postgres_password: str = Field(..., alias="POSTGRES_PASSWORD")
    postgres_db: str = Field(..., alias="POSTGRES_DB")

    model_config = SettingsConfigDict(
        env_file=("prisma/.env", ".env"),
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

    @property
    def flag_reload(self) -> bool:
        """Возвращает True, если включён режим разработки"""
        return self.env_type == "dev"

    @field_validator("database_url")
    @classmethod
    def _db_url_must_be_pg(cls, v: str) -> str:
        if not v.startswith(("postgresql://", "postgres://")):
            raise ValueError(
                "DATABASE_URL must start with postgresql:// or postgres://"
            )
        return v


settings = Settings()
