from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.hotel import Hotel
from app.schemas.hotel import HotelCreate, HotelResponse, HotelUpdate
from app.models.room import Room
from app.models.user import User
from app.utils.token import get_current_admin
from app.schemas.room import RoomResponse
from app.models.booking import Booking
from app.models.review import Review
from datetime import date



router = APIRouter(prefix="/hotels", tags=["Hotels"])


@router.post("/", response_model=HotelResponse)
def create_hotel(hotel: HotelCreate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    new_hotel = Hotel(
        name=hotel.name,
        location=hotel.location,
        description=hotel.description,
    )

    db.add(new_hotel)
    db.commit()
    db.refresh(new_hotel)

    return new_hotel

@router.get("/", response_model=list[HotelResponse])
def get_hotels(
    location: str | None = None,
    name: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    room_type: str | None = None,
    sort: str | None = None,
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    query = db.query(Hotel)
    if (
        min_price is not None
        and max_price is not None
        and min_price > max_price
    ):
        raise HTTPException(
            status_code=400,
            detail="Minimum price cannot be greater than maximum price"
        )
    # Hotel filters
    if location is not None:
        query = query.filter(
            Hotel.location.ilike(f"%{location}%")
        )

    if name is not None:
        query = query.filter(
            Hotel.name.ilike(f"%{name}%")
        )

    # Room filters or price sorting need Room
    needs_room = (
        min_price is not None
        or max_price is not None
        or room_type is not None
        or sort in ["low", "high"]
    )

    if needs_room:
        query = query.join(Room)

    # Room filters
    if min_price is not None:
        query = query.filter(
            Room.price >= min_price
        )

    if max_price is not None:
        query = query.filter(
            Room.price <= max_price
        )

    if room_type is not None:
        query = query.filter(
            Room.room_type.ilike(f"%{room_type}%")
        )

    # Price sorting
    if sort == "low":
        query = query.group_by(
            Hotel.id
        ).order_by(
            func.min(Room.price).asc()
        )

    elif sort == "high":
        query = query.group_by(
            Hotel.id
        ).order_by(
            func.max(Room.price).desc()
        )

    elif sort == "rating":
        query = (
            query
            .outerjoin(Room)
            .outerjoin(Booking, Room.id == Booking.room_id)
            .outerjoin(Review, Booking.id == Review.booking_id)
            .group_by(Hotel.id)
            .order_by(
                func.avg(Review.rating).desc().nullslast()
            )
        )

    else:
        query = query.distinct()

    if page < 1:
        raise HTTPException(
            status_code=400,
            detail="Page must be greater than 0"
        )

    if limit < 1 or limit > 100:
        raise HTTPException(
            status_code=400,
            detail="Limit must be between 1 and 100"
        )

    offset = (page - 1) * limit

    query = query.offset(offset).limit(limit)

    return query.all()

@router.get("/{hotel_id}", response_model=HotelResponse)
def get_hotel(hotel_id: int, db: Session = Depends(get_db)):
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()

    if hotel is None:
        raise HTTPException(
            status_code=404,
            detail="Hotel not found"
        )

    return hotel

@router.get("/{hotel_id}/rooms", response_model=list[RoomResponse])
def get_rooms_of_hotel(
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

    return hotel.rooms

@router.get("/{hotel_id}/available-rooms", response_model=list[RoomResponse])
def get_available_rooms(
    hotel_id: int,
    check_in: date,
    check_out: date,
    db: Session = Depends(get_db)
):

    if check_out <= check_in:
        raise HTTPException(
            status_code=400,
            detail="Check-out date must be after check-in date."
        )

    hotel = db.query(Hotel).filter(
        Hotel.id == hotel_id
        ).first()

    if hotel is None:
        raise HTTPException(
            status_code=404,
            detail="Hotel not found"
        )

    rooms = db.query(Room).filter(
        Room.hotel_id == hotel_id
        ).all()

    booked_rooms = db.query(Booking.room_id).join(Room).filter(
        Room.hotel_id == hotel_id,
        Booking.check_in < check_out,
        Booking.check_out > check_in,
        Booking.status == "confirmed"
    ).all()

    booked_room_ids = {
        room_id for (room_id,) in booked_rooms
    }

    available_rooms = [
        room for room in rooms
        if room.id not in booked_room_ids
    ]

    return available_rooms

@router.patch("/{hotel_id}", response_model=HotelResponse)
def update_hotel(
    hotel_id: int,
    hotel_data: HotelUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    hotel = db.query(Hotel).filter(
        Hotel.id == hotel_id
    ).first()

    if hotel is None:
        raise HTTPException(
            status_code=404,
            detail="Hotel not found"
        )

    if hotel_data.name is not None:
        hotel.name = hotel_data.name

    if hotel_data.location is not None:
        hotel.location = hotel_data.location

    if hotel_data.description is not None:
        hotel.description = hotel_data.description

    db.commit()
    db.refresh(hotel)

    return hotel

@router.delete("/{hotel_id}")
def delete_hotel(
    hotel_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    hotel = db.query(Hotel).filter(
        Hotel.id == hotel_id
    ).first()

    if hotel is None:
        raise HTTPException(
            status_code=404,
            detail="Hotel not found"
        )

    db.delete(hotel)
    db.commit()

    return {
        "message": "Hotel deleted successfully"
    }