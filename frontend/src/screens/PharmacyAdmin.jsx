import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Icon = ({ children, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

const Icons = {
  Home: () => (
    <Icon className="w-5 h-5">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </Icon>
  ),
  Search: () => (
    <Icon className="w-5 h-5">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </Icon>
  ),
  Box: () => (
    <Icon className="w-5 h-5">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4" />
    </Icon>
  ),
  POS: () => (
    <Icon className="w-5 h-5">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </Icon>
  ),

  Users: () => (
    <Icon className="w-5 h-5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Icon>
  ),
};

const PharmacyAdmin = () => {
  const navigate = useNavigate();

  /* ================= AUTH ================= */
  const getHeaders = () => {
    const token = localStorage.getItem("pharmacistToken");
    if (!token) {
      navigate("/pharmacist-login");
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  };

  /* ================= STATE ================= */
  const [activeTab, setActiveTab] = useState("prescriptions");
  const [prescriptions, setPrescriptions] = useState([]);
  const [pharmacistName, setPharmacistName] = useState("");
  const [toast, setToast] = useState(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [allPresent, setAllPresent] = useState(true);
  const [manualMedicines, setManualMedicines] = useState([""]);

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchPharmacistInfo();
    fetchPrescriptions();
    // eslint-disable-next-line
  }, []);

  const fetchPharmacistInfo = async () => {
    const headers = getHeaders();
    if (!headers) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/pharmacist/me`,
        { headers }
      );
      setPharmacistName(res.data.name);
    } catch {
      navigate("/pharmacist-login");
    }
  };

  const fetchPrescriptions = async () => {
    const headers = getHeaders();
    if (!headers) return;
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/prescriptions/all`,
      { headers }
    );
    setPrescriptions(res.data);
  };

  /* ================= ACTIONS ================= */
  const openConfirmModal = (p) => {
    setSelectedPrescription(p);
    setShowConfirmModal(true);
    setAllPresent(true);
    setManualMedicines([""]);
  };

  const handleConfirmMedicines = async () => {
    const headers = getHeaders();
    if (!headers) return;

    await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/prescriptions/${
        selectedPrescription._id
      }/confirm`,
      {
        allPresent,
        medicines: allPresent ? [] : manualMedicines.filter(Boolean),
      },
      { headers }
    );

    setPrescriptions((prev) =>
      prev.map((p) =>
        p._id === selectedPrescription._id ? { ...p, status: "confirmed" } : p
      )
    );

    setShowConfirmModal(false);
    showToast("Prescription Confirmed");
  };

  const handleReject = async (id) => {
    const headers = getHeaders();
    if (!headers) return;

    await axios.put(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/pharmacist/prescriptions/${id}/reject`,
      {},
      { headers }
    );

    setPrescriptions((prev) =>
      prev.map((p) => (p._id === id ? { ...p, status: "rejected" } : p))
    );

    showToast("Prescription Rejected");
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 bg-white border-r fixed inset-y-0 flex-col mt-16">
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link to="/pharmacy-admin" className="sidebar-link active">
            <Icons.Home /> Prescriptions
          </Link>

          <Link to="/pharmacy-admin" className="sidebar-link">
            <Icons.Search /> Online Orders
          </Link>

          <Link to="/pharmacy-admin" className="sidebar-link">
            <Icons.POS /> New Sales
          </Link>

          <Link to="/pharmacy-admin" className="sidebar-link">
            <Icons.Box /> Wholesale Store
          </Link>

          <Link to="/pharmacy-admin" className="sidebar-link">
            <Icons.Users /> Referrals
          </Link>
        </nav>

      </div>

      {/* Main */}
      <div className="flex-1 ml-0 md:ml-64 pt-4">
        <div className="flex justify-center">
          <div className="h-16 w-72 bg-gray-200 border-b flex items-center justify-center rounded-md shadow-xl shadow-green-700 font-bold">
            Welcome, {pharmacistName}
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {prescriptions.map((p) => (
            <div
              key={p._id}
              className="bg-gray-200 shadow-xl shadow-green-700 p-4 rounded"
            >
              <p className="text-xs text-gray-500">
                {p.type === "manual"
                  ? "Manual Request"
                  : "Uploaded Prescription"}
              </p>

              {p.type === "upload" && p.filename && (
                <a
                  href={`${
                    import.meta.env.VITE_BACKEND_URL
                  }/api/prescriptions/image/${p.filename}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 text-sm underline block mt-2"
                >
                  View Prescription
                </a>
              )}

              <p className="text-sm mt-2">
                <b>User:</b> {p.userEmail}
              </p>

              <p className="text-sm">
                <b>Status:</b>{" "}
                <span
                  className={
                    p.status === "confirmed"
                      ? "text-green-600"
                      : p.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }
                >
                  {p.status || "pending"}
                </span>
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => openConfirmModal(p)}
                  disabled={p.status === "confirmed"}
                  className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(p._id)}
                  disabled={p.status === "rejected"}
                  className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-80">
            <h2 className="font-bold mb-2">Confirm Medicines</h2>

            <label>
              <input
                type="radio"
                checked={allPresent}
                onChange={() => setAllPresent(true)}
              />{" "}
              All present
            </label>

            <label className="block mt-2">
              <input
                type="radio"
                checked={!allPresent}
                onChange={() => setAllPresent(false)}
              />{" "}
              Not all present
            </label>

            {!allPresent && (
              <div className="mt-2">
                {manualMedicines.map((m, i) => (
                  <input
                    key={i}
                    value={m}
                    onChange={(e) => {
                      const updated = [...manualMedicines];
                      updated[i] = e.target.value;
                      setManualMedicines(updated);
                    }}
                    className="border w-full mb-1 px-2 py-1"
                    placeholder={`Medicine ${i + 1}`}
                  />
                ))}

                <button
                  onClick={() => setManualMedicines([...manualMedicines, ""])}
                  className="text-blue-600 text-sm mt-1"
                >
                  + Add more medicines
                </button>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleConfirmMedicines}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-400 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-green-600 text-white px-6 py-3 rounded shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
};

export default PharmacyAdmin;
