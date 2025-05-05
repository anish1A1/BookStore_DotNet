// app/admin/notice/page.jsx
"use client";

import { useState } from "react";
import {
  BellIcon,
  CalendarIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";

const SAMPLE_NOTICES = [
  {
    id: 1,
    title: "Summer Reading Club",
    range: "Jun 1 – Aug 31, 2025",
    status: "Active",
    statusColor: "green",
    description:
      "Join our free Summer Reading Club and earn points for every book you finish!",
    
  },
  {
    id: 2,
    title: "Mid-Year Clearance",
    range: "Jul 15 – Jul 31, 2025",
    status: "Scheduled",
    statusColor: "blue",
    description:
      "Huge month-end discounts on bestsellers—up to 70% off!",
    
  },
  {
    id: 3,
    title: "Store Maintenance",
    range: "Aug 5, 2025",
    status: "Draft",
    statusColor: "yellow",
    description:
      "Planned downtime for site maintenance on August 5. Expect brief interruptions.",
    
  },
  {
    id: 4,
    title: "Flash Fiction Contest",
    range: "Sep 10 – Sep 12, 2025",
    status: "Ended",
    statusColor: "gray",
    description:
      "Congratulations to our winners! See top stories on the homepage now.",
    
  },
];

export default function AdminNoticePage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header + “New Notice” button */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-300 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notices Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md"
        >
          <PlusIcon size={16} />
          <span>New Notice</span>
        </button>
      </div>

      {/* Notices List */}
      <div className="grid gap-4">
        {SAMPLE_NOTICES.map((n) => (
          <div
            key={n.id}
            className="bg-white rounded-lg shadow border border-gray-300 overflow-hidden"
          >
           
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">{n.title}</h2>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    n.statusColor === "green"
                      ? "bg-green-100 text-green-800"
                      : n.statusColor === "blue"
                      ? "bg-blue-100 text-blue-800"
                      : n.statusColor === "yellow"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {n.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <CalendarIcon size={14} />
                <span>{n.range}</span>
              </div>
              <p className="text-gray-700 mb-4">{n.description}</p>
              <div className="flex justify-end gap-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                  Edit
                </button>
                {n.status === "Active" ? (
                  <button className="px-3 py-1 border border-red-300 text-red-600 rounded-md text-sm">
                    End Now
                  </button>
                ) : n.status === "Draft" ? (
                  <button className="px-3 py-1 bg-gray-800 text-white rounded-md text-sm">
                    Publish
                  </button>
                ) : n.status === "Ended" ? (
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                    Duplicate
                  </button>
                ) : (
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">
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
              <h2 className="text-xl font-bold">Create New Notice</h2>
              <button onClick={() => setShowForm(false)}>
                <XIcon size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="e.g. Holiday Closure"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Date Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <span className="self-center">–</span>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded h-24"
                  placeholder="Enter notice details..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Banner Image URL
                </label>
                <input
                  type="url"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="https://example.com/banner.jpg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-gray-800 text-white rounded-md">
                Create Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
