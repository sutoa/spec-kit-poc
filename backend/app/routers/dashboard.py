from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import date
from typing import Optional
from backend.app import schemas
from backend.app.database import get_db
from backend.app.services import dashboard_service

router = APIRouter()

@router.get("/", response_model=schemas.DashboardResponse)
def read_dashboard_data(
    as_of_date: Optional[date] = Query(None, description="Date to retrieve account balances as of."),
    db: Session = Depends(get_db)
):
    return dashboard_service.get_dashboard_data(db, as_of_date)
