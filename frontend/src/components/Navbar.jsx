import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isAdmin = !!localStorage.getItem("adminToken");
  const isPharmacist = !!localStorage.getItem("pharmacistToken");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("pharmacistToken");
    logout?.();
    navigate("/");
  };

  return (
    <nav className="bg-teal-200 p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Svasthya Hub
        </Link>

        <div className="hidden md:flex gap-6 items-center">
          {/* 👤 GUEST */}
          {!user && !isAdmin && !isPharmacist && (
            <Link to="/login" className="font-semibold">
              Login
            </Link>
          )}

          {/* 👨‍⚕️ USER */}
          {user && (
            <>
              <Link to="/userdashboard">Dashboard</Link>
              <Link to="/profile">Profile</Link>
              <Link to="/aushadhi">Aushadhi</Link>
              <Link to="/suraksha">Suraksha</Link>
              <Link to="/raksha">Raksha</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}

          {/* 🧪 PHARMACIST */}
          {isPharmacist && (
            <>
              <Link to="/pharmacy-admin">Pharmacy Dashboard</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}

          {/* 🛡 ADMIN */}
          {isAdmin && (
            <>
              <Link to="/admin/dashboard">Admin Dashboard</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
