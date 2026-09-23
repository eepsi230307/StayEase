import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import MyBookings from "./MyBookings";
import Hotels from "./pages/Hotels";
import HotelDetails from "./pages/HotelDetails";
import BookingConfirmation from "./pages/BookingConfirmation";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/hotels/:hotelId" element={<HotelDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>}/>
        <Route path="/profile" element={<ProtectedRoute><Profile /> </ProtectedRoute>}/>
        <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /> </ProtectedRoute>}/>
        <Route path="/booking/:roomId" element={<ProtectedRoute><Booking /> </ProtectedRoute>}/>
        <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>}/>
        <Route path="/booking-confirmation" element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>}/>
        
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);