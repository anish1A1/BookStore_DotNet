"use client";

import { useState } from "react";
import { XIcon } from "lucide-react";

const ORDERS = {
  CC1001: { memberId: "M001", name: "Alice Johnson", email: "alice.j@mail.com", items: "3 books", total: "$30" },
  CC1002: { memberId: "M002", name: "Bob Smith",     email: "bob.s@mail.com",   items: "2 books", total: "$20" },
  CC1003: { memberId: "M003", name: "Cara Martinez", email: "cara.m@mail.com",  items: "1 book",  total: "$10" },
};

function Modal({ isOpen, onClose, order, onFulfill, onCancel }) {
  if (!isOpen || !order) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3" style={{ background: "var(--sky)" }}>
          <h3 className="text-lg font-semibold text-white">Order Details</h3>
          <button onClick={onClose} className="text-white hover:opacity-80">
            <XIcon size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-2 px-6 py-5" style={{ background: "var(--pale)" }}>
          {["Claim Code", "Member ID", "Name", "Email", "Items", "Total"].map((label, i) => {
            const key = label.split(" ").join("").toLowerCase();
            const value = order[key] || order[label === "Claim Code" ? "code" : key];
            return (
              <p key={i} className="text-gray-800">
                <span className="font-medium">{label}:</span> {value}
              </p>
            );
          })}
        </div>

        {/* Actions */}
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

  const handleSearch = (e) => {
    e.preventDefault();
    const lookup = code.trim().toUpperCase();
    setMessage("");
    setSelectedOrder(null);

    if (!lookup) {
      setMessage("❌ Please enter a claim code.");
      setMessageColor("text-red-600");
    } else if (ORDERS[lookup]) {
      setSelectedOrder({ code: lookup, ...ORDERS[lookup] });
    } else {
      setMessage("❌ Invalid claim code.");
      setMessageColor("text-red-600");
    }
  };

  const fulfill = () => {
    setMessage("✅ Books successfully fulfilled.");
    setMessageColor("text-green-600");
  };
  const cancel = () => {
    setMessage("⚠️ Request has been cancelled.");
    setMessageColor("text-red-600");
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
          />
          <button
            type="submit"
            className="px-6 font-medium text-white hover:opacity-90"
            style={{ background: "var(--slate)" }}
          >
            Search
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
