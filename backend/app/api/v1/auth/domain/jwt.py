from datetime import UTC, datetime, timedelta
from typing import Any

from jose import JWTError, jwt

from app.api.v1.auth.constants import TOKEN_TYPE_ACCESS, TOKEN_TYPE_REFRESH
from app.core import settings


class InvalidTokenError(Exception):
    """Raised when a JWT is invalid, expired, or has an unexpected type."""


def create_access_token(subject: str) -> str:
    """
    Create a signed JWT access token for the given subject (user id).
    """
    expire = datetime.now(UTC) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": subject,
        "exp": expire,
        "type": TOKEN_TYPE_ACCESS,
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(subject: str) -> str:
    """
    Create a signed JWT refresh token for the given subject (user id).
    """
    expire = datetime.now(UTC) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    payload = {
        "sub": subject,
        "exp": expire,
        "type": TOKEN_TYPE_REFRESH,
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> dict[str, Any]:
    """
    Decode and validate a JWT, returning its payload.

    Raises InvalidTokenError when the token is invalid or expired.
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
    except JWTError as exc:
        raise InvalidTokenError("Invalid token.") from exc

    if not isinstance(payload, dict):
        raise InvalidTokenError("Invalid token.")

    return payload
