import os
import uvicorn
from dotenv import load_dotenv

# Load environment variables from prisma/.env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "prisma/.env"))

if __name__ == "__main__":
    port = int(os.getenv("SERVER_PORT", 8001))  # default 8001 if not set
    print(f"Starting server on port {port}...")
    uvicorn.run(
        "br-general-python.app.main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
    )