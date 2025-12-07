from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, REAL
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    snaptrade_user_id = Column(String, unique=True, index=True)
    snaptrade_user_secret = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    connections = relationship("Connection", back_populates="owner")

class Connection(Base):
    __tablename__ = "connections"

    id = Column(Integer, primary_key=True, index=True)
    snaptrade_connection_id = Column(String, unique=True, index=True)
    institution_name = Column(String)
    status = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    owner = relationship("User", back_populates="connections")
    accounts = relationship("Account", back_populates="connection")

class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    snaptrade_account_id = Column(String, unique=True, index=True)
    masked_account_number = Column(String)
    balance = Column(REAL)
    currency = Column(String)
    as_of_date = Column(DateTime(timezone=True))
    last_updated = Column(DateTime(timezone=True), server_default=func.now())
    connection_id = Column(Integer, ForeignKey("connections.id"))
    connection = relationship("Connection", back_populates="accounts")