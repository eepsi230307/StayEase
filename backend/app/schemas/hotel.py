from pydantic import BaseModel, ConfigDict


class HotelCreate(BaseModel):
    name: str
    location: str
    description: str | None = None


class HotelResponse(BaseModel):
    id: int
    name: str
    location: str
    description: str | None = None

    model_config = ConfigDict(from_attributes=True)


class HotelUpdate(BaseModel):
    name: str | None = None
    location: str | None = None
    description: str | None = None