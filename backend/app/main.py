from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
from .database import engine, SessionLocal
from .models import Base, User
from .schemas import AccountCreate, TransactionCreate, CategoryCreate, UserCreate, UserLogin, BudgetCreate
from .auth import authenticate_user, create_access_token, get_current_user
from . import crud

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Finance Tracker API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Routes
@app.get("/")
def root():
    return {"message": "Finance Tracker API"}

# Authentication Routes
@app.post("/auth/register", status_code=201)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    db_user = crud.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    created_user = crud.create_user(db, user)
    
    # Create default categories for new user
    crud.create_default_categories(db, created_user.user_id)
    
    return {"message": "User created successfully", "user_id": created_user.user_id}

@app.post("/auth/login")
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, user_credentials.username, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "user_id": user.user_id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name
        }
    }

# Protected Routes
@app.get("/users/me")
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

# Accounts
@app.get("/accounts")
def get_accounts(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    accounts = crud.get_accounts(db, current_user.user_id)
    return accounts

@app.post("/accounts")
def create_account(account: AccountCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    new_account = crud.create_account(db, account, current_user.user_id)
    return new_account

@app.get("/accounts/{account_id}")
def get_account(account_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    account = crud.get_account_by_id(db, account_id, current_user.user_id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account

@app.put("/accounts/{account_id}")
def update_account(account_id: int, account: AccountCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    updated_account = crud.update_account(db, account_id, account, current_user.user_id)
    if not updated_account:
        raise HTTPException(status_code=404, detail="Account not found")
    return updated_account

@app.delete("/accounts/{account_id}")
def delete_account(account_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    deleted = crud.delete_account(db, account_id, current_user.user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Account not found")
    return {"message": "Account deleted successfully"}

# Categories
@app.get("/categories")
def get_categories(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    categories = crud.get_categories(db, current_user.user_id)
    return categories

@app.post("/categories")
def create_category(category: CategoryCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    new_category = crud.create_category(db, category, current_user.user_id)
    return new_category

@app.get("/categories/{category_id}")
def get_category(category_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    category = crud.get_category_by_id(db, category_id, current_user.user_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

# Transactions
@app.get("/transactions")
def get_transactions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    transactions = crud.get_transactions(db, current_user.user_id)
    return transactions

@app.post("/transactions")
def create_transaction(transaction: TransactionCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    new_transaction = crud.create_transaction(db, transaction, current_user.user_id)
    return new_transaction

@app.get("/transactions/{transaction_id}")
def get_transaction(transaction_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    transaction = crud.get_transaction_by_id(db, transaction_id, current_user.user_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction

@app.put("/transactions/{transaction_id}")
def update_transaction(transaction_id: int, transaction: TransactionCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    updated_transaction = crud.update_transaction(db, transaction_id, transaction, current_user.user_id)
    if not updated_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return updated_transaction

@app.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    deleted = crud.delete_transaction(db, transaction_id, current_user.user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {"message": "Transaction deleted successfully"}

# Budgets
@app.get("/budgets")
def get_budgets(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    budgets = crud.get_budgets(db, current_user.user_id)
    return budgets

@app.post("/budgets")
def create_budget(budget: BudgetCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    new_budget = crud.create_budget(db, budget, current_user.user_id)
    return new_budget

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)