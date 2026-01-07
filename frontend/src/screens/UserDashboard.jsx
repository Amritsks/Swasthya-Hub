import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ---------------- ICON COMPONENT ---------------- */
const Icon = ({ children, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

const Icons = {
  Home: () => (
    <Icon className="w-5 h-5">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </Icon>
  ),
  Box: () => (
    <Icon className="w-5 h-5">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4" />
    </Icon>
  ),
  Shield: () => (
    <Icon className="w-10 h-10">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Icon>
  ),
};

/* ---------------- MAIN COMPONENT ---------------- */
const UserDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Guest");

  useEffect(() => {
    if (user?.name) {
      setUserName(user.name);
    } else {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUserName(JSON.parse(storedUser).name);
      }
    }
  }, [user]);

  const cards = [
    { name: "Aushadhi", route: "/aushadhi", color: "bg-blue-100", icon: <Icons.Box /> },
    { name: "Suraksha", route: "/suraksha", color: "bg-purple-100", icon: <Icons.Shield /> },
    { name: "Raksha", route: "/raksha", color: "bg-red-100", icon: <Icons.Shield /> },
    { name: "AI Health Assist", route: "/healthassist", color: "bg-green-100", icon: <Icons.Home /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      
      {/* ---------------- SIDEBAR ---------------- */}
      <aside className="hidden md:fixed md:flex left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 z-20 flex-col mt-16">
        <nav className="p-4">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-900 text-white">
            <Icons.Home /> Home
          </button>
        </nav>

        <div className="mt-auto p-4 border-t">
          <p className="font-bold text-slate-700">{userName}</p>
          <p className="text-xs text-teal-600">Plus Member</p>
        </div>
      </aside>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="flex-1 md:ml-64 pt-6 md:pt-24 px-4 sm:px-6 md:px-8 space-y-8">

        {/* ---- GRADIENT HEADER ---- */}
        <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="absolute right-4 top-4 opacity-10 hidden sm:block">
            <Icons.Shield />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
            Welcome, {userName}
          </h1>
          <p className="text-teal-100 text-sm sm:text-base">
            Your Companion in Crisis. Your Partner in Care.
          </p>
        </div>

        {/* ---- CARDS GRID ---- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.route)}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg cursor-pointer transition flex flex-col items-center gap-4 hover:-translate-y-1"
            >
              <div className={`${card.color} p-4 rounded-full`}>
                {card.icon}
              </div>
              <h3 className="font-bold text-slate-700 text-center">
                {card.name}
              </h3>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
};

export default UserDashboard;
