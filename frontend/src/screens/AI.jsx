// src/screens/AIHealthAssist.jsx
import React, { useState } from "react";

const AIHealthAssist = () => {
  // Sample AI health assist data
  const assists = [
    { name: "Fever Diagnosis", category: "Symptom Checker", description: "Get AI-based suggestions for fever causes." },
    { name: "Diabetes Risk", category: "Health Risk", description: "AI analysis of diabetes risk based on symptoms." },
    { name: "Heart Health", category: "Cardiology", description: "AI insights for heart disease risk and prevention." },
    { name: "Skin Check", category: "Dermatology", description: "Upload symptoms to get AI skin health analysis." },
    { name: "Mental Wellness", category: "Psychology", description: "AI chatbot for stress, anxiety & depression support." },
    { name: "Diet Planner", category: "Nutrition", description: "Personalized AI diet recommendations." },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  // Filter by name or category
  const filteredAssists = assists.filter(
    (assist) =>
      assist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assist.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50 p-6">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        AI <span className="text-green-600">Health Assist</span>
      </h1>

      {/* Search Bar */}
      <div className="mb-10 max-w-lg mx-auto">
        <input
          type="text"
          placeholder="🔍 Search by assist name or category..."
          className="w-full p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* AI Assists Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredAssists.length > 0 ? (
          filteredAssists.map((assist, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl p-6 hover:shadow-2xl hover:scale-105 transform transition duration-200 cursor-pointer"
            >
              <h2 className="text-xl font-bold text-green-700">{assist.name}</h2>
              <p className="text-sm text-gray-600 mt-1">Category: {assist.category}</p>
              <p className="text-sm text-gray-600 mt-2">{assist.description}</p>
              <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                Try Now
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center text-lg col-span-full">
            ❌ No AI assists found.
          </p>
        )}
      </div>
    </div>
  );
};

export default AIHealthAssist;
