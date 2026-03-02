"""Availability schemas."""

from datetime import datetime, timezone
from pydantic import BaseModel, field_validator


class AvailabilitySlotCreate(BaseModel):
    start_time: datetime
    end_time: datetime

    @field_validator("start_time", "end_time", mode="after")
    @classmethod
    def force_utc(cls, v: datetime):
        if v.tzinfo is None:
            return v.replace(tzinfo=timezone.utc)
        return v


class AvailabilitySlotOut(BaseModel):
    id: str
    tutor_id: str
    start_time: datetime
    end_time: datetime
    status: str

    model_config = {"from_attributes": True}

    @field_validator("start_time", "end_time", mode="after")
    @classmethod
    def force_utc(cls, v: datetime):
        if v.tzinfo is None:
            return v.replace(tzinfo=timezone.utc)
        return v
