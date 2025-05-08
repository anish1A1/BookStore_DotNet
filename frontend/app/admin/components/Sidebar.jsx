// app/admin/components/Sidebar.jsx
"use client";

import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";
import React, {useContext, useEffect} from "react";
import {
  LayoutDashboardIcon,
  BookOpenIcon,
  PercentIcon,
  BellIcon,
  LogOutIcon,
} from "lucide-react";
import { AuthContext } from "../../../utils/auth";
import { toast } from "sonner";

export default function Sidebar() {
  const {logout} = useContext(AuthContext);
  const pathname = usePathname();
  const router = useRouter();
  const iconColor = typeof window !== "undefined" ? "text-blue-600" : "text-gray-500";

  const menu = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboardIcon size={20} />,
    },
    {
      href: "/admin/book-management",
      label: "Books",
      icon: <BookOpenIcon size={20} className={`lucide lucide-book-open ${iconColor}`} />
      ,
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
  // useEffect(() => {
  //   if (typeof window === "undefined") return;
  
  
  
  // }, [logout, router]);
  const handleLogOut = async () => {
    try {
      const response = await logout(router);
      toast.success(response?.message || "Logged out successfully");
    } catch (error) {
      toast.error("Logout failed!");
    }
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
        <Link key={href} href={href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
          ${isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-200'}
        `}>
          <span className="flex-shrink-0">
            {React.cloneElement(icon, { className: isActive ? 'text-blue-600' : 'text-gray-500' })}
          </span>
          <span className="truncate">{label}</span>
        </Link>
          );
        })}
        <button
          onClick={handleLogOut}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-gray-200 rounded-lg"
        >
          <LogOutIcon size={20} className="text-red-600" />
          <span>Sign Out</span>
        </button>
      </nav>
        

      {/* Footer / Version */}
      <div className="px-6 py-4 border-t border-gray-200 text-xs text-gray-500">
        
        v1.0.0
      </div>
    </aside>
  );
}
