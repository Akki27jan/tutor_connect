"""Tutor schemas."""

from typing import Optional, List
from pydantic import BaseModel, field_validator


class TutorProfileCreate(BaseModel):
    bio: str = ""
    qualifications: str = ""


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


class TutorSubjectsUpdate(BaseModel):
    subjects: List[str]


class TutorWithSubjects(BaseModel):
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
