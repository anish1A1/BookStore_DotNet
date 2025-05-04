// app/layout.jsx
import React from "react";
import "./globals.css";
import Topbar from "./components/topbar";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

export const metadata = { title: "BookLux" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="pt-12 flex flex-col min-h-screen">
        <Topbar />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
