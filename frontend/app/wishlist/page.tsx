// app/wishlist/page.jsx
"use client";

import React from "react";
import Link from "next/link";
import { HeartIcon, ShoppingCartIcon, XIcon } from "lucide-react";

const WISHLIST = [
  {
    id: 1,
    title: "The Silent Echo",
    author: "Eleanor Winters",
    cover:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=60",
    price: 29.99,
    onSale: false,
    salePrice: 0,
    format: "Hardcover",
    addedDate: "2023-07-01",
  },
  {
    id: 2,
    title: "Midnight Gardens",
    author: "James Holloway",
    cover:
      "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=400&q=60",
    price: 24.99,
    onSale: true,
    salePrice: 19.99,
    format: "Paperback",
    addedDate: "2023-07-03",
  },
  {
    id: 3,
    title: "Quantum Horizons",
    author: "Dr. Samuel Chen",
    cover:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=60",
    price: 26.99,
    onSale: false,
    salePrice: 0,
    format: "Hardcover",
    addedDate: "2023-07-05",
  },
  {
    id: 4,
    title: "Whispers in the Wind",
    author: "Robert Hayes",
    cover:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=60",
    price: 19.99,
    onSale: false,
    salePrice: 0,
    format: "Paperback",
    addedDate: "2023-07-07",
  },
];

export default function WishlistPage() {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 pt-4">
        <div className="flex items-center mb-6">
          <HeartIcon className="text-[#E3B23C] mr-3" />
          <h1 className="text-3xl font-bold text-[#2C3E50]">My Wishlist</h1>
        </div>

        {WISHLIST.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {WISHLIST.map((book) => (
                <div
                  key={book.id}
                  className="bg-white shadow rounded-lg overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-48 object-cover"
                    />
                    <button className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition">
                      <XIcon size={16} className="text-gray-600" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-1">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        {book.onSale ? (
                          <div className="flex items-baseline">
                            <span className="text-red-500 font-bold">
                              ${book.salePrice.toFixed(2)}
                            </span>
                            <span className="text-gray-500 text-sm line-through ml-2">
                              ${book.price.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold">
                            ${book.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {book.format}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Added on {book.addedDate}
                      </span>
                      <Link
                        href="/cart"
                        className="flex items-center bg-[#E3B23C] text-white px-3 py-1 rounded text-sm hover:bg-[#d1a436] transition"
                      >
                        <ShoppingCartIcon size={14} className="mr-1" />
                        Add to Cart
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-2 text-center">
              <Link
                href="/catalogue"
                className="text-[#E3B23C] font-bold hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <HeartIcon size={48} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Browse our collection and add items to your wishlist
            </p>
            <Link
              href="/catalogue"
              className="bg-[#E3B23C] hover:bg-[#d1a436] text-white px-6 py-3 rounded font-bold transition-colors"
            >
              Browse Collection
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
