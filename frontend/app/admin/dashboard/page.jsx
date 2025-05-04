// app/admin/dashboard/page.jsx
"use client";

import { useRouter } from "next/navigation";
import {
  BarChart2Icon,
  PackageIcon,
  AlertTriangleIcon,
  TrendingUpIcon,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300 space-y-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="border border-gray-300 rounded-md p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold">Total Sales Today</h2>
              <div className="p-2 bg-blue-100 rounded-md">
                <BarChart2Icon size={20} className="text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold">$1,248.88</div>
            <div className="text-sm text-green-600 mt-1">
              ↑ 12% from yesterday
            </div>
          </div>

          <div className="border border-gray-300 rounded-md p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold">Pending Orders</h2>
              <div className="p-2 bg-yellow-100 rounded-md">
                <PackageIcon size={20} className="text-yellow-600" />
              </div>
            </div>
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-gray-600 mt-1">
              4 ready for pickup
            </div>
          </div>

          <div className="border border-gray-300 rounded-md p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold">Low Stock Alerts</h2>
              <div className="p-2 bg-red-100 rounded-md">
                <AlertTriangleIcon size={20} className="text-red-600" />
              </div>
            </div>
            <div className="text-2xl font-bold">8</div>
            <div className="text-sm text-red-600 mt-1">
              3 items out of stock
            </div>
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
          {/* Sales Chart */}
          <div className="lg:w-2/3 border border-gray-300 rounded-md p-4 bg-white">
            <h2 className="font-bold text-lg mb-4">Sales Overview</h2>
            {/* Real image from the web */}
            <img
              src="https://via.placeholder.com/800x256.png?text=Sales+Overview+Chart"
              alt="Sales Overview Chart"
              className="w-full h-64 object-cover rounded mb-4"
            />
            <div className="flex justify-center gap-2">
              {["Today", "Week", "Month", "Quarter"].map((label, idx) => (
                <button
                  key={label}
                  className={`px-3 py-1 rounded ${
                    idx === 0
                      ? "bg-gray-800 text-white"
                      : "border border-gray-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Real-time Sales Feed */}
          <div className="lg:w-1/3 border border-gray-300 rounded-md p-4 bg-white">
            <h2 className="font-bold text-lg mb-4">Real-time Sales Feed</h2>
            <div className="space-y-3 h-64 overflow-y-auto">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-2 border-b border-gray-200 last:border-0"
                >
                  <img
                    src={`https://picsum.photos/seed/book${i}/40/40`}
                    alt="book cover"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm">
                      <strong>{(i % 3) + 1} copies</strong> of{" "}
                      <strong>Book Title {i + 1}</strong> sold
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

        {/* Quick Actions */}
        <div className="mt-6 border border-gray-300 rounded-md p-4 bg-white">
          <h2 className="font-bold text-lg mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Manage Books", emoji: "📚", path: "/admin/book-management" },
              { label: "Manage Discounts", emoji: "🏷️", path: "/admin/discounts" },
              { label: "Announcements", emoji: "📢", path: "/admin/announcements" },
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
