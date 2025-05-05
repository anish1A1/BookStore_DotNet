
"use client";

import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon, SlidersIcon } from "lucide-react";
import { BookContext } from "../../utils/book";
import axios from "../../utils/axios";
import { useRouter } from "next/navigation";
export default function CataloguePage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

const [sortOption, setSortOption] = useState("popularity");
const [searchTerm, setSearchTerm] = useState("");
const [genreFilter, setGenreFilter] = useState("");
const [authorFilter, setAuthorFilter] = useState("");
const [publisherFilter, setPublisherFilter] = useState("");
const [formatFilter, setFormatFilter] = useState("");
const [languageFilter, setLanguageFilter] = useState("");
const [minPrice, setMinPrice] = useState("");
const [maxPrice, setMaxPrice] = useState("");
const [minRating, setMinRating] = useState("");
const [inStock, setInStock] = useState(false);
const [libraryAvailable, setLibraryAvailable] = useState(false);
const [exclusive, setExclusive] = useState(false);
const [awardWinner, setAwardWinner] = useState(false);

const fetchBooks = async (filters = {}) => {
  try {
    setLoading(true);
    const response = await axios.get("/book", { params: filters });
    setBooks(response.data.books); 
    setLoading(false);
  } catch (error) {
    console.error("Error fetching books:", error);
  } finally {
    setLoading(false);
  }
};  

  useEffect(() => {
    fetchBooks();
  },[]);

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
    {/* Search */}
    <div>
      <p className="font-medium mb-1">Search</p>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by title, author, or ISBN"
        className="w-full p-2 border border-gray-300 rounded"
      />
    </div>

    {/* Genre */}
    <div>
      <p className="font-medium mb-1">Genre</p>
      <select
        value={genreFilter}
        onChange={(e) => setGenreFilter(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
      >
        <option value="">All Genres</option>
        <option value="Fiction">Fiction</option>
        <option value="Mystery">Mystery</option>
        <option value="Sci-Fi">Sci-Fi</option>
      <option value="Children's">Children's</option>
        <option value="Non-Fiction">Non-Fiction</option>
      </select>
    </div>

    {/* Author */}
    <div>
      <p className="font-medium mb-1">Author</p>
      <input
        type="text"
        value={authorFilter}
        onChange={(e) => setAuthorFilter(e.target.value)}
        placeholder="Author Name"
        className="w-full p-2 border border-gray-300 rounded"
      />
    </div>

    {/* Publisher */}
    <div>
      <p className="font-medium mb-1">Publisher</p>
      <input
        type="text"
        value={publisherFilter}
        onChange={(e) => setPublisherFilter(e.target.value)}
        placeholder="Publisher Name"
        className="w-full p-2 border border-gray-300 rounded"
      />
    </div>

    {/* Format */}
    <div>
      <p className="font-medium mb-1">Format</p>
      <select
        value={formatFilter}
        onChange={(e) => setFormatFilter(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
      >
        <option value="">All Formats</option>
        <option value="Paperback">Paperback</option>
        <option value="Hardcover">Hardcover</option>
        <option value="Deluxe">Deluxe</option>
        <option value="Signed">Signed</option>
    <option value="Ebook">Ebook</option>
      </select>
    </div>

    {/* Price Range */}
    <div>
      <p className="font-medium mb-1">Price Range</p>
      <div className="flex gap-2">
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Min Price"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Max Price"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
    </div>

    {/* Rating */}
    <div>
      <p className="font-medium mb-1">Minimum Rating</p>
      <input
        type="number"
        value={minRating}
        onChange={(e) => setMinRating(e.target.value)}
        placeholder="Min Rating"
        className="w-full p-2 border border-gray-300 rounded"
      />
    </div>

    {/* Availability */}
    <div>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
        In Stock
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={libraryAvailable}
          onChange={(e) => setLibraryAvailable(e.target.checked)}
        />
        Library Available
      </label>
    </div>

    {/* Exclusive & Award Winner */}
    <div>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={exclusive} onChange={(e) => setExclusive(e.target.checked)} />
        Exclusive
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={awardWinner}
          onChange={(e) => setAwardWinner(e.target.checked)}
        />
        Award Winner
      </label>
    </div>

    {/* Filter Button */}
    <button
      onClick={() => fetchBooks({
        search: searchTerm,
        genreName: genreFilter,
        authorName: authorFilter,
        publisherName: publisherFilter,
        formatName: formatFilter,
        minPrice,
        maxPrice,
        minRating,
        inStock,
        libraryAvailable,
        exclusive,
        awardWinner
      })}
      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md"
    >
      Apply Filters
    </button>
  </div>
</aside>

          {/* Main */}
          <main className="w-full md:w-3/4">
            {/* Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <p className="text-gray-600">
                Showing {books.length} results
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
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8 hover:cursor-auto">
              {books.length > 0 &&  books.map((book) => (
                <button
                  key={book.bookId}
                  onClick={() => router.push(`/BookDetail/${book.bookId}`)}
                  className="block bg-white rounded-lg shadow hover:shadow-lg transition p-2 "
                >
                  {book.imageUrl ? (
                      <img
                        src={book.imageUrl}
                        alt={book.bookTitle}
                        className="w-full h-48 object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center bg-gray-200 rounded">
                        <span className="text-gray-600">No Image Available</span>
                      </div>
                    )}

                  <h2 className="mt-2 font-semibold">{book.bookTitle}</h2>
                  <p className="text-sm text-gray-500">{book.authorName}</p>
                  <p className="mt-1 font-bold">${book.bookPrice?.toFixed(2)}</p>
                </button>
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
