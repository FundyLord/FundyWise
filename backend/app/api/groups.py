# groups.py - API endpoints placeholder

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import (
    Group,
    GroupMember,
    User,
)
from app.schemas.group import (
    GroupCreate,
    GroupMemberCreate,
    GroupResponse
)
from app.schemas.user import UserResponse

router = APIRouter()


@router.post("/groups", response_model=GroupResponse)
def create_group(
    group: GroupCreate,
    db: Session = Depends(get_db)
):
    new_group = Group(
        name=group.name,
        created_by=group.created_by
    )

    db.add(new_group)
    db.commit()
    db.refresh(new_group)

    return new_group

@router.get("/groups", response_model=list[GroupResponse])
def get_groups(
    db: Session = Depends(get_db)
):
    return db.query(Group).all()

@router.get("/groups/{group_id}", response_model=GroupResponse)
def get_group(
    group_id: int,
    db: Session = Depends(get_db)
):
    group = db.query(Group).filter(Group.id == group_id).first()

    if not group:
        raise HTTPException(
            status_code=404,
            detail="Group not found"
        )

    return group

@router.post("/groups/{group_id}/members")
def add_member(
    group_id: int,
    member: GroupMemberCreate,
    db: Session = Depends(get_db)
):
    group = db.query(Group).filter(
        Group.id == group_id
    ).first()

    if not group:
        raise HTTPException(
            status_code=404,
            detail="Group not found"
        )

    new_member = GroupMember(
        group_id=group_id,
        user_id=member.user_id
    )

    db.add(new_member)
    db.commit()
    db.refresh(new_member)

    return {
        "message": "Member added successfully"
    }

@router.get(
    "/groups/{group_id}/members",
    response_model=list[UserResponse]
)
def get_group_members(
    group_id: int,
    db: Session = Depends(get_db)
):
    group = db.query(Group).filter(
        Group.id == group_id
    ).first()

    if not group:
        raise HTTPException(
            status_code=404,
            detail="Group not found"
        )

    members = (
        db.query(User)
        .join(
            GroupMember,
            User.id == GroupMember.user_id
        )
        .filter(
            GroupMember.group_id == group_id
        )
        .all()
    )

    return members