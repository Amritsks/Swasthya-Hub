import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [data, setData] = useState({ users: [], requests: [], pharmacists: [] });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin-panel/users`, { headers }),
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin-panel/requests`, { headers }),
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin-panel/pharmacists`, { headers }),
    ]).then(([u, r, p]) => {
      setData({ users: u.data, requests: r.data, pharmacists: p.data });
    });
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Users ({data.users.length})</h2>
          {data.users.map((u) => <p key={u._id}>{u.name} - {u.email}</p>)}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Blood Requests ({data.requests.length})</h2>
          {data.requests.map((r) => <p key={r._id}>{r.group} - {r.status}</p>)}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Pharmacists ({data.pharmacists.length})</h2>
          {data.pharmacists.map((p) => <p key={p._id}>{p.userId}</p>)}
        </div>
      </div>
    </div>
  );
}
