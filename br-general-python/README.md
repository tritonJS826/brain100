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
pip install --upgrade pip
pip install -r requirements.txt
```

### 2.1 Install dependencies for development environment:

```bash
pip install -r requirements/local.txt
```

### 3. Set up environment variables

Copy .env.local.example to .env and update values:

```bash
cp .env.local.example .env
```

### 4. Initialize Prisma

```bash
prisma generate
```

### 5. Start dockerized postgresql and grafana

```bash
cd ..
docker compose -f local.docker-compose.yml up --build
```

or (if your system uses the old CLI):

```bash
cd ..
docker-compose -f local.docker-compose.yml up --build
```

### 6. (First time only) Run database initial migration

```bash
prisma migrate dev --name init
```

### 7. (For deploying existing migrations)

```bash
prisma migrate deploy
```

### 8. Start locally the FastAPI server with connection to the dockerized postgresql and grafana

```bash
cd br-general-python
python -m app.run
```

### 9. (Optional) Run linters and formatters with Ruff

These commands use pnpm scripts defined in package.json.
Make sure pnpm is installed globally:

#### 9.1 Check only

```bash
pnpm py:lint
```

#### 9.2 Auto-fix issues

```bash
pnpm py:lint:fix
```

#### 9.3 Apply formatting

```bash
pnpm py:format
```

## API Endpoints

By default the server runs on port defined in `.env` (`SERVER_PORT`, e.g. 8010).

### Interactive API Docs

http://localhost:8010/docs

### Health Check

http://localhost:8010/br-general/health
or
http://localhost:8010/br-general/health/general

### Users CRUD

http://localhost:8010/br-general/users

## MailHog (Local Email Testing)

We use [MailHog](https://github.com/mailhog/MailHog) to test emails locally.

### Start the service:

```bash
cd br-general-python
docker compose -f local.mailhog.yml up --build -d
```

### Stop the service:

```bash
docker compose -f local.mailhog.yml down
```

http://localhost:8010/br-general/email/send

### Check the MailHog web interface:
http://localhost:8025

### To test sending an email, you can use the following `curl` command:

```bash
curl -X POST http://localhost:8010/br-general/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "Welcome to Brain100!",
    "template": "email/welcome.html",
    "params": {
      "username": "DemoUser"
    }
  }'
```

### Demo for Swagger UI:

```bash
{
  "to": "user@example.com",
  "subject": "Welcome to Brain100!",
  "template": "email/welcome.html",
  "params": {
    "username": "DemoUser"
  }
}
```