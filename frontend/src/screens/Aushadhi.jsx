import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import useSocket from "../hooks/useSocket";

const Aushadhi = () => {
  const { user } = useAuth();

  const [prescription, setPrescription] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const socket = useSocket(user?.email);

  /* ---------------- FETCH PRESCRIPTIONS ---------------- */
  useEffect(() => {
    if (!user?.token) return;

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/prescriptions`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setPrescriptions(res.data))
      .catch(console.error);
  }, [user]);

  /* ---------------- SOCKET LISTENER ---------------- */
  useEffect(() => {
    if (!socket?.current) return;

    const s = socket.current;

    s.on("prescriptionConfirmed", (data) => {
      alert(data.message);
      setPrescriptions((prev) =>
        prev.map((p) =>
          p._id === data.prescriptionId
            ? {
                ...p,
                status: "confirmed",
                confirmation: {
                  allPresent: data.allPresent,
                  medicines: data.medicines || [],
                },
              }
            : p
        )
      );
    });

    return () => s.off("prescriptionConfirmed");
  }, [socket]);

  /* ---------------- UPLOAD ---------------- */
  const handleFileChange = (e) => {
    setPrescription(e.target.files[0]);
    setUploadStatus("");
  };

  const handleUpload = async () => {
    if (!prescription || !user) return;

    const formData = new FormData();
    formData.append("file", prescription);
    formData.append("userName", user.name);
    formData.append("userEmail", user.email);

    try {
      setIsUploading(true);
      setUploadStatus("Uploading...");

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/prescriptions`,
        formData,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setUploadStatus("Uploaded successfully!");
      setPrescription(null);
    } catch {
      setUploadStatus("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  /* ---------------- MEDICINES ---------------- */
  const medicines = [
    {
      name: "Paracetamol",
      dosage: "500mg",
      steps: "Take 1 tablet every 6 hours",
    },
    { name: "Amoxicillin", dosage: "250mg", steps: "Every 8 hours for 5 days" },
    { name: "Vitamin C", dosage: "500mg", steps: "Once daily" },
    { name: "Vitamin D", dosage: "400mg", steps: "If pain persists" },
    { name: "Combiflame", dosage: "400mg", steps: "If pain persists" },
    { name: "Ciplox Eye Drops", dosage: "2 drops", steps: "Twice daily" },
  ];

  const filteredMedicines = medicines.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectMedicine = (name) => {
    setSelectedMedicines((prev) =>
      prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name]
    );
  };

  const handleManualSubmit = async () => {
    if (!selectedMedicines.length) return alert("Select medicines");

    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/prescriptions/manual`,
      {
        medicines: selectedMedicines,
        userEmail: user.email,
        userName: user.name,
      },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );

    alert("✅ Medicine request submitted");
    setSelectedMedicines([]);
  };

  return (
    <main className="min-h-screen p-6 bg-gray-100 relative">
      {/* -------- HEADER -------- */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl p-6 sm:p-8 text-white">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
          Svasthya <span className="text-teal-100">Aushadhi</span>
        </h1>
        <p className="text-teal-100 mt-1">
          Upload prescriptions or request medicines manually
        </p>
      </div>

      {/* -------- UPLOAD -------- */}
      <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <label className="cursor-pointer border rounded px-4 py-2 bg-slate-50 hover:bg-slate-100">
          {prescription ? prescription.name : "Select Prescription"}
          <input type="file" className="hidden" onChange={handleFileChange} />
        </label>

        <button
          onClick={handleUpload}
          disabled={!prescription || isUploading}
          className="bg-teal-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {uploadStatus && (
        <p className="text-center font-semibold text-teal-600">
          {uploadStatus}
        </p>
      )}

      {/* -------- SEARCH -------- */}
      <input
        className="w-full max-w-md mx-auto block p-3 rounded-xl border shadow-sm"
        placeholder="Search medicine..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* -------- MEDICINES GRID -------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredMedicines.map((m, i) => (
          <div
            key={i}
            onClick={() => toggleSelectMedicine(m.name)}
            className={`bg-white p-6 rounded-xl shadow-sm cursor-pointer transition hover:shadow-lg ${
              selectedMedicines.includes(m.name) ? "ring-4 ring-teal-500" : ""
            }`}
          >
            <h3 className="font-bold text-teal-700">{m.name}</h3>
            <p className="text-sm text-gray-500">{m.dosage}</p>
            <p className="text-sm mt-2">{m.steps}</p>
          </div>
        ))}
      </div>

      {/* -------- SUBMIT -------- */}
      {selectedMedicines.length > 0 && (
        <div className="text-center">
          <p className="mb-2 text-gray-700">
            Selected: <strong>{selectedMedicines.join(", ")}</strong>
          </p>
          <button
            onClick={handleManualSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Submit Selected Medicines
          </button>
        </div>
      )}

      {/* -------- CONFIRMATION SECTION -------- */}
      <div className="mt-10 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-3">
          Prescription Confirmations
        </h2>

        {prescriptions.length === 0 && (
          <p className="text-gray-600">No prescriptions found.</p>
        )}

        {prescriptions.map((p) =>
          p.confirmation ? (
            <div
              key={p._id}
              className="bg-green-100 p-4 rounded mb-4 shadow-sm"
            >
              <p>
                <strong>Status:</strong> Confirmed
              </p>

              {p.confirmation.allPresent ? (
                <p>
                  <strong>All Medicines Present:</strong> Yes
                </p>
              ) : (
                <>
                  <p>
                    <strong>All Medicines Present:</strong> No
                  </p>

                  {p.confirmation.medicines &&
                    p.confirmation.medicines.length > 0 && (
                      <ul className="list-disc list-inside ml-4 mt-1">
                        {p.confirmation.medicines.map((m, idx) => (
                          <li key={idx}>{m}</li>
                        ))}
                      </ul>
                    )}
                </>
              )}
            </div>
          ) : null
        )}
      </div>
    </main>
  );
};

export default Aushadhi;
