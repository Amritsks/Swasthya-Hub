import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PharmacyAdmin = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [pharmacistName, setPharmacistName] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [allPresent, setAllPresent] = useState(true);
  const [manualMedicines, setManualMedicines] = useState([""]);

  const navigate = useNavigate();

  /* ================= AUTH HEADER (SINGLE SOURCE) ================= */
  const getHeaders = () => {
    const token = localStorage.getItem("pharmacistToken");
    if (!token) {
      navigate("/pharmacist-login");
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  };

  /* ================= FETCH DATA ================= */
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
    } catch (err) {
      console.error("Pharmacist info error:", err);
      navigate("/pharmacist-login");
    }
  };

  const fetchPrescriptions = async () => {
    const headers = getHeaders();
    if (!headers) return;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/prescriptions/all`,
        { headers }
      );
      setPrescriptions(res.data);
    } catch (err) {
      console.error("Prescription fetch error:", err);
    }
  };

  /* ================= MODAL HELPERS ================= */
  const openConfirmModal = (prescription) => {
    setSelectedPrescription(prescription);
    setShowConfirmModal(true);
    setAllPresent(true);
    setManualMedicines([""]);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setSelectedPrescription(null);
    setManualMedicines([""]);
  };

  const handleMedicineInputChange = (index, value) => {
    const updated = [...manualMedicines];
    updated[index] = value;
    setManualMedicines(updated);
  };

  const addMedicineField = () => {
    setManualMedicines([...manualMedicines, ""]);
  };

  const removeMedicineField = (index) => {
    setManualMedicines(manualMedicines.filter((_, i) => i !== index));
  };

  /* ================= CONFIRM ================= */
  const handleConfirmMedicines = async () => {
    if (!selectedPrescription) return;

    const headers = getHeaders();
    if (!headers) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/prescriptions/${selectedPrescription._id}/confirm`,
        {
          allPresent,
          medicines: allPresent
            ? []
            : manualMedicines.filter((m) => m.trim() !== ""),
        },
        { headers }
      );

      setPrescriptions((prev) =>
        prev.map((p) =>
          p._id === selectedPrescription._id
            ? { ...p, status: "confirmed" }
            : p
        )
      );

      closeConfirmModal();
    } catch (err) {
      console.error("Confirm error:", err);
      alert("Error confirming prescription");
    }
  };

  /* ================= REJECT ================= */
  const handleReject = async (id) => {
    const headers = getHeaders();
    if (!headers) return;

    const ok = window.confirm(
      "Request rejected.\nYou can respond again when medicines are available."
    );
    if (!ok) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/prescriptions/${id}/reject`,
        {},
        { headers }
      );

      setPrescriptions((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, status: "rejected" } : p
        )
      );
    } catch (err) {
      console.error("Reject error:", err);
      alert("Error rejecting prescription");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Welcome, {pharmacistName}
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {prescriptions.map((p) => (
          <div key={p._id} className="bg-white p-4 rounded-xl shadow">
            <p className="text-xs mb-2">
              {p.type === "manual" ? "Manual Request" : "Uploaded Prescription"}
            </p>

            <p className="text-sm">
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
                disabled={p.status === "confirmed"}
                onClick={() => openConfirmModal(p)}
                className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
              >
                Accept
              </button>
              <button
                disabled={p.status === "rejected"}
                onClick={() => handleReject(p._id)}
                className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-80">
            <h2 className="font-bold mb-2">Confirm Medicines</h2>

            <label className="block">
              <input
                type="radio"
                checked={allPresent}
                onChange={() => setAllPresent(true)}
              />{" "}
              All medicines present
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
                    onChange={(e) =>
                      handleMedicineInputChange(i, e.target.value)
                    }
                    placeholder={`Medicine ${i + 1}`}
                    className="border w-full mb-1 px-2 py-1"
                  />
                ))}
                <button
                  onClick={addMedicineField}
                  className="text-blue-600 text-sm"
                >
                  + Add Medicine
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
                onClick={closeConfirmModal}
                className="bg-gray-400 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyAdmin;
