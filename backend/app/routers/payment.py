from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.booking import Booking
from app.models.payment import Payment
from app.models.user import User
from app.schemas.payment import PaymentCreate, PaymentResponse
from app.utils.token import get_current_user


router = APIRouter(prefix="/payments", tags=["Payments"])


@router.post("/bookings/{booking_id}/payment", response_model=PaymentResponse)
def create_payment(
    booking_id: int,
    payment: PaymentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # 1. Find the booking
    booking = db.query(Booking).filter(
        Booking.id == booking_id
    ).first()

    if booking is None:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    # 2. Make sure the booking belongs to the logged-in user
    if booking.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to pay for this booking."
        )

    # 3. Don't allow payment for a cancelled booking
    if booking.status == "cancelled":
        raise HTTPException(
            status_code=400,
            detail="Cannot make payment for a cancelled booking."
        )

    # 4. Check whether the booking already has a successful payment
    existing_payment = db.query(Payment).filter(
        Payment.booking_id == booking_id,
        Payment.status == "successful"
    ).first()

    if existing_payment:
        raise HTTPException(
            status_code=400,
            detail="This booking has already been paid."
        )

    # 5. Get the room price
    room = booking.room

    if room is None:
        raise HTTPException(
            status_code=404,
            detail="Room not found."
        )

    # 6. Create payment
    new_payment = Payment(
        booking_id=booking_id,
        payment_mode=payment.payment_mode,
        status="successful",
        amount_paid=room.price
    )

    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)

    return new_payment

@router.get("/my-payments", response_model=list[PaymentResponse])
def get_my_payments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    payments = (
        db.query(Payment)
        .join(Booking, Payment.booking_id == Booking.id)
        .filter(Booking.user_id == current_user.id)
        .all()
    )

    return payments

@router.get("/{payment_id}", response_model=PaymentResponse)
def get_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    payment = db.query(Payment).filter(
        Payment.id == payment_id
    ).first()

    if payment is None:
        raise HTTPException(
            status_code=404,
            detail="Payment not found"
        )

    booking = db.query(Booking).filter(
        Booking.id == payment.booking_id
    ).first()

    if booking is None:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    if booking.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to view this payment."
        )

    return payment