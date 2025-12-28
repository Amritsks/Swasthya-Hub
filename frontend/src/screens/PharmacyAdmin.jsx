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

  useEffect(() => {
    const token = localStorage.getItem("pharmacistToken");
    if (!token) {
      navigate("/pharmacist-login");
      return;
    }

    const fetchPharmacistInfo = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/pharmacist/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPharmacistName(res.data.userId);
      } catch {
        localStorage.removeItem("pharmacistToken");
        navigate("/pharmacist-login");
      }
    };

    const fetchPrescriptions = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/prescriptions/all`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPrescriptions(res.data);
      } catch {
        localStorage.removeItem("pharmacistToken");
        navigate("/pharmacist-login");
      }
    };

    fetchPharmacistInfo();
    fetchPrescriptions();
  }, [navigate]);

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

  const addMedicineField = () => setManualMedicines([...manualMedicines, ""]);
  const removeMedicineField = (index) =>
    setManualMedicines(manualMedicines.filter((_, i) => i !== index));

  const handleConfirmMedicines = async () => {
    if (!selectedPrescription) return;

    const token = localStorage.getItem("pharmacistToken");

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/prescriptions/${
          selectedPrescription._id
        }/confirm`,
        {
          allPresent,
          medicines: allPresent
            ? []
            : manualMedicines.filter((m) => m.trim() !== ""),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update UI immediately
      setPrescriptions((prev) =>
        prev.map((p) =>
          p._id === selectedPrescription._id
            ? {
                ...p,
                status: "confirmed",
                confirmation: {
                  allPresent,
                  medicines: allPresent
                    ? []
                    : manualMedicines.filter((m) => m.trim() !== ""),
                },
              }
            : p
        )
      );

      closeConfirmModal();
    } catch (error) {
      console.error(error);
      alert("Error confirming prescription");
    }
  };

 const handleReject = async (id) => {
  const token = localStorage.getItem("pharmacistToken");

  const confirmReject = window.confirm(
    "Request rejected.\nWhen the medicines become available, please respond to the request."
  );

  if (!confirmReject) return;

  try {
    await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/prescriptions/${id}/reject`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setPrescriptions((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, status: "rejected" } : p
      )
    );
  } catch (error) {
    // console.error(error);
    // alert("Error rejecting prescription");
  }
};


  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50 relative">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
        Welcome, {pharmacistName}
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {prescriptions.map((p) => (
          <div
            key={p._id}
            className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-shadow flex flex-col justify-between h-full"
          >
            {/* Badge */}
            <p
              className={`text-xs px-2 py-1 rounded-full mb-2 w-fit ${
                p.type === "manual"
                  ? "bg-teal-100 text-teal-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {p.type === "manual" ? "Manual Request" : "Uploaded Prescription"}
            </p>

            {/* Basic Info */}
            <div className="space-y-2 mb-3">
              {p.type === "upload" ? (
                <>
                  <p className="truncate">
                    <span className="font-semibold">Filename:</span>{" "}
                    {p.filename ? (
                      <a
                        href={`${
                          import.meta.env.VITE_BACKEND_URL
                        }/api/prescriptions/image/${p.filename}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline break-all"
                      >
                        {p.originalname}
                      </a>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold">Medicines Requested:</p>
                  {p.medicines && p.medicines.length > 0 ? (
                    <ul className="list-disc list-inside text-gray-700 text-sm">
                      {p.medicines.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">No medicines listed</p>
                  )}
                </>
              )}

              <p className="break-words">
                <span className="font-semibold">User Email:</span> {p.userEmail}
              </p>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {new Date(p.date).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`font-semibold ${
                    p.status === "confirmed"
                      ? "text-green-600"
                      : p.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {p.status || "pending"}
                </span>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2 sm:flex-row mt-auto pt-2">
              <button
                disabled={p.status === "confirmed"}
                onClick={() => openConfirmModal(p)}
                className="bg-green-600 text-white w-full sm:w-auto px-4 py-2 rounded disabled:opacity-50 hover:bg-green-700 transition"
              >
                Accept
              </button>
              <button
                disabled={p.status === "rejected"}
                onClick={() => handleReject(p._id)}
                className="bg-red-600 text-white w-full sm:w-auto px-4 py-2 rounded disabled:opacity-50 hover:bg-red-700 transition"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg max-w-xs w-full">
            <h2 className="text-lg font-bold mb-2">Confirm Medicines</h2>
            <div>
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
                Not all present, specify:
              </label>
            </div>

            {!allPresent && (
              <div className="flex flex-col space-y-2 mt-2">
                {manualMedicines.map((val, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={val}
                      onChange={(e) =>
                        handleMedicineInputChange(idx, e.target.value)
                      }
                      placeholder={`Medicine ${idx + 1}`}
                      className="border rounded px-2 py-1 w-full"
                    />
                    {manualMedicines.length > 1 && (
                      <button
                        onClick={() => removeMedicineField(idx)}
                        className="text-red-500"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addMedicineField}
                  className="text-teal-600 mt-1"
                >
                  + Add Medicine
                </button>
              </div>
            )}

            <div className="flex space-x-3 mt-4">
              <button
                onClick={handleConfirmMedicines}
                className="bg-teal-600 text-white px-3 py-1 rounded"
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
