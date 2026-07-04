import re

PASSWORD_MIN_LENGTH = 8


def validate_password_strength(password: str) -> str:
    """
    Validate password meets complexity requirements.

    Requires at least 8 characters, one uppercase, one lowercase, and one digit.
    """
    if len(password) < PASSWORD_MIN_LENGTH:
        msg = f"Password must be at least {PASSWORD_MIN_LENGTH} characters long."
        raise ValueError(msg)

    if not re.search(r"[A-Z]", password):
        raise ValueError("Password must contain at least one uppercase letter.")

    if not re.search(r"[a-z]", password):
        raise ValueError("Password must contain at least one lowercase letter.")

    if not re.search(r"\d", password):
        raise ValueError("Password must contain at least one number.")

    return password
