// app/layout.jsx
import './globals.css'
import Navbar from './components/navbar'
// import Hero from './components/hero'
import Footer from './components/footer'
import { AuthProvider } from '../utils/auth'
import { BookProvider } from '../utils/book'
import { OrderProvider } from '../utils/order'
import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <BookProvider>
            <OrderProvider>

        <Navbar />
        <main className="flex-grow">
        <Toaster position="top-center" />
        {children}
        </main>
        <Footer />


            </OrderProvider>
          </BookProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
