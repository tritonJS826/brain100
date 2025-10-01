from __future__ import annotations

import os
from typing import Literal, Optional

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, EmailStr, AnyHttpUrl, field_validator, AliasChoices

# br-general-python/
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
ENV_PATH = os.path.join(BASE_DIR, ".env")


class Settings(BaseSettings):
    OIDC_ISSUER: AnyHttpUrl = Field("https://accounts.google.com", alias="OIDC_ISSUER")
    # Можно явно задать metadata url, а можно оставить пустым, тогда соберём из issuer
    OIDC_METADATA_URL: str | None = Field(None, alias="OIDC_METADATA_URL")
    # --- Runtime / env ---
    server_port: int = Field(..., alias="SERVER_PORT")
    env_type: Literal["dev", "prod"] = Field(default="dev", alias="ENV_TYPE")
    webapp_domain: str = Field(..., alias="WEBAPP_DOMAIN")

    # --- Routing / base ---
    BASE_URL: AnyHttpUrl = Field(..., alias="BASE_URL")
    API_PREFIX: str = Field("/br-general", alias="API_PREFIX")

    # --- DB ---
    # Принимаем и DATABASE_URL, и старое database_url (как у тебя)
    DATABASE_URL: str = Field(
        ..., validation_alias=AliasChoices("DATABASE_URL", "database_url")
    )
    postgres_user: str = Field(..., alias="POSTGRES_USER")
    postgres_password: str = Field(..., alias="POSTGRES_PASSWORD")
    postgres_db: str = Field(..., alias="POSTGRES_DB")

    # --- Email (из origin) ---
    smtp_host: str = Field(..., alias="SMTP_HOST")
    smtp_port: int = Field(..., alias="SMTP_PORT")
    smtp_user: Optional[str] = Field(None, alias="SMTP_USER")
    smtp_password: Optional[str] = Field(None, alias="SMTP_PASSWORD")
    smtp_starttls: bool = Field(True, alias="SMTP_STARTTLS")
    smtp_ssl: bool = Field(False, alias="SMTP_SSL")
    smtp_sender_email: EmailStr = Field(..., alias="SMTP_SENDER_EMAIL")
    smtp_sender_name: str = Field(..., alias="SMTP_SENDER_NAME")

    # --- OAuth / Google (твои) ---
    GOOGLE_CLIENT_ID: str = Field(..., alias="GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET: str = Field(..., alias="GOOGLE_CLIENT_SECRET")
    OAUTH_GOOGLE_SCOPE: str = Field("openid email profile", alias="OAUTH_GOOGLE_SCOPE")

    # --- Auth / JWT / Frontend (твои) ---
    SECRET_KEY: str = Field(..., alias="SECRET_KEY")
    FRONTEND_APP_URL: AnyHttpUrl = Field(..., alias="FRONTEND_APP_URL")
    # 24h по умолчанию
    ACCESS_TOKEN_MINUTES: int = Field(1440, alias="ACCESS_TOKEN_MINUTES")

    model_config = SettingsConfigDict(
        env_file=ENV_PATH,
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    @property
    def oidc_metadata_url(self) -> str:
        if self.OIDC_METADATA_URL:
            return self.OIDC_METADATA_URL
        base = str(self.OIDC_ISSUER).rstrip("/")
        return f"{base}/.well-known/openid-configuration"

    # --- Derived / computed ---
    @property
    def flag_reload(self) -> bool:
        """True в dev, иначе False."""
        return self.env_type == "dev"

    @property
    def GOOGLE_REDIRECT_URI(self) -> str:
        base = str(self.BASE_URL).rstrip("/")
        prefix = "/" + self.API_PREFIX.strip("/")
        return f"{base}{prefix}/auth/google/callback"

    # --- Validators ---
    @field_validator("DATABASE_URL")
    @classmethod
    def _db_url_must_be_pg(cls, v: str) -> str:
        if not v.startswith(("postgresql://", "postgres://")):
            raise ValueError(
                "DATABASE_URL must start with postgresql:// or postgres://"
            )
        return v

    @field_validator("smtp_ssl")
    @classmethod
    def _validate_tls_ssl(cls, v: bool, info):
        starttls = info.data.get("smtp_starttls", True)
        if v and starttls:
            raise ValueError("Only one of SMTP_SSL or SMTP_STARTTLS can be true.")
        return v


settings = Settings()
