FROM python:3.12-slim

# System deps for psycopg (libpq), and build tools for wheels where needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential gcc curl ca-certificates pkg-config libpq-dev \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only requirements first to leverage Docker layer caching
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy the service code
COPY app /app/app

# Env for FastAPI & runtime
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8010

EXPOSE 8010

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8010"]