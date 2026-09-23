import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Payment.css";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingDetails = location.state;

  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setMessage("");

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        alert("Please login before payment.");
        navigate("/login");
        return;
      }

      await axios.post(
        "http://127.0.0.1:8000/bookings/",
        {
          room_id: Number(bookingDetails.roomId),
          check_in: bookingDetails.checkIn,
          check_out: bookingDetails.checkOut,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Payment successful! Booking confirmed 🎉");

      setTimeout(() => {
          navigate("/booking-confirmation", {
              state: bookingDetails,
          });
      }, 1500);
    } catch (error) {
      setMessage(
        error.response?.data?.detail || "Payment or booking failed."
      );
      setIsProcessing(false);
    }
  };

  if (!bookingDetails) {
    return (
      <>
        <Navbar />

        <main className="payment-page">
          <h1>No Booking Details Found</h1>

          <button onClick={() => navigate("/hotels")}>
            Explore Hotels
          </button>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="payment-page">
        <h1>Complete Your Payment</h1>

        <div className="payment-card">
          <h2>Booking Summary</h2>

          <p>
            <strong>Room:</strong>{" "}
            {bookingDetails.room?.room_number}
          </p>

          <p>
            <strong>Room Type:</strong>{" "}
            {bookingDetails.room?.room_type}
          </p>

          <p>
            <strong>Check-in:</strong>{" "}
            {bookingDetails.checkIn}
          </p>

          <p>
            <strong>Check-out:</strong>{" "}
            {bookingDetails.checkOut}
          </p>

          <h2>
            Total Amount: ₹{bookingDetails.totalPrice}
          </h2>

          <button
            className="pay-now-btn"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </button>

          {message && <p>{message}</p>}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Payment;