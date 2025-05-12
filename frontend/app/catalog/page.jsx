"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon, SlidersIcon } from "lucide-react";
import axios from "../../utils/axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function CataloguePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // States for actual filters
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "popularity");
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [genreFilter, setGenreFilter] = useState(searchParams.get("genreName") || "");
  const [authorFilter, setAuthorFilter] = useState(searchParams.get("authorName") || "");
  const [publisherFilter, setPublisherFilter] = useState(searchParams.get("publisherName") || "");
  const [formatFilter, setFormatFilter] = useState(searchParams.get("formatName") || "");
  const [languageFilter, setLanguageFilter] = useState(searchParams.get("bookLanguage") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [minRating, setMinRating] = useState(searchParams.get("minRating") || "");
  const [inStock, setInStock] = useState(searchParams.get("inStock") === "true");
  const [libraryAvailable, setLibraryAvailable] = useState(searchParams.get("libraryAvailable") === "true");
  const [exclusive, setExclusive] = useState(searchParams.get("exclusive") === "true");
  const [awardWinner, setAwardWinner] = useState(searchParams.get("awardWinner") === "true");

  // States for pending filters
  const [pendingSearchTerm, setPendingSearchTerm] = useState(searchParams.get("search") || "");
  const [pendingGenreFilter, setPendingGenreFilter] = useState(searchParams.get("genreName") || "");
  const [pendingAuthorFilter, setPendingAuthorFilter] = useState(searchParams.get("authorName") || "");
  const [pendingPublisherFilter, setPendingPublisherFilter] = useState(searchParams.get("publisherName") || "");
  const [pendingFormatFilter, setPendingFormatFilter] = useState(searchParams.get("formatName") || "");
  const [pendingLanguageFilter, setPendingLanguageFilter] = useState(searchParams.get("bookLanguage") || "");
  const [pendingMinPrice, setPendingMinPrice] = useState(searchParams.get("minPrice") || "");
  const [pendingMaxPrice, setPendingMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [pendingMinRating, setPendingMinRating] = useState(searchParams.get("minRating") || "");
  const [pendingInStock, setPendingInStock] = useState(searchParams.get("inStock") === "true");
  const [pendingLibraryAvailable, setPendingLibraryAvailable] = useState(searchParams.get("libraryAvailable") === "true");
  const [pendingExclusive, setPendingExclusive] = useState(searchParams.get("exclusive") === "true");
  const [pendingAwardWinner, setPendingAwardWinner] = useState(searchParams.get("awardWinner") === "true");

  const fetchBooks = async (filters = {}) => {
    try {
      setLoading(true);
      console.log("Fetching books with filters:", filters);
      const response = await axios.get("/book", { params: filters });
      console.log("API Response - Books:", response.data.books);
      setBooks(response.data.books || []);
      setTotalPages(response.data.totalPages || 1);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    setSearchTerm(pendingSearchTerm);
    setGenreFilter(pendingGenreFilter);
    setAuthorFilter(pendingAuthorFilter);
    setPublisherFilter(pendingPublisherFilter);
    setFormatFilter(pendingFormatFilter);
    setLanguageFilter(pendingLanguageFilter);
    setMinPrice(pendingMinPrice);
    setMaxPrice(pendingMaxPrice);
    setMinRating(pendingMinRating);
    setInStock(pendingInStock);
    setLibraryAvailable(pendingLibraryAvailable);
    setExclusive(pendingExclusive);
    setAwardWinner(pendingAwardWinner);

    let sort = "";
    switch (sortOption) {
      case "popularity":
        sort = "popularity";
        break;
      case "title_asc":
        sort = "title_asc";
        break;
      case "title_desc":
        sort = "title_desc";
        break;
      case "price_asc":
        sort = "price_asc";
        break;
      case "price_desc":
        sort = "price_desc";
        break;
      default:
        sort = "popularity";
    }

    const filters = {
      page,
      pageSize,
      search: pendingSearchTerm || undefined,
      sort,
      genreName: pendingGenreFilter || undefined,
      authorName: pendingAuthorFilter || undefined,
      publisherName: pendingPublisherFilter || undefined,
      formatName: pendingFormatFilter || undefined,
      bookLanguage: pendingLanguageFilter || undefined,
      minPrice: pendingMinPrice ? Number(pendingMinPrice) : undefined,
      maxPrice: pendingMaxPrice ? Number(pendingMaxPrice) : undefined,
      minRating: pendingMinRating ? Number(pendingMinRating) : undefined,
      inStock: pendingInStock || undefined,
      libraryAvailable: pendingLibraryAvailable || undefined,
      exclusive: pendingExclusive || undefined,
      awardWinner: pendingAwardWinner || undefined,
    };

    const query = new URLSearchParams();
    if (filters.page && filters.page > 1) query.set("page", filters.page);
    if (filters.search) query.set("search", filters.search);
    if (filters.sort && filters.sort !== "popularity") query.set("sort", filters.sort);
    if (filters.genreName) query.set("genreName", filters.genreName);
    if (filters.authorName) query.set("authorName", filters.authorName);
    if (filters.publisherName) query.set("publisherName", filters.publisherName);
    if (filters.formatName) query.set("formatName", filters.formatName);
    if (filters.bookLanguage) query.set("bookLanguage", filters.bookLanguage);
    if (filters.minPrice) query.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice) query.set("maxPrice", filters.maxPrice.toString());
    if (filters.minRating) query.set("minRating", filters.minRating.toString());
    if (filters.inStock) query.set("inStock", filters.inStock.toString());
    if (filters.libraryAvailable) query.set("libraryAvailable", filters.libraryAvailable.toString());
    if (filters.exclusive) query.set("exclusive", filters.exclusive.toString());
    if (filters.awardWinner) query.set("awardWinner", filters.awardWinner.toString());

    router.push(`/catalog?${query.toString()}`, { scroll: false });
  };

  // Fetch books when sortOption, page, or actual filter states change
  useEffect(() => {
    const filters = {
      page,
      pageSize,
      search: searchTerm || undefined,
      sort: sortOption,
      genreName: genreFilter || undefined,
      authorName: authorFilter || undefined,
      publisherName: publisherFilter || undefined,
      formatName: formatFilter || undefined,
      bookLanguage: languageFilter || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minRating: minRating ? Number(minRating) : undefined,
      inStock: inStock || undefined,
      libraryAvailable: libraryAvailable || undefined,
      exclusive: exclusive || undefined,
      awardWinner: awardWinner || undefined,
    };
    fetchBooks(filters);
  }, [page, sortOption, searchTerm, genreFilter, authorFilter, publisherFilter, formatFilter, languageFilter, minPrice, maxPrice, minRating, inStock, libraryAvailable, exclusive, awardWinner]);

  // Sync pending filter states with URL search params on initial load
  useEffect(() => {
    setPage(Number(searchParams.get("page")) || 1);
    setSortOption(searchParams.get("sort") || "popularity");
    setSearchTerm(searchParams.get("search") || "");
    setGenreFilter(searchParams.get("genreName") || "");
    setAuthorFilter(searchParams.get("authorName") || "");
    setPublisherFilter(searchParams.get("publisherName") || "");
    setFormatFilter(searchParams.get("formatName") || "");
    setLanguageFilter(searchParams.get("bookLanguage") || "");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setMinRating(searchParams.get("minRating") || "");
    setInStock(searchParams.get("inStock") === "true");
    setLibraryAvailable(searchParams.get("libraryAvailable") === "true");
    setExclusive(searchParams.get("exclusive") === "true");
    setAwardWinner(searchParams.get("awardWinner") === "true");

    // Also sync pending states
    setPendingSearchTerm(searchParams.get("search") || "");
    setPendingGenreFilter(searchParams.get("genreName") || "");
    setPendingAuthorFilter(searchParams.get("authorName") || "");
    setPendingPublisherFilter(searchParams.get("publisherName") || "");
    setPendingFormatFilter(searchParams.get("formatName") || "");
    setPendingLanguageFilter(searchParams.get("bookLanguage") || "");
    setPendingMinPrice(searchParams.get("minPrice") || "");
    setPendingMaxPrice(searchParams.get("maxPrice") || "");
    setPendingMinRating(searchParams.get("minRating") || "");
    setPendingInStock(searchParams.get("inStock") === "true");
    setPendingLibraryAvailable(searchParams.get("libraryAvailable") === "true");
    setPendingExclusive(searchParams.get("exclusive") === "true");
    setPendingAwardWinner(searchParams.get("awardWinner") === "true");
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#2C3E50] mb-6">
          Browse Collection
        </h1>
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-1/4 bg-gray-50 p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-4 text-lg font-semibold">
              <SlidersIcon className="mr-2" /> Filters
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium mb-1">Search</p>
                <input
                  type="text"
                  value={pendingSearchTerm}
                  onChange={(e) => setPendingSearchTerm(e.target.value)}
                  placeholder="Search by title, author, or ISBN"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <p className="font-medium mb-1">Genre</p>
                <select
                  value={pendingGenreFilter}
                  onChange={(e) => setPendingGenreFilter(e.target.value)}
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
              <div>
                <p className="font-medium mb-1">Author</p>
                <input
                  type="text"
                  value={pendingAuthorFilter}
                  onChange={(e) => setPendingAuthorFilter(e.target.value)}
                  placeholder="Author Name"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <p className="font-medium mb-1">Publisher</p>
                <input
                  type="text"
                  value={pendingPublisherFilter}
                  onChange={(e) => setPendingPublisherFilter(e.target.value)}
                  placeholder="Publisher Name"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <p className="font-medium mb-1">Format</p>
                <select
                  value={pendingFormatFilter}
                  onChange={(e) => setPendingFormatFilter(e.target.value)}
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
              <div>
                <p className="font-medium mb-1">Price Range</p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={pendingMinPrice}
                    onChange={(e) => setPendingMinPrice(e.target.value)}
                    placeholder="Min Price"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <input
                    type="number"
                    value={pendingMaxPrice}
                    onChange={(e) => setPendingMaxPrice(e.target.value)}
                    placeholder="Max Price"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              <div>
                <p className="font-medium mb-1">Minimum Rating</p>
                <input
                  type="number"
                  value={pendingMinRating}
                  onChange={(e) => setPendingMinRating(e.target.value)}
                  placeholder="Min Rating"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={pendingInStock} onChange={(e) => setPendingInStock(e.target.checked)} />
                  In Stock
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={pendingLibraryAvailable}
                    onChange={(e) => setPendingLibraryAvailable(e.target.checked)}
                  />
                  Library Available
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={pendingExclusive} onChange={(e) => setPendingExclusive(e.target.checked)} />
                  Exclusive
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={pendingAwardWinner}
                    onChange={(e) => setPendingAwardWinner(e.target.checked)}
                  />
                  Award Winner
                </label>
              </div>
              <button
                onClick={applyFilters}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Apply Filters
              </button>
            </div>
          </aside>

          <main className="w-full md:w-3/4">
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
                  <option value="title_desc">Title (Z-A)</option>
                  <option value="price_asc">Price (Low to High)</option>
                  <option value="price_desc">Price (High to Low)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8 hover:cursor-auto">
              {loading ? (
                <p>Loading...</p>
              ) : books.length > 0 ? (
                books.map((book) => (
                  <button
                    key={book.bookId}
                    onClick={() => router.push(`/BookDetail/${book.bookId}`)}
                    className="relative block bg-white rounded-lg shadow hover:shadow-lg transition p-2"
                  >
                    {book.isOnSale && (
                      <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                        On Sale
                      </span>
                    )}
                    {book.imageUrl ? (
                      <img
                        src={`http://localhost:5189${book.imageUrl}`}
                        alt={book.bookTitle}
                        className="w-full h-48 object-cover rounded"
                      />
                    ) : null}
                    <h2 className="mt-2 font-semibold">{book.bookTitle}</h2>
                    <p className="text-sm text-gray-500">{book.authorName}</p>
                    {book.isOnSale ? (
                      <p className="mt-1 text-lg font-bold text-red-600">
                        <span className="text-gray-500 line-through">Rs.{book.bookPrice?.toFixed(2)}</span>
                        Rs.{book.discountedPrice?.toFixed(2)}
                      </p>
                    ) : (
                      <p className="mt-1 text-lg font-bold">Rs.{book.bookPrice?.toFixed(2)}</p>
                    )}
                  </button>
                ))
              ) : (
                <p>No books found.</p>
              )}
            </div>

            <div className="flex justify-center">
              <div className="inline-flex items-center space-x-1">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="p-2 rounded border hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronLeftIcon size={16} />
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setPage(index + 1)}
                    className={`px-3 py-1 rounded border ${
                      page === index + 1
                        ? "bg-[#2C3E50] text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="p-2 rounded border hover:bg-gray-100 disabled:opacity-50"
                >
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