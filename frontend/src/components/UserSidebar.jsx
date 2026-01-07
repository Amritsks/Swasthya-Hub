import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
  Truck: () => (
    <Icon className="w-5 h-5">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </Icon>
  ),
  Box: () => (
    <Icon className="w-5 h-5">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4" />
    </Icon>
  ),
  Drop: () => (
    <Icon className="w-5 h-5">
      <path d="M12 2.69l5.74 5.74c2.58 2.58 2.58 6.76 0 9.34a6.6 6.6 0 0 1-9.34 0c-2.58-2.58-2.58-6.76 0-9.34L12 2.69z" />
    </Icon>
  ),
  Image: () => (
    <Icon className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </Icon>
  ),
  Logout: () => (
    <Icon className="w-5 h-5">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </Icon>
  ),
};

const UserSidebar = ({ userName }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout?.();
    navigate("/", { replace: true });
  };

  return (
    <aside className="hidden md:fixed md:flex left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 z-20 flex-col">
      {/* NAV LINKS */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link to="/userdashboard" className="sidebar-link active">
          <Icons.Home /> Home
        </Link>

        <Link to="/orders" className="sidebar-link">
          <Icons.Truck /> My Orders
        </Link>

        <Link to="/aushadhi" className="sidebar-link">
          <Icons.Box /> Order Medicines
        </Link>

        <Link to="/raksha" className="sidebar-link">
          <Icons.Drop /> Blood Corner
        </Link>

        <Link to="/aushadhi" className="sidebar-link">
          <Icons.Image /> Upload Prescription
        </Link>
      </nav>

      {/* USER INFO */}
      <div className="p-4 border-t">
        <Link to="/profile">
          <p className="font-bold text-slate-700">{userName}</p>
          <p className="text-xs text-teal-600">Plus Member</p>
        </Link>
      </div>

      {/* LOGOUT BUTTON */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 m-4 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
      >
        <Icons.Logout /> Logout
      </button>
    </aside>
  );
};

export default UserSidebar;
