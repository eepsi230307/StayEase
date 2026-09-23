from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import Base, engine

# Import all models so SQLAlchemy knows about them
from app.models import user, hotel

# Import routers
from app.routers.user import router as user_router
from app.routers.hotel import router as hotel_router
from app.routers.room import router as room_router
from app.routers.review import router as review_router
from app.routers import booking
from app.routers.payment import router as payment_router


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(user_router)
app.include_router(hotel_router)
app.include_router(room_router)
app.include_router(booking.router)
app.include_router(review_router)
app.include_router(payment_router)

@app.get("/")
def home():
    return {
        "message": f"Welcome to {settings.APP_NAME} 🚀"
    }