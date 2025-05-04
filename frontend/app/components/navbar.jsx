import Link from "next/link";
import { FiSearch, FiHeart, FiShoppingCart, FiUser } from "react-icons/fi";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-xl  ">
      <div className="max-w-6xl mx-auto p-2  flex items-center justify-between h-15">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-[#F1C40F]">
          <span className="text-[#0063c5]">Book </span>Lux
        </Link>

        {/* Static Search Input */}
        <div className="relative w-full max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, author, ISBN…"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F1C40F] text-black"
          />
        </div>

        {/* Nav Icons */}
        <div className="flex items-center space-x-6">
          <Link
            href="/wishlist"
            className="flex flex-col items-center text-gray-600 hover:text-[#F1C40F]"
          >
            <FiHeart size={20} />
            <span className="text-xs">Wishlist</span>
          </Link>
          <Link
            href="/cart"
            className="flex flex-col items-center text-gray-600 hover:text-[#F1C40F]"
          >
            <FiShoppingCart size={20} />
            <span className="text-xs">Cart</span>
          </Link>
          <Link
            href="/profile"
            className="flex flex-col items-center text-gray-600 hover:text-[#F1C40F]"
          >
            <FiUser size={20} />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
