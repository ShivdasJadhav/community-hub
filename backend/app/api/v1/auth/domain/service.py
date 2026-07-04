from datetime import UTC, datetime
from uuid import UUID

from fastapi import HTTPException, status

from app.api.v1.auth.constants import TOKEN_TYPE_ACCESS, TOKEN_TYPE_REFRESH
from app.api.v1.auth.domain import jwt
from app.api.v1.auth.domain import password as password_utils
from app.api.v1.auth.domain.jwt import InvalidTokenError
from app.api.v1.auth.domain.schemas import (
    LoginRequest,
    RefreshRequest,
    RegisterRequest,
    TokenResponse,
)
from app.api.v1.users.domain.models import User
from app.api.v1.users.domain.schemas import UserCreate
from app.api.v1.users.domain.service import UserService
from app.api.v1.users.domain.validators import normalize_email
from app.api.v1.users.repositories.user_repository import UserRepository


class AuthService:
    """
    Business logic for authentication flows.
    """

    def __init__(
        self,
        user_repository: UserRepository,
        user_service: UserService,
    ) -> None:
        self._user_repository = user_repository
        self._user_service = user_service

    async def register(self, data: RegisterRequest) -> User:
        """
        Register a new user account.

        Raises 400 if the email is already registered.
        """
        normalized_email = normalize_email(str(data.email))

        if await self._user_repository.exists_by_email(normalized_email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered.",
            )

        hashed_password = password_utils.hash_password(data.password)
        user_create = UserCreate(
            email=normalized_email,
            password=data.password,
            first_name=data.first_name,
            last_name=data.last_name,
        )
        return await self._user_service.create_user(
            user_create,
            hashed_password=hashed_password,
        )

    async def login(self, data: LoginRequest) -> TokenResponse:
        """
        Authenticate a user and return access and refresh tokens.

        Raises 401 for invalid credentials and 403 for inactive accounts.
        """
        normalized_email = normalize_email(str(data.email))
        user = await self._user_repository.get_by_email(normalized_email)

        if user is None or not password_utils.verify_password(
            data.password,
            user.hashed_password,
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive.",
            )

        user.last_login_at = datetime.now(UTC)
        await self._user_repository.update(user)

        return self._create_token_response(user)

    async def refresh(self, data: RefreshRequest) -> TokenResponse:
        """
        Issue a new access and refresh token pair from a valid refresh token.

        Raises 401 for invalid or expired refresh tokens.
        """
        user = await self._get_user_from_token(
            data.refresh_token,
            expected_type=TOKEN_TYPE_REFRESH,
        )
        return self._create_token_response(user)

    async def logout(self) -> None:
        """
        Log out the current user.

        Tokens are discarded client-side; no server-side revocation yet.
        """
        return None

    async def get_current_user(self, token: str) -> User:
        """
        Resolve the authenticated user from a bearer access token.

        Raises 401 for invalid tokens and 403 for inactive accounts.
        """
        return await self._get_user_from_token(
            token,
            expected_type=TOKEN_TYPE_ACCESS,
        )

    async def _get_user_from_token(self, token: str, *, expected_type: str) -> User:
        try:
            payload = jwt.decode_token(token)
        except InvalidTokenError as exc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token.",
            ) from exc

        token_type = payload.get("type")
        if token_type != expected_type:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token.",
            )

        subject = payload.get("sub")
        if not subject:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token.",
            )

        try:
            user_id = UUID(subject)
        except ValueError as exc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token.",
            ) from exc

        user = await self._user_repository.get_by_id(user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token.",
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive.",
            )

        return user

    def _create_token_response(self, user: User) -> TokenResponse:
        subject = str(user.id)
        return TokenResponse(
            access_token=jwt.create_access_token(subject),
            refresh_token=jwt.create_refresh_token(subject),
        )
