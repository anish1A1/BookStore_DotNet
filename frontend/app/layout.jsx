// app/layout.jsx
import './globals.css'
import Navbar from './components/navbar'
import Hero from './components/hero'
import Footer from './components/footer'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <Hero />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
