from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class ReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: str

class ReviewResponse(BaseModel):
    id: int
    rating: int
    comment: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ReviewCreateResponse(BaseModel):
    message: str
    review: ReviewResponse
        
class ReviewListResponse(BaseModel):
    user_name: str
    rating: int
    comment: str
    created_at: datetime
   
class HotelRatingResponse(BaseModel):
    hotel_id: int
    average_rating: float | None
    total_reviews: int


