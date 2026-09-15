from sqlalchemy import Column, Integer, Date, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)

    check_in = Column(Date, nullable=False)

    check_out = Column(Date, nullable=False)

    status = Column(String(20), default="confirmed")

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="bookings")

    room = relationship("Room", back_populates="bookings")

    reviews = relationship("Review", back_populates="booking")

    payments = relationship("Payment", back_populates="booking")