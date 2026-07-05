# Community Hub

A community management platform for organizing members, events, announcements, bookings, and more. Built as a monorepo with a React frontend and a FastAPI backend.

**Stack:** React · Vite · Tailwind CSS · FastAPI · PostgreSQL · Redis · Docker Compose

---

## Repository Layout

```
community-hub/
├── frontend/          # React SPA (Vite)
├── backend/           # FastAPI REST API
├── readme/            # Architecture and setup guides
├── docker-compose.yml # Full-stack local development
├── .env.example       # Shared environment template
└── README.md          # You are here
```

---

## Quick Start

The fastest way to get running — requires only **Git** and **Docker**:

```bash
cp .env.example .env
docker compose up --build
```

Then open:

| URL | What |
|-----|------|
| http://localhost:5173 | Web UI |
| http://localhost:8000/api/v1/health | API health check |
| http://localhost:8000/docs | API documentation (Swagger) |

The first build takes a few minutes. The backend entrypoint installs dependencies and runs database migrations automatically.

---

## Development Workflows

Choose the path that fits your situation:

| Path | When to use | Host tools |
|------|-------------|------------|
| **A — Docker all-in-one** | First run, demos, minimal setup | Git + Docker |
| **B — Hybrid local dev** | Day-to-day feature work | Git + Docker + Node 22 + Python 3.12 + uv |

**Path A** runs everything in containers. No Node.js or Python needed on your machine.

**Path B** runs Postgres and Redis in Docker, but runs the backend (`uv`) and frontend (`npm`) natively for faster iteration and easier debugging.

For step-by-step instructions, pick your platform:

### Development setup (start here)

- [macOS](readme/development-setup-readme-macos.md)
- [Linux](readme/development-setup-readme-linux.md)
- [Windows](readme/development-setup-readme-windows.md)

### Application guides

- [Frontend](frontend/README.md) — UI development, npm scripts, project structure
- [Backend](backend/README.md) — API development, migrations, testing, Docker internals

### Architecture

- [Client folder structure](readme/client-folder-structure.md)
- [Server folder structure](readme/server-folder-structure.md)

---

## Environment Variables

Community Hub uses three env files. Using the wrong hostname is the most common setup mistake.

| Variable | Root `.env` | `backend/.env` | `frontend/.env` | Notes |
|----------|-------------|----------------|-----------------|-------|
| `POSTGRES_*` | Yes | — | — | Used by Docker Compose for the Postgres container |
| `DATABASE_URL` | `postgres` hostname | **`localhost` for hybrid** | — | Backend reads `backend/.env` when run locally |
| `REDIS_URL` | `redis` hostname | **`localhost` for hybrid** | — | Backend reads `backend/.env` when run locally |
| `BACKEND_PORT` | Yes | — | — | Host port mapped to backend container |
| `FRONTEND_PORT` | Yes | — | — | Host port mapped to frontend container |
| `SECRET_KEY`, JWT settings | Yes | Yes | — | Backend authentication |
| `CORS_ORIGINS` | Yes | Yes | — | Allowed frontend origins |
| `VITE_API_BASE_URL` | Yes | — | Yes | Always `http://localhost:<BACKEND_PORT>/api/v1` — the browser runs on the host |

**Rules:**

- `VITE_API_BASE_URL` always points at the host-mapped backend port, even when the frontend runs in Docker.
- When running the backend locally (Path B), change `DATABASE_URL` and `REDIS_URL` in `backend/.env` from `postgres`/`redis` to `localhost`.

Copy templates before editing:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

---

## Verification Checklist

After setup, confirm everything is working:

1. `docker compose ps` — services show **healthy**.
2. `curl http://localhost:8000/api/v1/health` → `{"status":"healthy"}`.
3. http://localhost:5173 loads the landing page.
4. Register and log in successfully.
5. http://localhost:8000/docs shows Swagger UI.

---

## Daily Commands

From the repository root:

| Command | Purpose |
|---------|---------|
| `docker compose up` | Start full stack (foreground) |
| `docker compose up -d` | Start full stack (detached) |
| `docker compose up postgres redis -d` | Start infra only (for hybrid dev) |
| `docker compose logs -f backend` | Tail backend logs |
| `docker compose logs -f frontend` | Tail frontend logs |
| `docker compose down` | Stop services (keeps data) |
| `docker compose down -v` | Stop and **wipe all database data** |
| `docker compose up --build` | Rebuild images and start |

For hybrid development, see the [platform setup guides](readme/development-setup-readme-macos.md) for backend (`bash scripts/dev.sh`) and frontend (`npm run dev`) commands.

---

## Getting Help

If something does not work, check the **Troubleshooting** section in your platform setup guide:

- [macOS troubleshooting](readme/development-setup-readme-macos.md#troubleshooting)
- [Linux troubleshooting](readme/development-setup-readme-linux.md#troubleshooting)
- [Windows troubleshooting](readme/development-setup-readme-windows.md#troubleshooting)

Common fixes:

- **Database connection refused** → use `localhost` in `backend/.env` for hybrid dev
- **Frontend can't reach API** → `VITE_API_BASE_URL` must be `http://localhost:8000/api/v1`
- **Port conflicts** → `docker compose down`, then free the port or change `BACKEND_PORT`/`FRONTEND_PORT`
- **Need a clean slate** → `docker compose down -v` then `docker compose up --build`

## General Development Standards (applies to all subtasks)

### Every backend task should include:

Database migrations where required.
Input validation using Pydantic models.
Authorization checks based on community roles.
Unit tests for business logic.
API documentation via OpenAPI.

### Every frontend task should include:

Responsive layouts.
Accessibility considerations (keyboard navigation, ARIA labels where applicable).
Client-side validation.
Loading, empty, and error states.
Reusable components where practical.

### Every integration task should include:

Strongly typed API client usage.
Consistent error mapping between backend and UI.
Cache invalidation or data refresh after mutations.
End-to-end verification that the feature works as intended across the full stack.
