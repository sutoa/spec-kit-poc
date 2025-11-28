from fastapi import FastAPI
from contextlib import asynccontextmanager
from .config import setup_logging
from .api import plaid, report

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Setup logging
    setup_logging()
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(plaid.router, prefix="/api/v1")
app.include_router(report.router, prefix="/api/v1")
