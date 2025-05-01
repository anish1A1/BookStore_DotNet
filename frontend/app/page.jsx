// app/page.jsx
"use client";

import React, { useEffect } from "react";
import axios from "axios";
import Hero from "./components/hero";
import { ChevronRightIcon, StarIcon } from "lucide-react";
import Link from "next/link";

// Category cards
const categories = [
  {
    title: "Bestsellers",
    description: "Explore our most popular titles that readers can't get enough of.",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  },
  {
    title: "New Releases",
    description: "Be the first to discover the latest additions to our collection.",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  },
  {
    title: "Special Deals",
    description: "Limited-time offers on select titles and exclusive editions.",
    image:
      "https://helios-i.mashable.com/imagery/articles/01IXbDbCfJFnFyridRtmg43/hero-image.fill.size_1248x702.v1731319856.jpg",
  },
];

// Seven featured picks (for the mid section)
const featuredPicks = [
  {
    id: 1,
    cover:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    title: "The Silent Echo",
    author: "Eleanor Winters",
    rating: 4.5,
    price: 29.99,
    onSale: false,
    salePrice: 0,
    format: "Hardcover",
    isNew: false,
    isBestseller: true,
  },
  {
    id: 2,
    cover:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_fmfuJO0BU1wiBC6htoD8oMKBfSBT1TGehA&s",
    title: "Midnight Gardens",
    author: "James Holloway",
    rating: 4.2,
    price: 24.99,
    onSale: false,
    salePrice: 0,
    format: "Paperback",
    isNew: false,
    isBestseller: true,
  },
  {
    id: 3,
    cover:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    title: "Quantum Horizons",
    author: "Dr. Samuel Chen",
    rating: 4.7,
    price: 26.99,
    onSale: true,
    salePrice: 19.99,
    format: "Hardcover",
    isNew: true,
    isBestseller: false,
  },
  {
    id: 4,
    cover:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    title: "The Last Kingdom",
    author: "Victoria Stone",
    rating: 4.3,
    price: 27.99,
    onSale: false,
    salePrice: 0,
    format: "Hardcover",
    isNew: false,
    isBestseller: true,
  },
  {
    id: 5,
    cover:
      "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    title: "Whispers in the Wind",
    author: "Robert Hayes",
    rating: 4.1,
    price: 19.99,
    onSale: false,
    salePrice: 0,
    format: "Paperback",
    isNew: true,
    isBestseller: false,
  },
  {
    id: 6,
    cover:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    title: "The Art of Strategy",
    author: "Elizabeth Morgan",
    rating: 4.8,
    price: 35.99,
    onSale: false,
    salePrice: 0,
    format: "Hardcover",
    isNew: false,
    isBestseller: true,
  },
  {
    id: 7,
    cover:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    title: "Secrets of the Stars",
    author: "Alexis Turner",
    rating: 4.4,
    price: 22.49,
    onSale: true,
    salePrice: 17.99,
    format: "Paperback",
    isNew: false,
    isBestseller: false,
  },
];

export default function HomePage() {
  useEffect(() => {
    axios.get("/api/data").catch(() => console.error("Data fetch error"));
  }, []);

  function BookCard({ book, size = "w-48" }) {
    return (
      <div
        className={`group ${size} bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow`}
      >
        <div className="relative h-64 overflow-hidden rounded-t-xl">
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
          {book.isNew && (
            <span className="absolute top-3 left-3 bg-green-600 text-white text-xs px-2 py-1 rounded">
              NEW
            </span>
          )}
          {book.isBestseller && (
            <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
              BESTSELLER
            </span>
          )}
          {book.onSale && (
            <span className="absolute top-10 right-3 bg-red-600 text-white text-xs px-2 py-1 rounded">
              SALE
            </span>
          )}
        </div>
        <div className="p-4 space-y-2">
          <h4 className="font-semibold text-lg truncate">{book.title}</h4>
          <p className="text-sm text-gray-500 truncate">{book.author}</p>
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                size={14}
                className={
                  i < Math.round(book.rating) ? "text-yellow-400" : "text-gray-300"
                }
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {book.rating.toFixed(1)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-lg font-bold text-gray-800">
              {book.onSale ? (
                <>
                  <span className="text-red-500">
                    ${book.salePrice.toFixed(2)}
                  </span>{" "}
                  <span className="line-through text-gray-400 text-sm">
                    ${book.price.toFixed(2)}
                  </span>
                </>
              ) : (
                `$${book.price.toFixed(2)}`
              )}
            </div>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {book.format}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Eight cards for Bestsellers and New Releases
  const bestsellerEight = [...featuredPicks, {
    id: 8,
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE5coG1F5Hrv2KL6ttw8lG_yGRUZ_uxYmNlA&s",
    title: "Voyage of Dreams",
    author: "Lara Kensington",
    rating: 4.6,
    price: 21.99,
    onSale: false,
    salePrice: 0,
    format: "Paperback",
    isNew: false,
    isBestseller: true,
  }];

  const newReleaseEight = featuredPicks
    .filter((b) => b.isNew)
    .concat({
      id: 9,
      cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2D2nS8aQA0caUaQ4bdKUEHzTzOl_k_y9rwg&s",
      title: "Reflections of Tomorrow",
      author: "Carlos Vega",
      rating: 4.4,
      price: 23.49,
      onSale: false,
      salePrice: 0,
      format: "Hardcover",
      isNew: true,
      isBestseller: false,
    });

  return (
    <>
      <Hero />

      {/* Categories */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Explore by Category
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {categories.map((cat) => (
              <div
                key={cat.title}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{cat.title}</h3>
                  <p className="text-gray-500 mb-4">{cat.description}</p>
                  <Link
                    href="/catalog"
                    className="inline-flex items-center text-[#E3B23C] hover:underline"
                  >
                    Explore <ChevronRightIcon className="ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Picks */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Featured Picks</h2>
            <Link
              href="/catalog"
              className="text-[#E3B23C] hover:underline flex items-center"
            >
              See All <ChevronRightIcon className="ml-1" />
            </Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {featuredPicks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* Separator */}
      <div className="h-1 bg-gradient-to-r from-[#E3B23C] to-transparent my-16 mx-4 rounded" />

      {/* Bestsellers Carousel */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Bestsellers</h2>
            <Link
              href="/catalog"
              className="text-[#E3B23C] hover:underline flex items-center"
            >
              See All <ChevronRightIcon className="ml-1" />
            </Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {bestsellerEight.map((book) => (
              <BookCard key={book.id} book={book} size="w-40" />
            ))}
          </div>
        </div>
      </section>

      {/* New Releases Carousel */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">New Releases</h2>
            <Link
              href="/catalog"
              className="text-[#E3B23C] hover:underline flex items-center"
            >
              See All <ChevronRightIcon className="ml-1" />
            </Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {newReleaseEight.map((book) => (
              <BookCard key={book.id} book={book} size="w-40" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
