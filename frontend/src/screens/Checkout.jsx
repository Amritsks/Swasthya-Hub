import React from "react";

const Checkout = ({ onBack, onSuccess }) => {
  return (
    <div className="absolute inset-0 bg-gray-50 overflow-y-auto">
      <div className="p-4 bg-gray-800 text-white flex justify-between items-center sticky top-0">
        <button onClick={onBack}>←</button>
        <h1 className="font-bold">Checkout</h1>
        <div className="w-10" />
      </div>

      <div className="p-4">
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="font-semibold text-gray-700">Shipping Address</h2>
          <p className="text-sm text-gray-600">123, MG Road, Bangalore</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="font-semibold text-gray-700">Payment Method</h2>
          <p className="text-sm text-gray-600">UPI (PhonePe)</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-700">Order Summary</h2>
          <p className="text-sm text-gray-600">2 items</p>
          <p className="font-bold mt-2">₹170.90</p>
        </div>

        <button
          onClick={onSuccess}
          className="mt-6 w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
