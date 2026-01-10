import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/nlogo.jpg";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const navigate = useNavigate();
  const { loginAdmin } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/login`,
        { email, password }
      );

      loginAdmin(res.data.token); // ✅ React state updated

      navigate("/admin/dashboard", { replace: true });
    } catch {
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-[#2b3c64]">
      <div style={{ backgroundImage: `url(${logo})`}} className=" bg-center rounded-3xl shadow-xl shadow-blue-400 ">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-2xl shadow-md w-96 opacity-95"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

          <input
            type="email"
            className="border w-full p-2 mb-4 rounded"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* ✅ PASSWORD + EYE WRAPPER */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "password" : "text"}
              className="w-full p-2 pr-10 border rounded"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white w-full py-2 rounded disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
