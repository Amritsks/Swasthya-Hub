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

  /* ================= AUTH ================= */
  const getHeaders = () => {
    const token = localStorage.getItem("pharmacistToken");
    if (!token) {
      navigate("/pharmacist-login");
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  };

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

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/prescriptions/all`,
        { headers }
      );
      setPrescriptions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= MODAL ================= */
  const openConfirmModal = (p) => {
    setSelectedPrescription(p);
    setShowConfirmModal(true);
    setAllPresent(true);
    setManualMedicines([""]);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setSelectedPrescription(null);
    setManualMedicines([""]);
  };

  const handleMedicineInputChange = (i, v) => {
    const updated = [...manualMedicines];
    updated[i] = v;
    setManualMedicines(updated);
  };

  const addMedicineField = () => {
    setManualMedicines([...manualMedicines, ""]);
  };

  /* ================= CONFIRM ================= */
  const handleConfirmMedicines = async () => {
    if (!selectedPrescription) return;
    const headers = getHeaders();
    if (!headers) return;

    await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/prescriptions/${selectedPrescription._id}/confirm`,
      {
        allPresent,
        medicines: allPresent
          ? []
          : manualMedicines.filter((m) => m.trim()),
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
  };

  /* ================= REJECT ================= */
  const handleReject = async (id) => {
    const headers = getHeaders();
    if (!headers) return;

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
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-6">
        Welcome, {pharmacistName}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {prescriptions.map((p) => (
          <div key={p._id} className="bg-white p-4 rounded shadow">
            <span className="text-xs text-gray-500">
              {p.type === "manual"
                ? "Manual Request"
                : "Uploaded Prescription"}
            </span>

            {/* 👁️ VIEW PRESCRIPTION (RESTORED) */}
            {p.type === "upload" && p.filename && (
              <p className="mt-2">
                <a
                  href={`${import.meta.env.VITE_BACKEND_URL}/api/prescriptions/image/${p.filename}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  View Prescription
                </a>
              </p>
            )}

            {/* 💊 MANUAL MEDICINES */}
            {p.type === "manual" && (
              <>
                <p className="font-semibold mt-2 text-sm">
                  Medicines:
                </p>
                <ul className="list-disc ml-4 text-sm">
                  {p.medicines?.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </>
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

      {/* ================= CONFIRM MODAL ================= */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-80">
            <h2 className="font-bold mb-2">Confirm Medicines</h2>

            <label>
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
                    className="border w-full mb-1 px-2 py-1"
                    placeholder={`Medicine ${i + 1}`}
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
