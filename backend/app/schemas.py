from pydantic import BaseModel
from datetime import date
from typing import Optional

# User Schemas
class UserBase(BaseModel):
    username: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    user_id: int
    is_active: bool
    created_at: date

    class Config:
        from_attributes = True

# Account Schemas
class AccountCreate(BaseModel):
    account_name: str
    account_type: str
    balance: float

class AccountResponse(AccountCreate):
    account_id: int
    user_id: int
    currency: str
    is_active: bool
    created_at: date

    class Config:
        from_attributes = True

# Transaction Schemas
class TransactionCreate(BaseModel):
    account_id: int
    category_id: int
    transaction_type: str
    amount: float
    description: str
    transaction_date: date
    payment_method: Optional[str] = None
    notes: Optional[str] = None

class TransactionResponse(TransactionCreate):
    transaction_id: int
    user_id: int
    created_at: date

    class Config:
        from_attributes = True

# Category Schemas
class CategoryCreate(BaseModel):
    category_name: str
    category_type: str
    icon: Optional[str] = None
    color: Optional[str] = None

class CategoryResponse(CategoryCreate):
    category_id: int
    user_id: int
    is_default: bool
    created_at: date

    class Config:
        from_attributes = True

# Budget Schemas
class BudgetCreate(BaseModel):
    category_id: int
    budget_amount: float
    month: int
    year: int

class BudgetResponse(BudgetCreate):
    budget_id: int
    user_id: int
    created_at: date

    class Config:
        from_attributes = True