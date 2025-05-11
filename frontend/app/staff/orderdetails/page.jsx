"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "../../../utils/axios";

export default function StaffOrderDetail() {
  const router = useRouter();
  const [orderHistory, setOrderHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // For username search
  const [claimCodeSearch, setClaimCodeSearch] = useState(""); // For claim code search
  const [statusFilter, setStatusFilter] = useState("All"); // For status filter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch order history from backend
  useEffect(() => {
    const fetchOrderHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token available");

        const response = await axios.get("/order/staff/history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Order history received:", response.data); // Debug log
        setOrderHistory(response.data);
        setFilteredHistory(response.data); // Initialize filtered history
      } catch (error) {
        console.error("Error fetching order history:", error.response?.data || error.message);
        setError(`Failed to fetch order history: ${error.response?.data?.Message || error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderHistory();
  }, []);

  // Filter history by username, claim code, and status
  useEffect(() => {
    let filtered = orderHistory;

    // Filter by username
    if (searchTerm) {
      filtered = filtered.filter((entry) =>
        (entry.user?.userName || "Unknown")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    // Filter by claim code
    if (claimCodeSearch) {
      filtered = filtered.filter((entry) =>
        entry.claimCode.toLowerCase().includes(claimCodeSearch.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "All") {
      filtered = filtered.filter((entry) => entry.status === statusFilter);
    }

    setFilteredHistory(filtered);
  }, [searchTerm, claimCodeSearch, statusFilter, orderHistory]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setClaimCodeSearch("");
    setStatusFilter("All");
  };

  if (loading) return <div className="bg-gray-100 min-h-screen p-6">Loading...</div>;
  if (error) return <div className="bg-gray-100 min-h-screen p-6 text-red-600">{error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300 space-y-6 max-w-4xl mx-auto">
        <div className="mb-4 text-sm">
          <Link href="/staff/dashboard" className="text-gray-600 hover:underline">
            Claim Orders
          </Link>
          <span className="mx-2"></span>
          <span>Orders History</span>
        </div>

        <div className="flex flex-col gap-6">
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Order History</h1>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Username Search */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Filter by username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full max-w-md p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
              </div>

              {/* Claim Code Search */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search by claim code..."
                  value={claimCodeSearch}
                  onChange={(e) => setClaimCodeSearch(e.target.value)}
                  className="w-full max-w-md p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                >
                  <option value="All">All Status</option>
                  <option value="Fulfilled">Fulfilled</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Clear Filters Button */}
              {(searchTerm || claimCodeSearch || statusFilter !== "All") && (
                <button
                  onClick={clearFilters}
                  className="text-gray-600 hover:text-gray-800 underline"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* History List */}
            <div className="border border-gray-300 rounded-md p-4 space-y-4">
              <h2 className="font-bold text-lg mb-4">Orders Processed by Staff</h2>
              {filteredHistory.length === 0 ? (
                <div className="text-gray-500">
                  {searchTerm || claimCodeSearch || statusFilter !== "All"
                    ? "No orders found matching the filters."
                    : "No orders have been claimed or canceled yet."}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredHistory.map((entry, idx) => {
                    const bookDetails = entry.orderItems
                      .map((item) => `${item.book.bookTitle} (Qty: ${item.quantity})`)
                      .join(", ");
                    return (
                      <div
                        key={idx}
                        className="border border-gray-200 rounded-md p-4 bg-gray-50 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-4 h-4 rounded-full ${
                              entry.status === "Fulfilled"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></div>
                          <h3 className="font-semibold text-lg">
                            {entry.status}
                          </h3>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <span className="font-medium">User:</span>{" "}
                            {entry.user?.userName || "Unknown"}
                          </p>
                          <p>
                            <span className="font-medium">Claim Code:</span>{" "}
                            {entry.claimCode}
                          </p>
                          <p>
                            <span className="font-medium">Books:</span>{" "}
                            {bookDetails}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}