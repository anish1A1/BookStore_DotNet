"use client";

import { useRouter } from "next/navigation";
import { BarChart2Icon, PackageIcon, AlertTriangleIcon, TrendingUpIcon, BookOpenIcon, TagIcon, BellIcon, PieChartIcon } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "../../../utils/axios";
import StaffManagement from "../components/StaffManagement";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStaff: 0,
    totalBooks: 0,
    totalOnSale: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token available");

        // Fetch all users
        const usersResponse = await axios.get("/user/getallusers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allUsers = usersResponse.data;

        // Fetch all books
        const booksResponse = await axios.get("/book", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allBooks = booksResponse.data.books || [];

        // Calculate stats
        const totalUsers = allUsers.length;
        const totalStaff = allUsers.filter(user => user.role === "Staff").length;
        const totalBooks = allBooks.length;
        const totalOnSale = allBooks.filter(book => book.isOnSale).length;

        setStats({
          totalUsers,
          totalStaff,
          totalBooks,
          totalOnSale,
        });
        setError(null);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setError(error.response?.status === 404 ? "Endpoint not found. Check server configuration." : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300 space-y-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="border border-gray-300 rounded-md p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold">Total Registered Users</h2>
              <div className="p-2 bg-blue-100 rounded-md">
                <TrendingUpIcon size={20} className="text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <div className="text-sm text-gray-600 mt-1">All registered accounts</div>
          </div>
          <div className="border border-gray-300 rounded-md p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold">Total Staff Users</h2>
              <div className="p-2 bg-yellow-100 rounded-md">
                <PackageIcon size={20} className="text-yellow-600" />
              </div>
            </div>
            <div className="text-2xl font-bold">{stats.totalStaff}</div>
            <div className="text-sm text-gray-600 mt-1">Staff members only</div>
          </div>
          <div className="border border-gray-300 rounded-md p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold">Total Books</h2>
              <div className="p-2 bg-green-100 rounded-md">
                <BookOpenIcon size={20} className="text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold">{stats.totalBooks}</div>
            <div className="text-sm text-gray-600 mt-1">Books in inventory</div>
          </div>
          <div className="border border-gray-300 rounded-md p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold">Total Books on Sale</h2>
              <div className="p-2 bg-red-100 rounded-md">
                <TagIcon size={20} className="text-red-600" />
              </div>
            </div>
            <div className="text-2xl font-bold">{stats.totalOnSale}</div>
            <div className="text-sm text-gray-600 mt-1">Books with discounts</div>
          </div>
        </div>
        
        <StaffManagement />
        <div className="mt-6 border border-gray-300 rounded-md p-4 bg-white">
          <h2 className="font-bold text-lg mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Manage Books", icon: BookOpenIcon, path: "/admin/book-management" },
              { label: "Manage Discounts", icon: TagIcon, path: "/admin/discount" },
              { label: "Announcements", icon: BellIcon, path: "/admin/notice" },
              { label: "Reports", icon: PieChartIcon, path: "/admin/dashboard" },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => router.push(action.path)}
                className="p-4 border border-gray-300 rounded-md hover:bg-gray-50 text-center"
              >
                <div className="mb-1 flex justify-center">
                  <action.icon size={25} className="text-gray-600" />
                </div>
                <div className="font-bold">{action.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}