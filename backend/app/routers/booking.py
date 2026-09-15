from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.booking import Booking
from app.models.room import Room
from app.models.user import User
from app.schemas.booking import BookingCreate, BookingResponse
from app.utils.token import get_current_user, get_current_admin

router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"]
)


@router.post("/", response_model=BookingResponse)
def create_booking(
    booking: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    room = db.query(Room).filter(
        Room.id == booking.room_id
    ).first()

    if room is None:
        raise HTTPException(
            status_code=404,
            detail="Room not found"
        )

    if booking.check_out <= booking.check_in:
        raise HTTPException(
            status_code=400,
            detail="Check-out date must be after check-in date."
        )

    existing_booking = db.query(Booking).filter(
        Booking.room_id == booking.room_id,
        booking.check_in < Booking.check_out,
        booking.check_out > Booking.check_in,
        Booking.status == "confirmed"
    ).first()

    if existing_booking:
        raise HTTPException(
            status_code=400,
            detail="Room is already booked for the selected dates."
        )

    new_booking = Booking(
        user_id=current_user.id,
        room_id=booking.room_id,
        check_in=booking.check_in,
        check_out=booking.check_out
    )

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    return new_booking

@router.get("/my-bookings", response_model=list[BookingResponse])
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    bookings = db.query(Booking).filter(
        Booking.user_id == current_user.id
    ).all()

    return bookings

@router.get("/admin/all", response_model=list[BookingResponse])
def get_all_bookings(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    bookings = db.query(Booking).all()

    return bookings

@router.patch("/admin/{booking_id}/cancel", response_model=BookingResponse)
def admin_cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    booking = db.query(Booking).filter(
        Booking.id == booking_id
    ).first()

    if booking is None:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    if booking.status == "cancelled":
        raise HTTPException(
            status_code=400,
            detail="Booking is already cancelled."
        )

    booking.status = "cancelled"

    db.commit()
    db.refresh(booking)

    return booking

@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(
    booking_id: int,
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
            detail="You are not allowed to view this booking."
        )

    return booking

@router.patch("/{booking_id}/cancel", response_model=BookingResponse)
def cancel_booking(
    booking_id: int,
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
            detail="You are not allowed to cancel this booking."
        )
    if booking.status == "cancelled":
        raise HTTPException(
            status_code=400,
            detail="Booking is already cancelled."
        )
    booking.status = "cancelled"

    db.commit()
    db.refresh(booking)

    return booking