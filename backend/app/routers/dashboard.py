from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import date
from backend.app.schemas import DashboardReport
from backend.app.database import get_db
from backend.app.services.dashboard_service import get_dashboard_report
from backend.app.config import settings

router = APIRouter()

@router.get(
    "/dashboard",
    response_model=DashboardReport,
    summary="Get consolidated account report",
    description="Retrieves a consolidated report of financial accounts, optionally filtered by an 'as-of date'.",
    tags=["Dashboard"]
)
def read_dashboard_report(
    as_of_date: Optional[date] = Query(
        None,
        description="Optional date to filter the report (YYYY-MM-DD). If not provided, returns the latest available data."
    ),
    db: Session = Depends(get_db)
):
    return get_dashboard_report(db, as_of_date)