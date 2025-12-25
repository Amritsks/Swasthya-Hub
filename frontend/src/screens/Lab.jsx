// src/screens/Labtest.jsx
import React, { useState } from "react";

const Labtest = () => {
  // Sample lab tests data
  const labTests = [
    { name: "Blood Sugar Test", category: "Pathology", price: "₹300" },
    { name: "Lipid Profile", category: "Biochemistry", price: "₹800" },
    { name: "Complete Blood Count (CBC)", category: "Hematology", price: "₹500" },
    { name: "Thyroid Profile", category: "Endocrinology", price: "₹700" },
    { name: "X-Ray Chest", category: "Radiology", price: "₹1000" },
    { name: "MRI Brain", category: "Radiology", price: "₹5000" },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  // Filter by name or category
  const filteredTests = labTests.filter(
    (test) =>
      test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-gray-50 p-6">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        Book Your <span className="text-pink-600">Lab Test</span>
      </h1>

      {/* Search Bar */}
      <div className="mb-10 max-w-lg mx-auto">
        <input
          type="text"
          placeholder="🔍 Search by test name or category..."
          className="w-full p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Lab Tests Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredTests.length > 0 ? (
          filteredTests.map((test, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl p-6 hover:shadow-2xl hover:scale-105 transform transition duration-200 cursor-pointer"
            >
              <h2 className="text-xl font-bold text-pink-700">{test.name}</h2>
              <p className="text-sm text-gray-600 mt-1">Category: {test.category}</p>
              <p className="text-sm text-gray-600 mt-1">Price: {test.price}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center text-lg col-span-full">
            ❌ No lab tests found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Labtest;
