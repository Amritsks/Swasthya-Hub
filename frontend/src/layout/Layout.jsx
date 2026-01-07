import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Layout = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Navbar />

      {/* Page Content */}
      <main className="ml-16 hover:ml-64 transition-all duration-300 w-full p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
