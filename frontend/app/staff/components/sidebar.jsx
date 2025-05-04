// app/admin/components/Sidebar.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  LayoutDashboardIcon,
  BookOpenIcon,
  PercentIcon,
  BellIcon,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const menu = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboardIcon size={20} />,
    },
    {
      href: "/admin/book-management",
      label: "Books",
      icon: <BookOpenIcon size={20} />,
    },
    {
      href: "/admin/discount",
      label: "Discounts",
      icon: <PercentIcon size={20} />,
    },
    {
      href: "/admin/notice",
      label: "Notices",
      icon: <BellIcon size={20} />,
    },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-white to-gray-100 border-r border-gray-200 sticky top-0 h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-8 text-2xl font-extrabold flex items-center justify-center border-b border-gray-200">
        <span className="text-blue-600">Book </span>
        <span className="text-[#F0C40E]">Lux</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menu.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors 
                ${isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-200'}
              `}
            >
              <span className="flex-shrink-0">
                {React.cloneElement(icon, { className: isActive ? 'text-blue-600' : 'text-gray-500' })}
              </span>
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Version */}
      <div className="px-6 py-4 border-t border-gray-200 text-xs text-gray-500">
        v1.0.0
      </div>
    </aside>
  );
}
