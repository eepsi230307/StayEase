from pydantic import BaseModel, ConfigDict, Field


class RoomCreate(BaseModel):
    room_number: str
    room_type: str
    price: float = Field(gt=0)
    hotel_id: int


class RoomResponse(BaseModel):
    id: int
    room_number: str
    room_type: str
    price: float
    is_available: bool
    hotel_id: int

    model_config = ConfigDict(from_attributes=True)

class RoomUpdate(BaseModel):
    room_number: str | None = None
    room_type: str | None = None
    price: float | None = Field(default=None, gt=0)
    is_available: bool | None = None