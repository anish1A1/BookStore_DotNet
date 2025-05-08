"use client";

import { useContext, useEffect } from "react";
import Link from "next/link";
import { HeartIcon, ShoppingCartIcon } from "lucide-react";
import { OrderContext } from "../../utils/order";
import { AuthContext } from "../../utils/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function WishlistPage() {
  const { getAllWishList, AddToCart, removeFromWishList, wishlists, loading } = useContext(OrderContext);
  const { user, fetchUserData } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
    if (!user) {
      router.push("/login");
      toast.error("Please login first!");
    } else {
      getAllWishList();
    }
  }, [user, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center py-20">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const handleDelete = async (bookId) => {
    try {
      const response = await removeFromWishList(bookId);
      getAllWishList();
      toast.success(response?.message || "Deleted from wishlist successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete item");
    }
  };

  const handleAddToCart = async (bookId) => {
    try {
      const response = await AddToCart(bookId, 1);
      toast.success(response?.message || "Added to cart successfully");
    } catch (error) {
      toast.error(error?.message || "Failed to add item");
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-50">
      <div
        className="h-64 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://cdn.prod.website-files.com/605826c62e8de87de744596e/6316cc066dd19a6c19aada38_Aug%20Orders%20Wishlist%20Page-%20Case%20Studies.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white">
          <h1 className="text-4xl font-bold">Your Wishlist</h1>
          <p className="mt-2">Save the books you love for later.</p>
        </div>
      </div>
      <div className="container mx-auto px-4 pt-6 pb-4 flex-1">
        <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Cover</th>
              <th className="p-3 text-left">Book Title</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-center">Qty</th>
              <th className="p-3 text-left">Availability</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {wishlists.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  Your wishlist is empty.
                </td>
              </tr>
            )}
            {wishlists.map((b) => {
              const unit = b.onSale ? b.salePrice : b?.bookPrice;
              const total = (unit * 1).toFixed(2);
              return (
                <tr key={b.bookId + b.bookTitle} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    {b?.imageUrl ? (
                      <img
                        src={`http://localhost:5189${b.imageUrl}`}
                        alt={b.bookTitle}
                        className="w-16 h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-20 flex items-center justify-center bg-gray-200 rounded">
                        <span className="text-gray-600">No Image Available</span>
                      </div>
                    )}
                  </td>
                  <td className="p-3">{b.bookTitle}</td>
                  <td className="p-3 text-gray-800 font-semibold">${total}</td>
                  <td className="p-2 text-center">
                    <div className="inline-flex items-center border rounded overflow-hidden">
                      1
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={
                        b?.libraryAvailable === true ? "text-green-600" : "text-red-500"
                      }
                    >
                      {b.libraryAvailable ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="p-3 space-x-3">
                    <button
                      onClick={() => handleAddToCart(b.bookId)}
                      className="inline-flex items-center bg-[#F1C40F] hover:bg-green-600 text-white px-4 py-1 rounded transition"
                    >
                      <ShoppingCartIcon size={16} className="mr-1" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleDelete(b.bookId)}
                      className="inline-flex items-center bg-[#F1C40F] hover:bg-green-600 text-white px-4 py-1 rounded transition"
                    >
                      <HeartIcon size={16} className="mr-1" />
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}