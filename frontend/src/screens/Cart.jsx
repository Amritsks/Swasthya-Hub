import React from "react";

const Cart = ({ onBack, onCheckout }) => {
  return (
    <div className="absolute inset-0 bg-gray-50 overflow-y-auto">
      <div className="p-4 bg-gray-800 text-white flex justify-between items-center sticky top-0">
        <button onClick={onBack}>←</button>
        <h1 className="font-bold">My Cart</h1>
        <div className="w-10" />
      </div>
      <div className="p-4">
        <div className="bg-white p-3 rounded-lg">Dolo 650mg - ₹30.90</div>
        <div className="bg-white p-3 rounded-lg mt-2">Vicks Vaporub - ₹140</div>
        <button
          onClick={onCheckout}
          className="mt-6 w-full bg-teal-600 text-white py-3 rounded-lg"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
