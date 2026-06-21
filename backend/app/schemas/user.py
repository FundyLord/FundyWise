from pydantic import BaseModel


class UserResponse(BaseModel):
    id: int
    username: str
    full_name: str

    model_config = {
        "from_attributes": True
    }


class UserCreate(BaseModel):
    name: str