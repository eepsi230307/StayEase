import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    const [hotels, setHotels] = useState([]);

    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/hotels")
            .then((response) => {
            setHotels(response.data);
            })
            .catch((error) => {
            console.error("Error fetching hotels:", error);
            });
    }, []);
    return (
    <>
    <Navbar />
    <main className="home-page">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find Your Perfect Stay</h1>

          <p>
            Discover comfortable hotels and book your
            perfect room with StayEase.
          </p>

          <button
              className="explore-btn"
              onClick={() => navigate("/hotels")}
            >
              Explore Hotels
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <h2>Our Services</h2>

        <div className="services-container">

          <div className="service-card">
            <h3>🏨 Find Hotels</h3>
            <p>
              Discover hotels that match your preferences.
            </p>
          </div>

          <div className="service-card">
            <h3>🛏️ Easy Booking</h3>
            <p>
              Select your preferred room and book easily.
            </p>
          </div>

          <div className="service-card">
            <h3>📅 Manage Bookings</h3>
            <p>
              View and manage your hotel reservations.
            </p>
          </div>

        </div>
      </section>
    {/* Featured Hotels Section */}
    <section className="featured-hotels-section">
    <h2>Featured Hotels</h2>

    <div className="featured-hotels-container">
        {hotels.length === 0 ? (
        <p>No hotels available.</p>
        ) : (
        hotels.map((hotel) => (
            <div className="featured-hotel-card" key={hotel.id}>
            <h3>{hotel.name}</h3>

            <p>📍 {hotel.location}</p>

            <p>
                {hotel.description || "Comfortable stay awaits you."}
            </p>

            <Link
              to={`/hotels/${hotel.id}`}
              className="view-rooms-btn"
            >
              View Rooms
            </Link>
            </div>
        ))
        )}
    </div>
    </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How StayEase Works</h2>

        <div className="steps-container">

          <div className="step-card">
            <span>1</span>
            <h3>Search</h3>
            <p>Find a hotel that suits your needs.</p>
          </div>

          <div className="step-card">
            <span>2</span>
            <h3>Select</h3>
            <p>Choose your preferred room.</p>
          </div>

          <div className="step-card">
            <span>3</span>
            <h3>Book</h3>
            <p>Reserve your room with ease.</p>
          </div>

        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-section">
        <h2>Why Choose StayEase?</h2>

        <p>
          We make hotel discovery and room booking
          simple, convenient, and user-friendly.
        </p>
      </section>
    {/* FAQ Section */}
        <section className="faq-section">
            <h2>Frequently Asked Questions</h2>

            <div className="faq-container">

                <details className="faq-item">
                <summary>How can I book a room?</summary>
                <p>
                    Select a hotel, choose an available room,
                    and provide your booking dates.
                </p>
                </details>

                <details className="faq-item">
                <summary>Do I need an account to book?</summary>
                <p>
                    Yes, you need to register and log in
                    before booking a room.
                </p>
                </details>

                <details className="faq-item">
                <summary>Can I cancel my booking?</summary>
                <p>
                    Yes, you can manage and cancel eligible
                    bookings from My Bookings.
                </p>
                </details>

                <details className="faq-item">
                <summary>How can I view my bookings?</summary>
                <p>
                    Log in and open the My Bookings page
                    to view your reservations.
                </p>
                </details>

            </div>
        </section>
    </main>
    <Footer />
    </>
  );
}

export default Home;