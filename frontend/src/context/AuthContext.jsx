import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("guest"); // guest | user | pharmacist | admin

  // 🔄 Restore auth on refresh
  useEffect(() => {
    if (localStorage.getItem("adminToken")) {
      setRole("admin");
    } else if (localStorage.getItem("pharmacistToken")) {
      setRole("pharmacist");
    } else {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      if (storedUser && token) {
        setUser({ ...storedUser, token });
        setRole("user");
      }
    }
  }, []);

  const loginUser = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser({ ...userData, token });
    setRole("user");
  };

  const loginPharmacist = (token) => {
    localStorage.setItem("pharmacistToken", token);
    setRole("pharmacist");
  };

  const loginAdmin = (token) => {
    localStorage.setItem("adminToken", token);
    setRole("admin");
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setRole("guest");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loginUser,
        loginPharmacist,
        loginAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
