import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent))

from app.database import engine, SessionLocal
from app.models import Base
from app.crud import create_user, create_default_categories
from app.schemas import UserCreate

def setup_database():
    """Initialize database with tables and test user"""
    print("🔧 Setting up database...")
    
    # Create all tables
    Base.metadata.drop_all(bind=engine)  # Drop existing tables
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created")
    
    # Create test user with categories
    db = SessionLocal()
    try:
        # Check if user already exists
        from app.crud import get_user_by_username
        existing_user = get_user_by_username(db, "danish")
        
        if not existing_user:
            # Create user
            test_user = UserCreate(
                username="danish",
                email="danish@example.com",
                password="password123",
                first_name="Danish",
                last_name="Naseer"
            )
            
            user = create_user(db, test_user)
            print(f"✅ User created: {user.username} (ID: {user.user_id})")
            
            # Create default categories for user
            create_default_categories(db, user.user_id)
            print(f"✅ Default categories created for user {user.user_id}")
            
            # Create a default account
            from app.models import Account
            account = Account(
                user_id=user.user_id,
                account_name="Main Account",
                account_type="bank",
                balance=1000.00,
                currency="USD"
            )
            db.add(account)
            db.commit()
            print(f"✅ Default account created")
            
            print("\n🎉 Setup complete!")
            print(f"📧 Login with:")
            print(f"   Username: danish")
            print(f"   Password: password123")
        else:
            print(f"⚠️  User 'danish' already exists (ID: {existing_user.user_id})")
            
            # Check categories
            from app.models import Category
            categories = db.query(Category).filter(Category.user_id == existing_user.user_id).all()
            print(f"📁 Existing categories: {len(categories)}")
            
            if len(categories) == 0:
                print("🔧 Creating default categories...")
                create_default_categories(db, existing_user.user_id)
                print("✅ Categories created")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    setup_database()