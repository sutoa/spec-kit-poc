from pydantic import BaseModel, ConfigDict, field_validator
from datetime import date
from typing import Optional, List

class InstitutionBase(BaseModel):
    external_id: str
    name: str

class InstitutionCreate(InstitutionBase):
    pass

class Institution(InstitutionBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class AccountBase(BaseModel):
    external_id: str
    masked_account_number: str
    balance: float
    as_of_date: date

    @field_validator('balance')
    def balance_must_be_positive(cls, v):
        if v < 0:
            raise ValueError('balance must be positive')
        return v

class AccountCreate(AccountBase):
    institution_id: int

class Account(AccountBase):
    id: int
    institution_id: int

    model_config = ConfigDict(from_attributes=True)

class DashboardInstitution(BaseModel):
    institution: Institution
    accounts: List[Account]
    sub_total: float

class DashboardResponse(BaseModel):
    grand_total: float
    institutions: List[DashboardInstitution]