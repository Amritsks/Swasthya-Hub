import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [pharmacists, setPharmacists] = useState([]);
  const [showAdminPassword, setShowAdminPassword] = useState(true);
  const [showPharmacistPassword, setShowPharmacistPassword] = useState(true);

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
    if (!token) {
      window.location.href = "/admin/login";
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    try {
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
    } catch (err) {
      console.error(err);
      localStorage.removeItem("adminToken");
      window.location.href = "/admin/login";
    }
  };

  // 🔐 Create Admin (NO TOKEN REQUIRED)
  const createAdmin = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/register`,
        {
          email: newAdmin.email,
          password: newAdmin.password,
        }
      );

      alert("Admin created");
      setNewAdmin({ email: "", password: "" });
    } catch (err) {
      console.error("Create admin error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to create admin");
    }
  };

  // 💊 Create Pharmacist
  const createPharmacist = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin-panel/pharmacist`,
        newPharmacist,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Pharmacist created");
      setNewPharmacist({ name: "", email: "", password: "" });
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create pharmacist");
    }
  };
  // ❌ Delete Pharmacist
  const deletePharmacist = async (id) => {
    const token = localStorage.getItem("adminToken");

    if (!window.confirm("Are you sure you want to delete this pharmacist?")) {
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin-panel/pharmacists/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Pharmacist deleted");
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete pharmacist");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[#0f172a] text-white min-h-screen">
      <h1 className="text-2xl text-white sm:text-3xl font-bold mb-6 sm:mb-8">
        Admin Dashboard
      </h1>

      {/* 📊 Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 ">
        <StatCard title="Users" count={users.length} />
        <StatCard title="Blood Requests" count={requests.length} />
        <StatCard title="Pharmacists" count={pharmacists.length} />
      </div>

      {/* ➕ Create Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-12">
        <FormCard title="Create Admin" onSubmit={createAdmin}>
          <Input
            placeholder="Email"
            value={newAdmin.email}
            onChange={(e) =>
              setNewAdmin({ ...newAdmin, email: e.target.value })
            }
          />

          <div className="relative">
            <Input
              placeholder="Password"
              value={newAdmin.password}
              type={showAdminPassword ? "password" : "text"}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, password: e.target.value })
              }
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowAdminPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
            >
              {showAdminPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
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
            placeholder="Email"
            value={newPharmacist.email}
            onChange={(e) =>
              setNewPharmacist({ ...newPharmacist, email: e.target.value })
            }
          />

          <div className="relative">
            <Input
              placeholder="Password"
              type={showPharmacistPassword ? "password" : "text"}
              value={newPharmacist.password}F
              onChange={(e) =>
                setNewPharmacist({ ...newPharmacist, password: e.target.value })
              }
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPharmacistPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
            >
              {showPharmacistPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </FormCard>
      </div>

      {/* 📋 Tables */}
      <ResponsiveTable
        title="Registered Users"
        headers={["Name", "Email", "Phone"]}
        tableRows={users.map((u) => (
          <tr key={u._id}>
            <td className="p-3">{u.name}</td>
            <td className="p-3">{u.email}</td>
            <td className="p-3">{u.phone || "—"}</td>
          </tr>
        ))}
        mobileCards={users.map((u) => (
          <div
            key={u._id}
            className="bg-[#1e293b] text-white rounded-lg p-4 shadow-sm"
          >
            <p className="font-semibold">{u.name}</p>
            <p className="text-sm text-gray-600 break-all">{u.email}</p>
            <p className="text-sm mt-1">📞 {u.phone || "—"}</p>
          </div>
        ))}
      />

      <ResponsiveTable
        title="Blood Requests"
        headers={["Email", "Blood Group", "Status"]}
        tableRows={requests.map((r) => (
          <tr key={r._id}>
            <td className="p-3">{r.requester || "—"}</td>
            <td className="p-3">{r.group}</td>
            <td className="p-3">{r.status}</td>
          </tr>
        ))}
        mobileCards={requests.map((r) => (
          <div
            key={r._id}
            className="bg-[#1e293b] text-white rounded-lg p-4 shadow-sm"
          >
            <p className="font-semibold">Email: {r.requester || "—"}</p>
            <p className="font-semibold">Blood Group: {r.group}</p>
            <p className="text-sm mt-1">Status: {r.status}</p>
          </div>
        ))}
      />

      <ResponsiveTable
        title="Pharmacists"
        headers={["Name", "Email", "Action"]}
        tableRows={pharmacists.map((p) => (
          <tr key={p._id}>
            <td className="p-3">{p.name}</td>
            <td className="p-3">{p.email}</td>
            <td className="p-3">
              <button
                onClick={() => deletePharmacist(p._id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
        mobileCards={pharmacists.map((p) => (
          <div
            key={p._id}
            className="bg-[#1e293b] text-white rounded-lg p-4 shadow-sm"
          >
            <p className="font-semibold">{p.name}</p>
            <p className="text-sm text-gray-600 break-all">{p.email}</p>
            <button
              onClick={() => deletePharmacist(p._id)}
              className="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        ))}
      />
    </div>
  );
}

/* ------------------ UI Components ------------------ */
const StatCard = ({ title, count }) => (
  <div className="bg-[#1e293b] text-white p-4 sm:p-6 rounded-xl shadow">
    <h3 className="text-gray-500 text-sm sm:text-base">{title}</h3>
    <p className="text-2xl sm:text-3xl font-bold">{count}</p>
  </div>
);

const FormCard = ({ title, children, onSubmit }) => (
  <form
    onSubmit={onSubmit}
    className="bg-[#1e293b] text-white p-4 sm:p-6 rounded-xl shadow space-y-4"
  >
    <h2 className="text-lg sm:text-xl font-semibold ">{title}</h2>
    {children}
    <button className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition">
      Create
    </button>
  </form>
);

const Input = (props) => (
  <input
    {...props}
    className="border bg-[#1e293b] text-white w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
);

const ResponsiveTable = ({ title, headers, tableRows, mobileCards }) => (
  <div className="bg-[#1e293b] text-white rounded-xl shadow mb-8 sm:mb-10">
    <h2 className="text-lg sm:text-xl font-semibold p-4">{title}</h2>

    {/* Desktop Table */}
    <div className="hidden sm:block overflow-x-auto ">
      <table className="min-w-full border-t">
        <thead className="bg-[#1e293b] text-white ">
          <tr>
            {headers.map((h) => (
              <th key={h} className="text-left p-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">{tableRows}</tbody>
      </table>
    </div>

    {/* Mobile Cards */}
    <div className="sm:hidden space-y-3 p-4">{mobileCards}</div>
  </div>
);
