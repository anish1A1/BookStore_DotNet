"use client";

import { useState } from "react";
import { XIcon } from "lucide-react";
import axios from "../../../utils/axios";

function Modal({ isOpen, onClose, order, onFulfill, onCancel }) {
  if (!isOpen || !order) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-3" style={{ background: "var(--sky)" }}>
          <h3 className="text-lg font-semibold text-white">Order Details</h3>
          <button onClick={onClose} className="text-white hover:opacity-80">
            <XIcon size={20} />
          </button>
        </div>
        <div className="space-y-2 px-6 py-5" style={{ background: "var(--pale)" }}>
          {["Claim Code", "Name", "Email", "Items", "Total"].map((label, i) => {
            const key = label.split(" ").join("").toLowerCase();
            const value = order[key] || (label === "Claim Code" ? order.claimCode : order.user?.[key] || "Unknown");
            return (
              <p key={i} className="text-gray-800">
                <span className="font-medium">{label}:</span> {value || "Unknown"}
              </p>
            );
          })}
        </div>
        <div className="flex">
          <button
            onClick={() => { onFulfill(); onClose(); }}
            className="flex-1 py-3 font-medium text-white"
            style={{ background: "var(--slate)" }}
          >
            Fulfill Order
          </button>
          <button
            onClick={() => { onCancel(); onClose(); }}
            className="flex-1 py-3 font-medium text-white"
            style={{ background: "var(--navy)" }}
          >
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StaffDashboardPage() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    const lookup = code.trim().toUpperCase();
    setMessage("");
    setSelectedOrder(null);
    setLoading(true);

    if (!lookup) {
      setMessage("❌ Please enter a claim code.");
      setMessageColor("text-red-600");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");
      const response = await axios.get(`/order/claim/${lookup}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const order = response.data;
      setSelectedOrder({
        claimCode: order.claimCode,
        name: order.user?.userName || "Unknown",
        email: order.user?.userEmail || "Unknown",
        items: `${order.orderItems?.length || 0} books`,
        total: `$${order.totalAmount?.toFixed(2) || "0.00"}`,
      });
    } catch (error) {
      setMessage("❌ Invalid claim code or no token available.");
      setMessageColor("text-red-600");
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fulfill = () => {
    setMessage("✅ Books successfully fulfilled.");
    setMessageColor("text-green-600");
    // Optionally call backend to update status
  };

  const cancel = () => {
    setMessage("⚠️ Request has been cancelled.");
    setMessageColor("text-red-600");
    // Optionally call backend to cancel
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-4xl font-bold text-white mb-6">Welcome Staff</h1>
        <form
          onSubmit={handleSearch}
          className="flex w-full max-w-lg overflow-hidden rounded-full bg-white shadow-lg"
        >
          <input
            type="text"
            placeholder="Enter claim code…"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 px-6 py-3 text-gray-800 focus:outline-none"
            disabled={loading}
          />
          <button
            type="submit"
            className="px-6 font-medium text-white hover:opacity-90"
            style={{ background: "var(--slate)" }}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-center font-medium ${messageColor}`}>
            {message}
          </p>
        )}
      </div>
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        onFulfill={fulfill}
        onCancel={cancel}
      />
    </>
  );
}