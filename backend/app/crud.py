from sqlalchemy.orm import Session

from . import models, schemas


def get_institution(db: Session, institution_id: int):
    return db.query(models.Institution).filter(models.Institution.id == institution_id).first()


def get_institution_by_external_id(db: Session, external_id: str):
    return db.query(models.Institution).filter(models.Institution.external_id == external_id).first()


def get_institutions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Institution).offset(skip).limit(limit).all()


def create_institution(db: Session, institution: schemas.InstitutionCreate):
    db_institution = models.Institution(**institution.dict())
    db.add(db_institution)
    db.commit()
    db.refresh(db_institution)
    return db_institution


def get_accounts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Account).offset(skip).limit(limit).all()


def create_institution_account(db: Session, account: schemas.AccountCreate, institution_id: int):
    db_account = models.Account(**account.dict(), institution_id=institution_id)
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account
