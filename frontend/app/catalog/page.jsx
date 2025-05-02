
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon, SlidersIcon } from "lucide-react";

const BOOKS = [
  {
    id: 1,
    title: "The Silent Echo",
    author: "Eleanor Winters",
    cover:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&q=60",
    price: 29.99,
  },
  {
    id: 2,
    title: "Midnight Gardens",
    author: "James Holloway",
    cover:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_fmfuJO0BU1wiBC6htoD8oMKBfSBT1TGehA&s",
    price: 24.99,
  },
  {
    id: 3,
    title: "Quantum Horizons",
    author: "Dr. Samuel Chen",
    cover:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=60",
    price: 26.99,
  },
  {
    id: 4,
    title: "The Last Kingdom",
    author: "Victoria Stone",
    cover:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=400&q=60",
    price: 27.99,
  },
  {
    id: 5,
    title: "Whispers in the Wind",
    author: "Robert Hayes",
    cover:
      "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=400&q=60",
    price: 19.99,
  },
  {
    id: 6,
    title: "The Art of Strategy",
    author: "Elizabeth Morgan",
    cover:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=60",
    price: 35.99,
  },
  {
    id: 7,
    title: "Secrets of the Stars",
    author: "Alexis Turner",
    cover:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=60",
    price: 22.49,
  },
  {
    id: 8,
    title: "Voyage of Dreams",
    author: "Lara Kensington",
    cover:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE5coG1F5Hrv2KL6ttw8lG_yGRUZ_uxYmNlA&s",
    price: 21.99,
  },
];

export default function CataloguePage() {
  const [sortOption, setSortOption] = useState("popularity");

  // For now, we just display BOOKS statically
  const displayed = BOOKS;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#2C3E50] mb-6">
          Browse Collection
        </h1>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-1/4 bg-gray-50 p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-4 text-lg font-semibold">
              <SlidersIcon className="mr-2" /> Filters
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium mb-1">Genre</p>
                <ul className="space-y-1">
                  {["Fiction", "Mystery", "Sci-Fi", "Non-Fiction"].map((g) => (
                    <li key={g}>
                      <label className="inline-flex items-center">
                        <input type="checkbox" className="mr-2" /> {g}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium mb-1">Format</p>
                <ul className="space-y-1">
                  {["Paperback", "Hardcover", "Deluxe", "Signed"].map((f) => (
                    <li key={f}>
                      <label className="inline-flex items-center">
                        <input type="checkbox" className="mr-2" /> {f}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="w-full md:w-3/4">
            {/* Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <p className="text-gray-600">
                Showing {displayed.length} results
              </p>
              <div className="flex items-center">
                <label htmlFor="sort" className="mr-2 text-sm">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border rounded p-2 text-sm"
                >
                  <option value="popularity">Popularity</option>
                  <option value="title_asc">Title (A-Z)</option>
                  <option value="price_asc">Price ↑</option>
                  <option value="price_desc">Price ↓</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {displayed.map((book) => (
                <Link
                  key={book.id}
                  href="/bookdetail"
                  className="block bg-white rounded-lg shadow hover:shadow-lg transition p-2"
                >
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-48 object-cover rounded"
                  />
                  <h2 className="mt-2 font-semibold">{book.title}</h2>
                  <p className="text-sm text-gray-500">{book.author}</p>
                  <p className="mt-1 font-bold">${book.price.toFixed(2)}</p>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center">
              <div className="inline-flex items-center space-x-1">
                <button className="p-2 rounded border hover:bg-gray-100">
                  <ChevronLeftIcon size={16} />
                </button>
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    className={`px-3 py-1 rounded border ${
                      n === 1
                        ? "bg-[#2C3E50] text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <span className="px-2">…</span>
                <button className="p-2 rounded border hover:bg-gray-100">
                  <ChevronRightIcon size={16} />
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
