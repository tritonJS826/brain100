import uvicorn
from app.settings import settings

from app.mainlocally import app

if __name__ == "__main__":
    port = settings.server_port
    print(f"Starting server on port {port} (reload={settings.flag_reload})...")

    uvicorn.run(
        "app.mainlocally:app",
        host="0.0.0.0",
        port=port,
        reload=settings.flag_reload,
    )
