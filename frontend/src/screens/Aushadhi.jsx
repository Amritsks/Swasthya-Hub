import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import useSocket from "../hooks/useSocket";

const Aushadhi = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [prescription, setPrescription] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedMedicines, setSelectedMedicines] = useState([]); // ✅ new state
  const [isUploading, setIsUploading] = useState(false);

  // Setup real-time socket connection for user notifications
  const socket = useSocket(user?.email);

  // Fetch prescriptions on mount and whenever user changes
  useEffect(() => {
    if (!user || !user.token) return;
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/prescriptions`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setPrescriptions(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [user]);

  useEffect(() => {
    if (!socket?.current) return;

    const currentSocket = socket.current;

    currentSocket.on("prescriptionConfirmed", (data) => {
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

    return () => {
      if (currentSocket) {
        currentSocket.off("prescriptionConfirmed");
      }
    };
  }, [socket, user]);

  // Upload prescription file
  const handleFileChange = (e) => {
    setPrescription(e.target.files[0]);
    setUploadStatus("");
  };

  const handleUpload = async () => {
    if (!prescription) return alert("Please select a prescription.");
    if (!user) return alert("User not logged in.");

    const formData = new FormData();
    formData.append("file", prescription);
    formData.append("userName", user.name);
    formData.append("userEmail", user.email);

    try {
      setIsUploading(true); // 🔒 disable button
      setUploadStatus("Uploading...");

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/prescriptions`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`, // ⚠️ important for prod
          },
        }
      );

      setUploadStatus("Uploaded successfully!");
      setPrescription(null);
    } catch (err) {
      console.error(err);
      setUploadStatus("Upload failed.");
    } finally {
      setIsUploading(false); // 🔓 enable button again
    }
  };

  // Static medicines (for now)
  const medicines = [
    {
      name: "Paracetamol",
      dosage: "500mg",
      steps: "Take 1 tablet every 6 hours after food",
    },
    {
      name: "Amoxicillin",
      dosage: "250mg",
      steps: "Take 1 capsule every 8 hours for 5 days",
    },
    {
      name: "Vitamin C",
      dosage: "500mg",
      steps: "Take 1 tablet daily after breakfast",
    },
    {
      name: "Vitamin D",
      dosage: "400mg",
      steps: "Take 1 tablet every 8 hours if pain persists",
    },
    {
      name: "Combiflame",
      dosage: "400mg",
      steps: "Take 1 tablet every 8 hours if pain persists",
    },
    {
      name: "Ciplox eye drops",
      dosage: "Apply 2 drops",
      steps: "Apply 2 drops twice daily",
    },
  ];

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Handle selecting medicine
  const toggleSelectMedicine = (medicineName) => {
    setSelectedMedicines((prev) =>
      prev.includes(medicineName)
        ? prev.filter((m) => m !== medicineName)
        : [...prev, medicineName]
    );
  };

  // ✅ Handle submitting selected medicines
  const handleManualSubmit = async () => {
    if (selectedMedicines.length === 0) {
      return alert("Please select at least one medicine.");
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/prescriptions/manual`,
        {
          medicines: selectedMedicines,
          userEmail: user.email,
          userName: user.name,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      console.log("🔑 Current user token:", user?.token);
      alert("✅ Medicine request submitted successfully!");
      setSelectedMedicines([]);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit manual request.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-50 px-2 py-4 sm:px-6 md:px-10 lg:px-20 overflow-y-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-5 gap-3 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 text-center flex-1 break-words">
          Svasthya <span className="text-teal-600">Aushadhi</span>
        </h1>

        {/* Upload Section */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <label
            htmlFor="prescription-upload"
            className="cursor-pointer bg-white border border-gray-300 rounded px-4 py-2 shadow-sm hover:bg-gray-100"
          >
            {prescription ? prescription.name : "Select Prescription"}
            <input
              id="prescription-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <button
            onClick={handleUpload}
            disabled={!prescription || isUploading}
            className={`bg-teal-500 text-white px-3 py-1 rounded 
    ${isUploading ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-600"}
  `}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      {/* Upload Status */}
      {uploadStatus && (
        <p
          className={`text-center mb-4 font-semibold ${
            uploadStatus.includes("success") ? "text-green-600" : "text-red-600"
          }`}
        >
          {uploadStatus}
        </p>
      )}

      {/* SEARCH BAR */}
      <div className="mb-6 max-w-lg mx-auto">
        <input
          type="text"
          aria-label="Search medicine"
          placeholder="Search medicine..."
          className="w-full p-3 rounded-xl border border-gray-300 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* MEDICINE LIST */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredMedicines.length > 0 ? (
          filteredMedicines.map((medicine, index) => {
            const selected = selectedMedicines.includes(medicine.name);
            return (
              <div
                key={index}
                onClick={() => toggleSelectMedicine(medicine.name)}
                className={`cursor-pointer bg-white shadow-md rounded-xl p-4 sm:p-6 flex flex-col justify-between hover:shadow-2xl h-full transition-all ${
                  selected ? "ring-4 ring-teal-500" : ""
                }`}
              >
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-teal-700">
                  {medicine.name}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                  {medicine.dosage}
                </p>
                <p className="text-xs sm:text-sm text-gray-700 mt-3">
                  {medicine.steps}
                </p>
              </div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No medicines found.
          </p>
        )}
      </div>

      {/* ✅ Submit Selected Medicines */}
      {selectedMedicines.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-gray-700 mb-3">
            Selected Medicines:{" "}
            <span className="font-semibold text-teal-700">
              {selectedMedicines.join(", ")}
            </span>
          </p>
          <button
            onClick={handleManualSubmit}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Submit Selected Medicines
          </button>
        </div>
      )}

      {/* CONFIRMATION SECTION */}
      <div className="mt-10 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-3">
          Prescription Confirmations
        </h2>
        {prescriptions.length === 0 && <p>No prescriptions found.</p>}
        {prescriptions.map((p) =>
          p.confirmation ? (
            <div key={p._id} className="bg-green-100 p-4 rounded mb-4">
              <p>
                <strong>Status:</strong> Confirmed
              </p>
              <p>
                <strong>All Medicines Present:</strong>{" "}
                {p.confirmation.allPresent ? "Yes" : "No"}
              </p>
              {!p.confirmation.allPresent &&
                p.confirmation.medicines.length > 0 && (
                  <ul className="list-disc list-inside ml-4">
                    {p.confirmation.medicines.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                )}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default Aushadhi;
