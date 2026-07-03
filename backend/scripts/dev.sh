uv sync
uv run alembic upgrade head
uv run uvicorn app.main:app --reload