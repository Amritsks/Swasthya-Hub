import React, { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Auth = () => {
  const [mode, setMode] = useState("login"); // 'login' or 'register'
  const [form, setForm] = useState({
    email: "",
    phone: "",
    password: "",
    name: "",
    bloodGroup: "",
    age: "",
  });
  const { login } = useAuth();

  const submit = async () => {
    try {
      // validation
      if ((!form.email && !form.phone) || !form.password) {
        alert("Please provide either Email or Phone and Password!");
        return;
      }

      if (
        mode === "register" &&
        (!form.name || !form.bloodGroup || !form.age)
      ) {
        alert("Please fill all required registration fields!");
        return;
      }

      // ✅ Payload banate waqt sirf filled fields bhejo
      let payload = { password: form.password };

      if (form.email) payload.email = form.email;
      if (form.phone) payload.phone = form.phone;

      if (mode === "register") {
        payload.name = form.name;
        payload.bloodGroup = form.bloodGroup;
        payload.age = form.age;
      }

      const { data } = await api.post(
        mode === "login" ? "/auth/login" : "/auth/register",
        payload
      );

      login(data.user, data.token);

      if (mode === "register") {
        alert("Registration successful! You are now logged in.");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Error");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {mode === "login" ? "Login" : "Register"}
      </h2>

      {/* Email & Phone (optional, but at least one required) */}
        <input
        placeholder="Email (optional if using phone)"
        onChange={e => setForm({ ...form, email: e.target.value })}
        className="w-full p-2 border mb-2"
      />
      <input
        placeholder="Phone (optional if using email)"
        onChange={e => setForm({ ...form, phone: e.target.value })}
        className="w-full p-2 border mb-2"
/>

      {/* Password */}
      <input
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="w-full p-2 border mb-2 rounded"
      />

      {/* Extra fields for registration */}
      {mode === "register" && (
        <>
          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-2 border mb-2 rounded"
          />
          <input
            placeholder="Blood Group"
            value={form.bloodGroup}
            onChange={(e) =>
              setForm({ ...form, bloodGroup: e.target.value })
            }
            className="w-full p-2 border mb-2 rounded"
          />
          <input
            placeholder="Age"
            type="number"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            className="w-full p-2 border mb-2 rounded"
          />
        </>
      )}

      {/* Submit button */}
      <button
        onClick={submit}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {mode === "login" ? "Login" : "Register"}
      </button>

      {/* Switch mode */}
      <div className="mt-3 text-center">
        <button
          onClick={() =>
            setMode(mode === "login" ? "register" : "login")
          }
          className="text-sm text-blue-600 underline"
        >
          {mode === "login"
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
