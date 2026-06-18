from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import (
    Expense,
    ExpenseParticipant,
    Group
)
from app.schemas.expense import (
    ExpenseCreate,
    ExpenseResponse
)

router = APIRouter()


@router.post("/expenses", response_model=ExpenseResponse)
def create_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db)
):
    group = db.query(Group).filter(
        Group.id == expense.group_id
    ).first()

    if not group:
        raise HTTPException(
            status_code=404,
            detail="Group not found"
        )

    new_expense = Expense(
        group_id=expense.group_id,
        paid_by=expense.paid_by,
        amount=expense.amount,
        description=expense.description
    )

    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)

    for participant in expense.participants:
        expense_participant = ExpenseParticipant(
            expense_id=new_expense.id,
            user_id=participant.user_id,
            share_amount=participant.share_amount
        )

        db.add(expense_participant)

    db.commit()

    return new_expense

@router.get(
    "/groups/{group_id}/expenses",
    response_model=list[ExpenseResponse]
)
def get_group_expenses(
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

    expenses = (
        db.query(Expense)
        .filter(Expense.group_id == group_id)
        .all()
    )

    return expenses