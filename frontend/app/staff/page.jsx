"use client";

export default function StaffLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
