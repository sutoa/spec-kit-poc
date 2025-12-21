from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from backend.app import models
from backend.app.database import engine
from backend.app.logging_config import configure_logging
from backend.app.routers import dashboard, institutions, snaptrade
import logging

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173", # Frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    configure_logging()
    models.Base.metadata.create_all(bind=engine)

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logging.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"message": "An unexpected error occurred. Please try again later."},
    )

app.include_router(institutions.router, prefix="/institutions", tags=["institutions"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
app.include_router(snaptrade.router, prefix="/snaptrade", tags=["snaptrade"])

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Account Reporting Backend!"}
