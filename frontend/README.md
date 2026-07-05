# Community Hub — Frontend

The Community Hub web client. A React single-page application for community management — members, events, announcements, and more.

**Stack:** React 19 · Vite 8 · Tailwind CSS 4 · React Router · TanStack Query · Axios

---

## Prerequisites

Before starting, complete the platform setup guide for your OS:

- [macOS](../readme/development-setup-readme-macos.md)
- [Linux](../readme/development-setup-readme-linux.md)
- [Windows](../readme/development-setup-readme-windows.md)

The backend API must be running and reachable at the URL configured in `VITE_API_BASE_URL`.

---

## How to Run

### Option 1 — Via Docker (from repository root)

Runs the frontend inside a container with hot reload. No local Node.js install required.

```bash
# Full stack (recommended for first run)
docker compose up --build

# Frontend only (requires backend already running)
docker compose up frontend
```

The frontend source is bind-mounted into the container. `node_modules` lives in a named Docker volume (`frontend_node_modules`) so the host mount does not overwrite installed packages.

Open http://localhost:5173.

To rebuild after dependency changes:

```bash
docker compose up --build frontend
```

### Option 2 — Locally (from `frontend/`)

Recommended for day-to-day UI development — faster HMR and direct access to browser devtools.

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:5173.

---

## Environment Variables

| Variable | File | Description |
|----------|------|-------------|
| `VITE_API_BASE_URL` | `frontend/.env` | Backend API base URL |

Default:

```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

**Important:** This URL is read by the **browser**, not by the Vite server. Always use `http://localhost:<BACKEND_PORT>/api/v1` — even when the frontend runs inside Docker — because the browser runs on your host machine.

See the [environment variable matrix](../README.md#environment-variables) in the root README for how this relates to root and backend env files.

---

## npm Scripts

Run from the `frontend/` directory:

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server (default port 5173) |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
frontend/src/
├── api/           # Axios client, interceptors, endpoint paths
├── assets/        # Static images, icons, logos
├── components/    # Reusable UI (auth forms, layout, common)
├── constants/     # App name, routes, API base URL
├── context/       # React context (AuthProvider)
├── hooks/         # Shared hooks (useAuth, useProtectedRoute)
├── pages/         # Route-level page components
├── router/        # Route definitions, protected/public wrappers
├── services/      # Frontend business logic (authService)
└── utils/         # Pure helpers (token storage, validation)
```

For the full folder philosophy and contribution guidelines, see [Client folder structure](../readme/client-folder-structure.md).

---

## Working with the API

- All HTTP calls go through `src/api/client.js` — never call `axios` directly from components.
- `src/api/interceptor.js` attaches the JWT access token to requests and handles automatic token refresh on 401 responses.
- Tokens are stored in `localStorage` via `src/utils/storage.js`.
- The backend must allow your origin in `CORS_ORIGINS` (default includes `http://localhost:5173` and `http://127.0.0.1:5173`).

---

## Common Issues

| Symptom | Fix |
|---------|-----|
| UI loads but API calls fail | Check `VITE_API_BASE_URL` in `frontend/.env`; must be `http://localhost:8000/api/v1` |
| CORS error in browser console | Ensure backend `CORS_ORIGINS` includes your frontend origin |
| Port 5173 already in use | Stop the other process or set `FRONTEND_PORT` in root `.env` for Docker |
| `node_modules` errors in Docker | Rebuild: `docker compose up --build frontend` |
| Changes not reflected in Docker | Source is bind-mounted — save the file; Vite HMR should pick it up. Restart if needed: `docker compose restart frontend` |

---

## Related Documentation

- [Backend README](../backend/README.md)
- [Root README](../README.md)
- [Client folder structure](../readme/client-folder-structure.md)

## Every frontend task should include:

- Responsive layouts.
- Accessibility considerations (keyboard navigation, ARIA labels where applicable).
- Client-side validation.
- Loading, empty, and error states.
- Reusable components where practical.