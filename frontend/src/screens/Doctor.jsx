// src/screens/Doctor.jsx
import React, { useState } from "react";

const Doctor = () => {
  // Sample doctors data
  const doctors = [
    { name: "Dr. Ramesh Kumar", specialization: "Cardiologist", experience: "10 years" },
    { name: "Dr. Priya Sharma", specialization: "Dermatologist", experience: "7 years" },
    { name: "Dr. Anil Verma", specialization: "Pediatrician", experience: "12 years" },
    { name: "Dr. Kavita Singh", specialization: "Gynecologist", experience: "9 years" },
    { name: "Dr. Arjun Mehta", specialization: "Orthopedic", experience: "8 years" },
    { name: "Dr. Neha Gupta", specialization: "Neurologist", experience: "6 years" },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  // Filter by name or specialization
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-50 p-6">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        Find Your <span className="text-indigo-600">Doctor</span>
      </h1>

      {/* Search Bar */}
      <div className="mb-10 max-w-lg mx-auto">
        <input
          type="text"
          placeholder="🔍 Search by name or specialization..."
          className="w-full p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl p-6 hover:shadow-2xl hover:scale-105 transform transition duration-200 cursor-pointer"
            >
              <h2 className="text-xl font-bold text-indigo-700">{doctor.name}</h2>
              <p className="text-sm text-gray-600 mt-1">Specialization: {doctor.specialization}</p>
              <p className="text-sm text-gray-600 mt-1">Experience: {doctor.experience}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center text-lg col-span-full">
            ❌ No doctors found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Doctor;
