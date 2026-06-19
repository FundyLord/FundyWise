# backend/app/api/users.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import User
from app.schemas.user import UserResponse

router = APIRouter()


@router.get("/users", response_model=list[UserResponse])
def get_users(
    db: Session = Depends(get_db)
):
    return db.query(User).all()