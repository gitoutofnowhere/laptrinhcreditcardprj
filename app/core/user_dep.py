from sqlalchemy.orm import Session
from fastapi import Depends, Header
from app.core.database import get_db
from app.models.user import User

def get_current_user(
    x_user_id: int = Header(default=1, alias="X-User-ID"),
    db: Session = Depends(get_db)
) -> User:
    """
    Retrieves user by ID (default user_id=1).
    Creates default test user if not existing.
    """
    user = db.query(User).filter(User.id == x_user_id).first()
    if not user:
        user = User(
            id=x_user_id,
            email=f"user_{x_user_id}@rightcard.vn",
            password_hash="hashed_secret"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user
