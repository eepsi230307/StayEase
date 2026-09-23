import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./HotelDetails.css";

function HotelDetails() {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/hotels/${hotelId}`)
      .then((response) => {
        setHotel(response.data);
      })
      .catch(() => {
        setError("Unable to load hotel details.");
      });

    axios
      .get(`http://127.0.0.1:8000/hotels/${hotelId}/rooms`)
      .then((response) => {
        setRooms(response.data);
      })
      .catch(() => {
        setError("Unable to load rooms.");
      });
  }, [hotelId]);

  return (
    <>
      <Navbar />

      <main className="hotel-details-page">
        {error && <p className="error-message">{error}</p>}

        {hotel && (
          <section className="hotel-details-header">
            <h1>{hotel.name}</h1>
            <p>📍 {hotel.location}</p>
            <p>{hotel.description}</p>
          </section>
        )}

        <section className="rooms-section">
          <h2>Available Rooms</h2>

          <div className="room-cards">
            {rooms.map((room) => (
              <div className="room-card" key={room.id}>
                <h3>Room {room.room_number}</h3>

                <p>Type: {room.room_type}</p>

                <p>Price: ₹{room.price} per night</p>

                <p>
                  {room.is_available
                    ? "Available ✅"
                    : "Not Available ❌"}
                </p>

                <button
                  className="book-btn"
                  disabled={!room.is_available}
                  onClick={() =>
                    navigate(`/booking/${room.id}`, {
                      state: { room: room },
                    })
                  }
                >
                  Select Room
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default HotelDetails;