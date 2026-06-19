# backend/app/schemas/user.py

from pydantic import BaseModel


class UserResponse(BaseModel):
    id: int
    name: str

    model_config = {
        "from_attributes": True
    }