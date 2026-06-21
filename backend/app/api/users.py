# backend/app/api/users.py

from fastapi import APIRouter, Depends, HTTPException
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

@router.get(
    "/users/auth/{auth_user_id}",
    response_model=UserResponse
)
def get_user_by_auth_id(
    auth_user_id: str,
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(
            User.auth_user_id == auth_user_id
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user