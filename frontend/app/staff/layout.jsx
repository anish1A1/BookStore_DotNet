// app/staff/layout.jsx
"use client";

import Sidebar from "./components/Sidebar";

export default function StaffLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
