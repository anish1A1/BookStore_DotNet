
import Link from 'next/link'
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#2C3E50] text-white py-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-[#F1C40F]">BookLux</h2>
          <p className="mt-4">Premium book retail platform</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="/about" className="hover:text-[#F1C40F]">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-[#F1C40F]">Contact</Link></li>
            <li><Link href="/faq" className="hover:text-[#F1C40F]">FAQ</Link></li>
            <li><Link href="/terms" className="hover:text-[#F1C40F]">Terms & Privacy</Link></li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Customer Support</h3>
          <ul className="space-y-2">
            <li><Link href="/help-center" className="hover:text-[#F1C40F]">Help Center</Link></li>
            <li><Link href="/order-status" className="hover:text-[#F1C40F]">Order Status</Link></li>
            <li><Link href="/returns" className="hover:text-[#F1C40F]">Returns & Refunds</Link></li>
          </ul>
        </div>

        {/* Social Icons */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#F1C40F]">
              <FaFacebookF size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#F1C40F]">
              <FaTwitter size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#F1C40F]">
              <FaInstagram size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center text-gray-400 text-sm">
        &copy; {year} BookLux. All rights reserved.
      </div>
    </footer>
  )
}
