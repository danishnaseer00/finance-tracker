from sqlalchemy.orm import Session
from .models import Account, Transaction, Category, Budget, User
from .schemas import AccountCreate, TransactionCreate, CategoryCreate, UserCreate, BudgetCreate
from . import auth
from decimal import Decimal

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

# Create default categories for new users
def create_default_categories(db: Session, user_id: int):
    default_categories = [
        # Income categories
        {'category_name': 'Salary', 'category_type': 'income', 'icon': '💼', 'color': '#10b981'},
        {'category_name': 'Freelance', 'category_type': 'income', 'icon': '💻', 'color': '#3b82f6'},
        {'category_name': 'Investment', 'category_type': 'income', 'icon': '📈', 'color': '#8b5cf6'},
        {'category_name': 'Business', 'category_type': 'income', 'icon': '💰', 'color': '#06b6d4'},
        # Expense categories
        {'category_name': 'Food & Dining', 'category_type': 'expense', 'icon': '🍔', 'color': '#ef4444'},
        {'category_name': 'Transportation', 'category_type': 'expense', 'icon': '🚗', 'color': '#f59e0b'},
        {'category_name': 'Shopping', 'category_type': 'expense', 'icon': '🛍️', 'color': '#ec4899'},
        {'category_name': 'Entertainment', 'category_type': 'expense', 'icon': '🎬', 'color': '#6366f1'},
        {'category_name': 'Bills & Utilities', 'category_type': 'expense', 'icon': '💡', 'color': '#14b8a6'},
        {'category_name': 'Healthcare', 'category_type': 'expense', 'icon': '🏥', 'color': '#f43f5e'},
        {'category_name': 'Education', 'category_type': 'expense', 'icon': '📚', 'color': '#8b5cf6'},
        {'category_name': 'Travel', 'category_type': 'expense', 'icon': '✈️', 'color': '#0ea5e9'},
    ]
    
    for cat_data in default_categories:
        new_category = Category(
            user_id=user_id,
            category_name=cat_data['category_name'],
            category_type=cat_data['category_type'],
            icon=cat_data['icon'],
            color=cat_data['color'],
            is_default=True
        )
        db.add(new_category)
    
    db.commit()
    return True

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

def update_account(db: Session, account_id: int, account: AccountCreate, user_id: int):
    db_account = db.query(Account).filter(Account.account_id == account_id, Account.user_id == user_id).first()
    if db_account:
        db_account.account_name = account.account_name
        db_account.account_type = account.account_type
        db_account.balance = account.balance
        db.commit()
        db.refresh(db_account)
        return db_account
    return None

def delete_account(db: Session, account_id: int, user_id: int):
    db_account = db.query(Account).filter(Account.account_id == account_id, Account.user_id == user_id).first()
    if db_account:
        # Check if account has any transactions
        has_transactions = db.query(Transaction).filter(Transaction.account_id == account_id).first()
        if has_transactions:
            # Soft delete if has transactions
            db_account.is_active = False
        else:
            # Hard delete if no transactions
            db.delete(db_account)
        db.commit()
        return True
    return False

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
        # Convert amount to Decimal to match balance type
        amount_decimal = Decimal(str(transaction.amount))
        
        if transaction.transaction_type == "income":
            account.balance += amount_decimal
        else:
            account.balance -= amount_decimal
    
    db.commit()
    db.refresh(new_transaction)
    return new_transaction

def get_transaction_by_id(db: Session, transaction_id: int, user_id: int):
    return db.query(Transaction).filter(Transaction.transaction_id == transaction_id, Transaction.user_id == user_id).first()

def update_transaction(db: Session, transaction_id: int, transaction: TransactionCreate, user_id: int):
    db_transaction = db.query(Transaction).filter(Transaction.transaction_id == transaction_id, Transaction.user_id == user_id).first()
    if db_transaction:
        # Reverse old transaction balance impact
        account = db.query(Account).filter(Account.account_id == db_transaction.account_id, Account.user_id == user_id).first()
        if account:
            # Convert to Decimal
            old_amount = Decimal(str(db_transaction.amount))
            
            if db_transaction.transaction_type == "income":
                account.balance -= old_amount
            else:
                account.balance += old_amount
        
        # Update transaction
        db_transaction.account_id = transaction.account_id
        db_transaction.category_id = transaction.category_id
        db_transaction.transaction_type = transaction.transaction_type
        db_transaction.amount = transaction.amount
        db_transaction.description = transaction.description
        db_transaction.transaction_date = transaction.transaction_date
        db_transaction.payment_method = transaction.payment_method
        db_transaction.notes = transaction.notes
        
        # Apply new transaction balance impact
        new_account = db.query(Account).filter(Account.account_id == transaction.account_id, Account.user_id == user_id).first()
        if new_account:
            # Convert to Decimal
            new_amount = Decimal(str(transaction.amount))
            
            if transaction.transaction_type == "income":
                new_account.balance += new_amount
            else:
                new_account.balance -= new_amount
        
        db.commit()
        db.refresh(db_transaction)
        return db_transaction
    return None

def delete_transaction(db: Session, transaction_id: int, user_id: int):
    db_transaction = db.query(Transaction).filter(Transaction.transaction_id == transaction_id, Transaction.user_id == user_id).first()
    if db_transaction:
        # Reverse transaction balance impact
        account = db.query(Account).filter(Account.account_id == db_transaction.account_id, Account.user_id == user_id).first()
        if account:
            # Convert to Decimal
            amount_decimal = Decimal(str(db_transaction.amount))
            
            if db_transaction.transaction_type == "income":
                account.balance -= amount_decimal
            else:
                account.balance += amount_decimal
        
        db.delete(db_transaction)
        db.commit()
        return True
    return False

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