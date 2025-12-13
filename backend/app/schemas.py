from pydantic import BaseModel
from datetime import date
from typing import List, Optional


class AccountBase(BaseModel):
    external_id: str
    masked_account_number: str
    balance: float
    as_of_date: date


class AccountCreate(AccountBase):
    pass


class Account(AccountBase):
    id: int
    institution_id: int

    class Config:
        orm_mode = True


class InstitutionBase(BaseModel):
    external_id: str
    name: str
    status: str


class InstitutionCreate(InstitutionBase):
    pass


class Institution(InstitutionBase):
    id: int
    accounts: List[Account] = []

    class Config:
        orm_mode = True


class Dashboard(BaseModel):
    grand_total: float
    institutions: List[Institution]

class SnapTradeConnectRequest(BaseModel):
    institution_id: str

