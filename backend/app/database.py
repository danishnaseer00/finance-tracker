from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Get absolute path to backend directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Use absolute path for database
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/finance_tracker.db")

print(f"Database location: {BASE_DIR}/finance_tracker.db")  # Debug line

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()