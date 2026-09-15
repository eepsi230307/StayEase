from sqlalchemy import Column, Integer,  DateTime, ForeignKey, String,  Text, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base

class Review(Base):
    __tablename__ = "reviews"
    __table_args__ = (UniqueConstraint("user_id", "booking_id"),)
    id = Column(Integer, primary_key=True, index=True)
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)

    rating = Column(Integer,nullable=False)

    comment = Column(Text,nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="reviews")
    
    booking = relationship("Booking", back_populates="reviews")