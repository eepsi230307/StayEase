from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from app.database import get_db
from app.models.booking import Booking
from app.models.user import User
from app.models.review import Review
from app.models.hotel import Hotel
from app.models.room import Room
from app.schemas.review import ReviewCreate, ReviewCreateResponse, ReviewListResponse, HotelRatingResponse
from app.utils.token import get_current_user


router = APIRouter(tags=["Reviews"])

@router.post("/bookings/{booking_id}/review", response_model=ReviewCreateResponse)
def create_review(
    booking_id: int,
    review: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    booking = db.query(Booking).filter(
        Booking.id == booking_id
    ).first()

    if booking is None:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    if booking.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to review this booking."
        )

    if booking.status == "cancelled":
        raise HTTPException(
            status_code=400,
            detail="Cannot review a cancelled booking."
        )

    if booking.check_out > date.today():
        raise HTTPException(
            status_code=400,
            detail="Review cannot be given before checkout date."
        )
    existing_review = db.query(Review).filter(
        Review.booking_id == booking_id
    ).first()

    if existing_review:
        raise HTTPException(
            status_code=400,
            detail="Review is already given. Thank you."
        )

    new_review = Review(
        user_id=current_user.id,
        booking_id=booking_id,
        rating = review.rating,
        comment = review.comment
    )

    db.add(new_review)
    db.commit()
    db.refresh(new_review)

    return ReviewCreateResponse(
        message="Thank you for your review! We look forward to your next booking.",
        review=new_review
    )

@router.get(
    "/hotels/{hotel_id}/reviews",
    response_model=list[ReviewListResponse]
)
def get_hotel_reviews(
    hotel_id: int,
    db: Session = Depends(get_db)
):
    hotel = db.query(Hotel).filter(
        Hotel.id == hotel_id
    ).first()

    if hotel is None:
        raise HTTPException(
            status_code=404,
            detail="Hotel not found"
        )

    reviews = (
        db.query(Review)
        .join(Booking, Review.booking_id == Booking.id)
        .join(Room, Booking.room_id == Room.id)
        .filter(Room.hotel_id == hotel_id)
        .all()
    )

    return [
        ReviewListResponse(
            user_name=review.user.name,
            rating=review.rating,
            comment=review.comment,
            created_at=review.created_at
        )
        for review in reviews
    ]

@router.get(
    "/hotels/{hotel_id}/rating",
    response_model= HotelRatingResponse
)
def get_hotel_rating(
    hotel_id: int,
    db: Session = Depends(get_db)
):
    hotel = db.query(Hotel).filter(
        Hotel.id == hotel_id
    ).first()

    if hotel is None:
        raise HTTPException(
            status_code=404,
            detail="Hotel not found"
        )

    result = db.query(
        func.avg(Review.rating),
        func.count(Review.id)
    ).join(
        Booking, Review.booking_id == Booking.id
    ).join(
        Room, Booking.room_id == Room.id
    ).filter(
        Room.hotel_id == hotel_id
    ).first()

    average_rating = result[0]
    total_reviews = result[1]

    return HotelRatingResponse(
        hotel_id=hotel_id,
        average_rating=average_rating,
        total_reviews=total_reviews
    )