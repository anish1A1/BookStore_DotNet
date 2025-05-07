// app/wishlist/page.jsx
"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { HeartIcon, ShoppingCartIcon, Delete } from "lucide-react";
import axios from "../../utils/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { OrderContext } from "../../utils/order";
import { AuthContext } from "../../utils/auth";



export default function WishlistPage() {
  const {getAllWishList, AddToCart, removeFromWishList, wishlists, loading} = useContext(OrderContext);
  const {user, fetchUserData} = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
      fetchUserData();
    }, [user]);
  
    if (!user) {
      router.push("/login");
      toast.error("Please login first!");
      return;
    }


  useEffect(() => {
    getAllWishList();
  },[user]);
  const handleDelete = async (id) => {
    try {
      const response = await removeFromWishList(id);
      getAllWishList();
      toast.success(response?.message || "Deleted from wishlist successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete item");
      console.log(error);
    }
  }

  const handleAddToCart =async  (id) => {
    try {
      const response = await AddToCart(id);
      toast.success(response?.message || "Added to cart successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add item");
    }
  }


  if (loading) {
    <div className="min-h-screen flex items-center justify-center py-20"> 
    Loading...
    </div>
  }

  

  return (
    <div className="flex flex-col flex-1 bg-gray-50">
      {/* Hero header */}
      <div
        className="h-64 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1350&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white">
          <h1 className="text-4xl font-bold">Your Wishlist</h1>
          <p className="mt-2">Save the books you love for later.</p>
        </div>
      </div>

      {/* Content */}
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
            {wishlists.length> 0 && wishlists.map((b) => {
              const unit = b.onSale ? b.salePrice : b?.bookPrice;
              const total = (unit * 1).toFixed(2);
              console.log(b);
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
                  <td className="p-3 text-gray-800 font-semibold">
                    ${total}
                  </td>
                  <td className="p-2 text-center">
                    <div className="inline-flex items-center border rounded overflow-hidden">
                      1
                      {/* <button
                        onClick={() => updateQty(b.bookId, -1)}
                        className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
                        disabled={b.qty <= 1}
                      >
                        −
                      </button>
                      <span className="px-3">{1}</span>
                      <button
                        onClick={() => updateQty(b.id, +1)}
                        className="px-2 py-1 hover:bg-gray-100"
                      >
                        +
                      </button> */}
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={
                        b.libraryAvailable === true
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    >
                      {b.libraryAvailable ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="p-3 space-x-3 ">
                    <button
                      onClick={() => handleAddToCart(b.bookId)}
                      className="inline-flex items-center bg-[#F1C40F] hover:bg-green-600 text-white px-4 py-1 rounded transition"
                    >
                      <ShoppingCartIcon size={16} className="mr-1" />
                      Add to Cart
                    </button>
                    <button onClick={() =>handleDelete(b.bookId)} 
                    className="inline-flex items-center bg-[#F1C40F] hover:bg-green-600 text-white px-4 py-1 rounded transition">
                      <Delete size={16} className="mr-1" />
                      
                      Remove
                    </button>
                    
                  </td>
                  {/* <td className="p-3 space-x-2">
                    <button onClick={handleDelete} className="inline-flex items-center bg-[#F1C40F] hover:bg-green-600 text-white px-4 py-1 rounded transition">
                      Remove
                    </button>
                  </td> */}
                </tr>
                
              );
            })}
          </tbody>
        </table>

        

        
      </div>
    </div>
  );
}
