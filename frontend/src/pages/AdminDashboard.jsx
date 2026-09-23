import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./AdminDashboard.css";

const API = "http://127.0.0.1:8000";

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("hotels");

  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [message, setMessage] = useState("");

  const [hotelForm, setHotelForm] = useState({
    name: "",
    location: "",
    description: "",
  });

  const [editingHotel, setEditingHotel] = useState(null);

  const [roomForm, setRoomForm] = useState({
    hotel_id: "",
    room_number: "",
    room_type: "",
    price: "",
  });

  const [editingRoom, setEditingRoom] = useState(null);

  const token = localStorage.getItem("access_token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchHotels = async () => {
    try {
      const response = await axios.get(`${API}/hotels`);
      setHotels(response.data);

      const allRooms = [];

      for (const hotel of response.data) {
        const roomResponse = await axios.get(
          `${API}/hotels/${hotel.id}/rooms`
        );

        allRooms.push(...roomResponse.data);
      }

      setRooms(allRooms);
    } catch (error) {
      setMessage("Unable to load hotels.");
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        `${API}/bookings/admin/all`,
        { headers }
      );

      setBookings(response.data);
    } catch (error) {
      setMessage("Unable to load bookings.");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${API}/admin/users`,
        { headers }
      );

      setUsers(response.data);
    } catch (error) {
      setMessage("Unable to load users.");
    }
  };

  useEffect(() => {
    fetchHotels();
    fetchBookings();
    fetchUsers();
  }, []);

  /* =========================
     HOTEL FUNCTIONS
  ========================= */

  const handleHotelSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingHotel) {
        await axios.patch(
          `${API}/hotels/${editingHotel.id}`,
          hotelForm,
          { headers }
        );

        setMessage("Hotel updated successfully.");
      } else {
        await axios.post(
          `${API}/hotels/`,
          hotelForm,
          { headers }
        );

        setMessage("Hotel added successfully.");
      }

      setHotelForm({
        name: "",
        location: "",
        description: "",
      });

      setEditingHotel(null);
      fetchHotels();
    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
          "Unable to save hotel."
      );
    }
  };

  const deleteHotel = async (hotelId) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) {
      return;
    }

    try {
      await axios.delete(
        `${API}/hotels/${hotelId}`,
        { headers }
      );

      setMessage("Hotel deleted successfully.");
      fetchHotels();
    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
          "Unable to delete hotel."
      );
    }
  };

  const startEditHotel = (hotel) => {
    setEditingHotel(hotel);

    setHotelForm({
      name: hotel.name,
      location: hotel.location,
      description: hotel.description || "",
    });
  };

  /* =========================
     ROOM FUNCTIONS
  ========================= */

  const handleRoomSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingRoom) {
        await axios.patch(
          `${API}/rooms/${editingRoom.id}`,
          {
            room_number: roomForm.room_number,
            room_type: roomForm.room_type,
            price: Number(roomForm.price),
          },
          { headers }
        );

        setMessage("Room updated successfully.");
      } else {
        await axios.post(
          `${API}/rooms/`,
          {
            hotel_id: Number(roomForm.hotel_id),
            room_number: roomForm.room_number,
            room_type: roomForm.room_type,
            price: Number(roomForm.price),
          },
          { headers }
        );

        setMessage("Room added successfully.");
      }

      setRoomForm({
        hotel_id: "",
        room_number: "",
        room_type: "",
        price: "",
      });

      setEditingRoom(null);
      fetchHotels();
    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
          "Unable to save room."
      );
    }
  };

  const startEditRoom = (room) => {
    setEditingRoom(room);

    setRoomForm({
      hotel_id: room.hotel_id,
      room_number: room.room_number,
      room_type: room.room_type,
      price: room.price,
    });
  };

  const deleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) {
      return;
    }

    try {
      await axios.delete(
        `${API}/rooms/${roomId}`,
        { headers }
      );

      setMessage("Room deleted successfully.");
      fetchHotels();
    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
          "Unable to delete room."
      );
    }
  };

  /* =========================
     BOOKING FUNCTIONS
  ========================= */

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) {
      return;
    }

    try {
      await axios.patch(
        `${API}/bookings/admin/${bookingId}/cancel`,
        {},
        { headers }
      );

      setMessage("Booking cancelled successfully.");
      fetchBookings();
    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
          "Unable to cancel booking."
      );
    }
  };

  return (
    <>
      <Navbar />

      <main className="admin-page">

        <section className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage StayEase from one place.</p>
        </section>

        {message && (
          <div className="admin-message">
            {message}
          </div>
        )}

        <div className="admin-tabs">

          <button
            className={activeSection === "hotels" ? "active" : ""}
            onClick={() => setActiveSection("hotels")}
          >
            🏨 Hotels
          </button>

          <button
            className={activeSection === "rooms" ? "active" : ""}
            onClick={() => setActiveSection("rooms")}
          >
            🛏️ Rooms
          </button>

          <button
            className={activeSection === "bookings" ? "active" : ""}
            onClick={() => setActiveSection("bookings")}
          >
            📅 Bookings
          </button>

          <button
            className={activeSection === "users" ? "active" : ""}
            onClick={() => setActiveSection("users")}
          >
            👥 Users
          </button>

        </div>

        {/* ================= HOTELS ================= */}

        {activeSection === "hotels" && (
          <section className="admin-section">

            <div className="admin-form-card">
              <h2>
                {editingHotel
                  ? "Edit Hotel"
                  : "Add New Hotel"}
              </h2>

              <form onSubmit={handleHotelSubmit}>

                <input
                  type="text"
                  placeholder="Hotel name"
                  value={hotelForm.name}
                  onChange={(event) =>
                    setHotelForm({
                      ...hotelForm,
                      name: event.target.value,
                    })
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="Location"
                  value={hotelForm.location}
                  onChange={(event) =>
                    setHotelForm({
                      ...hotelForm,
                      location: event.target.value,
                    })
                  }
                  required
                />

                <textarea
                  placeholder="Description"
                  value={hotelForm.description}
                  onChange={(event) =>
                    setHotelForm({
                      ...hotelForm,
                      description: event.target.value,
                    })
                  }
                />

                <button type="submit">
                  {editingHotel
                    ? "Update Hotel"
                    : "Add Hotel"}
                </button>

                {editingHotel && (
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => {
                      setEditingHotel(null);
                      setHotelForm({
                        name: "",
                        location: "",
                        description: "",
                      });
                    }}
                  >
                    Cancel Edit
                  </button>
                )}

              </form>
            </div>

            <div className="admin-list">

              <h2>Hotels</h2>

              {hotels.map((hotel) => (
                <div className="admin-item" key={hotel.id}>

                  <div>
                    <h3>{hotel.name}</h3>

                    <p>
                      📍 {hotel.location}
                    </p>

                    <p>
                      {hotel.description}
                    </p>
                  </div>

                  <div className="admin-actions">

                    <button
                      onClick={() =>
                        startEditHotel(hotel)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteHotel(hotel.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>
              ))}

            </div>

          </section>
        )}

        {/* ================= ROOMS ================= */}

        {activeSection === "rooms" && (
          <section className="admin-section">

            <div className="admin-form-card">

              <h2>
                {editingRoom
                  ? "Edit Room"
                  : "Add New Room"}
              </h2>

              <form onSubmit={handleRoomSubmit}>

                {!editingRoom && (
                  <select
                    value={roomForm.hotel_id}
                    onChange={(event) =>
                      setRoomForm({
                        ...roomForm,
                        hotel_id: event.target.value,
                      })
                    }
                    required
                  >
                    <option value="">
                      Select Hotel
                    </option>

                    {hotels.map((hotel) => (
                      <option
                        key={hotel.id}
                        value={hotel.id}
                      >
                        {hotel.name}
                      </option>
                    ))}
                  </select>
                )}

                <input
                  type="text"
                  placeholder="Room number"
                  value={roomForm.room_number}
                  onChange={(event) =>
                    setRoomForm({
                      ...roomForm,
                      room_number: event.target.value,
                    })
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="Room type"
                  value={roomForm.room_type}
                  onChange={(event) =>
                    setRoomForm({
                      ...roomForm,
                      room_type: event.target.value,
                    })
                  }
                  required
                />

                <input
                  type="number"
                  placeholder="Price per night"
                  value={roomForm.price}
                  onChange={(event) =>
                    setRoomForm({
                      ...roomForm,
                      price: event.target.value,
                    })
                  }
                  required
                />

                <button type="submit">
                  {editingRoom
                    ? "Update Room"
                    : "Add Room"}
                </button>

                {editingRoom && (
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => {
                      setEditingRoom(null);

                      setRoomForm({
                        hotel_id: "",
                        room_number: "",
                        room_type: "",
                        price: "",
                      });
                    }}
                  >
                    Cancel Edit
                  </button>
                )}

              </form>
            </div>

            <div className="admin-list">

              <h2>Rooms</h2>

              {rooms.map((room) => {

                const hotel = hotels.find(
                  (hotel) => hotel.id === room.hotel_id
                );

                return (
                  <div
                    className="admin-item"
                    key={room.id}
                  >

                    <div>
                      <h3>
                        Room {room.room_number}
                      </h3>

                      <p>
                        Hotel:{" "}
                        {hotel?.name ||
                          "Unknown"}
                      </p>

                      <p>
                        Type: {room.room_type}
                      </p>

                      <p>
                        Price: ₹{room.price}
                      </p>

                      <p>
                        Status:{" "}
                        {room.is_available
                          ? "Available"
                          : "Unavailable"}
                      </p>
                    </div>

                    <div className="admin-actions">

                      <button
                        onClick={() =>
                          startEditRoom(room)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteRoom(room.id)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>

          </section>
        )}

        {/* ================= BOOKINGS ================= */}

        {activeSection === "bookings" && (
          <section className="admin-section">

            <div className="admin-list">

              <h2>All Bookings</h2>

              {bookings.length === 0 ? (
                <p>No bookings found.</p>
              ) : (
                bookings.map((booking) => (
                  <div
                    className="admin-item"
                    key={booking.id}
                  >

                    <div>

                      <h3>
                        Booking #{booking.id}
                      </h3>

                      <p>
                        User ID: {booking.user_id}
                      </p>

                      <p>
                        Room:{" "}
                        {booking.room?.room_number ||
                          "N/A"}
                      </p>

                      <p>
                        Check-in:{" "}
                        {booking.check_in}
                      </p>

                      <p>
                        Check-out:{" "}
                        {booking.check_out}
                      </p>

                      <p>
                        Status:{" "}
                        <strong>
                          {booking.status}
                        </strong>
                      </p>

                    </div>

                    {booking.status !== "cancelled" && (
                      <div className="admin-actions">

                        <button
                          className="delete-btn"
                          onClick={() =>
                            cancelBooking(
                              booking.id
                            )
                          }
                        >
                          Cancel Booking
                        </button>

                      </div>
                    )}

                  </div>
                ))
              )}

            </div>

          </section>
        )}

        {/* ================= USERS ================= */}

        {activeSection === "users" && (
          <section className="admin-section">

            <div className="admin-list">

              <h2>Registered Users</h2>

              {users.map((user) => (
                <div
                  className="admin-item"
                  key={user.id}
                >

                  <div>

                    <h3>{user.name}</h3>

                    <p>
                      Email: {user.email}
                    </p>

                    <p>
                      Role:{" "}
                      <strong>
                        {user.role}
                      </strong>
                    </p>

                  </div>

                </div>
              ))}

            </div>

          </section>
        )}

      </main>

      <Footer />
    </>
  );
}

export default AdminDashboard;