import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/nlogo.jpg";
import Shivang from "../assets/Shivang.jpeg";
import Sachin from "../assets/Sachin.jpeg";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % doctors.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  const doctors = [
    {
      name: "Dr. Shivang Mishra",
      title: "Doctor of Pharmacy (Pharm.D)",
      role: "Healthcare Consultant",
      image: Shivang,
    },
    {
      name: "Dr. Sachin Kumar",
      title: "Doctor of Pharmacy (Pharm.D)",
      role: "Healthcare Consultant",
      image: Sachin,
    },
    {
      name: "Dr. Anurag Singh",
      title: "Doctor of Pharmacy (Pharm.D)",
      role: "Healthcare Consultant",
      image: "/doctors/anurag.jpg",
    },
  ];

  return (
    <div className="bg-slate-50 text-slate-900 font-sans">
      {/* HERO */}
      <header
        className="text-white py-20 px-6"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="bg-sky-500/20 text-sky-300 px-4 py-1 rounded-full text-sm font-semibold border border-sky-500/30">
              India's First Pharm.D-Led Clinical Network
            </span>

            <h1 className="text-5xl md:text-6xl font-bold mt-6 leading-tight">
              Beyond Supply. <br />
              <span className="text-sky-400">Clinical Partnership.</span>
            </h1>

            <p className="text-slate-300 text-lg mt-6 max-w-lg">
              Stop just buying medicine. Start managing your health with expert
              oversight from Pharm.D professionals. We ensure every dose is
              safe, effective, and tailored to you.
            </p>

            <div className="flex gap-4 mt-10 flex-wrap">
              <a href="#userform"
              className="bg-sky-500 hover:bg-sky-400 px-8 py-4 rounded-xl font-bold text-lg transition">
                Get Your Safety Audit
              </a>
              <a href="#userform"
              className="border border-slate-500 hover:bg-white/10 px-8 py-4 rounded-xl font-bold text-lg transition">
                Meet the Doctor
              </a>
            </div>
          </div>

          {/* DOCTOR CARD */}
          <div className="relative w-full max-w-lg mx-auto overflow-hidden">
            {/* CARD */}
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ x: -120, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 120, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-sky-500/20 blur-3xl rounded-full" />

                  <div className="relative bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-[0_0_20px_rgba(14,165,233,0.2)]">
                    <div className="flex items-center gap-4 mb-6">
                      {/* IMAGE */}
                      <img
                        src={doctors[index].image}
                        alt={doctors[index].name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-sky-500"
                      />

                      <div>
                        <p className="font-bold text-xl">
                          {doctors[index].name}
                        </p>
                        <p className="text-sky-400 text-sm italic">
                          {doctors[index].title}
                        </p>
                        <p className="text-sky-400 text-sm italic">
                          {doctors[index].role}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-slate-900/50 p-4 rounded-lg flex justify-between">
                        <span>Clinical Audits</span>
                        <span className="text-sky-400 font-bold">500+</span>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-lg flex justify-between">
                        <span>Med-Safety Rating</span>
                        <span className="text-sky-400 font-bold">99.9%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* DOT INDICATORS */}
            <div className="flex justify-center gap-2 mt-6 mb-3">
              {doctors.map((_, i) => (
                <motion.span
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-sky-500"
                  animate={{
                    opacity: index === i ? 1 : 0.4,
                    scale: index === i ? 1.3 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-800">
            Why SvasthyaHub is Different
          </h2>
          <p className="text-slate-500 mt-4">
            We solve the risks that standard pharmacies ignore.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "⚠️",
              color: "red",
              text: "Standard pharmacies just deliver a box. They don't check if your medications clash or if they are right for you.",
              solution: "Clinical Safety Audits",
            },
            {
              icon: "💊",
              color: "blue",
              text: "Patients often miss doses or take them incorrectly, leading to slow recovery or complications.",
              solution: "Adherence Coaching",
            },
            {
              icon: "🛡️",
              color: "green",
              text: "Side effects go unreported. Patients suffer in silence without knowing if it's the drug or the disease.",
              solution: "Pharmacovigilance",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-xl transition group"
            >
              <div
                className={`w-14 h-14 bg-${item.color}-100 text-${item.color}-600 rounded-full flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition`}
              >
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">The Problem</h3>
              <p className="text-slate-500 mb-6">{item.text}</p>
              <div className="pt-6 border-t border-slate-100 text-sky-600 font-semibold">
                Our Solution: {item.solution}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/*User Form */}
      <div
        id="userform"
        className="flex justify-center items-center p-4  bg-gradient-to-br from-blue-50 to-blue-100 mb-2"
      >
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          {/* USER FORM */}
          {selectedRole === "user" && (
            <>
              <h1 className="text-2xl font-bold mb-4 text-center">
                {isLogin
                  ? "User Can Login Here 👇"
                  : "User Can Register Here 👇"}
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

                <button
                  disabled={loading}
                  className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Logging in..." : isLogin ? "Login" : "Register"}
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

      {/* CTA */}
      <section className="bg-sky-600 py-16 px-6 text-center text-white">
        <h2 className="text-4xl font-bold mb-6">
          Ready for a safer healthcare journey?
        </h2>
        <p className="text-sky-100 text-xl mb-10 max-w-2xl mx-auto">
          Upload your prescription for a complimentary Clinical Safety Audit by
          our Pharm.D team.
        </p>
        <a
          href="#userform"
          className="inline-block bg-white text-sky-600 px-10 py-4 rounded-full font-bold text-xl hover:bg-slate-100 transition shadow-lg"
        >
          Upload Prescription
        </a>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-slate-500 text-sm">
        © 2025 SvasthyaHub. Founded by Dr. Ankit Rana.
      </footer>
    </div>
  );
};

export default Login;
