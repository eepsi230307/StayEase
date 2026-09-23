import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Hotels.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/hotels")
      .then((response) => {
        setHotels(response.data);
      })
      .catch(() => {
        setError("Unable to load hotels.");
      });
  }, []);

  const filteredHotels = hotels.filter((hotel) => {
    const search = searchTerm.toLowerCase();

    return (
      hotel.name.toLowerCase().includes(search) ||
      hotel.location.toLowerCase().includes(search)
    );
  });

  return (
    <>
    <Navbar />
    <main className="hotels-page">
      <section className="hotels-header">
        <h1>Explore Hotels</h1>
        <p>Find a comfortable stay for your next journey.</p>
      </section>

      <section className="hotels-list-section">
        <div className="hotel-search-container">
          <input
            type="text"
            placeholder="Search by hotel name or location..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="hotels-grid">
          {filteredHotels.length === 0 ? (
            <p>No hotels found.</p>
          ) : (
            filteredHotels.map((hotel) => (
              <div className="hotel-list-card" key={hotel.id}>
                <div className="hotel-list-info">
                  <h2>{hotel.name}</h2>

                  <p>📍 {hotel.location}</p>

                  <p>
                    {hotel.description ||
                      "Enjoy a comfortable stay with us."}
                  </p>

                <Link
                    to={`/hotels/${hotel.id}`}
                    className="view-rooms-btn"
                >
                    View Rooms
                </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
    <Footer />
  </>
  );
}

export default Hotels;