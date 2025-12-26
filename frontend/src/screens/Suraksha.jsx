import React, { useState } from "react";

const paymentOptions = [
  { id: "upi", label: "UPI / QR Code" },
  { id: "card", label: "Credit/Debit Card" },
  { id: "netbanking", label: "Net Banking" },
  { id: "wallet", label: "Wallets" }
];

const Suraksha = () => {
  const plans = [
    {
      name: "Free / Always",
      price: 0,
      duration: "per Year",
      features: [
        "Digital Health Locker",
        "Medication Reminder",
        "Standarad 10% Pharmacy Discount",
        "Standarad Discount on Lab test"
      ],
      color: "bg-gradient-to-br from-cyan-50 to-cyan-100",
      hover: "hover:shadow-xl hover:-translate-y-1",
      popular: false,
    },
    {
      name: "Basic",
      price: 999,
      duration: "per Year",
      features: [
        "Digital Health Locker",
        "Medication Reminder",
        "Standarad 10% Pharmacy Discount",
        "Standarad Discount on Lab test"
      ],
      color: "bg-gradient-to-br from-cyan-50 to-cyan-100",
      hover: "hover:shadow-xl hover:-translate-y-1",
      popular: false,
    },
    {
      name: "Standard",
      price: 1999,
      duration: "per Year",
      features: [
        "Basic coverage",
        "Priority support",
        "Discounted medicines"
      ],
      color: "bg-gradient-to-br from-cyan-50 to-cyan-100",
      hover: "hover:shadow-2xl hover:-translate-y-2",
      popular: true,
    },
    {
      name: "Premium",
      price: 3599,
      duration: "per Year",
      features: [
        "All Standard features",
        "Full coverage",
        "Dedicated health advisor"
      ],
      color: "bg-gradient-to-br from-cyan-50 to-cyan-100",
      hover: "hover:shadow-xl hover:-translate-y-1",
      popular: false,
    },
  ];

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSubscribe = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const closeModal = () => {
    setShowPaymentModal(false);
    setSelectedPlan(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-8 md:p-12 overflow-y-auto bg-cover bg-center">
      <h1 className="text-6xl font-bold text-gray-700 mt-2 mb-4 text-center">
        Donors Who Deserves Care.
      </h1>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-12 text-center">
        Svasthya <span className="text-teal-600">Suraksha</span>
      </h1>

      <div className="flex flex-row flex-wrap justify-center max-w-6xl mx-auto gap-16">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative rounded-3xl p-8 flex flex-col items-center justify-between transform transition duration-300 ${plan.color} ${plan.hover} shadow-md w-72`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <span className="absolute top-2.5 right-3 bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            )}

            <h2 className="text-2xl font-bold text-gray-800 mb-4">{plan.name}</h2>

            <p className="text-5xl font-extrabold text-teal-700 mb-1">₹{plan.price}</p>
            <p className="text-gray-600 mb-6">{plan.duration}</p>

            <ul className="text-gray-700 mb-6 list-disc list-inside space-y-2 self-start">
              {plan.features.map((feature, i) => (
                <li key={i} className="leading-relaxed">{feature}</li>
              ))}
            </ul>

            <button
              className={`w-full py-4 rounded-xl font-semibold text-white transition ${
                plan.popular ? "bg-teal-600 hover:bg-teal-700" : "bg-teal-600 hover:bg-teal-700"
              }`}
              onClick={() => handleSubscribe(plan)}
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>
      <h1 className="text-5xl font-bold text-gray-700 mt-6 text-center">
        The Gift of Health is the Greatest Reward.
      </h1>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
          <div className="bg-white rounded-xl p-8 shadow-xl w-[90vw] max-w-md relative">
            <button
              className="absolute top-2 right-2 text-lg text-gray-500 hover:text-gray-800"
              onClick={closeModal}
              aria-label="Close payment options"
            >&times;</button>
            <h2 className="text-2xl font-bold mb-4 text-center">Choose Payment Method</h2>
            <ul className="space-y-4 my-6">
              {paymentOptions.map(opt => (
                <li key={opt.id}>
                  <button
                    className="w-full bg-teal-100 hover:bg-teal-200 text-teal-800 py-3 px-4 rounded-lg font-semibold transition"
                    onClick={() => alert(`You selected: ${opt.label}`)}
                  >
                    {opt.label}
                  </button>
                </li>
              ))}
            </ul>
            <button className="w-full mt-2 text-gray-600 underline" onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suraksha;
