import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

const PharmacistLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const navigate = useNavigate();
  const { loginPharmacist } = useAuth();

  const handleLogin = async (e) => {
     e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/pharmacist-auth/login`,
        { email, password }
      );

      loginPharmacist(res.data.token); // ✅ updates React state

      navigate("/pharmacy-admin", { replace: true });
    } catch {
      setError("Invalid credentials");
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
  <h2 className="text-xl mb-4 font-semibold">Pharmacist Login</h2>

  <input
    type="email"
    className="w-full p-2 mb-3 border rounded"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />

  {/* 🔐 Password Field */}
  <div className="relative mb-3">
    <input
      type={showPassword ? "password" : "text"}
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full p-2 pr-10 border rounded"
    />

    <button
      type="button"
      onClick={() => setShowPassword((p) => !p)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>

  <button
    onClick={handleLogin}
    disabled={loading}
    className="w-full bg-teal-600 text-white py-2 rounded disabled:opacity-50"
  >
    {loading ? "Logging in..." : "Login"}
  </button>

  {error && <p className="text-red-600 mt-2">{error}</p>}
</div>

  );
};

export default PharmacistLogin;
