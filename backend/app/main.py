from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.database import create_db_and_tables
from backend.app.config import settings
from backend.app.logging_config import configure_logging

# Configure logging
logger = configure_logging()

from backend.app.routers import dashboard
# from backend.app.routers import institutions

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers here as they are created
app.include_router(dashboard.router, prefix=settings.API_V1_STR, tags=["dashboard"])
# app.include_router(institutions.router, prefix=settings.API_V1_STR, tags=["institutions"])


@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
async def root():
    return {"message": "Account Viewer API is running!"}