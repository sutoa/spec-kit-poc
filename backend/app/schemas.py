from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    snaptrade_user_id: str
    created_at: datetime

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class Account(BaseModel):
    id: int
    snaptrade_account_id: str
    masked_account_number: str
    balance: float
    currency: str
    as_of_date: datetime
    last_updated: datetime

    class Config:
        orm_mode = True

class ConnectionBase(BaseModel):
    institution_name: str
    status: str

class ConnectionCreate(ConnectionBase):
    snaptrade_connection_id: str

class Connection(ConnectionBase):
    id: int
    created_at: datetime
    accounts: List[Account] = []

    class Config:
        orm_mode = True

class SnapTradeCallback(BaseModel):
    authorization_id: str
    state: str

class Institution(BaseModel):
    name: str
    accounts: List[Account] = []

class Dashboard(BaseModel):
    institutions: List[Institution] = []
    grand_total: float

class SnapTradeLoginResponse(BaseModel):
    redirect_uri: str
    state: str