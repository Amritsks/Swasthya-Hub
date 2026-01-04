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
  const { user, role } = useAuth(); // ✅ single source of truth

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        {/* Navbar always visible */}
        <Navbar />

        <Routes>
          {/* ---------- HOME ---------- */}
          <Route
            path="/"
            element={
              role === "admin" ? (
                <Navigate to="/admin/dashboard" replace />
              ) : role === "pharmacist" ? (
                <Navigate to="/pharmacy-admin" replace />
              ) : role === "user" ? (
                <Navigate to="/userdashboard" replace />
              ) : (
                <Dashboard />
              )
            }
          />

          {/* ---------- PUBLIC ---------- */}
          <Route
            path="/login"
            element={role === "guest" ? <Login /> : <Navigate to="/" replace />}
          />

          {/* ---------- USER ---------- */}
          <Route
            path="/userdashboard"
            element={role === "user" ? <UserDashboard /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/profile"
            element={role === "user" ? <Profile /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/suraksha"
            element={role === "user" ? <Suraksha /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/raksha"
            element={role === "user" ? <Raksha /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/aushadhi"
            element={role === "user" ? <Aushadhi /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/doctor"
            element={role === "user" ? <Doctor /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/labtest"
            element={role === "user" ? <Labtest /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/healthassist"
            element={role === "user" ? <Healthassist /> : <Navigate to="/login" replace />}
          />

          {/* ---------- PHARMACIST ---------- */}
          <Route
            path="/pharmacist-login"
            element={role === "guest" ? <PharmacistLogin /> : <Navigate to="/" replace />}
          />
          <Route
            path="/pharmacy-admin"
            element={role === "pharmacist" ? <PharmacyAdmin /> : <Navigate to="/pharmacist-login" replace />}
          />

          {/* ---------- ADMIN ---------- */}
          <Route
            path="/admin/login"
            element={role === "guest" ? <AdminLogin /> : <Navigate to="/" replace />}
          />
          <Route
            path="/admin/dashboard"
            element={role === "admin" ? <AdminDashboard /> : <Navigate to="/admin/login" replace />}
          />

          {/* ---------- FALLBACK ---------- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
