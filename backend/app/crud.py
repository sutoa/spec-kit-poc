from sqlalchemy.orm import Session
from . import models, schemas, security
from .config import settings
import httpx

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    # Register user with SnapTrade
    with httpx.Client() as client:
        response = client.post(
            "https://api.snaptrade.com/api/v1/snaptrade/register",
            json={"clientId": settings.snaptrade_client_id, "userId": user.username},
        )
        response.raise_for_status()
        snaptrade_data = response.json()

    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        hashed_password=hashed_password,
        snaptrade_user_id=snaptrade_data["userId"],
        snaptrade_user_secret=snaptrade_data["userSecret"],
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_connections(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Connection).filter(models.Connection.user_id == user_id).offset(skip).limit(limit).all()

def create_connection(db: Session, connection: schemas.ConnectionCreate, user_id: int):
    db_connection = models.Connection(**connection.dict(), user_id=user_id)
    db.add(db_connection)
    db.commit()
    db.refresh(db_connection)
    return db_connection