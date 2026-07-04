#!/bin/sh
set -e

echo "Installing backend dependencies..."
uv sync

echo "Running database migrations..."
uv run alembic upgrade head

echo "Starting application..."
exec "$@"
