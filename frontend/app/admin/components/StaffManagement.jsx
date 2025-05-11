"use client";

import { useState, useEffect } from "react";
import axios from "../../../utils/axios";

function StaffManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    UserName: "",
    UserEmail: "",
    Password: "",
    Role: "Staff",
    PhoneNumber: "",
  });
  const [error, setError] = useState(null);
  const [editUserId, setEditUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");
      const response = await axios.get("/user/getallusers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const staffUsers = response.data.filter(user => user.role === "Staff");
      setUsers(staffUsers);
      setError(null);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.response?.data?.Message || error.message || "Error fetching staff users");
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
      const url = editUserId ? `/user/${editUserId}` : "/user/create";
      const method = editUserId ? "put" : "post";
      const data = editUserId
        ? { UserName: formData.UserName, UserEmail: formData.UserEmail, PhoneNumber: formData.PhoneNumber }
        : formData;
      await axios({
        method,
        url,
        data,
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowForm(false);
      setFormData({ UserName: "", UserEmail: "", Password: "", Role: "Staff", PhoneNumber: "" });
      setEditUserId(null);
      fetchUsers();
      setError(null);
    } catch (error) {
      console.error("Error creating/updating user:", error);
      setError(error.response?.data?.Message || error.response?.data?.Details || error.message || "Error creating/updating staff user");
    }
  };

  const handleEdit = (user) => {
    setEditUserId(user.userId);
    setFormData({
      UserName: user.userName,
      UserEmail: user.userEmail,
      Password: "",
      Role: user.role,
      PhoneNumber: user.phoneNumber || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (userId) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token available");
        await axios.delete(`/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchUsers();
        setError(null);
      } catch (error) {
        console.error("Error deleting user:", error);
        setError(error.response?.data?.Message || error.message || "Error deleting staff user");
      }
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="mt-6 border border-gray-300 rounded-md p-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">Staff Management</h2>
        <button
          onClick={() => { setShowForm(true); setEditUserId(null); }}
          className="px-4 py-2 bg-gray-800 text-white rounded-md"
        >
          Add Staff
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full space-y-4">
            <h2 className="text-xl font-bold">{editUserId ? "Edit Staff" : "Add New Staff"}</h2>
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
            {!editUserId && (
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
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                type="text"
                name="PhoneNumber"
                value={formData.PhoneNumber}
                onChange={handleFormChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditUserId(null); }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gray-800 text-white rounded"
              >
                {editUserId ? "Save" : "Create"}
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
            <th className="p-3 border border-gray-300">Phone Number</th>
            <th className="p-3 border border-gray-300">Role</th>
            <th className="p-3 border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" className="p-3 text-center text-gray-500">
                No staff users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.userId} className="hover:bg-gray-50">
                <td className="p-3 border border-gray-300">{user.userName}</td>
                <td className="p-3 border border-gray-300">{user.userEmail}</td>
                <td className="p-3 border border-gray-300">{user.phoneNumber || "N/A"}</td>
                <td className="p-3 border border-gray-300">{user.role}</td>
                <td className="p-3 border border-gray-300">
                  <button
                    onClick={() => handleEdit(user)}
                    className="mr-2 px-4 py-1 bg-blue-900 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.userId)}
                    className="px-4 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StaffManagement;