// app/layout.jsx
<<<<<<< HEAD
import './globals.css'
import Navbar from './components/navbar'
// import Hero from './components/hero'
import Footer from './components/footer'
import { AuthProvider } from '../utils/auth'
import { BookProvider } from '../utils/book'
import { OrderProvider } from '../utils/order'
=======
import React from "react";
import "./globals.css";
import Topbar from "./components/topbar";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

export const metadata = { title: "BookLux" };
>>>>>>> a085f1b4d93cf739d8afac5d090909b34b79fe2b

export default function RootLayout({ children }) {
  return (
    <html lang="en">
<<<<<<< HEAD
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <BookProvider>
            <OrderProvider>

=======
      <body className="pt-12 flex flex-col min-h-screen">
        <Topbar />
>>>>>>> a085f1b4d93cf739d8afac5d090909b34b79fe2b
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />


            </OrderProvider>
          </BookProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
