from sqlalchemy.orm import Session
from backend.app.database import SessionLocal, engine
from backend.app.models import Base
from backend.app.crud import create_user, get_user_by_username
from backend.app.schemas import UserCreate

# Ensure all tables are created
Base.metadata.create_all(bind=engine)

def seed_users(db: Session):
    # Check if user already exists to prevent duplicates
    user = get_user_by_username(db, username="dashboard_user")
    if not user:
        create_user(db, UserCreate(username="dashboard_user", password="password"), snaptrade_user_id="test_snap_user_id", snaptrade_user_secret="test_snap_user_secret")
        print("Test user 'dashboard_user' created successfully.")
    else:
        print("Test user 'dashboard_user' already exists.")

if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_users(db)
    finally:
        db.close()
