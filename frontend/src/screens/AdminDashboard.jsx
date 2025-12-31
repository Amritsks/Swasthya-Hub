import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [pharmacists, setPharmacists] = useState([]);

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

  // 🔐 Create Admin
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

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* 📊 Summary */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <StatCard title="Users" count={users.length} />
        <StatCard title="Blood Requests" count={requests.length} />
        <StatCard title="Pharmacists" count={pharmacists.length} />
      </div>

      {/* ➕ Create Section */}
      <div className="grid grid-cols-2 gap-8 mb-12">
        <FormCard title="Create Admin" onSubmit={createAdmin}>
          <Input
            placeholder="Email"
            value={newAdmin.email}
            onChange={(e) =>
              setNewAdmin({ ...newAdmin, email: e.target.value })
            }
          />
          <Input
            placeholder="Password"
            type="password"
            value={newAdmin.password}
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
            placeholder="Email"
            value={newPharmacist.email}
            onChange={(e) =>
              setNewPharmacist({ ...newPharmacist, email: e.target.value })
            }
          />
          <Input
            placeholder="Password"
            type="password"
            value={newPharmacist.password}
            onChange={(e) =>
              setNewPharmacist({ ...newPharmacist, password: e.target.value })
            }
          />
        </FormCard>
      </div>

      {/* 📋 Tables */}
      <Table title="Registered Users" headers={["Name", "Email"]}>
        {users.map((u) => (
          <tr key={u._id}>
            <td>{u.name}</td>
            <td>{u.email}</td>
          </tr>
        ))}
      </Table>

      <Table title="Blood Requests" headers={["Blood Group", "Status"]}>
        {requests.map((r) => (
          <tr key={r._id}>
            <td>{r.group}</td>
            <td>{r.status}</td>
          </tr>
        ))}
      </Table>

      <Table title="Pharmacists" headers={["Name", "Email"]}>
        {pharmacists.map((p) => (
          <tr key={p._id}>
            <td className="p-2">{p.name}</td>
            <td className="p-2">{p.email}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

/* ------------------ UI Components ------------------ */

const StatCard = ({ title, count }) => (
  <div className="bg-white p-6 rounded-xl shadow">
    <h3 className="text-gray-500">{title}</h3>
    <p className="text-3xl font-bold">{count}</p>
  </div>
);

const FormCard = ({ title, children, onSubmit }) => (
  <form
    onSubmit={onSubmit}
    className="bg-white p-6 rounded-xl shadow space-y-4"
  >
    <h2 className="text-xl font-semibold">{title}</h2>
    {children}
    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
      Create
    </button>
  </form>
);

const Input = ({ ...props }) => (
  <input {...props} className="border w-full p-2 rounded" required />
);

const Table = ({ title, headers, children }) => (
  <div className="bg-white rounded-xl shadow mb-10">
    <h2 className="text-xl font-semibold p-4">{title}</h2>
    <table className="w-full border-t">
      <thead className="bg-gray-200">
        <tr>
          {headers.map((h) => (
            <th key={h} className="text-left p-3">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y">{children}</tbody>
    </table>
  </div>
);
