from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PaymentCreate(BaseModel):
    payment_mode: str


class PaymentResponse(BaseModel):
    id: int
    booking_id: int
    payment_mode: str
    status: str
    amount_paid: float
    done_at: datetime

    model_config = ConfigDict(from_attributes=True)