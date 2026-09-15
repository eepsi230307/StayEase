from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.room import Room
from app.models.hotel import Hotel
from app.models.user import User
from app.utils.token import get_current_admin
from app.schemas.room import RoomCreate, RoomResponse, RoomUpdate

router = APIRouter(
    prefix="/rooms",
    tags=["Rooms"]
)


@router.post("/", response_model=RoomResponse)
def create_room(
    room: RoomCreate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):

    hotel = db.query(Hotel).filter(
        Hotel.id == room.hotel_id
    ).first()

    if hotel is None:
        raise HTTPException(
            status_code=404,
            detail="Hotel not found"
        )

    new_room = Room(
        room_number=room.room_number,
        room_type=room.room_type,
        price=room.price,
        hotel_id=room.hotel_id
    )

    db.add(new_room)
    db.commit()
    db.refresh(new_room)

    return new_room

# Get one room - Public
@router.get("/{room_id}", response_model=RoomResponse)
def get_room(
    room_id: int,
    db: Session = Depends(get_db)
):
    room = db.query(Room).filter(
        Room.id == room_id
    ).first()

    if room is None:
        raise HTTPException(
            status_code=404,
            detail="Room not found"
        )

    return room


# Update room - Admin only
@router.patch("/{room_id}", response_model=RoomResponse)
def update_room(
    room_id: int,
    room_data: RoomUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    room = db.query(Room).filter(
        Room.id == room_id
    ).first()

    if room is None:
        raise HTTPException(
            status_code=404,
            detail="Room not found"
        )

    if room_data.room_number is not None:
        room.room_number = room_data.room_number

    if room_data.room_type is not None:
        room.room_type = room_data.room_type

    if room_data.price is not None:
        room.price = room_data.price

    if room_data.is_available is not None:
        room.is_available = room_data.is_available

    db.commit()
    db.refresh(room)

    return room


# Delete room - Admin only
@router.delete("/{room_id}")
def delete_room(
    room_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    room = db.query(Room).filter(
        Room.id == room_id
    ).first()

    if room is None:
        raise HTTPException(
            status_code=404,
            detail="Room not found"
        )

    db.delete(room)
    db.commit()

    return {
        "message": "Room deleted successfully"
    }