// app/staff/page.jsx
"use client";

import { useState } from "react";
import Sidebar from "../staff/components/sidebar";

export default function StaffLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
