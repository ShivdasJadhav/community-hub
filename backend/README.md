# Community Hub — Backend

The Community Hub REST API. A FastAPI application for community management with JWT authentication, PostgreSQL persistence, and Redis support.

**Stack:** FastAPI · SQLAlchemy (async) · Alembic · PostgreSQL · Redis · uv

---

## Prerequisites

Before starting, complete the platform setup guide for your OS:

- [macOS](../readme/development-setup-readme-macos.md)
- [Linux](../readme/development-setup-readme-linux.md)
- [Windows](../readme/development-setup-readme-windows.md)

Postgres and Redis must be running — either via Docker Compose or installed locally.

---

## How to Run

### Option 1 — Via Docker (from repository root)

Runs the backend inside a container. Dependencies and migrations are handled automatically on every container start.

```bash
# Full stack (recommended for first run)
docker compose up --build

# Backend only (requires postgres and redis already running)
docker compose up postgres redis backend -d
```

**What the entrypoint does** (`scripts/docker-entrypoint.sh`):

1. `uv sync` — install/update Python dependencies
2. `uv run alembic upgrade head` — apply database migrations
3. Start Uvicorn with the command from the Dockerfile (hot reload enabled)

The application source is bind-mounted into the container. The Python virtual environment lives in a named Docker volume (`backend_venv`) so the host mount does not overwrite installed packages.

Open http://localhost:8000/docs for the interactive API documentation.

To rebuild after dependency or Dockerfile changes:

```bash
docker compose up --build backend
```

### Option 2 — Locally (from `backend/`)

Recommended for day-to-day API development — direct debugger access and faster reload.

```bash
cd backend
cp .env.example .env
```

**Critical for hybrid development:** change `DATABASE_URL` and `REDIS_URL` to use `localhost` instead of Docker service names:

```diff
- DATABASE_URL=postgresql+psycopg://communityhub:communityhub@postgres:5432/community_hub
+ DATABASE_URL=postgresql+psycopg://communityhub:communityhub@localhost:5432/community_hub

- REDIS_URL=redis://redis:6379/0
+ REDIS_URL=redis://localhost:6379/0
```

Then start the server:

```bash
uv sync --group dev
uv run alembic upgrade head
uv run uvicorn app.main:app --reload
```

Or use the convenience script:

```bash
bash scripts/dev.sh
```

Ensure infrastructure is running first (from repository root):

```bash
docker compose up postgres redis -d
```

---

## Environment Variables

| Variable | File | Description |
|----------|------|-------------|
| `DATABASE_URL` | `backend/.env` | PostgreSQL connection string — use `localhost` for hybrid dev |
| `REDIS_URL` | `backend/.env` | Redis connection string — use `localhost` for hybrid dev |
| `SECRET_KEY` | `backend/.env` | JWT signing key — change in production |
| `JWT_ALGORITHM` | `backend/.env` | JWT algorithm (default: `HS256`) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `backend/.env` | Access token lifetime |
| `REFRESH_TOKEN_EXPIRE_DAYS` | `backend/.env` | Refresh token lifetime |
| `CORS_ORIGINS` | `backend/.env` | Allowed frontend origins (JSON array) |

When running in Docker, Compose injects `DATABASE_URL` and `REDIS_URL` with Docker network hostnames from the root `.env`. When running locally, `backend/.env` is loaded by `app/core/config.py`.

See the [environment variable matrix](../README.md#environment-variables) in the root README for the full picture across all env files.

---

## Development Commands

Run from the `backend/` directory:

| Command | Purpose |
|---------|---------|
| `uv sync --group dev` | Install production + dev dependencies |
| `bash scripts/dev.sh` | Sync deps, migrate, start server with reload |
| `uv run uvicorn app.main:app --reload` | Start dev server |
| `uv run alembic upgrade head` | Apply all pending migrations |
| `uv run alembic revision --autogenerate -m "description"` | Create a new migration from model changes |
| `uv run alembic downgrade -1` | Roll back one migration |
| `uv run pytest` | Run tests |
| `uv run ruff check .` | Lint |
| `uv run ruff format .` | Format code |
| `uv run mypy app` | Type check |

---

## API Reference

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/health` | Health check — returns `{"status":"healthy"}` |
| `POST /api/v1/auth/register` | Register a new user |
| `POST /api/v1/auth/login` | Log in and receive JWT tokens |
| `POST /api/v1/auth/refresh` | Refresh an access token |

Interactive documentation:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## Docker Internals

The backend container uses:

- **Base image:** `python:3.12-slim`
- **Package manager:** [uv](https://docs.astral.sh/uv/) — `uv sync --frozen --no-dev` at build time
- **Entrypoint:** `scripts/docker-entrypoint.sh` — runs `uv sync` + `alembic upgrade head` before every start
- **Default command:** `uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`
- **Health check:** polls `GET /api/v1/health` every 10 seconds

This means you do not need to run migrations manually when using Docker — they apply on container start.

---

## Project Structure

```
backend/
├── app/
│   ├── main.py          # FastAPI application factory
│   ├── core/            # Config, security, lifespan, logging
│   ├── db/              # SQLAlchemy engine, session, models
│   ├── api/             # Route registration
│   │   └── v1/          # Versioned endpoints (auth, health, ...)
│   └── shared/          # Pagination, responses, permissions
├── migrations/          # Alembic migration scripts
├── scripts/             # dev.sh, docker-entrypoint.sh
├── tests/
└── pyproject.toml
```

For architecture principles and feature module conventions, see [Server folder structure](../readme/server-folder-structure.md).

---

## Common Issues

| Symptom | Fix |
|---------|-----|
| `connection refused` to Postgres | Use `localhost` in `DATABASE_URL` when running backend locally |
| Migration errors on container start | Check `docker compose logs backend`; ensure Postgres is healthy first |
| Port 8000 already in use | Stop the other process or set `BACKEND_PORT` in root `.env` |
| Auth tokens invalid after switching Docker ↔ hybrid | Align `SECRET_KEY` in `backend/.env` with root `.env` |
| CORS errors from frontend | Add frontend origin to `CORS_ORIGINS` in `backend/.env` |
| Need a clean database | `docker compose down -v` from repo root (**deletes all data**), then restart |

---

## Related Documentation

- [Frontend README](../frontend/README.md)
- [Root README](../README.md)
- [Server folder structure](../readme/server-folder-structure.md)


## Every backend task should include:

- Database migrations where required.
- Input validation using Pydantic models.
- Authorization checks based on community roles.
- Unit tests for business logic.
- API documentation via OpenAPI.