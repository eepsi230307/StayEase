import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./pages/MyBookings.css";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.get(
        "http://127.0.0.1:8000/bookings/my-bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings(response.data);
    } catch (error) {
      setMessage("Unable to load bookings.");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem("access_token");

      await axios.patch(
        `http://127.0.0.1:8000/bookings/${bookingId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Booking cancelled successfully.");
      fetchBookings();
    } catch (error) {
      setMessage(
        error.response?.data?.detail || "Unable to cancel booking."
      );
    }
  };

  return (
    <>
      <Navbar />

      <main className="my-bookings-page">
        <h1>My Bookings</h1>

        {message && <p className="booking-message">{message}</p>}

        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className="bookings-container">
            {bookings.map((booking) => (
              <div className="booking-card" key={booking.id}>
                <h2>Booking #{booking.id}</h2>

                <p>Hotel: {booking.room?.hotel?.name || "Not available"}</p>
                <p>Room: {booking.room?.room_number || "Not available"}</p>
                <p>Room Type: {booking.room?.room_type || "Not available"}</p>
                <p>
                  Price per night: ₹{booking.room?.price || "Not available"}
                </p>

                <p>
                  Number of nights:{" "}
                  {Math.ceil(
                    (new Date(booking.check_out) -
                      new Date(booking.check_in)) /
                      (1000 * 60 * 60 * 24)
                  )}
                </p>

                <p>
                  <strong>
                    Total Amount Paid: ₹
                    {booking.room?.price *
                      Math.ceil(
                        (new Date(booking.check_out) -
                          new Date(booking.check_in)) /
                          (1000 * 60 * 60 * 24)
                      )}
                  </strong>
                </p>
                <p>Check-in: {booking.check_in}</p>
                <p>Check-out: {booking.check_out}</p>
                <p>Status: {booking.status}</p>

                {booking.status !== "cancelled" && (
                  <button
                    className="cancel-booking-btn"
                    onClick={() => cancelBooking(booking.id)}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default MyBookings;