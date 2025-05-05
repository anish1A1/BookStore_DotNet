// app/staff/orders/page.jsx
"use client";

import { useRouter } from "next/navigation";

export default function StaffOrdersPage() {
  const router = useRouter();

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300 space-y-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Pending Orders</h1>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by claim code or order number..."
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex gap-2">
            <select className="border border-gray-300 rounded p-2">
              <option>All Orders</option>
              <option>Processing</option>
              <option>Ready for Pickup</option>
            </select>
            <select className="border border-gray-300 rounded p-2">
              <option>Sort by Date</option>
              <option>Sort by Claim Code</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {[
                  "Claim Code",
                  "Order #",
                  "Date",
                  "Customer",
                  "Items",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left p-3 border border-gray-300"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-3 border border-gray-300 font-bold">
                    BC-12345-{i}789
                  </td>
                  <td className="p-3 border border-gray-300">
                    #ORD-87654{i}21
                  </td>
                  <td className="p-3 border border-gray-300">
                    Jan {20 - i}, 2023
                  </td>
                  <td className="p-3 border border-gray-300">John Doe</td>
                  <td className="p-3 border border-gray-300">
                    {i + 1} items
                  </td>
                  <td className="p-3 border border-gray-300">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        i % 2 === 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {i % 2 === 0 ? "pending" : "Ready for Pickup"}
                    </span>
                  </td>
                  <td className="p-3 border border-gray-300">
                    <button
                      onClick={() => router.push("/staff/orderdetails")}
                      className="px-3 py-1 bg-gray-800 text-white text-sm rounded-md"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing 1-6 of 24 orders
          </div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-300 rounded">
              Previous
            </button>
            <button className="px-3 py-1 bg-gray-800 text-white rounded">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded">
              3
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
