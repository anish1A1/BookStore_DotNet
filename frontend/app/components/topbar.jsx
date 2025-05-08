"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import axios from "../../utils/axios";
import { XIcon } from "lucide-react"; // Assuming you have lucide-react for icons

export default function Topbar() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isClosed, setIsClosed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get("/announcements/public");
        const activeNotices = response.data.filter(notice => notice.status === "Active");
        setNotices(activeNotices);
      } catch (err) {
        setError("Failed to load notices.");
        console.error("Error fetching notices:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  // Hide Topbar on login, register, admin, and staff pages
  const isHidden = pathname?.startsWith("/login") || 
                   pathname?.startsWith("/register") || 
                   pathname?.startsWith("/admin") || 
                   pathname?.startsWith("/staff");

  if (loading) return null;
  if (error || notices.length === 0 || isHidden || isClosed) return null;

  return (
    <div
      role="region"
      aria-label="Site notices"
      className="fixed inset-x-0 top-0 z-50 bg-gradient-to-r from-yellow-200 to-yellow-100 text-black font-medium shadow"
    >
      <div className="max-w-screen-2xl mx-auto flex items-center px-6 py-2 gap-6 group">
        {/* Notice Scroller */}
        <div className="overflow-hidden flex-1">
          <div className="inline-flex whitespace-nowrap animate-marquee group-hover:pause">
            {notices.map((notice) => (
              <span key={notice.announcementId} className="mr-10 flex items-center">
                <span className="inline-block animate-bounce mr-1">📢</span>
                {notice.title}: {notice.message}
              </span>
            ))}
          </div>
        </div>

        {/* View All and Close Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/notice"
            className="bg-yellow-300 hover:bg-yellow-400 text-black px-3 py-1 rounded text-xs shadow transition duration-200"
            aria-label="View all notices"
          >
            View All
          </Link>
          <button
            onClick={() => setIsClosed(true)}
            className="text-black hover:text-gray-800 p-1 rounded"
            aria-label="Close notices"
          >
            <XIcon size={16} />
          </button>
        </div>
      </div>

      {/* Component-scoped styles for marquee and hover-pause */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .pause {
          animation-play-state: paused;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce {
          animation: bounce 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}