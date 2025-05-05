// app/wishlist/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { HeartIcon, ShoppingCartIcon } from "lucide-react";

const INITIAL = [
  {
    id: 1,
    title: "The Great Gatsby",
    cover:
      "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=200&q=60",
    price: 9.99,
    onSale: false,
    salePrice: null,
    availability: "In Stock",
    addedDate: "Jun 17, 2024",
    qty: 1,
    selected: false,
  },
  {
    id: 2,
    title: "Becoming",
    cover:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=200&q=60",
    price: 24.99,
    onSale: true,
    salePrice: 19.99,
    availability: "In Stock",
    addedDate: "Apr 4, 2024",
    qty: 1,
    selected: false,
  },
  {
    id: 3,
    title: "Dune",
    cover:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=200&q=60",
    price: 14.99,
    onSale: false,
    salePrice: null,
    availability: "In Stock",
    addedDate: "Mar 12, 2024",
    qty: 1,
    selected: false,
  },
];

export default function WishlistPage() {
  const [items, setItems] = useState(INITIAL);
  const [selectAll, setSelectAll] = useState(false);
  const [bulkAction, setBulkAction] = useState("add");

  const toggleSelectAll = () => {
    const next = !selectAll;
    setSelectAll(next);
    setItems((arr) => arr.map((i) => ({ ...i, selected: next })));
  };

  const toggleSelect = (id) =>
    setItems((arr) =>
      arr.map((i) => (i.id === id ? { ...i, selected: !i.selected } : i))
    );

  const updateQty = (id, delta) =>
    setItems((arr) =>
      arr.map((i) =>
        i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i
      )
    );

  const applyBulk = () => {
    // For demo: just clear selections
    setSelectAll(false);
    setItems((arr) => arr.map((i) => ({ ...i, selected: false })));
  };

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
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                  className="form-checkbox"
                />
              </th>
              <th className="p-3 text-left">Cover</th>
              <th className="p-3 text-left">Book Title</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-center">Qty</th>
              <th className="p-3 text-left">Availability</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((b) => {
              const unit = b.onSale ? b.salePrice : b.price;
              const total = (unit * b.qty).toFixed(2);
              return (
                <tr key={b.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={b.selected}
                      onChange={() => toggleSelect(b.id)}
                      className="form-checkbox"
                    />
                  </td>
                  <td className="p-2">
                    <img
                      src={b.cover}
                      alt={b.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                  </td>
                  <td className="p-3">{b.title}</td>
                  <td className="p-3 text-gray-800 font-semibold">
                    ${total}
                  </td>
                  <td className="p-3 text-center">
                    <div className="inline-flex items-center border rounded overflow-hidden">
                      <button
                        onClick={() => updateQty(b.id, -1)}
                        className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
                        disabled={b.qty <= 1}
                      >
                        −
                      </button>
                      <span className="px-3">{b.qty}</span>
                      <button
                        onClick={() => updateQty(b.id, +1)}
                        className="px-2 py-1 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={
                        b.availability === "In Stock"
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    >
                      {b.availability}
                    </span>
                  </td>
                  <td className="p-3 space-x-2">
                    <Link
                      href="/cart"
                      className="inline-flex items-center bg-[#F1C40F] hover:bg-green-600 text-white px-4 py-1 rounded transition"
                    >
                      <ShoppingCartIcon size={16} className="mr-1" />
                      Add to Cart
                    </Link>
                    <span className="text-sm text-gray-500">
                      Added: {b.addedDate}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Bulk action */}
        <div className="mt-4 flex items-center space-x-3">
          <span>Action for selected:</span>
          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="add">Add to cart</option>
            <option value="remove">Remove</option>
          </select>
          <button
            onClick={applyBulk}
            className="bg-[#F1C40F] hover:bg-green-600 text-white px-4 py-1 rounded"
          >
            APPLY
          </button>
          <button className="ml-auto border border-gray-300 text-gray-600 px-4 py-1 rounded hover:bg-gray-100">
            UPDATE
          </button>
        </div>

        {/* Add All to Cart */}
        <div className="mt-6 flex justify-end">
          <Link
            href="/cart"
            className="bg-[#F1C40F] hover:bg-green-600 text-white px-6 py-2 rounded"
          >
            Add All to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
