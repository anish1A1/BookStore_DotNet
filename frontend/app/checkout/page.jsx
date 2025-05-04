<<<<<<< HEAD
import React from 'react'

const CheckoutPage = () => {
  return (
    <div>
      
    </div>
  )
}

export default CheckoutPage
=======
// app/checkout/page.jsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckIcon } from "lucide-react";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#2C3E50] mb-8 text-center">
          Checkout
        </h1>

        {/* Progress */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center w-full max-w-3xl">
            {[1, 2, 3].map((n) => (
              <React.Fragment key={n}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= n ? "bg-[#E3B23C] text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step > n ? <CheckIcon size={20} /> : n}
                  </div>
                  <span className="text-sm mt-2">
                    {n === 1
                      ? "Pickup"
                      : n === 2
                      ? "Review"
                      : "Confirm"}
                  </span>
                </div>
                {n < 3 && (
                  <div
                    className={`flex-1 h-1 ${
                      step > n ? "bg-[#E3B23C]" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold mb-6">Pickup Location & Date</h2>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Location</label>
                <select className="w-full border rounded p-3">
                  <option>Main Store – 123 Literary Lane</option>
                  <option>Downtown – 456 Reader’s Ave</option>
                  <option>University – 789 Scholar St</option>
                </select>
              </div>
              <div className="mb-8">
                <label className="block text-gray-700 mb-2">Date</label>
                <select className="w-full border rounded p-3">
                  <option>Tomorrow, July 15 (10 AM)</option>
                  <option>July 16 (10 AM)</option>
                  <option>July 17 (10 AM)</option>
                </select>
                <p className="text-sm text-gray-500 mt-2">
                  Held for 3 days from pickup.
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={next}
                  className="bg-[#E3B23C] hover:bg-[#d1a436] text-white px-8 py-3 rounded font-bold"
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold mb-6">Review Order</h2>
              <div className="bg-gray-50 p-4 rounded mb-6">
                <h3 className="font-bold mb-2">Pickup</h3>
                <p>Main Store – 123 Literary Lane</p>
                <p>Tomorrow, July 15 (10 AM)</p>
              </div>
              <div className="border-b pb-4 mb-4">
                <h3 className="font-bold mb-4">Items (3)</h3>
                {[
                  { title: "The Silent Echo", price: 29.99, qty: 1 },
                  { title: "Quantum Horizons", price: 26.99, qty: 2 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center mb-4">
                    <div className="flex-grow">
                      <h4 className="font-bold">{item.title}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                    </div>
                    <div className="text-right font-bold">
                      ${(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mb-6 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>$83.97</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount (5%)</span>
                  <span>-$4.20</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>$79.77</span>
                </div>
              </div>
              <div className="mb-8">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full border rounded p-3"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex justify-between">
                <button
                  onClick={prev}
                  className="border border-[#2C3E50] text-[#2C3E50] px-6 py-3 rounded font-bold"
                >
                  Back
                </button>
                <button
                  onClick={next}
                  className="bg-[#E3B23C] hover:bg-[#d1a436] text-white px-8 py-3 rounded font-bold"
                >
                  Complete Order
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="text-center">
              <div className="w-20 h-20 bg-[#E3B23C] rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckIcon size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
              <p className="mb-8">Your order has been placed.</p>
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="font-bold mb-2">Claim Code</h3>
                <div className="bg-white border-2 border-dashed border-[#E3B23C] p-4 rounded text-2xl font-bold mb-2">
                  BLX-45678-92K
                </div>
                <p className="text-sm text-gray-600">
                  Sent to {email || "your email"}.
                </p>
              </div>
              <Link
                href="/"
                className="bg-[#E3B23C] hover:bg-[#d1a436] text-white px-8 py-3 rounded font-bold"
              >
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
>>>>>>> a085f1b4d93cf739d8afac5d090909b34b79fe2b
