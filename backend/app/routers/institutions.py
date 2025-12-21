from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from backend.app import crud, schemas
from backend.app.database import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.Institution])
def read_institutions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    institutions = crud.get_institutions(db, skip=skip, limit=limit)
    return institutions
