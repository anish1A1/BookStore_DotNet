"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";
import Footer from "./footer";
import Topbar from "./topbar";
import { Toaster } from "sonner";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  
  const excludedRoutes = ["/admin", "/staff", "/login", "/register"];
  
  const shouldExcludeLayout = excludedRoutes.some(route => pathname.startsWith(route));

  return (
    <>
      {!shouldExcludeLayout && <Topbar />}
      {!shouldExcludeLayout && <Navbar />}
      <main className="flex-grow">
        <Toaster position="top-center" />
        {children}
      </main>
      {!shouldExcludeLayout && <Footer />}
    </>
  );
}