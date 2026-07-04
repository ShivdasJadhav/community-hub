from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.users.domain.models import User


class UserRepository:
    """
    Data access layer for User entities.
    """

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_by_id(self, user_id: UUID) -> User | None:
        """Return a user by primary key, or None if not found."""
        result = await self._session.execute(
            select(User).where(User.id == user_id),
        )
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> User | None:
        """Return a user by email, or None if not found."""
        result = await self._session.execute(
            select(User).where(User.email == email),
        )
        return result.scalar_one_or_none()

    async def exists_by_email(self, email: str) -> bool:
        """Return True if a user with the given email exists."""
        result = await self._session.execute(
            select(User.id).where(User.email == email),
        )
        return result.scalar_one_or_none() is not None

    async def create(self, user: User) -> User:
        """Persist a new user and return it."""
        self._session.add(user)
        await self._session.commit()
        await self._session.refresh(user)
        return user

    async def update(self, user: User) -> User:
        """Persist changes to an existing user and return it."""
        await self._session.commit()
        await self._session.refresh(user)
        return user

    async def delete(self, user: User) -> None:
        """Remove a user from the database."""
        self._session.delete(user)
        await self._session.commit()
