"use client";

import Link from "next/link";

const notices = [
  "Free delivery on orders above Rs. 1000!",
  "Summer Book Sale is live — up to 50% off!",
  "New arrivals: Bestsellers from 2024!",
  "Join our book club for exclusive discounts!",
];

export default function Topbar() {
  return (
    <div
      role="region"
      aria-label="Site notices"
      className="fixed inset-x-0 top-0 z-50 bg-gradient-to-r from-yellow-200 to-yellow-100 text-black text- font-medium shadow"
    >
      <div className="max-w-screen-2xl mx-auto flex items-center px-6 py-2 gap-6 group">
        {/* Notice Scroller */}
        <div className="overflow-hidden flex-1">
          <div className="inline-flex whitespace-nowrap animate-marquee group-hover:pause">
            {notices.map((notice, idx) => (
              <span key={idx} className="mr-10 flex items-center">
                <span className="inline-block animate-bounce mr-1">📢</span>
                {notice}
              </span>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <Link
          href="/notice"
          className="shrink-0 bg-yellow-300 hover:bg-yellow-400 text-black px-3 py-1 rounded text-xs shadow transition duration-200"
          aria-label="View all notices"
        >
          View All
        </Link>
      </div>

      {/* Component-scoped styles for marquee and hover-pause */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .pause {
          animation-play-state: paused;
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        .animate-bounce {
          animation: bounce 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
