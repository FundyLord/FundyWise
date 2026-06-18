# group schema placeholder

from pydantic import BaseModel


class GroupCreate(BaseModel):
    name: str
    created_by: int


class GroupResponse(BaseModel):
    id: int
    name: str
    created_by: int

    model_config = {
        "from_attributes": True
    }

class GroupMemberCreate(BaseModel):
    user_id: int

