// // app/admin/layout.jsx
// import "./globals.css";
// import Sidebar from "./components/Sidebar";
// import React from "react";

// export const metadata = { title: "Admin • BookLux" };

// export default function AdminLayout({ children }) {
//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <Sidebar />
//       <div className="flex-1 flex flex-col">
//         <header className="bg-white border-b border-gray-200 p-4">
//           {/* optional topbar */}
//         </header>
//         <main className="flex-1 overflow-auto p-6">{children}</main>
//       </div>
//     </div>
//   );
// }


// app/(admin)/layout.jsx
import React from "react";
import Sidebar from "./components/Sidebar";
import "./globals.css";  // optional: only if you have admin-specific styles

export const metadata = {
  title: "Admin • BookLux",
};

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4">
          {/* Breadcrumbs or page title */}
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
