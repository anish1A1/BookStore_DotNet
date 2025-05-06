// app/staff/layout.jsx
"use client";

import Sidebar from "../staff/components/sidebar";

export default function StaffLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
