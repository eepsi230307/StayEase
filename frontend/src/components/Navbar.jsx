import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const userRole = localStorage.getItem("user_role");
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("access_token"));

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        StayEase
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/hotels">Hotels</Link>
        <Link to="/profile">My Profile</Link>
        <Link to="/my-bookings">My Bookings</Link>
        {userRole === "admin" && (
          <Link to="/admin">Admin Dashboard</Link>
        )}
        {!isLoggedIn ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
          </>
        ) : (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;