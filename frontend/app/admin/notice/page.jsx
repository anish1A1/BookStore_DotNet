"use client";

import { useState, useEffect } from "react";
import {
  BellIcon,
  CalendarIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import axios from "../../../utils/axios";

export default function AdminNoticePage() {
  const [notices, setNotices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    message: "",
    isActive: false,
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");
      const response = await axios.get("/announcements", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotices(response.data);
    } catch (err) {
      setError("Failed to load notices.");
      console.error("Error fetching notices:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({ ...prev, isActive: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError("End date must be after start date.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");
      const payload = {
        title: formData.title,
        message: formData.message,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        isActive: formData.isActive,
      };

      if (editId) {
        await axios.put(`/announcements/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("/announcements", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setShowForm(false);
      setFormData({
        title: "",
        startDate: "",
        endDate: "",
        message: "",
        isActive: false,
      });
      setEditId(null);
      fetchNotices();
    } catch (err) {
      setError("Failed to save notice.");
      console.error("Error saving notice:", err);
    }
  };

  const handleEdit = (notice) => {
    setEditId(notice.announcementId);
    setFormData({
      title: notice.title,
      startDate: notice.startDate.split("T")[0],
      endDate: notice.endDate.split("T")[0],
      message: notice.message,
      isActive: notice.isActive,
    });
    setShowForm(true);
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");
      await axios.put(`/announcements/${id}/toggle-active`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotices();
    } catch (err) {
      setError("Failed to update notice status.");
      console.error("Error toggling active status:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");
      await axios.delete(`/announcements/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotices();
    } catch (err) {
      setError("Failed to delete notice.");
      console.error("Error deleting notice:", err);
    }
  };

  const handleDuplicate = (notice) => {
    setFormData({
      title: notice.title,
      startDate: "",
      endDate: "",
      message: notice.message,
      isActive: false,
    });
    setEditId(null);
    setShowForm(true);
  };

  if (loading) return <div>Loading notices...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Header + “New Notice” button */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-300 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notices Management</h1>
        <button
          onClick={() => {
            setEditId(null);
            setFormData({
              title: "",
              startDate: "",
              endDate: "",
              message: "",
              isActive: false,
            });
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md"
        >
          <PlusIcon size={16} />
          <span>New Notice</span>
        </button>
      </div>

      {/* Notices List */}
      <div className="grid gap-4">
        {notices.map((n) => (
          <div
            key={n.announcementId}
            className="bg-white rounded-lg shadow border border-gray-300 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">{n.title}</h2>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    n.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : n.status === "Scheduled"
                      ? "bg-blue-100 text-blue-800"
                      : n.status === "Draft"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {n.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <CalendarIcon size={14} />
                <span>
                  {new Date(n.startDate).toLocaleDateString()} –{" "}
                  {new Date(n.endDate).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 mb-4">{n.message}</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(n)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  Edit
                </button>
                {n.status === "Active" ? (
                  <button
                    onClick={() => handleToggleActive(n.announcementId, n.status)}
                    className="px-3 py-1 border border-red-300 text-red-600 rounded-md text-sm"
                  >
                    End Now
                  </button>
                ) : n.status === "Draft" ? (
                  <button
                    onClick={() => handleToggleActive(n.announcementId, n.status)}
                    className="px-3 py-1 bg-gray-800 text-white rounded-md text-sm"
                  >
                    Publish
                  </button>
                ) : n.status === "Ended" ? (
                  <button
                    onClick={() => handleDuplicate(n)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    Duplicate
                  </button>
                ) : (
                  <button
                    onClick={() => handleDelete(n.announcementId)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Notice Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editId ? "Edit Notice" : "Create New Notice"}</h2>
              <button onClick={() => setShowForm(false)}>
                <XIcon size={20} />
              </button>
            </div>

            {error && <div className="text-red-600 mb-4">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="e.g. Holiday Closure"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Date Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                    <span className="self-center">–</span>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded h-24"
                    placeholder="Enter notice details..."
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4"
                    />
                    <span className="text-sm font-medium">Publish Immediately</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-800 text-white rounded-md"
                >
                  {editId ? "Update Notice" : "Create Notice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}