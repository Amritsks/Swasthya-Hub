import React, { useEffect, useState } from "react";
import axios from "axios";
import bgImage from "../assets/pbgc.avif";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const userEmail = user?.email;

  const [userData, setUserData] = useState({
    name: "",
    age: "",
    gender: "",
    bloodGroup: "",
    height: "",
    weight: "",
    allergies: "",
    medicalConditions: "",
    medications: "",
    fathername: "",
    mothername: "",
    emergencyContact: { name: "", phone: "", relation: "" },
    achievements: [],
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  

  // Fetch profile data
  useEffect(() => {
    if (!userEmail) {
      setError("User not logged in. Please log in again.");
      return;
    }
    fetchProfile();
  }, [userEmail]);

   useEffect(() => {
      if (user && user.name) {
        setUserName(user.name); // Use user from parent state if available
      } else {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserName(parsedUser.name);
        }
      }
    }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/profile/${encodeURIComponent(userEmail)}`
      );
      const data = res.data || {};

      // Ensure emergencyContact is always an object
      setUserData({
        ...userData,
        ...data,
        emergencyContact: data.emergencyContact || {
          name: "",
          phone: "",
          relation: "",
        },
        achievements: data.achievements || [],
      });
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError("Error fetching profile: " + (err.response?.data?.msg || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("emergencyContact.")) {
      const field = name.split(".")[1];
      setUserData((prev) => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value,
        },
      }));
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    if (!userEmail) {
      setError("User email unavailable.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/profile/${encodeURIComponent(userEmail)}`,
        userData
      );
      setUserData(res.data);
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Profile save error:", err);
      setError("Failed to save profile. " + (err.response?.data?.msg || err.message));
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (field, label, type = "text") => (
    <div key={field}>
      <p className="text-gray-500 font-medium">{label}</p>
      {editMode ? (
        <input
          type={type}
          name={field}
          value={userData[field] || ""}
          onChange={handleChange}
          className="border rounded p-2 w-full mt-1 placeholder:text-gray-400"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      ) : (
        <p className="text-gray-900 font-semibold">
          {userData[field] || "Not provided"}
        </p>
      )}
    </div>
  );

  const renderEmergencyInput = (field, label) => (
    <div key={field}>
      <p className="text-gray-500 font-medium">{label}</p>
      {editMode ? (
        <input
          type="text"
          name={`emergencyContact.${field}`}
          value={userData?.emergencyContact?.[field] || ""}
          onChange={handleChange}
          className="border rounded p-2 w-full mt-1 placeholder:text-gray-400"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      ) : (
        <p className="text-gray-900 font-semibold">
          {userData?.emergencyContact?.[field] || "Not provided"}
        </p>
      )}
    </div>
  );

  if (loading && !editMode)
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl text-gray-700">Loading profile...</p>
      </div>
    );

  return (
    <div
      className="min-h-screen bg-gray-100 p-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center"> Hello, <span className="text-teal-600">{userName || "Guest"}</span></h1>

      {error && (
        <div className="max-w-4xl mx-auto mb-4 p-4 bg-red-100 border border-red-400 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-8">
        {/* Toggle Edit */}
        <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center"><u>MEDICAL REPORT</u></h1>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-700">Profile Information</h2>
          <button
            onClick={() => setEditMode(!editMode)}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {editMode ? "Cancel Edit" : "Edit Profile"}
          </button>
        </div>

        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderInput("name", "Full Name")}
          {renderInput("age", "Age", "number")}
          {renderInput("gender", "Gender")}
          {renderInput("bloodGroup", "Blood Group")}
          {renderInput("height", "Height")}
          {renderInput("weight", "Weight")}
          {renderInput("allergies", "Allergies")}
          {renderInput("medicalConditions", "Medical Conditions")}
          {renderInput("medications", "Medications")}
        </div>

        {/* Emergency Contact */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Emergency Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderEmergencyInput("name", "Contact Name")}
            {renderEmergencyInput("relation", "Relation")}
            {renderEmergencyInput("phone", "Phone")}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-4"><u>Achievements</u></h2>
          <ul className="space-y-2">
            {userData.achievements?.length > 0 ? (
              userData.achievements.map((ach, idx) => (
                <li
                  key={idx}
                  className="bg-gradient-to-br from-red-50 to-pink-100 border border-red-200 rounded-xl p-4 shadow-sm"
                >
                  <p className="font-semibold text-gray-800">{ach.title}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(ach.date).toLocaleDateString()} –{" "}
                    {ach.location || "Unknown location"}
                  </p>
                  {ach.donorCode && (
                    <p className="text-sm text-green-700 font-medium mt-1">
                      Donor Code: {ach.donorCode}
                    </p>
                  )}
                </li>
              ))
            ) : (
              <p className="text-gray-600">No achievements yet.</p>
            )}
          </ul>
        </div>

        {/* Save Button */}
        {editMode && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
