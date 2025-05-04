"use client";

import { useState } from "react";

const ORDERS = {
  CC1001: {
    memberId: "M001",
    name: "Alice Johnson",
    email: "alice.j@mail.com",
    items: "3 books",
    total: "$30",
  },
  CC1002: {
    memberId: "M002",
    name: "Bob Smith",
    email: "bob.s@mail.com",
    items: "2 books",
    total: "$20",
  },
  CC1003: {
    memberId: "M003",
    name: "Cara Martinez",
    email: "cara.m@mail.com",
    items: "1 book",
    total: "$10",
  },
};

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          ×
        </button>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default function StaffDashboardPage() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("text-red-600");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const lookup = code.trim().toUpperCase();
    setMessage("");
    setSelectedOrder(null);

    if (!lookup) {
      setMessage("❌ Please enter a claim code.");
      setMessageColor("text-red-600");
      return;
    }
    if (ORDERS[lookup]) {
      setSelectedOrder({ code: lookup, ...ORDERS[lookup] });
    } else {
      setMessage("❌ Invalid claim code.");
      setMessageColor("text-red-600");
    }
  };

  const fulfill = () => {
    setMessage("✅ Books successfully fulfilled.");
    setMessageColor("text-green-600");
    setSelectedOrder(null);
  };

  const cancel = () => {
    setMessage("⚠️ Request is cancelled.");
    setMessageColor("text-red-600");
    setSelectedOrder(null);
  };

  return (
    <>
      <div className="bg-gray-100 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <header className="bg-blue-600 text-white p-4">
            <h1 className="text-2xl font-semibold text-center">
              Staff Dashboard
            </h1>
          </header>

          {/* Main */}
          <main className="p-6">
            {/* Welcome */}
            <div className="mb-6 text-center">
              <h2 className="text-xl font-medium text-gray-800">
                Welcome, Staff!
              </h2>
              <p className="text-gray-600">
                Please enter a claim code below to retrieve order details.
              </p>
            </div>

            {/* Search Form */}
            <form id="searchForm" onSubmit={handleSearch} className="flex mb-2">
              <input
                id="claimInput"
                type="text"
                placeholder="e.g. CC1001"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none"
              >
                Search
              </button>
            </form>

            {/* Message */}
            {message && (
              <p className={`mt-2 h-5 text-center ${messageColor}`}>
                {message}
              </p>
            )}
          </main>
        </div>
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      >
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-md mb-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Order Details
          </h3>
          <p className="text-gray-700">
            <span className="font-medium">Claim Code:</span>{" "}
            {selectedOrder?.code}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Member ID:</span>{" "}
            {selectedOrder?.memberId}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Member Name:</span>{" "}
            {selectedOrder?.name}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Email:</span>{" "}
            {selectedOrder?.email}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Items:</span>{" "}
            {selectedOrder?.items}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Total:</span>{" "}
            {selectedOrder?.total}
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={fulfill}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
          >
            Fulfill Order
          </button>
          <button
            onClick={cancel}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
          >
            Cancel Order
          </button>
        </div>
      </Modal>
    </>
  );
}
