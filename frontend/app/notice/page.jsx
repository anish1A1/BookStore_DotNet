"use client";

import { useState, useEffect } from "react";
import axios from "../../utils/axios";

export default function NoticePage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get("/announcements/public");
        setNotices(response.data);
      } catch (err) {
        setError("Failed to load notices.");
        console.error("Error fetching notices:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  if (loading) return <div className="p-6">Loading notices...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2">Notices</h1>
          {notices.length === 0 ? (
            <p className="text-gray-500 text-center py-10">No notices available at the moment.</p>
          ) : (
            <div className="grid gap-6">
              {notices.map((notice) => (
                <div
                  key={notice.announcementId}
                  className="bg-white p-5 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-semibold text-gray-800">{notice.title}</h2>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        notice.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : notice.status === "Scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {notice.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{notice.message}</p>
                  <p className="text-sm text-gray-500">
                    Valid: {new Date(notice.startDate).toLocaleDateString()} -{" "}
                    {new Date(notice.endDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}