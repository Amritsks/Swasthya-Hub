import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Dashboard from "./screens/Dashboard";
import UserDashboard from "./screens/UserDashboard";
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
import AdminLogin from "./screens/AdminLogin";
import AdminDashboard from "./screens/AdminDashboard";

import { useAuth } from "./context/AuthContext";

const App = () => {
  const { user } = useAuth();

  const isLoggedIn = !!user;
  const isAdmin = !!localStorage.getItem("adminToken");
  const isPharmacist = !!localStorage.getItem("pharmacistToken");

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        {/* ✅ Navbar ALWAYS visible */}
        <Navbar />

        <Routes>
          {/* ---------- PUBLIC ---------- */}
          <Route
  path="/"
  element={
    isAdmin ? (
      <Navigate to="/admin/dashboard" />
    ) : isPharmacist ? (
      <Navigate to="/pharmacy-admin" />
    ) : isLoggedIn ? (
      <Navigate to="/userdashboard" />
    ) : (
      <Dashboard />
    )
  }
/>


          <Route path="/login" element={<Login />} />

          {/* ---------- USER ---------- */}
          <Route
  path="/userdashboard"
  element={isLoggedIn ? <UserDashboard /> : <Navigate to="/login" />}
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

          {/* ---------- PHARMACIST ---------- */}
          <Route path="/pharmacist-login" element={<PharmacistLogin />} />
          <Route
            path="/pharmacy-admin"
            element={
              isPharmacist ? (
                <PharmacyAdmin />
              ) : (
                <Navigate to="/pharmacist-login" />
              )
            }
          />

          {/* ---------- ADMIN ---------- */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              isAdmin ? <AdminDashboard /> : <Navigate to="/admin/login" />
            }
          />

          {/* ---------- FALLBACK ---------- */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
