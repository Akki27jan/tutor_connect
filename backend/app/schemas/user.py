"""User schemas."""

from datetime import datetime
from pydantic import BaseModel, EmailStr


class UserOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str
    created_at: datetime

    model_config = {"from_attributes": True}
