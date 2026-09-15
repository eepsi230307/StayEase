from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)

    booking_id = Column(
        Integer,
        ForeignKey("bookings.id"),
        nullable=False
    )

    payment_mode = Column(
        String(50),
        nullable=False
    )

    status = Column(
        String(50),
        nullable=False
    )

    amount_paid = Column(
        Float,
        nullable=False
    )

    done_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    booking = relationship(
        "Booking",
        back_populates="payments"
    )