import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/nlogo.jpg";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const { loginUser } = useAuth(); // ✅ NEW CONTEXT METHOD
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    bloodGroup: "",
    age: "",
  });

  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState("user");
  const [showPassword, setShowPassword] = useState(true); // 👁️ FIXED

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.password || (!form.email && !form.phone)) {
      alert("Please provide email/phone and password");
      return;
    }

    if (!isLogin && (!form.name || !form.bloodGroup || !form.age)) {
      alert("Please fill all required fields");
      return;
    }

    const payload = isLogin
      ? {
          email: form.email || null,
          phone: form.phone || null,
          password: form.password,
        }
      : {
          name: form.name,
          email: form.email || null,
          phone: form.phone || null,
          password: form.password,
          bloodGroup: form.bloodGroup,
          age: form.age,
        };

    const url = isLogin
      ? `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`
      : `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`;

    try {
      const res = await axios.post(url, payload);

      if (isLogin) {
        // ✅ CORRECT METHOD
        loginUser(res.data.user, res.data.token);

        // ✅ CORRECT REDIRECT
        navigate("/userdashboard", { replace: true });
      } else {
        alert("Registration successful! Please log in.");
        setIsLogin(true);
      }
    } catch (err) {
      console.error("Axios error:", err);
      alert(err.response?.data?.error || "Login/Register failed");
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role === "pharmacist") navigate("/pharmacist-login");
    if (role === "admin") navigate("/admin/login");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="w-20 h-20 rounded-full" />
        </div>

        {/* ROLE BUTTONS */}
        <div className="flex justify-center gap-3 mb-6">
          {["user", "pharmacist", "admin"].map((role) => (
            <button
              key={role}
              onClick={() => handleRoleSelect(role)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                selectedRole === role
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-blue-100"
              }`}
            >
              {role === "user" && "👤 User"}
              {role === "pharmacist" && "💊 Pharmacist"}
              {role === "admin" && "🧑‍💼 Admin"}
            </button>
          ))}
        </div>

        {/* USER FORM */}
        {selectedRole === "user" && (
          <>
            <h1 className="text-2xl font-bold mb-4 text-center">
              {isLogin ? "User Login" : "User Registration"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <input
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                  <input
                    name="bloodGroup"
                    placeholder="Blood Group"
                    value={form.bloodGroup}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                  <input
                    name="age"
                    type="number"
                    placeholder="Age"
                    value={form.age}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                </>
              )}

              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <input
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              {/* PASSWORD WITH EYE */}
              <div className="relative">
                <input
                  type={showPassword ? "password" : "text"}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border p-2 rounded pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                {isLogin ? "Login" : "Register"}
              </button>
            </form>

            <p
              className="text-sm text-center mt-4 text-blue-600 cursor-pointer"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? "Don't have an account? Register"
                : "Already have an account? Login"}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
