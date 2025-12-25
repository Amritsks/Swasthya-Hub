// src/screens/Raksha.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Confetti from "react-confetti";
import { useAuth } from "../context/AuthContext";

const Raksha = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({ group: "", units: "", locationName: "" });
  const [loading, setLoading] = useState(false);
  const [showDonorCode, setShowDonorCode] = useState(false);
  const [donorCode, setDonorCode] = useState("");
  const [error, setError] = useState("");
  const [serverStatus, setServerStatus] = useState("checking");
  const [thankYou, setThankYou] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Check backend status
  const checkServerStatus = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}`);
      setServerStatus("online");
      setError("");
    } catch {
      setServerStatus("offline");
      setError("Backend server is not running. Please start it.");
    }
  };

  // Fetch all requests
  const fetchRequests = async () => {
    if (serverStatus !== "online") return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/requests`);
      const filtered = res.data.filter(req => req.status === "open" || req.status === "accepted");
      setRequests(filtered);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      if (err.code === "ERR_NETWORK") {
        setServerStatus("offline");
        setError("Cannot connect to backend server.");
      } else setError("Error fetching requests: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    checkServerStatus();
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (serverStatus === "online") fetchRequests();
  }, [serverStatus]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // 🩸 Submit new request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.email) return alert("User not logged in!");
    if (!formData.group || !formData.units || !formData.locationName) return alert("Fill all fields!");
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/requests/request`, {
        ...formData,
        units: Number(formData.units),
        requesterEmail: user.email,
        lat: null,
        lng: null,
      });
      setRequests([...requests, res.data]);
      setFormData({ group: "", units: "", locationName: "" });
      alert("Request submitted successfully!");
    } catch (err) {
      console.error("Request error:", err);
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // 🩸 Donor accepts request
  const handleAccept = async (requestId) => {
    if (serverStatus !== "online") return setError("Backend server is offline.");
    if (!user || !user.email) return alert("User not logged in!");
    setLoading(true);
    try {
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/requests/${requestId}/accept`, {
        donorEmail: user.email,
        donorCode: randomCode,
        donorName: user.name,
        donorPhone: user.phone,
      });
      setDonorCode(randomCode);
      setShowDonorCode(true);
      fetchRequests();
    } catch (err) {
      console.error("Accept error:", err);
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // 🩸 Requester confirms donation
  const handleConfirmDonation = async (requestId) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/requests/confirmDonation/${requestId}`);
      setDonorCode(res.data.donorCode);
      setThankYou(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      fetchRequests();
    } catch (err) {
      console.error("Confirm donation error:", err);
      alert("Error confirming donation.");
    }
  };

  const closeDonorPopup = () => {
    setShowDonorCode(false);
    setDonorCode("");
  };

  const retryConnection = () => {
    setServerStatus("checking");
    checkServerStatus();
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 relative">
      <h1 className="text-3xl font-bold mb-6 text-center">🩸 Blood Requests</h1>

      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} />}

      {/* Backend offline */}
      {serverStatus === "offline" && (
        <div className="max-w-4xl mx-auto mb-4 p-4 bg-red-100 border border-red-400 rounded">
          <p className="text-red-700 font-semibold">⚠️ Backend Server Offline</p>
          <p className="text-red-600 mb-2">{error}</p>
          <button onClick={retryConnection} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Retry
          </button>
        </div>
      )}

      {/* Form for requester */}
      {serverStatus === "online" && (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Create a Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="group" placeholder="Blood Group (e.g., A+)" className="border p-2 w-full rounded"
              value={formData.group} onChange={handleChange} />
            <input type="number" name="units" placeholder="Units" className="border p-2 w-full rounded"
              value={formData.units} onChange={handleChange} />
            <input type="text" name="locationName" placeholder="Location (e.g., City Hospital)"
              className="border p-2 w-full rounded" value={formData.locationName} onChange={handleChange} />
            <button type="submit" disabled={loading}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400">
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>
      )}

      {/* Donor Thank You Popup */}
      {showDonorCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto animate-bounceIn text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Thank You! 🙏</h2>
            <p className="text-lg mb-2">You’ve accepted this request.</p>
            <div className="bg-yellow-100 p-4 rounded mb-4">
              <p className="font-semibold">Your Donor Code:</p>
              <p className="text-2xl font-bold text-red-600 my-2">{donorCode}</p>
              <p className="text-sm text-gray-600">Please share this code after donating.</p>
            </div>
            <button onClick={closeDonorPopup} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full">
              OK
            </button>
          </div>
        </div>
      )}

      {/* Thank You Confirmation Modal (Requester side) */}
      {thankYou && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 shadow-xl text-center w-80 animate-bounceIn">
            <h2 className="text-2xl font-bold text-green-700 mb-2">Donation Confirmed! 🎉</h2>
            <p className="mb-2">The donor successfully donated blood.</p>
            <p className="font-semibold text-red-600 text-lg mb-2">Code: {donorCode}</p>
            <p className="text-gray-600 text-sm mb-4">A new achievement has been added to donor’s profile 🏅</p>
            <button onClick={() => setThankYou(false)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Requests */}
      {serverStatus === "online" && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Existing Requests</h2>
          {requests.length === 0 ? (
            <p className="text-center text-gray-500">No active blood requests.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requests.map((req) => (
                <div key={req._id} className="bg-white p-4 rounded shadow relative">
                  <div className={`absolute top-0 left-0 w-2 h-full ${req.status === "accepted" ? "bg-green-500" : "bg-red-500"}`}></div>
                  <div className="ml-3">
                    <p><strong>Blood Group:</strong> {req.group}</p>
                    <p><strong>Units:</strong> {req.units}</p>
                    <p><strong>Location:</strong> {req.location.name}</p>
                    <p><strong>Requester:</strong> {req.requester}</p>
                    <p><strong>Status:</strong>
                      <span className={`font-semibold ${req.status === "accepted" ? "text-green-600" : "text-red-600"}`}>
                        {req.status.toUpperCase()}
                      </span>
                    </p>

                    {req.status === "accepted" && req.donor && (
                      <div className="mt-2 p-2 bg-green-50 rounded">
                        <p><strong>Accepted by:</strong> {req.donorName || req.donor}</p>
                        {req.donorPhone && <p><strong>Donor Phone:</strong> {req.donorPhone}</p>}
                        {req.donorCode && <p><strong>Donor Code:</strong> {req.donorCode}</p>}
                      </div>
                    )}

                    {/* Donor buttons */}
                    {req.status === "open" && req.requester !== user?.email && (
                      <div className="flex space-x-2 mt-3">
                        <button onClick={() => handleAccept(req._id)} disabled={loading}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 disabled:bg-gray-400">
                          Accept
                        </button>
                        <button onClick={() => setRequests(requests.filter(r => r._id !== req._id))}
                          className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600">
                          Reject
                        </button>
                      </div>
                    )}

                    {/* Requester: Confirm Donation */}
                    {req.status === "accepted" && req.requester === user?.email && !req.donationConfirmed && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-700 mb-1">Has the donor successfully donated blood?</p>
                        <button onClick={() => handleConfirmDonation(req._id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                          ✅ Yes, Donated
                        </button>
                      </div>
                    )}

                    {req.requester === user?.email && (
                      <p className="text-sm text-blue-600 mt-2">
                        This is your request {req.status === "accepted" && "- It has been accepted!"}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>
        {`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-in-out; }
        @keyframes bounceIn {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); }
        }
        .animate-bounceIn { animation: bounceIn 0.5s ease-in-out; }
        `}
      </style>
    </div>
  );
};

export default Raksha;
