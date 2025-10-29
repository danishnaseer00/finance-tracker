from sqlalchemy.orm import Session
from .models import Account, Transaction, Category, Budget, User
from .schemas import AccountCreate, TransactionCreate, CategoryCreate, UserCreate, BudgetCreate
from . import auth

# Users
def create_user(db: Session, user: UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.user_id == user_id).first()

# Accounts
def get_accounts(db: Session, user_id: int):
    return db.query(Account).filter(Account.user_id == user_id, Account.is_active == True).all()

def create_account(db: Session, account: AccountCreate, user_id: int):
    new_account = Account(
        user_id=user_id,
        account_name=account.account_name,
        account_type=account.account_type,
        balance=account.balance
    )
    db.add(new_account)
    db.commit()
    db.refresh(new_account)
    return new_account

def get_account_by_id(db: Session, account_id: int, user_id: int):
    return db.query(Account).filter(Account.account_id == account_id, Account.user_id == user_id).first()

# Categories
def get_categories(db: Session, user_id: int):
    return db.query(Category).filter(Category.user_id == user_id).all()

def create_category(db: Session, category: CategoryCreate, user_id: int):
    new_category = Category(
        user_id=user_id,
        category_name=category.category_name,
        category_type=category.category_type,
        icon=category.icon,
        color=category.color
    )
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

def get_category_by_id(db: Session, category_id: int, user_id: int):
    return db.query(Category).filter(Category.category_id == category_id, Category.user_id == user_id).first()

# Transactions
def get_transactions(db: Session, user_id: int):
    return db.query(Transaction).filter(Transaction.user_id == user_id).order_by(Transaction.transaction_date.desc()).all()

def create_transaction(db: Session, transaction: TransactionCreate, user_id: int):
    new_transaction = Transaction(
        user_id=user_id,
        account_id=transaction.account_id,
        category_id=transaction.category_id,
        transaction_type=transaction.transaction_type,
        amount=transaction.amount,
        description=transaction.description,
        transaction_date=transaction.transaction_date,
        payment_method=transaction.payment_method,
        notes=transaction.notes
    )
    db.add(new_transaction)
    
    # Update account balance
    account = db.query(Account).filter(Account.account_id == transaction.account_id, Account.user_id == user_id).first()
    if account:
        if transaction.transaction_type == "income":
            account.balance += transaction.amount
        else:
            account.balance -= transaction.amount
    
    db.commit()
    db.refresh(new_transaction)
    return new_transaction

def get_transaction_by_id(db: Session, transaction_id: int, user_id: int):
    return db.query(Transaction).filter(Transaction.transaction_id == transaction_id, Transaction.user_id == user_id).first()

# Budgets
def get_budgets(db: Session, user_id: int):
    return db.query(Budget).filter(Budget.user_id == user_id).all()

def create_budget(db: Session, budget: BudgetCreate, user_id: int):
    new_budget = Budget(
        user_id=user_id,
        category_id=budget.category_id,
        budget_amount=budget.budget_amount,
        month=budget.month,
        year=budget.year
    )
    db.add(new_budget)
    db.commit()
    db.refresh(new_budget)
    return new_budget
