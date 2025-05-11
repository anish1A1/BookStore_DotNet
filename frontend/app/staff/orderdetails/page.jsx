"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "../../../utils/axios";

export default function StaffOrderDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const claimCode = searchParams.get("claimCode");
  const [order, setOrder] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!claimCode) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/order/claim/${claimCode}`);
        let orderData = response.data;

        if (!orderData.User) {
          const userResponse = await axios.get(`/user/${orderData.UserId}`);
          orderData.User = userResponse.data;
        }
        setOrder(orderData);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [claimCode]);

  const handleFulfillOrder = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");

      await axios.put(`/order/${order.OrderId}/fulfill`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refetch the order to get the updated status
      const response = await axios.get(`/order/claim/${claimCode}`);
      let updatedOrder = response.data;
      if (!updatedOrder.User) {
        const userResponse = await axios.get(`/user/${updatedOrder.UserId}`);
        updatedOrder.User = userResponse.data;
      }
      setOrder(updatedOrder);
      setShowConfirmation(true);
    } catch (error) {
      console.error("Error fulfilling order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");

      await axios.put(`/order/${order.OrderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refetch the order to get the updated status
      const response = await axios.get(`/order/claim/${claimCode}`);
      let updatedOrder = response.data;
      if (!updatedOrder.User) {
        const userResponse = await axios.get(`/user/${updatedOrder.UserId}`);
        updatedOrder.User = userResponse.data;
      }
      setOrder(updatedOrder);
      setShowConfirmation(true);
    } catch (error) {
      console.error("Error cancelling order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="bg-gray-100 min-h-screen p-6">Loading...</div>;
  if (!order) return <div className="bg-gray-100 min-h-screen p-6">Order not found</div>;

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300 space-y-6 max-w-4xl mx-auto">
        <div className="mb-4 text-sm">
          <Link href="/staff/orders" className="text-gray-600 hover:underline">
            Pending Orders
          </Link>
          <span className="mx-2"></span>
          <span>Order #{order.OrderId}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">Order #{order.OrderId}</h1>
                <div className="text-gray-600">{new Date(order.OrderDate).toLocaleString()}</div>
              </div>
              <div className={`px-3 py-1 rounded text-sm ${
                order.Status === "Fulfilled" ? "bg-green-100 text-green-800" :
                order.Status === "Cancelled" ? "bg-red-100 text-red-800" :
                "bg-yellow-100 text-yellow-800"
              }`}>
                {order.Status}
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-md">
              <div className="text-sm mb-1">Claim code</div>
              <div className="text-xl font-bold tracking-wider">
                {order.ClaimCode}
              </div>
            </div>

            <div className="border border-gray-300 rounded-md p-4">
              <h2 className="font-bold text-lg mb-3">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ["Name", order.User?.UserName || "Unknown"],
                  ["Email", order.User?.UserEmail || "Unknown"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="text-sm text-gray-500">{label}</div>
                    <div>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-gray-300 rounded-md p-4 space-y-4">
              <h2 className="font-bold text-lg mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.OrderItems.map((item, i) => (
                  <div key={i} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                    <div className="w-16">
                      <img
                        src={`https://picsum.photos/seed/book${i}/80/120`}
                        alt={item.Book.BookTitle}
                        className="w-full h-20 object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">{item.Book.BookTitle}</h3>
                      <div className="text-sm text-gray-600">{item.Book.AuthorName}</div>
                      <div className="text-sm text-gray-600">ISBN: {item.Book.ISBN}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${item.UnitPrice.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">Qty: {item.Quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <div className="flex justify-between">Subtotal <span>${order.TotalAmount.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-200">
                  Total <span>${order.TotalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="border border-gray-300 rounded-md p-4 space-y-4">
              <h2 className="font-bold text-lg mb-4">Order Actions</h2>
              <div>
                <div className="text-sm text-gray-500 mb-1">Current Status</div>
                <div className={`px-3 py-1 rounded text-sm ${
                  order.Status === "Fulfilled" ? "bg-green-100 text-green-800" :
                  order.Status === "Cancelled" ? "bg-red-100 text-red-800" :
                  "bg-yellow-100 text-yellow-800"
                }`}>
                  {order.Status}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Staff Notes</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded h-24"
                  placeholder="Add notes about this order..."
                />
              </div>
              <div className="space-y-3">
                {order.Status === "Pending" && (
                  <>
                    <button
                      onClick={handleFulfillOrder}
                      className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Mark as Fulfilled"}
                    </button>
                    <button
                      onClick={handleCancelOrder}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-md"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Cancel Order"}
                    </button>
                  </>
                )}
                <button
                  onClick={() => router.push("/staff/orders")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  Return to Orders
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 rounded-md">
                  Contact Customer
                </button>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="font-bold text-lg mb-3">Order Timeline</h3>
                <div className="space-y-3">
                  {[
                    { label: "Order Placed", date: new Date(order.OrderDate).toLocaleString(), completed: true },
                    { label: "Ready for Pickup", date: order.Status === "Fulfilled" ? new Date().toLocaleString() : order.Status === "Cancelled" ? "Cancelled" : "Pending", completed: order.Status === "Fulfilled" },
                    { label: "Completed", date: order.Status === "Fulfilled" ? "Pending" : "Not Applicable", completed: false },
                  ].map((t, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div
                        className={`w-4 h-4 rounded-full mt-1 ${t.completed ? "bg-gray-800" : "bg-gray-300"}`}
                      ></div>
                      <div>
                        <div className={t.completed ? "" : "text-gray-400"}>{t.label}</div>
                        <div className="text-xs text-gray-500">{t.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {showConfirmation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Order Action Completed</h2>
              <p className="mb-6">
                Order #{order.OrderId} has been marked as {order.Status.toLowerCase()}. An email notification has been sent to the customer.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  Close
                </button>
                <button
                  onClick={() => router.push("/staff/orders")}
                  className="px-4 py-2 bg-gray-800 text-white rounded-md"
                >
                  Return to Orders
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}