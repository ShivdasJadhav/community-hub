from fastapi import FastAPI

from app.api.router import router as api_router
from app.core import settings
from app.core.lifespan import lifespan


def create_application() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        lifespan=lifespan,
    )

    app.include_router(api_router)

    return app


app = create_application()