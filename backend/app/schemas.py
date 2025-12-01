from pydantic import BaseModel
from datetime import datetime
from typing import List

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class LoginRedirectURI(BaseModel):
    redirect_uri: str

class SnapTradeCallback(BaseModel):
    authorization_id: str
    state: str

class ConnectionBase(BaseModel):
    institution_name: str
    status: str

class ConnectionCreate(ConnectionBase):
    snaptrade_connection_id: str

class Connection(ConnectionBase):
    id: int
    created_at: datetime
    snaptrade_connection_id: str

    class Config:
        orm_mode = True

class Account(BaseModel):
    masked_account_number: str
    balance: float
    currency: str
    as_of_date: datetime
    last_updated: datetime
    status: str = "Active"

class Institution(BaseModel):
    name: str
    accounts: List[Account]
    sub_total: float

class Dashboard(BaseModel):
    institutions: List[Institution]
    grand_total: float
