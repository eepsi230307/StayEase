from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)

    room_number = Column(String(20), nullable=False)

    room_type = Column(String(50), nullable=False)

    price = Column(Float, nullable=False)

    is_available = Column(Boolean, default=True)

    hotel_id = Column(Integer, ForeignKey("hotels.id"))

    hotel = relationship("Hotel", back_populates="rooms")

    bookings = relationship(
    "Booking",
    back_populates="room",
    )