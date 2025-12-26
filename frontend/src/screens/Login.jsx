import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/nlogo.jpg";
import { useAuth } from "../context/AuthContext"; // import context hook

const Login = () => {
  const { login } = useAuth(); // get login method from context
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
  const [selectedRole, setSelectedRole] = useState("user"); // 👈 role state added

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email && !form.phone && !form.password) {
      alert("Please provide email or phone and password!");
      return;
    }

    if (!isLogin && (!form.name || !form.bloodGroup || !form.age)) {
      alert("Please fill all required fields!");
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
        // log the user in globally using AuthContext
        login(res.data.user, res.data.token);
        navigate("/dashboard");
      } else {
        alert("Registration successful! Please log in now.");
        setIsLogin(true);
      }
    } catch (err) {
      console.error("Axios error:", err);
      alert(err.response?.data?.error || "Login/Register failed!");
    }
  };

  // Role button click handler
  const handleRoleSelect = (role) => {
    setSelectedRole(role);

    if (role === "pharmacist") navigate("/pharmacist-login");
    if (role === "admin") navigate("/admin/login");
    // user role stays on same page
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={logo}
            alt="Logo"
            className="w-20 h-20 object-contain rounded-full"
          />
        </div>

        {/* Role Selection Buttons */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={() => handleRoleSelect("user")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              selectedRole === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-blue-100"
            }`}
          >
            👤 User
          </button>
          <button
            onClick={() => handleRoleSelect("pharmacist")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              selectedRole === "pharmacist"
                ? "bg-green-600 text-white"
                : "bg-gray-100 hover:bg-green-100"
            }`}
          >
            💊 Pharmacist
          </button>
          <button
            onClick={() => handleRoleSelect("admin")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              selectedRole === "admin"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 hover:bg-purple-100"
            }`}
          >
            🧑‍💼 Admin
          </button>
        </div>

        {/* Only show user login/register form */}
        {selectedRole === "user" && (
          <>
            <h1 className="text-2xl font-bold mb-4 text-center">
              {isLogin ? "User Login" : "User Registration"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                  <input
                    type="text"
                    name="bloodGroup"
                    placeholder="Blood Group"
                    value={form.bloodGroup}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                  <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={form.age}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                </>
              )}

              <input
                type="email"
                name="email"
                placeholder="Email (optional if using phone)"
                value={form.email}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                name="phone"
                placeholder="Phone (optional if using email)"
                value={form.phone}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
              >
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
