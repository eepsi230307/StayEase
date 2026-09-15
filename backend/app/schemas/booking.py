from datetime import date, datetime
from pydantic import BaseModel


class HotelBookingResponse(BaseModel):
    id: int
    name: str
    location: str


class RoomBookingResponse(BaseModel):
    id: int
    room_number: str
    room_type: str
    price: float
    hotel: HotelBookingResponse


class BookingCreate(BaseModel):
    room_id: int
    check_in: date
    check_out: date


class BookingResponse(BaseModel):
    id: int
    user_id: int
    check_in: date
    check_out: date
    status: str
    created_at: datetime

    room: RoomBookingResponse

    class Config:
        from_attributes = True