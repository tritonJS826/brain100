FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV TZ=Europe/Berlin
ENV PRISMA_CACHE_DIR=/app/.prisma
ENV PYTHONPATH=/app

# Working directory
WORKDIR /app

# Add non-root user
ARG USER=appuser
RUN useradd --system ${USER}

# Setup timezone and Prisma deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    tzdata \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY --chown=${USER} br-general-python/requirements.txt requirements.txt
COPY --chown=${USER} br-general-python/requirements/ requirements/

# Setup Python environment
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements/production.txt

# Copy project
COPY --chown=${USER} br-general-python .

# Generate Prisma client (runs as appuser now)
RUN prisma generate
RUN prisma migrate

# Logs in the volume
VOLUME /app/logs

# Expose port
EXPOSE 8000

# Run FastAPI with run.py
CMD ["python", "app/run.py"]
