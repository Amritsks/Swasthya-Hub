import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PharmacistLogin = () => {
  const [email, setEmail] = useState(""); // ✅ email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/pharmacist-auth/login`,
        { email, password } // ✅ send email
      );

      // clear other auth (optional but fine)
      localStorage.removeItem("user");
      localStorage.removeItem("userToken");

      // save pharmacist token
      localStorage.setItem("pharmacistToken", res.data.token);
      setTimeout(() => {
        navigate("/pharmacy-admin", { replace: true });
      }, 0);
    } catch (err) {
      setError("Login failed. Check email or password.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h2 className="text-xl mb-4 font-semibold">Pharmacist Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />

      <button
        onClick={handleLogin}
        className="w-full bg-teal-600 text-white py-2 rounded"
      >
        Login
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default PharmacistLogin;
