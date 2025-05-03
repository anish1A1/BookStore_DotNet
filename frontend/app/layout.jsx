// app/layout.jsx
import "./globals.css";
import Navbar from "./components/navbar";
import Topbar from "./components/topbar";
import Footer from "./components/footer";

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
