from sqlalchemy import Column, Integer, String, Numeric, Date, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class User(Base):
    __tablename__ = "users"
    
    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    accounts = relationship("Account", back_populates="user")
    transactions = relationship("Transaction", back_populates="user")
    categories = relationship("Category", back_populates="user")
    budgets = relationship("Budget", back_populates="user")


class Category(Base):
    __tablename__ = "categories"
    
    category_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    category_name = Column(String, nullable=False)
    category_type = Column(String, nullable=False)
    icon = Column(String)
    color = Column(String)
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="categories")
    transactions = relationship("Transaction", back_populates="category")
    budgets = relationship("Budget", back_populates="category")


class Account(Base):
    __tablename__ = "accounts"
    
    account_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    account_name = Column(String, nullable=False)
    account_type = Column(String, nullable=False)
    balance = Column(Numeric(10, 2), default=0.00)
    currency = Column(String, default="USD")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="accounts")
    transactions = relationship("Transaction", back_populates="account")


class Transaction(Base):
    __tablename__ = "transactions"
    
    transaction_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    account_id = Column(Integer, ForeignKey("accounts.account_id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.category_id"), nullable=False)
    transaction_type = Column(String, nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    description = Column(String, nullable=False)
    transaction_date = Column(Date, nullable=False)
    payment_method = Column(String)
    notes = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="transactions")
    account = relationship("Account", back_populates="transactions")
    category = relationship("Category", back_populates="transactions")


class Budget(Base):
    __tablename__ = "budgets"
    
    budget_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.category_id"), nullable=False)
    budget_amount = Column(Numeric(10, 2), nullable=False)
    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="budgets")
    category = relationship("Category", back_populates="budgets")