# settlement.py - API endpoints placeholder

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Group
from app.schemas.settlement import (
    BalanceResponse,
    SettlementResponse
)

from app.services.settlement_service import (
    calculate_net_balances,
    calculate_settlements, 
    settle_group
)

router = APIRouter()


@router.get(
    "/groups/{group_id}/balances",
    response_model=BalanceResponse
)
def get_group_balances(
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

    balances = calculate_net_balances(
        db=db,
        group_id=group_id
    )

    return {
        "balances": balances
    }

@router.get(
    "/groups/{group_id}/settlements",
    response_model=SettlementResponse
)
def get_group_settlements(
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

    transactions = calculate_settlements(
        db=db,
        group_id=group_id
    )

    return {
        "transactions": transactions
    }

@router.post(
    "/groups/{group_id}/settle"
)
def settle_group_endpoint(
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

    settle_group(
        db=db,
        group_id=group_id
    )

    return {
        "message": "Group settled successfully"
    }