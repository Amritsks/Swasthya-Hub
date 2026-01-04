import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/bgc.avif";
import logo from "../assets/nlogo.jpg";

const UserDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

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

  const cards = [
    { name: "Aushadhi", route: "/aushadhi", color: "bg-teal-100", hover: "hover:shadow-lg hover:-translate-y-1" },
    { name: "Suraksha", route: "/suraksha", color: "bg-orange-200", hover: "hover:shadow-lg hover:-translate-y-1" },
    { name: "Raksha", route: "/raksha", color: "bg-white", hover: "hover:shadow-lg hover:-translate-y-1" },
    // { name: "Doctor", route: "/doctor", color: "bg-lime-100", hover: "hover:shadow-lg hover:-translate-y-1" },
    // { name: "Lab Test", route: "/labtest", color: "bg-blue-200", hover: "hover:shadow-lg hover:-translate-y-1" },
    { name: "AI Health Assist", route: "/healthassist", color: "bg-green-200", hover: "hover:shadow-lg hover:-translate-y-1" },
  ];

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-start p-4 sm:p-6 bg-no-repeat bg-center bg-cover md:bg-fixed"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-white/40 sm:bg-white/30 md:bg-white/20"></div>

      {/* Content above overlay */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Logo */}
        <img
          src={logo}
          alt="Logo"
          className="absolute top-1 left-1 w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 object-contain drop-shadow-md rounded-full"
        />

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-8 text-gray-800 text-center bg-white/70 px-3 sm:px-6 py-2 rounded-xl shadow-md mt-20">
          Welcome, <span className="text-teal-600">{userName || "Guest"}</span>
        </h1>

        {/* Cards */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 w-full max-w-6xl">
          {cards.map((item, idx) => (
            <div
              key={idx}
              onClick={() => navigate(item.route)}
              className={`w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 ${item.color} rounded-xl p-3 sm:p-5 flex flex-col items-center justify-center cursor-pointer transform transition duration-300 ${item.hover}`}
            >
              <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-1">{item.name}</h2>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base">Go to {item.name} module</p>
            </div>
          ))}
        </div>

        <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-gray-700 mt-8 text-center px-4">
          Your Companion in Crisis. Your Partner in Care.
        </h1>
      </div>
    </div>
  );
};

export default UserDashboard;