from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, REAL
from sqlalchemy.orm import relationship
from .database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    connections = relationship("Connection", back_populates="owner")

class Connection(Base):
    __tablename__ = "connections"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    snaptrade_connection_id = Column(String, unique=True, index=True)
    institution_name = Column(String)
    status = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="connections")
    accounts = relationship("Account", back_populates="connection")

class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    connection_id = Column(Integer, ForeignKey("connections.id"))
    snaptrade_account_id = Column(String, unique=True, index=True)
    masked_account_number = Column(String)
    balance = Column(REAL)
    currency = Column(String)
    as_of_date = Column(DateTime)
    last_updated = Column(DateTime, default=datetime.datetime.utcnow)

    connection = relationship("Connection", back_populates="accounts")
