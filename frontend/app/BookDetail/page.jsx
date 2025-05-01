// app/bookdetail/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  StarIcon,
  MinusIcon,
  PlusIcon,
  BookmarkIcon,
  ChevronRightIcon,
} from "lucide-react";

export default function BookDetailPage() {
  const [tab, setTab] = useState("description");
  const [qty, setQty] = useState(1);
  const [format, setFormat] = useState("hardcover");

  // Static book data
  const book = {
    id: 1,
    cover:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=60",
    title: "The Silent Echo",
    author: "Eleanor Winters",
    rating: 4.5,
    price: 29.99,
    onSale: true,
    salePrice: 23.99,
    formats: ["paperback", "hardcover", "deluxe", "signed"],
    publication: "June 15, 2023",
    isbn: "978-3-16-148410-0",
    language: "English",
    pages: 342,
  };

  const similar = [
    {
      id: 2,
      cover:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=60",
      title: "Quantum Horizons",
      author: "Dr. Samuel Chen",
      price: 26.99,
    },
    {
      id: 3,
      cover:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_fmfuJO0BU1wiBC6htoD8oMKBfSBT1TGehA&s",
      title: "Midnight Gardens",
      author: "James Holloway",
      price: 24.99,
    },
    {
      id: 4,
      cover:
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=60",
      title: "The Last Kingdom",
      author: "Victoria Stone",
      price: 27.99,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6 flex items-center space-x-2">
          <Link href="/" className="text-gray-500 hover:text-[#E3B23C]">
            Home
          </Link>
          <ChevronRightIcon size={14} className="text-gray-400" />
          <Link
            href="/catalog"
            className="text-gray-500 hover:text-[#E3B23C]"
          >
            Collection
          </Link>
          <ChevronRightIcon size={14} className="text-gray-400" />
          <span className="font-medium text-[#2C3E50]">{book.title}</span>
        </nav>

        {/* Main */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Cover */}
          <div className="md:w-1/3">
            <img
              src={book.cover}
              alt={book.title}
              className="w-full rounded-lg shadow"
            />
          </div>

          {/* Details */}
          <div className="md:w-2/3 space-y-4">
            <h1 className="text-3xl font-bold text-[#2C3E50]">
              {book.title}
            </h1>
            <p className="text-xl">
              by{" "}
              <span className="text-[#E3B23C] font-semibold">
                {book.author}
              </span>
            </p>

            <div className="flex items-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  size={18}
                  className={
                    i < Math.floor(book.rating)
                      ? "text-[#E3B23C]"
                      : "text-gray-300"
                  }
                />
              ))}
              <span>{book.rating.toFixed(1)} / 5</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold">
                  ${book.onSale ? book.salePrice.toFixed(2) : book.price.toFixed(2)}
                </span>
                {book.onSale && (
                  <>
                    <span className="text-gray-400 line-through">
                      ${book.price.toFixed(2)}
                    </span>
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                      SAVE
                    </span>
                  </>
                )}
              </div>
              <p className="text-green-600">
                In Stock — Ships within 24 hours
              </p>
            </div>

            <div className="space-y-4">
              {/* Formats */}
              <div>
                <p className="text-sm mb-2">Format</p>
                <div className="flex flex-wrap gap-2">
                  {book.formats.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={`px-4 py-2 border rounded ${
                        format === f
                          ? "border-[#E3B23C] bg-[#fdf7e6]"
                          : "border-gray-300"
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center space-x-4">
                <p className="text-sm">Quantity</p>
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty === 1}
                    className="px-3 py-1 border-r"
                  >
                    <MinusIcon size={16} />
                  </button>
                  <span className="px-4">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="px-3 py-1 border-l"
                  >
                    <PlusIcon size={16} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/cart"
                  className="bg-[#E3B23C] hover:bg-[#d1a436] text-white px-6 py-3 rounded font-bold"
                >
                  Add to Cart
                </Link>
                <Link
                  href="/wishlist"
                  className="border border-[#2C3E50] text-[#2C3E50] px-6 py-3 rounded flex items-center"
                >
                  <BookmarkIcon size={18} className="mr-2" />
                  Wishlist
                </Link>
              </div>
            </div>

            {/* Meta */}
            <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p>Publication Date</p>
                <p>{book.publication}</p>
              </div>
              <div>
                <p>ISBN</p>
                <p>{book.isbn}</p>
              </div>
              <div>
                <p>Language</p>
                <p>{book.language}</p>
              </div>
              <div>
                <p>Pages</p>
                <p>{book.pages}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div>
          <div className="border-b flex space-x-4">
            {["description", "reviews", "similar"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-3 font-bold ${
                  tab === t
                    ? "border-b-2 border-[#E3B23C] text-[#2C3E50]"
                    : "text-gray-500"
                }`}
              >
                {t === "description"
                  ? "Description"
                  : t === "reviews"
                  ? "Reviews"
                  : "Similar Books"}
              </button>
            ))}
          </div>
          <div className="pt-6 space-y-6">
            {tab === "description" && (
              <p className="leading-relaxed">
                In “The Silent Echo,” a mystery unfolds in Millfield as detective Amelia
                Hayes returns to solve a decades-old disappearance. Every clue
                brings her closer to a breathtaking revelation.
              </p>
            )}
            {tab === "reviews" && (
              <div className="space-y-4">
                {[
                  {
                    stars: 5,
                    title: "Captivating Mystery",
                    author: "Sarah J.",
                    date: "June 28, 2023",
                    text: "I couldn't put this book down—twists at every turn!",
                  },
                  {
                    stars: 4,
                    title: "Well-Crafted Characters",
                    author: "Michael T.",
                    date: "June 20, 2023",
                    text: "Deep, believable characters—pace slowed mid-story, but ending thrilled.",
                  },
                ].map((r, i) => (
                  <div key={i} className="border-b pb-4">
                    <div className="flex items-center space-x-2 mb-1">
                      {[...Array(5)].map((_, j) => (
                        <StarIcon
                          key={j}
                          size={16}
                          className={j < r.stars ? "text-[#E3B23C]" : "text-gray-300"}
                        />
                      ))}
                      <span className="font-bold ml-2">{r.title}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      by {r.author} – {r.date}
                    </p>
                    <p>{r.text}</p>
                  </div>
                ))}
              </div>
            )}
            {tab === "similar" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {similar.map((b) => (
                  <Link
                    key={b.id}
                    href={`/catalogue/${b.id}`}
                    className="block bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition"
                  >
                    <img
                      src={b.cover}
                      alt={b.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-semibold">{b.title}</h4>
                      <p className="text-sm text-gray-600">{b.author}</p>
                      <p className="font-bold mt-2">${b.price.toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
