from authlib.integrations.starlette_client import OAuth
from ...settings import settings

oauth = OAuth()
oauth.register(
    name="google",
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    authorize_url="https://accounts.google.com/o/oauth2/v2/auth",
    authorize_params=None,
    access_token_url="https://oauth2.googleapis.com/token",
    access_token_params=None,
    refresh_token_url=None,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={
        "scope": "openid email profile",
        "prompt": "consent",
        "access_type": "offline",
    },
    api_base_url="https://www.googleapis.com/oauth2/v3/",
    userinfo_endpoint="https://www.googleapis.com/oauth2/v3/userinfo",
)
