from __future__ import annotations

import os
from typing import Literal

from pydantic import Field, AliasChoices
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic.functional_validators import field_validator  # pydantic v2

# br-general-python/
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
ENV_PATH = os.path.join(BASE_DIR, ".env")


class Settings(BaseSettings):
    server_port: int = Field(..., alias="SERVER_PORT")
    env_type: Literal["dev", "prod"] = Field(default="dev", alias="ENV_TYPE")
    webapp_domain: str = Field(..., alias="WEBAPP_DOMAIN")

    BASE_URL: str = Field("http://127.0.0.1:8000", alias="BASE_URL")
    API_PREFIX: str = Field("/br-general", alias="API_PREFIX")

    DATABASE_URL: str = Field(
        ...,
        validation_alias=AliasChoices("DATABASE_URL", "database_url"),
    )
    postgres_user: str = Field(..., alias="POSTGRES_USER")
    postgres_password: str = Field(..., alias="POSTGRES_PASSWORD")
    postgres_db: str = Field(..., alias="POSTGRES_DB")

    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    OAUTH_GOOGLE_SCOPE: str = "openid email profile"

    SECRET_KEY: str
    FRONTEND_APP_URL: str = "http://localhost:5173"
    ACCESS_TOKEN_MINUTES: int = 30

    model_config = SettingsConfigDict(
        env_file=ENV_PATH,
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    @property
    def flag_reload(self) -> bool:
        """True в dev, иначе False."""
        return self.env_type == "dev"

    @field_validator("DATABASE_URL")
    @classmethod
    def _db_url_must_be_pg(cls, v: str) -> str:
        if not v.startswith(("postgresql://", "postgres://")):
            raise ValueError(
                "DATABASE_URL must start with postgresql:// or postgres://"
            )
        return v

    @property
    def GOOGLE_REDIRECT_URI(self) -> str:
        base = self.BASE_URL.rstrip("/")
        prefix = "/" + self.API_PREFIX.strip("/")
        return f"{base}{prefix}/auth/google/callback"


settings = Settings()
