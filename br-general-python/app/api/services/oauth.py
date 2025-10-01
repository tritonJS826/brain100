# app/api/services/oauth.py
from authlib.integrations.starlette_client import OAuth
from app.settings import settings

oauth = OAuth()
oauth.register(
    name="google",
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    server_metadata_url=settings.oidc_metadata_url,  # ← discovery, без хардкода
    client_kwargs={
        "scope": settings.OAUTH_GOOGLE_SCOPE,  # "openid email profile"
        "prompt": "consent",
        "access_type": "offline",
    },
)
