"""FastAPI application entry point."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import get_settings
from app.db.init_db import init_db

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle."""
    init_db()
    yield


app = FastAPI(
    title="Topic-Based Tutoring Platform",
    description="MVP tutoring marketplace with topic-based discovery, slot scheduling, and Google Meet integration.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
origins = [url.strip().rstrip("/") for url in settings.FRONTEND_URL.split(",") if url.strip()]
if "http://localhost:3000" not in origins:
    origins.append("http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all API routes
app.include_router(api_router, prefix="/api")
