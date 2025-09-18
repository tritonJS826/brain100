# Backend (FastAPI + Prisma)

This is the Python backend for the **brain100** project.  
It provides REST APIs built with **FastAPI** and uses **Prisma** as the ORM for database access.

---

## Quick Start

### 1. Create and activate virtual environment

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 2. Install dependencies

```bash
cd br-general-python
pip install -r requirements.txt
pip install --upgrade pip
```

### 3. Set up environment variables
Copy .env.local.example to .env and update values:

```bash
cp prisma/.env.local.example prisma/.env
```

### 4. Initialize Prisma

```bash
prisma generate
```

### 5. Run database migrations (if needed)

```bash
prisma migrate deploy
```

### 6. Start the development server

```bash
uvicorn br-general-python.app.main:app --reload --port 8001
```

The API will be available at:
http://localhost:8000

Interactive Docs: http://localhost:8000/docs

