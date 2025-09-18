import os
import uvicorn
from dotenv import load_dotenv
import subprocess

# Load environment variables from prisma/.env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "prisma/.env"))

if __name__ == "__main__":
    port = int(os.getenv("SERVER_PORT"))
    flag_reload = os.getenv("ENV_TYPE", "dev") == "dev"
    print(f"Starting server on port {port}...")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=flag_reload,
    )
