from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings.

    Values are loaded from the environment and `.env` file.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # ------------------------------------------------------------------
    # Application
    # ------------------------------------------------------------------

    PROJECT_NAME: str = "Community Hub API"
    API_V1_PREFIX: str = "/api/v1"
    VERSION: str = "0.1.0"

    DEBUG: bool = True

    # ------------------------------------------------------------------
    # Database
    # ------------------------------------------------------------------

    DATABASE_URL: str = Field(
        default="postgresql+psycopg://communityhub:communityhub@localhost:5432/community_hub"
    )

    # ------------------------------------------------------------------
    # Redis
    # ------------------------------------------------------------------

    REDIS_URL: str = Field(
        default="redis://localhost:6379/0"
    )


@lru_cache
def get_settings() -> Settings:
    """
    Returns a cached Settings instance.

    The settings are loaded only once during the application's lifetime.
    """
    return Settings()


settings = get_settings()