"""
Import all SQLAlchemy models here so Alembic can discover them.
"""

from app.api.v1.users.domain.models import User  # noqa: F401 - Ensures the User model is imported for Alembic