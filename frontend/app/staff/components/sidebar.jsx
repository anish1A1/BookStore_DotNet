"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboardIcon,
  ClipboardListIcon,
  LogOutIcon,
  BookOpenIcon,
} from "lucide-react";
import { toast } from "sonner";
import { AuthContext } from "../../../utils/auth"; // Adjust the path as needed

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setUser } = useContext(AuthContext); // Assuming AuthContext has setUser

  const menu = [
    {
      href: "/staff/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboardIcon size={20} />,
    },
    {
      href: "/staff/order",
      label: "Orders",
      icon: <ClipboardListIcon size={20} />,
    },
    {
      href: "/staff/orderdetails",
      label: "Order Details",
      icon: < BookOpenIcon size={20} />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (setUser) {
      setUser(null); 
    }

    
    toast.success("Logged out successfully");

    
    router.push("/login"); 
  };

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
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
            >
              {React.cloneElement(icon, {
                className: isActive ? "text-blue-600" : "text-gray-500",
              })}
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="px-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-gray-200 rounded-lg"
        >
          <LogOutIcon size={20} className="text-red-600" />
          <span>Sign Out</span>
        </button>
      </div>

    </aside>
  );
}