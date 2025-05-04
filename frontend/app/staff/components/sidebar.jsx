// app/staff/components/Sidebar.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardListIcon, FileTextIcon } from 'lucide-react'

import {
  LayoutDashboardIcon,
  BookOpenIcon,
  PercentIcon,
  BellIcon,
  ListOrderedIcon,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const menu = [
    {
      href: "/staff/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboardIcon size={20} />,
    },
    {
      href: "/staff/order",
      label: "Orders",
      icon: <FileTextIcon  size={20} />,
    },
    {
      href: "/staff/orderdetails",
      label: "Details",
      icon: <ClipboardListIcon  size={20} />,
    },
    // {
    //   href: "/staff/terms",
    //   label: "Terms",
    //   icon: <BellIcon size={20} />,
    // },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-white to-gray-100 border-r border-gray-200 sticky top-0 h-screen flex flex-col">
      <div className="px-6 py-8 text-2xl font-extrabold text-center border-b border-gray-200">
        <span className="text-blue-600">Book</span>
        <span className="text-yellow-400">Lux</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menu.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              {icon}
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-6 py-4 border-t border-gray-200 text-xs text-gray-500">
        v1.0.0
      </div>
    </aside>
  );
}
