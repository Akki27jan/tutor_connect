import sys
from pydantic import BaseModel, field_validator
from typing import List, Optional

class TutorProfileOut(BaseModel):
    id: str
    user_id: str
    bio: str
    qualifications: str
    is_verified: bool
    rating: float
    user_name: Optional[str] = None
    user_email: Optional[str] = None
    subjects: List[str] = []

    model_config = {"from_attributes": True}

    @field_validator("subjects", mode="before")
    @classmethod
    def parse_subjects(cls, v):
        if isinstance(v, str):
            return [s.strip() for s in v.split(",")] if v else []
        return v

try:
    p = TutorProfileOut(
        id="123",
        user_id="456",
        bio="test",
        qualifications="test2",
        is_verified=False,
        rating=0.0,
        user_name="John",
        user_email="j@j.com",
        subjects=""
    )
    print("Success:", p.model_dump())
except Exception as e:
    print("Error:", e)
