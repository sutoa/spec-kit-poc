from sqlalchemy.orm import Session
from backend.app import models, schemas
from typing import List

def get_institution(db: Session, institution_id: int):
    return db.query(models.Institution).filter(models.Institution.id == institution_id).first()

def get_institution_by_external_id(db: Session, external_id: str):
    return db.query(models.Institution).filter(models.Institution.external_id == external_id).first()

def get_institutions(db: Session, skip: int = 0, limit: int = 100) -> List[models.Institution]:
    return db.query(models.Institution).offset(skip).limit(limit).all()

def create_institution(db: Session, institution: schemas.InstitutionCreate):
    db_institution = models.Institution(
        external_id=institution.external_id,
        name=institution.name,
        status="disconnected" # Default status
    )
    db.add(db_institution)
    db.commit()
    db.refresh(db_institution)
    return db_institution

def update_institution_status(db: Session, institution_id: int, status: str):
    db_institution = get_institution(db, institution_id)
    if db_institution:
        db_institution.status = status
        db.commit()
        db.refresh(db_institution)
    return db_institution

def get_account(db: Session, account_id: int):
    return db.query(models.Account).filter(models.Account.id == account_id).first()

def get_accounts_by_institution(db: Session, institution_id: int, skip: int = 0, limit: int = 100) -> List[models.Account]:
    return db.query(models.Account).filter(models.Account.institution_id == institution_id).offset(skip).limit(limit).all()

def create_account(db: Session, account: schemas.AccountCreate):
    db_account = models.Account(**account.dict())
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account

def get_all_accounts(db: Session, skip: int = 0, limit: int = 100) -> List[models.Account]:
    return db.query(models.Account).offset(skip).limit(limit).all()

def get_accounts_by_as_of_date(db: Session, as_of_date: str) -> List[models.Account]:
    # This is a simplified version. A real implementation would handle date ranges and closest dates.
    return db.query(models.Account).filter(models.Account.as_of_date <= as_of_date).order_by(models.Account.as_of_date.desc()).all()