"""Subject and Topic schemas."""

from typing import List, Optional
from pydantic import BaseModel


class TopicOut(BaseModel):
    id: str
    subject_id: str
    name: str
    difficulty: str

    model_config = {"from_attributes": True}


class SubjectOut(BaseModel):
    id: str
    name: str
    exam_board: str
    topics: Optional[List[TopicOut]] = None

    model_config = {"from_attributes": True}
