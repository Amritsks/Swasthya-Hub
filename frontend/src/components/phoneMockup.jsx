import React from "react";

const PhoneMockup = ({ children }) => {
  return (
    <div className="relative w-full max-w-sm h-[800px] mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
      {children}
    </div>
  );
};

export default PhoneMockup;
