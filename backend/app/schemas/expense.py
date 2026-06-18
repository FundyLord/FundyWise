# expense schema placeholder

from pydantic import BaseModel


class ExpenseParticipantCreate(BaseModel):
    user_id: int
    share_amount: float


class ExpenseCreate(BaseModel):
    group_id: int
    paid_by: int
    amount: float
    description: str | None = None
    participants: list[ExpenseParticipantCreate]

class ExpenseResponse(BaseModel):
    id: int
    group_id: int
    paid_by: int
    amount: float
    description: str | None = None

    model_config = {
        "from_attributes": True
    }