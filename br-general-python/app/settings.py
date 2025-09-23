from typing import Literal
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, field_validator

import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # br-general-python/
ENV_PATH = os.path.join(BASE_DIR, ".env")

class Settings(BaseSettings):
    server_port: int = Field(..., alias="SERVER_PORT")
    env_type: Literal['dev', 'prod'] = Field(default="dev", alias="ENV_TYPE")
    webapp_domain: str = Field(..., alias="WEBAPP_DOMAIN")

    database_url: str = Field(..., alias="DATABASE_URL")
    postgres_user: str = Field(..., alias="POSTGRES_USER")
    postgres_password: str = Field(..., alias="POSTGRES_PASSWORD")
    postgres_db: str = Field(..., alias="POSTGRES_DB")

    model_config = SettingsConfigDict(
        env_file=ENV_PATH,
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

    @property
    def flag_reload(self) -> bool:
        """Return true if in development mode, else false."""
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
