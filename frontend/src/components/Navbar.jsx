import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, pharmacist, admin, logout } = useAuth();
 const [isDesktop, setIsDesktop] = useState(false);
 const menuRef = useRef(null);


  const isAdmin = !!localStorage.getItem("adminToken");
  const isPharmacist = !!localStorage.getItem("pharmacistToken");

  const handleLogout = () => {
    logout?.();

    navigate("/", { replace: true }); // 🔥 IMPORTANT
  };

  // useEffect(() => {
  //   const checkScreen = () => {
  //     setIsDesktop(window.innerWidth >= 768); // md breakpoint
  //   };

  //   checkScreen();
  //   window.addEventListener("resize", checkScreen);
  //   return () => window.removeEventListener("resize", checkScreen);
  // }, []);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  if (isOpen) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [isOpen]);


  // Common links based on role
const guestLinks = (
  <div className="flex flex-col gap-3">
    <Link to="/" className="hover:text-teal-700">
      Dashboard
    </Link>

    <div className="border-t pt-2">
      <p className="text-sm font-semibold text-gray-600 mb-1">
        Login as:
      </p>

      <div className="flex flex-col gap-1 pl-2">
        <Link
          to="/login"
          className="text-sm hover:text-teal-700"
        >
          User
        </Link>

        <Link
          to="/admin/login"
          className="text-sm hover:text-teal-700"
        >
          Admin
        </Link>

        <Link
          to="/pharmacist-login"
          className="text-sm hover:text-teal-700"
        >
          Pharmacist
        </Link>
      </div>
    </div>
  </div>
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
      {pharmacist && <Link to="/pharmacy-admin">Pharmacy Dashboard</Link>}

      <button onClick={handleLogout} className="block py-2 text-left">
        Logout
      </button>
    </>
  );

  const adminLinks = (
    <>
      {admin && <Link to="/admin/dashboard">Admin Dashboard</Link>}
      <button onClick={handleLogout} className="block py-2 text-left">
        Logout
      </button>
    </>
  );

  return (
    <nav className="bg-indigo-100 p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          SvasthyaHub
        </Link>

        {/* Menu Icon */}
        <div
  ref={menuRef}
  className="relative"
  onMouseEnter={isDesktop ? () => setIsOpen(true) : undefined}
  onMouseLeave={isDesktop ? () => setIsOpen(false) : undefined}
>

          <button onClick={!isDesktop ? () => setIsOpen(!isOpen) : undefined}>
            {isOpen ? <X /> : <Menu />}
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-teal-100 rounded shadow-lg p-4 z-50">
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
