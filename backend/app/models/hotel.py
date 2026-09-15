from sqlalchemy import Column, Integer, String, Text
from app.database import Base
from sqlalchemy.orm import relationship

class Hotel(Base):
    __tablename__ = "hotels"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    location = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)

    rooms = relationship(
        "Room",
        back_populates="hotel",
    )