from collections.abc import AsyncGenerator

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.auth.domain.service import AuthService
from app.api.v1.users.domain.models import User
from app.api.v1.users.domain.service import UserService
from app.api.v1.users.repositories.user_repository import UserRepository
from app.core import settings
from app.db.dependencies import get_db

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_PREFIX}/auth/login",
)


async def get_user_repository(
    session: AsyncSession = Depends(get_db),
) -> AsyncGenerator[UserRepository, None]:
    """Provide a UserRepository bound to the current database session."""
    yield UserRepository(session)


async def get_user_service(
    user_repository: UserRepository = Depends(get_user_repository),
) -> AsyncGenerator[UserService, None]:
    """Provide a UserService with its repository dependency."""
    yield UserService(user_repository)


async def get_auth_service(
    session: AsyncSession = Depends(get_db),
    user_service: UserService = Depends(get_user_service),
) -> AsyncGenerator[AuthService, None]:
    """Provide an AuthService with its dependencies."""
    yield AuthService(UserRepository(session), user_service)


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    auth_service: AuthService = Depends(get_auth_service),
) -> User:
    """
    Resolve the authenticated user from the Authorization bearer token.
    """
    return await auth_service.get_current_user(token)
