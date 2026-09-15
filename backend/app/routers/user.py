from fastapi import APIRouter, Depends, HTTPException


from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserProfileResponse, UserProfileUpdate
from app.utils.password import get_password_hash, verify_password
from app.utils.token import create_access_token, get_current_user


router = APIRouter()

@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):

    hashed_password = get_password_hash(user.password)

    new_user = User(
        name=user.name,
        email=user.email,
        password=hashed_password
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
            "message": "User created successfully",
            "id": new_user.id
        }

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    # Find the user by email
    db_user = db.query(User).filter(User.email == user.email).first()

    # Check if user exists
    if db_user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Verify password
    if not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    access_token = create_access_token(
    data={
        "sub": db_user.email,
        "role": db_user.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/profile", response_model=UserProfileResponse)
def get_profile(
    current_user: User = Depends(get_current_user)
):
    return current_user

@router.patch("/profile", response_model=UserProfileResponse)
def update_profile(
    profile: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if profile.name is not None:
        current_user.name = profile.name

    if profile.email is not None:

        existing_user = db.query(User).filter(
            User.email == profile.email,
            User.id != current_user.id
        ).first()

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already exists"
            )

        current_user.email = profile.email

    db.commit()
    db.refresh(current_user)

    return current_user

