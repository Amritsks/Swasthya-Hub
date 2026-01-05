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

  const [partnerOpen, setPartnerOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-slate-800 antialiased scroll-smooth">
      {/* HERO */}
      <header className="pt-32 pb-20 border-b border-blue-100 bg-[radial-gradient(#bae6fd_1px,transparent_1px)] bg-[size:32px_32px] bg-[#f0f9ff]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
              🚀 Incubated at NIMS University
            </span>

            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
              India’s First <span className="text-blue-600">PharmD-Led</span>
              <br />
              Clinical Pharmacy Network.
            </h1>

            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Transforming local medical stores into trusted centers for
              <strong> Affordable Quality Medicines</strong> & expert guidance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setPartnerOpen(true)}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition"
              >
                Become a Partner
              </button>
              <button
                onClick={() => setDownloadOpen(true)}
                className="bg-white border border-slate-300 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition"
              >
                Download App
              </button>
            </div>
          </div>

          {/* MOCK CARD */}
          <div className="relative">
            <div className="absolute inset-0 bg-blue-600 rounded-3xl rotate-3 opacity-10" />
            <div className="relative bg-white p-8 rounded-3xl shadow-2xl border">
              <div className="flex items-center gap-4 mb-6 border-b pb-6">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  ✅
                </div>
                <div>
                  <h3 className="font-bold text-lg">PharmD Verified Safe</h3>
                  <p className="text-sm text-slate-500">
                    Interaction Check Passed
                  </p>
                </div>
              </div>

              <Medicine
                name="SvasthyaHub Metformin 500"
                mrp="₹45"
                price="₹18.00"
              />
              <Medicine
                name="SvasthyaHub Telmisartan 40"
                mrp="₹55"
                price="₹22.00"
              />

              <div className="mt-6 text-center">
                <span className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1 rounded-full">
                  ❤️ 500+ Hero Points Earned
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section id="features" className="py-10 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Why SvasthyaHub?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-16">
            Clinical expertise meets supply-chain efficiency.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Feature
              title="Clinical Safety First"
              desc="Every prescription is checked for interactions."
            />
            <Feature
              title="Affordable Quality"
              desc="WHO-GMP medicines at 60% lower cost."
            />
            <Feature
              title="Community Loyalty"
              desc="Blood donor network with real rewards."
            />
          </div>
        </div>
      </section>

      {/*Pharmacist Form*/}
      <div className="max-w-md mx-auto m-2  p-6 border rounded shadow ">
        <h2 className="flex justify-center text-xl mb-4 font-semibold">
          Pharmacist Can Login Here 👇
        </h2>

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

      {/* Pharmacist Vision */}
      <section className="w-full max-w-4xl mx-auto m-10">
    <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition">

      {/* Accent Line */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500" />

      <div className="p-8 sm:p-10">

        {/* Heading */}
        <h2 className="text-xl  font-extrabold text-slate-900 mb-4">
          <u>Founder's Vision</u>
        </h2>
        <h2 className="text-2xl sm:text-3xl  text-slate-900 mb-4">
          Lead the Future of Pharmacy
        </h2>

        {/* Divider */}
        <div className="w-16 h-1 bg-indigo-600 rounded-full mb-6" />

        {/* Content */}
        <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
          Don’t just survive the competition—<span className="font-semibold text-slate-800">lead it</span>.
          SvasthyaHub is empowering forward-thinking pharmacists to become the most trusted
          clinical authority in their communities.
        </p>

        <p className="text-slate-600 leading-relaxed text-base sm:text-lg mt-4">
          With our
          <span className="font-semibold text-indigo-600"> Pharm.D-led clinical technology</span> and
          <span className="font-semibold text-green-600"> high-margin supply chain</span>,
          we give you the power to protect patients, elevate your professional role,
          and grow your business with confidence.
        </p>

        <p className="text-slate-700 font-semibold text-lg mt-6 mb-4">
          Save lives. Build trust. Grow stronger.
          <span className="text-indigo-600"> Join the revolution.</span>
        </p>
      <h2 className="font-semibold  text-slate-900">
          <u>Dr. Ankit Rana</u>
        </h2>
      <h2 className="font-semibold text-slate-900">
          <u>Doctor of Pharmacy</u>
        </h2>
        
      </div>
    </div>
  </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-white">SvasthyaHub</h3>
            <p className="mt-4 text-sm max-w-xs">
              India’s safest and most affordable pharmacy network.
            </p>
          </div>
          <FooterCol
            title="Company"
            items={["About Us", "Careers", "Contact"]}
          />
          <FooterCol title="Legal" items={["Privacy Policy", "Terms of Use"]} />
        </div>

        <div className="text-center text-xs mt-12 border-t border-slate-800 pt-6">
          © 2025 SvasthyaHub. All rights reserved.
        </div>
      </footer>

      {/* {partnerOpen && (
        <Modal title="Partner Login" onClose={() => setPartnerOpen(false)}>
          <a
            href=""
            className="block w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-center"
          >
            Continue to Dashboard
          </a>
        </Modal>
      )}

      {downloadOpen && (
        <Modal title="Get the App" onClose={() => setDownloadOpen(false)}>
          <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold">
            Download APK
          </button>
        </Modal>
      )} */}
    </div>
  );
};

/* ---------- COMPONENTS ---------- */

const Medicine = ({ name, mrp, price }) => (
  <div className="flex justify-between bg-slate-50 p-4 rounded-xl mb-3">
    <div>
      <p className="text-xs text-slate-500 uppercase font-bold">Medicine</p>
      <p className="font-bold">{name}</p>
    </div>
    <div className="text-right">
      <p className="text-xs line-through">{mrp}</p>
      <p className="font-bold text-green-600">{price}</p>
    </div>
  </div>
);

const Feature = ({ title, desc }) => (
  <div className="bg-white p-8 rounded-2xl border hover:shadow-xl transition">
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-slate-600">{desc}</p>
  </div>
);

const FooterCol = ({ title, items }) => (
  <div>
    <h4 className="text-white font-bold mb-4">{title}</h4>
    <ul className="space-y-2 text-sm">
      {items.map((i) => (
        <li key={i} className="hover:text-white cursor-pointer">
          {i}
        </li>
      ))}
    </ul>
  </div>
);

// const Modal = ({ title, children, onClose }) => (
//   <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
//     <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-xl font-bold">{title}</h3>
//         <button onClick={onClose}>✕</button>
//       </div>
//       {children}
//     </div>
//   </div>
// );

export default PharmacistLogin;
