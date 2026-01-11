from typing import List, Optional
from datetime import date
from pydantic import BaseModel, Field

# Shared Schemas

class AccountBase(BaseModel):
    external_id: str = Field(..., example="snaptrade-acc-123")
    masked_account_number: str = Field(..., example="••••1234")
    balance: float = Field(..., example=1000.00)
    as_of_date: date = Field(..., example="2025-12-21")

class AccountCreate(AccountBase):
    institution_id: int = Field(..., example=1) # Internal DB ID

class Account(AccountBase):
    id: int = Field(..., example=1)
    institution_id: int = Field(..., example=1)

    class Config:
        from_attributes = True # Formerly orm_mode = True

class InstitutionBase(BaseModel):
    external_id: str = Field(..., example="snaptrade-inst-456")
    name: str = Field(..., example="My Bank")
    # In data-model.md, connection_status is an Enum. For backend, we store as string.
    status: str = Field(..., example="connected") 

class InstitutionCreate(InstitutionBase):
    pass

class Institution(InstitutionBase):
    id: int = Field(..., example=1)
    
    class Config:
        from_attributes = True # Formerly orm_mode = True

# Schemas for API responses (potentially including relationships)

class AccountWithInstitution(Account):
    institution: Optional[Institution] = None

class InstitutionWithAccounts(Institution):
    accounts: List[Account] = []

    class Config:
        from_attributes = True

# Dashboard specific schemas (from openapi.yaml)

class InstitutionGroup(BaseModel):
    institution: Institution
    accounts: List[Account]
    sub_total: float = Field(..., example=1500.00)

class DashboardReport(BaseModel):
    institution_groups: List[InstitutionGroup]
    grand_total: float = Field(..., example=2500.00)
