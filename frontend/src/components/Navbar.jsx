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

  // Common links based on role
  const guestLinks = (
    <Link to="/login" className="font-semibold block py-2">
      Login
    </Link>
  );

  const userLinks = (
    <>
      <Link to="/userdashboard" className="block py-2">
        Dashboard
      </Link>
      <Link to="/profile" className="block py-2">
        Profile
      </Link>
      <Link to="/aushadhi" className="block py-2">
        Aushadhi
      </Link>
      <Link to="/suraksha" className="block py-2">
        Suraksha
      </Link>
      <Link to="/raksha" className="block py-2">
        Raksha
      </Link>
      <button onClick={handleLogout} className="block py-2 text-left">
        Logout
      </button>
    </>
  );

  const pharmacistLinks = (
    <>
      <Link to="/pharmacy-admin" className="block py-2">
        Pharmacy Dashboard
      </Link>
      <button onClick={handleLogout} className="block py-2 text-left">
        Logout
      </button>
    </>
  );

  const adminLinks = (
    <>
      <Link to="/admin/dashboard" className="block py-2">
        Admin Dashboard
      </Link>
      <button onClick={handleLogout} className="block py-2 text-left">
        Logout
      </button>
    </>
  );

  return (
    <nav className="bg-teal-200 p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Svasthya Hub
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          {!user && !isAdmin && !isPharmacist && guestLinks}
          {user && userLinks}
          {isPharmacist && pharmacistLinks}
          {isAdmin && adminLinks}
        </div>

        {/* Mobile Toggle Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 px-4 bg-teal-100 rounded shadow-lg">
          {!user && !isAdmin && !isPharmacist && guestLinks}
          {user && userLinks}
          {isPharmacist && pharmacistLinks}
          {isAdmin && adminLinks}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
