from sqlalchemy.orm import Session
from . import models, security, schemas

def get_user(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user_data: schemas.UserCreate):
    hashed_password = security.get_password_hash(user_data.password)
    db_user = models.User(username=user_data.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_connection(db: Session, connection_data: schemas.ConnectionCreate, user_id: int):
    db_connection = models.Connection(**connection_data.dict(), user_id=user_id)
    db.add(db_connection)
    db.commit()
    db.refresh(db_connection)
    return db_connection

def get_connections(db: Session, user_id: int):
    return db.query(models.Connection).filter(models.Connection.user_id == user_id).all()
