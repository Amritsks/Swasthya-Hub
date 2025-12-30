import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
// import Layout from "./layout/Layout";
import Dashboard from "./screens/Dashboard";
import Suraksha from "./screens/Suraksha";
import Aushadhi from "./screens/Aushadhi";
import Raksha from "./screens/Raksha";
import Profile from "./screens/Profile";
import Doctor from "./screens/Doctor";
import Labtest from "./screens/Lab";
import Healthassist from "./screens/AI";
import Login from "./screens/Login";
import PharmacyAdmin from "./screens/PharmacyAdmin";
import PharmacistLogin from "./screens/PharmacistLogin";
import { useAuth } from "./context/AuthContext";

// ✅ New imports for Admin Panel
import AdminLogin from "./screens/AdminLogin";
import AdminDashboard from "./screens/AdminDashboard";

const App = () => {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  // ✅ Simple helper to check if admin token exists
  const isAdmin = !!localStorage.getItem("adminToken");

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        {/* Show Navbar only for logged-in users, not admin */}
        {isLoggedIn && <Navbar />}

        <Routes>
          {/* ---------- USER ROUTES ---------- */}
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/suraksha"
            element={isLoggedIn ? <Suraksha /> : <Navigate to="/login" />}
          />
          <Route
            path="/raksha"
            element={isLoggedIn ? <Raksha /> : <Navigate to="/login" />}
          />
          <Route
            path="/aushadhi"
            element={isLoggedIn ? <Aushadhi /> : <Navigate to="/login" />}
          />
          <Route
            path="/doctor"
            element={isLoggedIn ? <Doctor /> : <Navigate to="/login" />}
          />
          <Route
            path="/labtest"
            element={isLoggedIn ? <Labtest /> : <Navigate to="/login" />}
          />
          <Route
            path="/healthassist"
            element={isLoggedIn ? <Healthassist /> : <Navigate to="/login" />}
          />

          {/* ---------- PHARMACY ROUTES ---------- */}
          <Route path="/pharmacy-admin" element={<PharmacyAdmin />} />
          <Route path="/pharmacist-login" element={<PharmacistLogin />} />

          {/* ---------- ADMIN PANEL ROUTES ---------- */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={isAdmin ? <AdminDashboard /> : <Navigate to="/admin/login" />}
          />

          {/* ---------- FALLBACK ---------- */}
          <Route
            path="*"
            element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
