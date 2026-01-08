import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      {/* Sidebar */}
      <div className="hidden md:flex w-64 bg-white border-r fixed inset-y-0 flex-col mt-16">
        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          <button
            onClick={() => setActiveTab("prescriptions")}
            className={`w-full text-left px-3 py-2 rounded ${
              activeTab === "prescriptions"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            Prescriptions
          </button>
        </nav>

        {/* Pharmacist Info */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
              {pharmacistName
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div>
              <p className="text-sm font-bold text-slate-700">
                {pharmacistName}
              </p>
              <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Online
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 ml-0 md:ml-64 pt-16">
        {/* <div className="h-16 bg-white border-b flex items-center px-6 font-bold">
          Welcome, {pharmacistName}
        </div> */}

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {prescriptions.map((p) => (
            <div key={p._id} className="bg-white p-4 rounded shadow">
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
