import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Booking.css";

function Booking() {
    const { roomId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const room = location.state?.room;

    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [message, setMessage] = useState("");
    const calculateNights = () => {
        if (!checkIn || !checkOut) return 0;

        const start = new Date(checkIn);
        const end = new Date(checkOut);

        const difference = end - start;

        return difference / (1000 * 60 * 60 * 24);
    };
    const handleBooking = (event) => {
      event.preventDefault();

      const today = new Date().toISOString().split("T")[0];

      if (checkIn < today) {
        setMessage("Check-in date cannot be in the past.");
        return;
      }

      if (checkOut <= checkIn) {
        setMessage("Check-out date must be after check-in date.");
        return;
      }

      if (!room) {
        setMessage("Room details not found.");
        return;
      }

      navigate("/payment", {
        state: {
          roomId: roomId,
          room: room,
          checkIn: checkIn,
          checkOut: checkOut,
          totalPrice: calculateNights() * room.price,
        },
      });
    };
    

  return (
    <>
      <Navbar />

      <main className="booking-page">
        <h1>Book Your Room</h1>

        {room && (
          <div className="booking-room-details">
            <h2>Room {room.room_number}</h2>
            <p>Type: {room.room_type}</p>
            <p>Price: ₹{room.price} per night</p>
            <p> Number of nights: {calculateNights()}</p>
            <h3> Total Price: ₹{calculateNights() * room.price}</h3>
          </div>
        )}

        <form className="booking-form" onSubmit={handleBooking}>
          <label>Check-in Date</label>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={checkIn}
            onChange={(event) => setCheckIn(event.target.value)}
            required
          />

          <label>Check-out Date</label>
          <input
            type="date"
            min={checkIn || new Date().toISOString().split("T")[0]}
            value={checkOut}
            onChange={(event) => setCheckOut(event.target.value)}
            required
          />

          <button type="submit">Continue to Payment</button>

          {message && <p>{message}</p>}
        </form>
      </main>

      <Footer />
    </>
  );
}

export default Booking;