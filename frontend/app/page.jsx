"use client";

import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import Hero from "./components/hero";
import { ChevronRightIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MainHomePage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [featuredPicks, setFeaturedPicks] = useState([]);
  const [bestsellerSeven, setBestsellerSeven] = useState([]);
  const [newReleaseSeven, setNewReleaseSeven] = useState([]);
  const [specialDealsSeven, setSpecialDealsSeven] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch distinct genres for categories
        const genresResponse = await axios.get("/book", { params: { pageSize: 50 } });
        const allBooks = genresResponse.data.books || [];
        const uniqueGenres = [...new Set(allBooks.map(book => book.genreName))].slice(0, 3);
        const categoryPromises = uniqueGenres.map(genre =>
          axios.get("/book", { params: { pageSize: 1, genreName: genre } })
        );
        const categoryResponses = await Promise.all(categoryPromises);
        const categoryBooks = categoryResponses.map(response => response.data.books[0]);
        const dynamicCategories = categoryBooks.map(book => ({
          title: book.genreName,
          description: `Explore ${book.genreName} titles like ${book.bookTitle}.`,
          image: book.imageUrl ? `http://localhost:5189${book.imageUrl}` : null,
        }));
        setCategories(dynamicCategories);

        // Featured Picks (exclusive books)
        const featuredResponse = await axios.get("/book", {
          params: { pageSize: 7, exclusive: true },
        });
        const featuredBooks = featuredResponse.data.books || [];
        setFeaturedPicks(featuredBooks.map(book => ({
          id: book.bookId,
          cover: book.imageUrl ? `http://localhost:5189${book.imageUrl}` : null,
          title: book.bookTitle,
          author: book.authorName,
          rating: book.rating || 4.0,
          price: book.bookPrice,
          onSale: book.isOnSale,
          salePrice: book.discountedPrice || 0,
          format: book.formatName,
          isNew: new Date(book.publicationDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          isBestseller: book.totalSales > 100,
        })));

        // Special Deals
        const specialDealsResponse = await axios.get("/book", {
          params: { pageSize: 7, minPrice: 0, maxPrice: 200, exclusive: true },
        });
        const specialDealsBooks = specialDealsResponse.data.books || [];
        setSpecialDealsSeven(specialDealsBooks.map(book => ({
          id: book.bookId,
          cover: book.imageUrl ? `http://localhost:5189${book.imageUrl}` : null,
          title: book.bookTitle,
          author: book.authorName,
          rating: book.rating || 4.0,
          price: book.bookPrice,
          onSale: book.isOnSale,
          salePrice: book.discountedPrice || 0,
          format: book.formatName,
          isNew: new Date(book.publicationDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          isBestseller: book.totalSales > 100,
        })));

        // Bestsellers (sorted by popularity)
        const bestsellerResponse = await axios.get("/book", {
          params: {
            pageSize: 7,
            inStock: true,
            libraryAvailable: true,
            exclusive: true,
            awardWinner: true,
            sort: "popularity",
          },
        });
        const bestsellerBooks = bestsellerResponse.data.books || [];
        setBestsellerSeven(bestsellerBooks.map(book => ({
          id: book.bookId,
          cover: book.imageUrl ? `http://localhost:5189${book.imageUrl}` : null,
          title: book.bookTitle,
          author: book.authorName,
          rating: book.rating || 4.0,
          price: book.bookPrice,
          onSale: book.isOnSale,
          salePrice: book.discountedPrice || 0,
          format: book.formatName,
          isNew: new Date(book.publicationDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          isBestseller: book.totalSales > 100,
        })));

        // New Releases (sorted by publication date)
        const newReleaseResponse = await axios.get("/book", {
          params: { pageSize: 7, sort: "publicationdate" },
        });
        const newReleaseBooks = newReleaseResponse.data.books || [];
        const filteredNewReleases = newReleaseBooks
          .filter(book => new Date(book.publicationDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
          .slice(0, 7);
        setNewReleaseSeven(filteredNewReleases.map(book => ({
          id: book.bookId,
          cover: book.imageUrl ? `http://localhost:5189${book.imageUrl}` : null,
          title: book.bookTitle,
          author: book.authorName,
          rating: book.rating || 4.0,
          price: book.bookPrice,
          onSale: book.isOnSale,
          salePrice: book.discountedPrice || 0,
          format: book.formatName,
          isNew: true,
          isBestseller: book.totalSales > 100,
        })));
      } catch (error) {
        console.error("Error fetching homepage data:", error);
        setCategories([]);
        setFeaturedPicks([]);
        setSpecialDealsSeven([]);
        setBestsellerSeven([]);
        setNewReleaseSeven([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function BookCard({ book, size = "w-48" }) {
    return (
      <button
        onClick={() => router.push(`/BookDetail/${book.id}`)}
        className={`group ${size} bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow`}
      >
        <div className="relative h-64 overflow-hidden rounded-t-xl">
          {book.cover ? (
            <img
              src={book.cover}
              alt={book.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
          ) : null}
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
                className={i < Math.round(book.rating) ? "text-yellow-400" : "text-gray-300"}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">{book.rating.toFixed(1)}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-lg font-bold text-gray-800">
              {book.onSale ? (
                <>
                  <span className="text-red-500">${book.salePrice.toFixed(2)}</span>{" "}
                  <span className="line-through text-gray-400 text-sm">${book.price.toFixed(2)}</span>
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
      </button>
    );
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <Hero />
      {/* Categories */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Explore by Category</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <div
                  key={cat.title}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  {cat.image ? (
                    <img src={cat.image} alt={cat.title} className="h-48 w-full object-cover" />
                  ) : null}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{cat.title}</h3>
                    <p className="text-gray-500 mb-4">{cat.description}</p>
                    <Link href={`/catalog?genreName=${cat.title}`} className="inline-flex items-center text-[#E3B23C] hover:underline">
                      Explore <ChevronRightIcon className="ml-1" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center col-span-3 text-gray-500">No categories available.</p>
            )}
          </div>
        </div>
      </section>

      {/* Featured Picks */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Featured Picks</h2>
            <Link href="/catalog?exclusive=true" className="text-[#E3B23C] hover:underline flex items-center">
              See All <ChevronRightIcon className="ml-1" />
            </Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {featuredPicks.length > 0 ? (
              featuredPicks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))
            ) : (
              <p className="text-gray-500">No featured picks available.</p>
            )}
          </div>
        </div>
      </section>

      {/* Separator */}
      <div className="h-1 bg-gradient-to-r from-[#E3B23C] to-transparent my-16 mx-4 rounded" />

      {/* Special Deals */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Special Deals</h2>
            <Link href={`/catalog?minPrice=0&maxPrice=200&exclusive=true`} className="text-[#E3B23C] hover:underline flex items-center">
              See All <ChevronRightIcon className="ml-1" />
            </Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {specialDealsSeven.length > 0 ? (
              specialDealsSeven.map((book) => (
                <BookCard key={book.id} book={book} size="w-40" />
              ))
            ) : (
              <p className="text-gray-500">No special deals available.</p>
            )}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Bestsellers</h2>
            <Link href={`/catalog?inStock=true&libraryAvailable=true&exclusive=true&awardWinner=true&sort=popularity`} className="text-[#E3B23C] hover:underline flex items-center">
              See All <ChevronRightIcon className="ml-1" />
            </Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {bestsellerSeven.length > 0 ? (
              bestsellerSeven.map((book) => (
                <BookCard key={book.id} book={book} size="w-40" />
              ))
            ) : (
              <p className="text-gray-500">No bestsellers available.</p>
            )}
          </div>
        </div>
      </section>

      {/* New Releases */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">New Releases</h2>
            <Link href={`/catalog?sort=publicationdate`} className="text-[#E3B23C] hover:underline flex items-center">
              See All <ChevronRightIcon className="ml-1" />
            </Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {newReleaseSeven.length > 0 ? (
              newReleaseSeven.map((book) => (
                <BookCard key={book.id} book={book} size="w-40" />
              ))
            ) : (
              <p className="text-gray-500">No new releases available.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default MainHomePage;