import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./BookingConfirmation.css";

function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state;

  if (!booking) {
    return (
      <>
        <Navbar />

        <main className="confirmation-page">
          <h1>Booking Details Not Found</h1>

          <button onClick={() => navigate("/my-bookings")}>
            Go to My Bookings
          </button>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="confirmation-page">
        <div className="confirmation-card">
          <div className="success-icon">✓</div>

          <h1>Booking Confirmed!</h1>

          <p className="confirmation-message">
            Your room has been successfully booked.
          </p>

          <div className="receipt">
            <h2>Booking Receipt</h2>

            <div className="receipt-row">
              <span>Room</span>
              <strong>
                {booking.room?.room_number}
              </strong>
            </div>

            <div className="receipt-row">
              <span>Room Type</span>
              <strong>
                {booking.room?.room_type}
              </strong>
            </div>

            <div className="receipt-row">
              <span>Check-in</span>
              <strong>{booking.checkIn}</strong>
            </div>

            <div className="receipt-row">
              <span>Check-out</span>
              <strong>{booking.checkOut}</strong>
            </div>

            <div className="receipt-row">
              <span>Payment Status</span>
              <strong className="paid">
                Paid
              </strong>
            </div>

            <div className="total-row">
              <span>Total Amount</span>
              <strong>₹{booking.totalPrice}</strong>
            </div>
          </div>

          <div className="confirmation-actions">
            <button
              onClick={() => navigate("/my-bookings")}
            >
              View My Bookings
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/hotels")}
            >
              Explore More Hotels
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default BookingConfirmation;