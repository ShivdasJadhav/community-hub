from uuid import UUID

from fastapi import HTTPException, status

from app.api.v1.users.domain.models import User
from app.api.v1.users.domain.schemas import UserCreate, UserUpdate
from app.api.v1.users.domain.validators import normalize_email
from app.api.v1.users.repositories.user_repository import UserRepository


class UserService:
    """
    Business logic for user management.
    """

    def __init__(self, user_repository: UserRepository) -> None:
        self._user_repository = user_repository

    async def create_user(
        self,
        data: UserCreate,
        *,
        hashed_password: str,
    ) -> User:
        """
        Create a new user with a pre-hashed password.

        Email normalization is applied before persistence.
        """
        normalized_email = normalize_email(str(data.email))
        user = User(
            email=normalized_email,
            hashed_password=hashed_password,
            first_name=data.first_name,
            last_name=data.last_name,
        )
        return await self._user_repository.create(user)

    async def get_user(self, user_id: UUID) -> User:
        """Return a user by ID or raise 404 if not found."""
        user = await self._user_repository.get_by_id(user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found.",
            )
        return user

    async def update_user(self, user_id: UUID, data: UserUpdate) -> User:
        """Update mutable user fields and return the updated user."""
        user = await self.get_user(user_id)

        if data.first_name is not None:
            user.first_name = data.first_name
        if data.last_name is not None:
            user.last_name = data.last_name

        return await self._user_repository.update(user)
