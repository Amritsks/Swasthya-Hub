import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, pharmacist, admin, logout } = useAuth();
  const menuRef = useRef(null);

  const isAdmin = !!localStorage.getItem("adminToken");
  const isPharmacist = !!localStorage.getItem("pharmacistToken");

  const handleLogout = () => {
    logout?.();
    navigate("/", { replace: true });
  };

  // Close menu when clicking outside (mobile only)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  /* ---------------- LINKS ---------------- */
 const guestLinks = (
  <div className="flex flex-col gap-3">
    <Link to="/" className="hover:text-teal-700">
      Dashboard
    </Link>

    <div className="border-t pt-2">
      <p className="text-sm font-semibold text-gray-600 mb-1">Login as:</p>

      <div className="flex flex-col gap-1 pl-2">
        <Link
          to="/login"
          className="block text-sm hover:text-teal-700"
        >
          User
        </Link>

        <Link
          to="/admin/login"
          className="block text-sm hover:text-teal-700"
        >
          Admin
        </Link>

        <Link
          to="/pharmacist-login"
          className="block text-sm hover:text-teal-700"
        >
          Pharmacist
        </Link>
      </div>
    </div>
  </div>
);


  const userLinks = (
  <div className="flex flex-col gap-2">
    <Link to="/userdashboard" className="block py-2 hover:text-teal-700">
      Dashboard
    </Link>

    <Link to="/profile" className="block py-2 hover:text-teal-700">
      Profile
    </Link>

    <Link to="/aushadhi" className="block py-2 hover:text-teal-700">
      Aushadhi
    </Link>

    <Link to="/suraksha" className="block py-2 hover:text-teal-700">
      Suraksha
    </Link>

    <Link to="/raksha" className="block py-2 hover:text-teal-700">
      Raksha
    </Link>

    <button
      onClick={handleLogout}
      className="block py-2 text-left hover:text-red-600"
    >
      Logout
    </button>
  </div>
);


  const pharmacistLinks = (
  <div className="flex flex-col gap-2">
    {/* {pharmacist && (
      <Link
        to="/pharmacy-admin"
        className="block py-2 hover:text-teal-700"
      >
        Pharmacy Dashboard
      </Link>
    )} */}

    <button
      onClick={handleLogout}
      className="block py-2 text-left hover:text-red-600"
    >
      Logout
    </button>
  </div>
);


  const adminLinks = (
    <>
      {/* <Link to="/admin/dashboard">Admin Dashboard</Link> */}
      <button onClick={handleLogout}>Logout</button>
    </>
  );

  return (
    <nav className="h-16 bg-white p-4 shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* LOGO (always visible) */}
        <Link to="/" className="text-xl font-bold">
          SvasthyaHub
        </Link>

        {/* MENU ICON — MOBILE ONLY */}
        <div ref={menuRef} className={`relative ${user ? "md:hidden" : ""}`}>
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>

          {/* DROPDOWN */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg p-4 z-50">
              {!user && !isAdmin && !isPharmacist && guestLinks}
              {user && userLinks}
              {isPharmacist && pharmacistLinks}
              {isAdmin && adminLinks}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
