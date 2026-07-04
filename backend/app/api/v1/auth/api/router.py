from fastapi import APIRouter, Depends, status

from app.api.v1.auth.api.dependencies import get_auth_service, get_current_user
from app.api.v1.auth.domain.schemas import (
    LoginRequest,
    RefreshRequest,
    RegisterRequest,
    TokenResponse,
)
from app.api.v1.auth.domain.service import AuthService
from app.api.v1.users.domain.models import User
from app.api.v1.users.domain.schemas import UserResponse

router = APIRouter()


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
)
async def register(
    data: RegisterRequest,
    auth_service: AuthService = Depends(get_auth_service),
) -> User:
    return await auth_service.register(data)


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Login with email and password",
)
async def login(
    data: LoginRequest,
    auth_service: AuthService = Depends(get_auth_service),
) -> TokenResponse:
    return await auth_service.login(data)


@router.post(
    "/refresh",
    response_model=TokenResponse,
    summary="Refresh access and refresh tokens",
)
async def refresh(
    data: RefreshRequest,
    auth_service: AuthService = Depends(get_auth_service),
) -> TokenResponse:
    return await auth_service.refresh(data)


@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
    summary="Logout the current user",
)
async def logout(
    auth_service: AuthService = Depends(get_auth_service),
) -> dict[str, str]:
    await auth_service.logout()
    return {"detail": "Successfully logged out."}


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get the current authenticated user",
)
async def me(current_user: User = Depends(get_current_user)) -> User:
    return current_user
