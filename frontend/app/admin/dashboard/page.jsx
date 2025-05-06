"use client";

import { useRouter } from "next/navigation";
import { BarChart2Icon, PackageIcon, AlertTriangleIcon, TrendingUpIcon } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "../../../utils/axios";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    UserName: "",
    UserEmail: "",
    Password: "",
    Role: "Staff"
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");
      console.log("Fetching users from:", `${axios.defaults.baseURL}/user/getallusers`);
      const response = await axios.get("/user/getallusers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Raw API response:", response.data);
      const staffUsers = response.data.filter(user => user.role === "Staff");
      console.log("Filtered staff users:", staffUsers);
      setUsers(staffUsers);
      setError(null);
    } catch (error) {
      console.error("Error fetching users:", error);
      console.error("Error response:", error.response);
      setError(error.response?.status === 404 ? "Endpoint not found. Check server configuration." : error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");
      await axios.post("/user/create", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowForm(false);
      setFormData({ UserName: "", UserEmail: "", Password: "", Role: "Staff" });
      fetchUsers();
      setError(null);
    } catch (error) {
      console.error("Error creating user:", error);
      setError(error.response?.status === 404 ? "Endpoint not found. Check server configuration." : error.message);
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="mt-6 border border-gray-300 rounded-md p-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">Staff Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-gray-800 text-white rounded-md"
        >
          Add Staff
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full space-y-4">
            <h2 className="text-xl font-bold">Add New Staff</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                name="UserName"
                value={formData.UserName}
                onChange={handleFormChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="UserEmail"
                value={formData.UserEmail}
                onChange={handleFormChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="Password"
                value={formData.Password}
                onChange={handleFormChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gray-800 text-white rounded"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 border border-gray-300">Username</th>
            <th className="p-3 border border-gray-300">Email</th>
            <th className="p-3 border border-gray-300">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="3" className="p-3 text-center text-gray-500">
                No staff users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.userId} className="hover:bg-gray-50">
                <td className="p-3 border border-gray-300">{user.userName}</td>
                <td className="p-3 border border-gray-300">{user.userEmail}</td>
                <td className="p-3 border border-gray-300">{user.role}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300 space-y-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="border border-gray-300 rounded-md p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold">Total Sales Today</h2>
              <div className="p-2 bg-blue-100 rounded-md">
                <BarChart2Icon size={20} className="text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold">$1,248.88</div>
            <div className="text-sm text-green-600 mt-1">↑ 12% from yesterday</div>
          </div>
          <div className="border border-gray-300 rounded-md p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold">Pending Orders</h2>
              <div className="p-2 bg-yellow-100 rounded-md">
                <PackageIcon size={20} className="text-yellow-600" />
              </div>
            </div>
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-gray-600 mt-1">4 ready for pickup</div>
          </div>
          <div className="border border-gray-300 rounded-md p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold">Low Stock Alerts</h2>
              <div className="p-2 bg-red-100 rounded-md">
                <AlertTriangleIcon size={20} className="text-red-600" />
              </div>
            </div>
            <div className="text-2xl font-bold">8</div>
            <div className="text-sm text-red-600 mt-1">3 items out of stock</div>
          </div>
          <div className="border border-gray-300 rounded-md p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold">New Members</h2>
              <div className="p-2 bg-green-100 rounded-md">
                <TrendingUpIcon size={20} className="text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold">24</div>
            <div className="text-sm text-green-600 mt-1">↑ 8% this week</div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3 border border-gray-300 rounded-md p-4 bg-white">
            <h2 className="font-bold text-lg mb-4">Sales Overview</h2>
            <img
              src="https://assets.mailshake.com/wp-content/uploads/2022/08/11110919/sales-performance-dashboard.png"
              alt="Sales Overview Chart"
              className="w-full h-64 object-cover rounded mb-4"
            />
            <div className="flex justify-center gap-2">
              {["Today", "Week", "Month", "Quarter"].map((label, idx) => (
                <button
                  key={label}
                  className={`px-3 py-1 rounded ${idx === 0 ? "bg-gray-800 text-white" : "border border-gray-300"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="lg:w-1/3 border border-gray-300 rounded-md p-4 bg-white">
            <h2 className="font-bold text-lg mb-4">Real-time Sales Feed</h2>
            <div className="space-y-3 h-64 overflow-y-auto">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex gap-3 p-2 border-b border-gray-200 last:border-0">
                  <img
                    src={`https://picsum.photos/seed/book${i}/40/40`}
                    alt="book cover"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm">
                      <strong>{(i % 3) + 1} copies</strong> of <strong>Book Title {i + 1}</strong> sold
                    </div>
                    <div className="text-xs text-gray-500">
                      {i < 2 ? "Just now" : `${i * 5} minutes ago`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-center">
              <button className="text-sm text-gray-600 hover:underline">
                View All Activity
              </button>
            </div>
          </div>
        </div>
        <UserManagement />
        <div className="mt-6 border border-gray-300 rounded-md p-4 bg-white">
          <h2 className="font-bold text-lg mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Manage Books", emoji: "📚", path: "/admin/book-management" },
              { label: "Manage Discounts", emoji: "🏷️", path: "/admin/discount" },
              { label: "Announcements", emoji: "📢", path: "/admin/notice" },
              { label: "Reports", emoji: "📊", path: "/admin/reports" },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => router.push(action.path)}
                className="p-4 border border-gray-300 rounded-md hover:bg-gray-50 text-center"
              >
                <div className="mb-2 text-2xl">{action.emoji}</div>
                <div className="font-bold">{action.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}