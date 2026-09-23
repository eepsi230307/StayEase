import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./pages/Profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const response = await axios.get(
          "http://127.0.0.1:8000/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfile(response.data);
      } catch (error) {
        setError(
          error.response?.data?.detail || "Unable to load profile."
        );
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
      <Navbar />

      <main className="profile-page">
        <h1>My Profile</h1>

        {error && <p className="profile-error">{error}</p>}

        {profile && (
          <div className="profile-card">
            <h2>Account Information</h2>

            <p>
              <strong>Name:</strong>{" "}
              {profile.name || profile.username || "Not available"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {profile.email || "Not available"}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default Profile;