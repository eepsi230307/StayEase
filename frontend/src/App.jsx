import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [hotels, setHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [rooms, setRooms] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingConfirmation, setBookingConfirmation] = useState(null);

  const [error, setError] = useState("");
  // Calculate number of nights
  function calculateNights() {
    if (!checkIn || !checkOut) return 0;

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    const difference = endDate - startDate;

    return difference / (1000 * 60 * 60 * 24);
  }
  useEffect(() => {
    fetchHotels();
  }, []);

  // Fetch hotels
  async function fetchHotels() {
    try {
      const response = await axios.get(`${API_URL}/hotels`);
      setHotels(response.data);
    } catch (error) {
      console.error(error);
      setError("Unable to load hotels.");
    }
  }

  // Fetch rooms
  async function fetchRooms(hotelId) {
    try {
      setError("");

      const response = await axios.get(
        `${API_URL}/hotels/${hotelId}/rooms`
      );

      setRooms(response.data);
      setSelectedHotel(hotelId);
      setSelectedRoom(null);
      setBookingMessage("");
    } catch (error) {
      console.error(error);
      setError("Unable to load rooms.");
    }
  }

  // Booking
  async function handleBooking() {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setBookingMessage("Please login first.");
      return;
    }

    if (!selectedRoom) {
      setBookingMessage("Please select a room first.");
      return;
    }

    if (!checkIn || !checkOut) {
      setBookingMessage(
        "Please select check-in and check-out dates."
      );
      return;
    }

    if (checkOut <= checkIn) {
      setBookingMessage(
        "Check-out date must be after check-in date."
      );
      return;
    }

    try {
      setBookingMessage("");

      const response = await axios.post(
        `${API_URL}/bookings/`,
        {
          room_id: selectedRoom.id,
          check_in: checkIn,
          check_out: checkOut,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookingConfirmation({
        bookingId: response.data.id,
        hotelName: hotels.find(
          (hotel) => hotel.id === selectedHotel
        )?.name || "Unknown Hotel",
        roomNumber: selectedRoom.room_number,
        roomType: selectedRoom.room_type,
        pricePerNight: selectedRoom.price,
        checkIn: checkIn,
        checkOut: checkOut,
        totalPrice: calculateNights() * selectedRoom.price,
      });

      setBookingMessage("");

      setRooms((previousRooms) =>
        previousRooms.map((room) =>
          room.id === selectedRoom.id
            ? { ...room, is_available: false }
            : room
        )
      );

      setSelectedRoom(null);
      setCheckIn("");
      setCheckOut("");
    } catch (error) {
      console.error(error);

      setBookingMessage(
        error.response?.data?.detail || "Booking failed."
      );
    }
  }

  // Filter hotels by name or location
  const filteredHotels = hotels.filter((hotel) => {
    const search = searchTerm.toLowerCase();

    return (
      hotel.name.toLowerCase().includes(search) ||
      hotel.location.toLowerCase().includes(search)
    );
  });

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <h2 className="logo">StayEase 🏨</h2>

        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#hotels">Hotels</a>
          <a href="#">About</a>
          <a href="#">Contact</a>

          <Link to="/login" className="login-link">
            Login
          </Link>

          <Link to="/register" className="register-link">
            Register
          </Link>

          <Link to="/my-bookings">
            My Bookings
          </Link>

          <Link to="/profile">My Profile</Link>
          
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Perfect Stay</h1>

          <p>
            Discover comfortable hotels and book your next
            unforgettable stay with StayEase.
          </p>

          <button
            className="explore-btn"
            onClick={() =>
              document
                .getElementById("hotels")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Explore Hotels
          </button>
        </div>
      </section>

      {/* Hotels Section */}
      <section className="hotels-section" id="hotels">
        <h2>Available Hotels</h2>

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search hotels by name or location..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="hotel-cards">
          {filteredHotels.length === 0 ? (
            <p>No hotels found.</p>
          ) : (
            filteredHotels.map((hotel) => (
              <div className="hotel-card" key={hotel.id}>
                <div className="hotel-image">🏨</div>

                <div className="hotel-info">
                  <h3>{hotel.name}</h3>

                  <p>📍 {hotel.location}</p>

                  <p>{hotel.description}</p>

                  <button
                    className="book-btn"
                    onClick={() => fetchRooms(hotel.id)}
                  >
                    View Rooms
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Rooms Section */}
      {selectedHotel && (
        <section className="rooms-section">
          <h2>Available Rooms</h2>

          <div className="room-cards">
            {rooms.map((room) => (
              <div className="room-card" key={room.id}>
                <h3>Room {room.room_number}</h3>

                <p>Type: {room.room_type}</p>

                <p>Price: ₹{room.price} per night</p>

                <p>
                  Status:{" "}
                  {room.is_available
                    ? "Available ✅"
                    : "Not Available ❌"}
                </p>

                {room.is_available && (
                  <button
                    className="book-btn"
                    onClick={() => {
                      setSelectedRoom(room);
                      setBookingMessage("");
                    }}
                  >
                    Book Now
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Booking Confirmation */}
      {bookingConfirmation && (
        <section className="booking-confirmation">
          <h2>🎉 Booking Confirmed!</h2>

          <p>
            <strong>Booking ID:</strong>{" "}
            {bookingConfirmation.bookingId}
          </p>

          <p>
            <strong>Hotel:</strong>{" "}
            {bookingConfirmation.hotelName}
          </p>

          <p>
            <strong>Room:</strong>{" "}
            {bookingConfirmation.roomNumber}
          </p>

          <p>
            <strong>Room Type:</strong>{" "}
            {bookingConfirmation.roomType}
          </p>

          <p>
            <strong>Check-in:</strong>{" "}
            {bookingConfirmation.checkIn}
          </p>

          <p>
            <strong>Check-out:</strong>{" "}
            {bookingConfirmation.checkOut}
          </p>

          <p>
            <strong>Total Price:</strong> ₹
            {bookingConfirmation.totalPrice}
          </p>

          <button
            className="book-btn"
            onClick={() => setBookingConfirmation(null)}
          >
            Close
          </button>
        </section>
      )}
      {/* Booking Section */}
      {selectedRoom && (
        <section className="booking-section">
          <h2>Book Room {selectedRoom.room_number}</h2>

          <p>Room Type: {selectedRoom.room_type}</p>

          <p>Price: ₹{selectedRoom.price} per night</p>

          <p>
            Number of nights: {calculateNights()}
          </p>

          <p>
            Total Price: ₹
            {calculateNights() * selectedRoom.price}
          </p>

          <label>Check-in Date</label>

          <input
            type="date"
            value={checkIn}
            min={new Date().toISOString().split("T")[0]}
            onChange={(event) => setCheckIn(event.target.value)}
          />

          <label>Check-out Date</label>

          <input
            type="date"
            value={checkOut}
            min={
              checkIn ||
              new Date().toISOString().split("T")[0]
            }
            onChange={(event) => setCheckOut(event.target.value)}
          />

          <button
            className="book-btn"
            onClick={handleBooking}
          >
            Confirm Booking
          </button>

          <button
            className="cancel-btn"
            onClick={() => {
              setSelectedRoom(null);
              setBookingMessage("");
            }}
          >
            Cancel
          </button>

          {bookingMessage && <p>{bookingMessage}</p>}
        </section>
      )}
      <Navbar />
      <Footer />
    </div>
  );
}

export default App;