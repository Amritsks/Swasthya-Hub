import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // icons

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState("en");

  // Save and load language preference from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    localStorage.setItem("language", selectedLang);
  };

  // Translations for menu items
  const translations = {
    en: {
      dashboard: "Dashboard",
      profile: "Profile",
      aushadhi: "Aushadhi",
      suraksha: "Suraksha",
      raksha: "Raksha",
      login: "LogIn",
    },
    hi: {
      dashboard: "डैशबोर्ड",
      profile: "प्रोफ़ाइल",
      aushadhi: "औषधि",
      suraksha: "सुरक्षा",
      raksha: "रक्षा",
      login: "लॉगिन",
    },
  };

  return (
    <nav className="bg-teal-200 p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo / Brand */}
        <Link to = "/dashboard"><h1 className="text-xl font-bold text-gray-800">Svasthya Hub</h1> </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/dashboard" className="text-gray-700 hover:text-blue-500 font-semibold">
            {translations[language].dashboard}
          </Link>
          <Link to="/profile" className="text-gray-700 hover:text-blue-500 font-semibold">
            {translations[language].profile}
          </Link>
          <Link to="/aushadhi" className="text-gray-700 hover:text-blue-500 font-semibold">
            {translations[language].aushadhi}
          </Link>
          <Link to="/suraksha" className="text-gray-700 hover:text-blue-500 font-semibold">
            {translations[language].suraksha}
          </Link>
          <Link to="/raksha" className="text-gray-700 hover:text-blue-500 font-semibold">
            {translations[language].raksha}
          </Link>
          <Link to="/login" className="text-gray-700 hover:text-blue-500 font-semibold">
            {translations[language].login}
          </Link>
          {/* <Link to="/pharmacy-admin" className="text-gray-700 hover:text-blue-500 font-semibold">Admin Panel</Link> */}

          {/* Language Dropdown */}
          <select
            value={language}
            onChange={handleLanguageChange}
            className="ml-4 px-2 py-1 rounded-md border bg-white text-gray-700 shadow-sm"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-800"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col space-y-4 bg-teal-200 p-4 rounded-lg shadow-lg">
          <Link to="/dashboard" className="text-gray-700 hover:text-blue-500 font-semibold">
            {translations[language].dashboard}
          </Link>
          <Link to="/profile" className="text-gray-700 hover:text-blue-500 font-semibold">
            {translations[language].profile}
          </Link>
          <Link to="/aushadhi" className="text-gray-700 hover:text-blue-500 font-semibold">
            {translations[language].aushadhi}
          </Link>
          <Link to="/suraksha" className="text-gray-700 hover:text-blue-500 font-semibold">
            {translations[language].suraksha}
          </Link>
          <Link to="/raksha" className="text-gray-700 hover:text-blue-500 font-semibold">
            {translations[language].raksha}
          </Link>
          <Link to="/login" className="text-gray-700 hover:text-blue-500 font-semibold">
            {translations[language].login}
          </Link>
          {/* <Link to="/pharmacy-admin">Pharmacy Admin Panel</Link> */}

          {/* Language Dropdown in Mobile */}
          <select
            value={language}
            onChange={handleLanguageChange}
            className="mt-2 px-2 py-1 rounded-md border bg-white text-gray-700 shadow-sm"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
