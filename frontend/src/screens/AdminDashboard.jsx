import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

/* ================= ICONS ================= */
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
  Users: () => (
    <Icon className="w-5 h-5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
    </Icon>
  ),
  Blood: () => (
    <Icon className="w-5 h-5">
      <path d="M12 2s6 6 6 10a6 6 0 0 1-12 0c0-4 6-10 6-10z" />
    </Icon>
  ),
  Pharmacist: () => (
    <Icon className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </Icon>
  ),
};

/* ================= COMPONENT ================= */
export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [pharmacists, setPharmacists] = useState([]);
  const [showAdminPassword, setShowAdminPassword] = useState(true);
  const [showPharmacistPassword, setShowPharmacistPassword] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  const [newAdmin, setNewAdmin] = useState({ email: "", password: "" });
  const [newPharmacist, setNewPharmacist] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return (window.location.href = "/admin/login");

    const headers = { Authorization: `Bearer ${token}` };
    const [u, r, p] = await Promise.all([
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin-panel/users`, {
        headers,
      }),
      axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin-panel/requests`,
        { headers }
      ),
      axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin-panel/pharmacists`,
        { headers }
      ),
    ]);

    setUsers(u.data);
    setRequests(r.data);
    setPharmacists(p.data);
  };

  const createAdmin = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/register`,
        newAdmin
      );

      alert("Admin created");
      setNewAdmin({ email: "", password: "" });
    } catch (err) {
      if (err.response?.status === 409) {
        alert("Admin exists");
      } else {
        alert("Failed to create admin");
      }
    }
  };

  const createPharmacist = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin-panel/pharmacist`,
        newPharmacist,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Pharmacist created");
      setNewPharmacist({ name: "", email: "", password: "" });
      fetchAll();
    } catch (err) {
      if (err.response?.status === 409) {
        alert("Pharmacist exists");
      } else {
        alert("Failed to create pharmacist");
      }
    }
  };

  const deletePharmacist = async (id) => {
    if (!window.confirm("Delete pharmacist?")) return;
    const token = localStorage.getItem("adminToken");
    await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin-panel/pharmacists/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchAll();
    alert("Pharmacist Deleted");
  };

  const SidebarItem = ({ label, tab, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left
      ${
        activeTab === tab
          ? "bg-blue-600 text-white"
          : "text-slate-300 hover:bg-slate-700"
      }`}
    >
      {Icon && <Icon />}
      {label}
    </button>
  );

  return (
    <div className="min-h-screen flex bg-[#0f172a] text-white">
      {/* ================= SIDEBAR ================= */}
      <aside className="hidden md:flex w-56 bg-[#0f172a] border-r fixed inset-y-0 flex-col mt-16">
        <nav className="p-4 space-y-2">
          <SidebarItem label="Dashboard" tab="dashboard" />
          <SidebarItem label="Users" tab="users" icon={Icons.Users} />
          <SidebarItem
            label="Blood Requests"
            tab="requests"
            icon={Icons.Blood}
          />
          <SidebarItem
            label="Pharmacists"
            tab="pharmacists"
            icon={Icons.Pharmacist}
          />
        </nav>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 ml-0 md:ml-56 p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Admin Dashboard</h1>
        {/* ================= DASHBOARD (DESKTOP/TABLET ONLY) ================= */}
        {activeTab === "dashboard" && (
          <>
            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <StatCard title="Users" count={users.length} />
              <StatCard title="Blood Requests" count={requests.length} />
              <StatCard title="Pharmacists" count={pharmacists.length} />
            </div>

            {/* FORMS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <FormCard title="Create Admin" onSubmit={createAdmin}>
                <Input
                  type="email"
                  placeholder="Email"
                  value={newAdmin.email}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, email: e.target.value })
                  }
                />
                <PasswordInput
                  value={newAdmin.password}
                  show={showAdminPassword}
                  toggle={() => setShowAdminPassword((p) => !p)}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, password: e.target.value })
                  }
                />
              </FormCard>

              <FormCard title="Create Pharmacist" onSubmit={createPharmacist}>
                <Input
                  placeholder="Name"
                  value={newPharmacist.name}
                  onChange={(e) =>
                    setNewPharmacist({ ...newPharmacist, name: e.target.value })
                  }
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={newPharmacist.email}
                  onChange={(e) =>
                    setNewPharmacist({
                      ...newPharmacist,
                      email: e.target.value,
                    })
                  }
                />
                <PasswordInput
                  value={newPharmacist.password}
                  show={showPharmacistPassword}
                  toggle={() => setShowPharmacistPassword((p) => !p)}
                  onChange={(e) =>
                    setNewPharmacist({
                      ...newPharmacist,
                      password: e.target.value,
                    })
                  }
                />
              </FormCard>
            </div>
          </>
        )}

        {/* TABLES */}
        {/* ================= DESKTOP / TABLET ================= */}
        <div className="hidden sm:block">
          {activeTab === "users" && (
            <ResponsiveTable
              title="REGISTERED USERS"
              headers={["Name", "Email", "Phone"]}
              tableRows={users.map((u) => (
                <tr
                  key={u._id}
                  className="bg-[#0f172a] text-white border border-white"
                >
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.phone || "—"}</td>
                </tr>
              ))}
              mobileCards={[]}
            />
          )}

          {activeTab === "requests" && (
            <ResponsiveTable
              title="BLOOD REQUESTS"
              headers={["Email", "Blood Group", "Status"]}
              tableRows={requests.map((r) => (
                <tr
                  key={r._id}
                  className="bg-[#0f172a] text-white border border-white"
                >
                  <td className="p-3">{r.requester || "—"}</td>
                  <td className="p-3">{r.group}</td>
                  <td className="p-3">{r.status}</td>
                </tr>
              ))}
              mobileCards={[]}
            />
          )}

          {activeTab === "pharmacists" && (
            <ResponsiveTable
              title="PHARMACISTS"
              headers={["Name", "Email", "Action"]}
              tableRows={pharmacists.map((p) => (
                <tr
                  key={p._id}
                  className="bg-[#0f172a] text-white border border-white"
                >
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.email}</td>
                  <td className="p-3">
                    <button
                      onClick={() => deletePharmacist(p._id)}
                      className="bg-red-600 px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              mobileCards={[]}
            />
          )}
        </div>
        {/* ================= MOBILE ================= */}
        <div className="sm:hidden space-y-8">
          {/* USERS */}
          <ResponsiveTable
            title="REGISTERED USERS"
            headers={[]}
            tableRows={[]}
            mobileCards={users.map((u) => (
              <div
                key={u._id}
                className=" p-4 border rounded shadow-md shadow-blue-300"
              >
                <p className="font-semibold">{u.name}</p>
                <p className="text-sm break-all">{u.email}</p>
                <p className="text-sm">📞 {u.phone || "—"}</p>
              </div>
            ))}
          />

          {/* BLOOD REQUESTS */}
          <ResponsiveTable
            title="BLOOD REQUESTS"
            headers={[]}
            tableRows={[]}
            mobileCards={requests.map((r) => (
              <div
                key={r._id}
                className=" p-4 border rounded shadow-md shadow-blue-300"
              >
                <p>Email: {r.requester || "—"}</p>
                <p>Blood Group: {r.group}</p>
                <p>Status: {r.status}</p>
              </div>
            ))}
          />

          {/* PHARMACISTS */}
          <ResponsiveTable
            title="PHARMACISTS"
            headers={[]}
            tableRows={[]}
            mobileCards={pharmacists.map((p) => (
              <div
                key={p._id}
                className=" p-4 border rounded shadow-md shadow-blue-300"
              >
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm break-all">{p.email}</p>
                <button
                  onClick={() => deletePharmacist(p._id)}
                  className="mt-2 bg-red-600 px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          />
        </div>
      </main>
    </div>
  );
}

/* ================= REUSABLE ================= */

const StatCard = ({ title, count }) => (
  <div className="bg-[#0f172a] text-white border border-white p-4 rounded shadow-lg shadow-blue-400">
    <p className="text-white text-sm">{title}</p>
    <p className="text-2xl font-bold">{count}</p>
  </div>
);

const FormCard = ({ title, children, onSubmit }) => (
  <form
    onSubmit={onSubmit}
    className="bg-[#0f172a] text-white border border-white p-4 rounded shadow-lg shadow-blue-400 space-y-4"
  >
    <h2 className="font-extrabold">{title}</h2>
    {children}
    <button className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
  </form>
);

const Input = (props) => (
  <input
    {...props}
    required
    className="border w-full p-2 rounded bg-slate-500"
  />
);

const PasswordInput = ({ value, onChange, show, toggle }) => (
  <div className="relative">
    <input
      type={show ? "password" : "text"}
      value={value}
      onChange={onChange}
      className="border w-full p-2 rounded pr-10 bg-slate-500"
      required
    />
    <button
      type="button"
      onClick={toggle}
      className="absolute right-3 top-1/2 -translate-y-1/2"
    >
      {show ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
);

const ResponsiveTable = ({ title, headers, tableRows, mobileCards }) => (
  <div className="bg-[#0f172a] text-white border border-white rounded shadow-lg shadow-blue-400 mb-8">
    <h2 className="font-extrabold p-4">{title}</h2>

    <div className="hidden sm:block overflow-x-auto">
      <table className="min-w-full border-t">
        <thead className="bg-[#0f172a] text-white border border-white ">
          <tr>
            {headers.map((h) => (
              <th key={h} className="text-left p-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    </div>

    <div className="sm:hidden space-y-3 p-4">{mobileCards}</div>
  </div>
);
