# Development Setup — Linux

This guide walks you through setting up **Community Hub** on Linux. By the end, you will have the full stack running locally and be ready to contribute.

Community Hub is a community management platform with a React frontend and a FastAPI backend backed by PostgreSQL and Redis.

---

## Prerequisites

Install the tools below. **Path A (Docker all-in-one)** only requires Git and Docker. **Path B (hybrid)** requires all tools.

### Git

**Debian / Ubuntu:**

```bash
sudo apt update
sudo apt install -y git
git --version
```

**Fedora / RHEL:**

```bash
sudo dnf install -y git
git --version
```

### Docker Engine + Compose plugin

**Debian / Ubuntu:**

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-v2
sudo usermod -aG docker $USER
newgrp docker
docker --version
docker compose version
```

**Fedora:**

```bash
sudo dnf install -y docker docker-compose
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
newgrp docker
```

> **Note:** Log out and back in (or run `newgrp docker`) after adding yourself to the `docker` group so you can run Docker without `sudo`.

### Node.js 22+ (Path B only)

Using [nvm](https://github.com/nvm-sh/nvm) (recommended):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22
node --version
```

**Debian / Ubuntu (alternative):**

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

### Python 3.12 (Path B only)

**Debian / Ubuntu:**

```bash
sudo apt install -y python3.12 python3.12-venv
python3.12 --version
```

**Fedora:**

```bash
sudo dnf install -y python3.12
```

### uv — Python package manager (Path B only)

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
source $HOME/.local/bin/env
uv --version
```

---

## Choose Your Workflow

| Path | Best for | Host tools needed |
|------|----------|-------------------|
| **A — Docker all-in-one** | First run, onboarding, quick demos | Git + Docker |
| **B — Hybrid local dev** | Day-to-day feature work, debugging | Git + Docker + Node + Python + uv |

**Recommendation:** Start with **Path A** to confirm everything works, then switch to **Path B** when you begin active development.

---

## Path A — Docker All-in-One

No Node.js, Python, or uv required on your machine.

### Step 1 — Clone the repository

```bash
git clone <repository-url>
cd community-hub
```

### Step 2 — Create environment file

From the **repository root**:

```bash
cp .env.example .env
```

The defaults work out of the box for local Docker development.

### Step 3 — Start the full stack

```bash
docker compose up --build
```

The first run takes several minutes while images build and dependencies install. Wait until you see the backend and frontend services report healthy.

What happens automatically:

- Postgres and Redis start with health checks.
- The backend entrypoint runs `uv sync`, applies Alembic migrations, then starts Uvicorn with hot reload.
- The frontend serves Vite on port 5173 with source bind-mounted from your machine.

### Step 4 — Open the app

| URL | What to expect |
|-----|----------------|
| http://localhost:5173 | Community Hub landing page |
| http://localhost:8000/api/v1/health | `{"status":"healthy"}` |
| http://localhost:8000/docs | FastAPI Swagger UI |

---

## Path B — Hybrid Local Development

Run Postgres and Redis in Docker; run the backend and frontend natively for faster iteration and easier debugging.

### Step 1 — Clone the repository

```bash
git clone <repository-url>
cd community-hub
```

### Step 2 — Start infrastructure services

From the **repository root**:

```bash
cp .env.example .env
docker compose up postgres redis -d
```

Confirm they are healthy:

```bash
docker compose ps
```

### Step 3 — Configure and start the backend

From the **`backend/`** directory:

```bash
cd backend
cp .env.example .env
```

**Critical:** Change database and Redis hostnames from Docker service names to `localhost`:

```diff
- DATABASE_URL=postgresql+psycopg://communityhub:communityhub@postgres:5432/community_hub
+ DATABASE_URL=postgresql+psycopg://communityhub:communityhub@localhost:5432/community_hub

- REDIS_URL=redis://redis:6379/0
+ REDIS_URL=redis://localhost:6379/0
```

Install dependencies, run migrations, and start the server:

```bash
uv sync --group dev
uv run alembic upgrade head
uv run uvicorn app.main:app --reload
```

Or use the convenience script:

```bash
bash scripts/dev.sh
```

The API is available at http://localhost:8000.

### Step 4 — Configure and start the frontend

Open a **new terminal**. From the **`frontend/`** directory:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The UI is available at http://localhost:5173.

`VITE_API_BASE_URL` in `frontend/.env` must point at the host-mapped backend port:

```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

---

## Verification Checklist

After either path, confirm all of the following:

1. `docker compose ps` — `postgres` and `redis` show **healthy** (and `backend`/`frontend` too if using Path A).
2. `curl http://localhost:8000/api/v1/health` returns `{"status":"healthy"}`.
3. http://localhost:5173 loads the Community Hub landing page.
4. Register and log in — confirms migrations, JWT, and CORS are working.
5. http://localhost:8000/docs shows the Swagger UI.

If any step fails, see [Troubleshooting](#troubleshooting) below.

---

## Daily Commands Cheat Sheet

### Path A — Docker (from repository root)

| Command | Purpose |
|---------|---------|
| `docker compose up` | Start all services (foreground, shows logs) |
| `docker compose up -d` | Start detached |
| `docker compose logs -f backend` | Tail backend logs |
| `docker compose logs -f frontend` | Tail frontend logs |
| `docker compose restart backend` | Restart API after env change |
| `docker compose down` | Stop services (keeps database data) |
| `docker compose down -v` | **Destructive** — wipes Postgres/Redis volumes |
| `docker compose up --build backend` | Rebuild backend after Dockerfile or dependency changes |
| `docker compose up --build frontend` | Rebuild frontend after Dockerfile or dependency changes |

### Path B — Hybrid

| Terminal | Directory | Command |
|----------|-----------|---------|
| 1 | repository root | `docker compose up postgres redis -d` |
| 2 | `backend/` | `bash scripts/dev.sh` |
| 3 | `frontend/` | `npm run dev` |

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `connection refused` to Postgres from local backend | `DATABASE_URL` still uses `postgres` hostname | Change to `localhost` in `backend/.env` |
| Frontend can't reach API | Wrong `VITE_API_BASE_URL` | Must be `http://localhost:8000/api/v1` (not `backend` or a container name) |
| Port already in use (5432/6379/8000/5173) | Another service or old container | `docker compose down`, free the port, or change `BACKEND_PORT`/`FRONTEND_PORT` in root `.env` |
| Backend container keeps restarting | Migration failure or bad env | `docker compose logs backend` |
| `node_modules` missing in Docker frontend | First build still running | Wait for `npm ci` during image build; volume populates on first `up` |
| Auth works in Docker but not hybrid | Different `SECRET_KEY` or stale DB | Align `backend/.env` with root `.env`; run `uv run alembic upgrade head` |
| CORS errors in browser | Origin not in `CORS_ORIGINS` | Ensure `http://localhost:5173` and `http://127.0.0.1:5173` are listed |
| Need a clean slate | Stale volumes or migrations | `docker compose down -v` then `docker compose up --build` (**deletes all database data**) |
| `permission denied` on Docker socket | User not in `docker` group | `sudo usermod -aG docker $USER` then log out and back in |

---

## Next Steps

- [Frontend README](../frontend/README.md) — UI development, npm scripts, project structure
- [Backend README](../backend/README.md) — API development, migrations, testing
- [Root README](../README.md) — project overview and documentation index
