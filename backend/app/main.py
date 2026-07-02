from fastapi import FastAPI

app = FastAPI(
    title="Community Hub API",
    version="0.1.0",
)

@app.get("/")
async def root():
    return {
        "message": "Community Hub API",
        "status": "running",
    }