import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-section">
          <h2>StayEase</h2>
          <p>
            Find your perfect stay with easy and comfortable
            hotel booking.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/hotels">Hotels</Link>
          <Link to="/profile">My Profile</Link>
          <Link to="/my-bookings">My Bookings</Link>
        </div>

        <div className="footer-section">
          <h3>Support</h3>
          <p>Help Center</p>
          <p>Contact Us</p>
          <p>FAQs</p>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: support@stayease.com</p>
          <p>Phone: +91 9876543210</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 StayEase. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;