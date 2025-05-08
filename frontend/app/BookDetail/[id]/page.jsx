"use client";

import { useState, useEffect, useContext, useCallback } from "react";
import Link from "next/link";
import {
  StarIcon,
  MinusIcon,
  PlusIcon,
  BookmarkIcon,
  ChevronRightIcon,
} from "lucide-react";
import { BookContext } from "../../../utils/book";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { OrderContext } from "../../../utils/order";

export default function BookDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [tab, setTab] = useState("description");
  const [qty, setQty] = useState(1);
  const [format, setFormat] = useState("hardcover");
  const { bookById, fetchBooksById } = useContext(BookContext);
  const { AddToCart, AddToWishList } = useContext(OrderContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBook = useCallback(async () => {
    // Skip fetch if bookById already has the data for this id
    if (bookById && bookById.bookId === id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await fetchBooksById(id);
      setLoading(false);
    } catch (err) {
      setError("Failed to load book details.");
      setLoading(false);
      console.error("Error fetching book:", err);
    }
  }, [id, fetchBooksById, bookById]);

  useEffect(() => {
    if (id) {
      loadBook();
    }
  }, [id, loadBook]);

  const handleAddToCartClick = async (quantity, wantedQuantity, bookId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      toast.error("Please login first!");
      return;
    }
    if (wantedQuantity > quantity) {
      toast.error("Not enough stock available");
      return;
    }

    try {
      const response = await AddToCart(bookId, wantedQuantity);
      toast.success(response?.message || "Added to cart successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add item");
      console.error("Add to Cart Error:", error?.response);
    }
  };

  const handleAddToWishListClick = async (bookId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      toast.error("Please login first!");
      return;
    }

    try {
      const response = await AddToWishList(bookId);
      toast.success(response?.message || "Added to wishlist successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add item");
      console.error("Add to Wishlist Error:", error?.response);
    }
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

  if (loading) {
    return <div className="text-center py-20">Loading book details...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600">{error}</div>;
  }

  if (!bookById || Object.keys(bookById).length === 0) {
    return <div className="text-center py-20">Book not found.</div>;
  }

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
          <span className="font-medium text-[#2C3E50]">{bookById.bookTitle}</span>
        </nav>

        {/* Main */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Cover */}
          <div className="md:w-1/3 relative">
          {bookById.isOnSale && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              On Sale
          </span>
            )}

            {bookById.imageUrl ? (
              <img
                src={`http://localhost:5189${bookById.imageUrl}`}
                alt={bookById.bookTitle}
                className="w-full rounded-lg shadow"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center bg-gray-200 rounded">
                <span className="text-gray-600">No Image Available</span>
              </div>
            )}
          </div>


          {/* Details */}
          <div className="md:w-2/3 space-y-4">
            <h1 className="text-3xl font-bold text-[#2C3E50]">
              {bookById.bookTitle}
            </h1>
            <p className="text-xl">
              by{" "}
              <span className="text-[#E3B23C] font-semibold">
                {bookById.authorName}
              </span>
            </p>

            <div className="flex items-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  size={18}
                  className={
                    i < Math.floor(bookById.rating || 0)
                      ? "text-[#E3B23C]"
                      : "text-gray-300"
                  }
                />
              ))}
              <span>{(bookById.rating || 0).toFixed(1)} / 5</span>
            </div>

            <div className="space-y-1">
            <div className="flex items-baseline space-x-2">
        {bookById.isOnSale ? (
          <>
                  <span className="text-xl font-bold text-red-600">
                    <span className="text-gray-500 line-through">${bookById.bookPrice?.toFixed(2)}</span>
                    &nbsp; ${bookById.discountedPrice?.toFixed(2)}
                  </span>
                  {/* ✅ Show discount percentage */}
                  <span className="text-green-600 text-sm font-medium">
                    ({bookById.discountPercentage}% Off)
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold">${bookById.bookPrice?.toFixed(2)}</span>
              )}
            </div>
                  <p className="text-green-600">
              {bookById?.stockCount > 0 ? "In Stock — Ships within 24 hours" : "Out of Stock"}
            </p>

            {bookById.isOnSale && (
              <p className="text-sm text-gray-500">Sale Ends: {new Date(bookById.saleEndDate).toLocaleDateString()}</p>
            )}
          </div>



            <div className="space-y-4">
              {/* Formats */}
              <div className="flex items-center space-x-4 gap-4">

              <div>
                <p className="text-sm mb-2">Format</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                    {bookById.formatName}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm mb-2">Genere</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    {bookById?.genreName}
                  </span>
                </div>
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
                <button
                  onClick={() => handleAddToCartClick(bookById?.stockCount, qty, bookById?.bookId)}
                  className="bg-[#E3B23C] hover:bg-[#d1a436] text-white px-6 py-3 rounded font-bold"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleAddToWishListClick(bookById?.bookId)}
                  className="border border-[#2C3E50] text-[#2C3E50] px-6 py-3 rounded flex items-center"
                >
                  <BookmarkIcon size={18} className="mr-2" />
                  Wishlist
                </button>
              </div>
            </div>

            {/* Meta */}
            <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p>Publication Date</p>
                <p>{new Date(bookById.publicationDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p>ISBN</p>
                <p>{bookById.isbn}</p>
              </div>
              <div>
                <p>Language</p>
                <p>{bookById.bookLanguage}</p>
              </div>
              <div>
                <p>Pages</p>
                <p>{bookById.pages || "N/A"}</p>
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
                {bookById.bookDescription}
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
                {similar.map((similarBook) => (
                  <Link
                    key={similarBook.id}
                    href={`/catalogue/${similarBook.id}`}
                    className="block bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition"
                  >
                    {similarBook.cover ? (
                      <img
                        src={similarBook.cover}
                        alt={similarBook.title}
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 flex items-center justify-center bg-gray-200 rounded">
                        <span className="text-gray-600">No Image Available</span>
                      </div>
                    )}
                    <div className="p-4">
                      <h4 className="font-semibold">{similarBook.title}</h4>
                      <p className="text-sm text-gray-600">{similarBook.author}</p>
                      <p className="font-bold mt-2">${similarBook.price.toFixed(2)}</p>
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