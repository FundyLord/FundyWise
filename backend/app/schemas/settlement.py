# settlement schema placeholder

from pydantic import BaseModel


class SettlementTransaction(BaseModel):
    from_user_id: int
    to_user_id: int
    amount: float


class SettlementResponse(BaseModel):
    transactions: list[SettlementTransaction]