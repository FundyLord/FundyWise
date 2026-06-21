# settlement_service.py - service placeholder

from sqlalchemy.orm import Session
from sqlalchemy import select

from app.db.models import Expense, ExpenseParticipant
from algorithm.python.optimizer import minimize_transactions

from sqlalchemy import delete

def calculate_net_balances(
    db: Session,
    group_id: int
) -> dict[int, float]:
    balances: dict[int, float] = {}

    expenses = db.execute(
        select(Expense).where(
            Expense.group_id == group_id
        )
    ).scalars().all()

    for expense in expenses:
        balances[expense.paid_by] = (
            balances.get(expense.paid_by, 0.0)
            + expense.amount
        )

        participants = db.execute(
            select(ExpenseParticipant).where(
                ExpenseParticipant.expense_id == expense.id
            )
        ).scalars().all()

        for participant in participants:
            balances[participant.user_id] = (
                balances.get(participant.user_id, 0.0)
                - participant.share_amount
            )

    return balances

def build_optimizer_input(
    db: Session,
    group_id: int
) -> list[dict]:
    optimizer_expenses = []

    expenses = db.execute(
        select(Expense).where(
            Expense.group_id == group_id
        )
    ).scalars().all()

    for expense in expenses:
        participants = db.execute(
            select(ExpenseParticipant).where(
                ExpenseParticipant.expense_id == expense.id
            )
        ).scalars().all()

        optimizer_expense = {
            "expense_id": expense.id,
            "group_id": expense.group_id,
            "paid_by": expense.paid_by,
            "amount": expense.amount,
            "participants": []
        }

        for participant in participants:
            optimizer_expense["participants"].append(
                {
                    "user_id": participant.user_id,
                    "share_amount": participant.share_amount
                }
            )

        optimizer_expenses.append(
            optimizer_expense
        )

    return optimizer_expenses

def calculate_settlements(
    db: Session,
    group_id: int
):
    optimizer_input = build_optimizer_input(
        db=db,
        group_id=group_id
    )

    return minimize_transactions(
        optimizer_input
    )

def settle_group(
    db: Session,
    group_id: int
):
    expenses = db.execute(
        select(Expense).where(
            Expense.group_id == group_id
        )
    ).scalars().all()

    expense_ids = [
        expense.id
        for expense in expenses
    ]

    if expense_ids:
        db.execute(
            delete(ExpenseParticipant).where(
                ExpenseParticipant.expense_id.in_(
                    expense_ids
                )
            )
        )

    db.execute(
        delete(Expense).where(
            Expense.group_id == group_id
        )
    )

    db.commit()