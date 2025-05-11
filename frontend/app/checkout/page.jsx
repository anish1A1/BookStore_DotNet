"use client";

import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { CheckIcon } from "lucide-react";
import { OrderContext } from "../../utils/order";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { cartWhole, placeOrder, fetchCartWhole } = useContext(OrderContext);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCartWhole();
  }, []);

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const subtotal = (cartWhole?.cartItems || []).reduce((sum, item) => {
    const price = typeof item.book?.discountedPrice === 'number' && item.book.discountedPrice > 0 
      ? item.book.discountedPrice 
      : item.book?.bookPrice || 0;
    return sum + price * item.quantity;
  }, 0);

  const totalBooks = (cartWhole?.cartItems || []).reduce((sum, item) => sum + item.quantity, 0);

  const orderCount = cartWhole?.orderCount || 0;
  let discountAmount = 0;
  let discountPercent = 0;
  if (totalBooks >= 5) {
    discountAmount = 5;
    discountPercent += 5;
  }
  if (orderCount >= 10) {
    discountPercent += 10;
  }
  const discount = parseFloat((subtotal * (discountPercent / 100)).toFixed(2));
  const total = parseFloat((subtotal - discount).toFixed(2));

  const handleCompleteOrder = async () => {
    setLoading(true);
    try {
      const response = await placeOrder({
        TotalAmount: total
      });
      
      toast.success("Order placed successfully! Check your email for the claim code.");
      console.log("Order placed successfully:", response);
      setStep(3); // Move to confirmation step
    } catch (error) {
      toast.error(error?.Message || "Failed to place order");
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

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
                <p className="border rounded p-3">BookLux Store, Putalisadak, Kathmandu</p>
              </div>
              <div className="mb-8">
                <label className="block text-gray-700 mb-2">Date</label>
                <p className="border rounded p-3">Tomorrow, 10:00 AM - 05:00 PM</p>
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
                <p>BookLux Store, Putalisadak, Kathmandu</p>
                <p>Tomorrow, 10:00 AM - 05:00 PM</p>
              </div>
              <div className="border-b pb-4 mb-4">
                <h3 className="font-bold mb-4">Items ({cartWhole?.cartItems?.length || 0})</h3>
                {cartWhole?.cartItems?.map((item, i) => (
                  <div key={item.cartItemId} className="flex items-center mb-4">
                    <div className="flex-grow">
                      <h4 className="font-bold">{item.book?.bookTitle}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-700">Rs. {item.book.discountedPrice ? item.book.discountedPrice.toFixed(2) : item.book.bookPrice.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mb-6 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {totalBooks >= 5 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (5%)</span>
                    <span>-${(subtotal * 0.05).toFixed(2)}</span>
                  </div>
                )}
                {orderCount >= 10 && (
                  <div className="flex justify-between text-green-600">
                    <span>Loyalty Discount (10%)</span>
                    <span>-Rs. {(subtotal * 0.10).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={prev}
                  className="border border-[#2C3E50] text-[#2C3E50] px-6 py-3 rounded font-bold"
                >
                  Back
                </button>
                <button
                  onClick={handleCompleteOrder}
                  disabled={loading}
                  className="bg-[#E3B23C] hover:bg-[#d1a436] text-white px-8 py-3 rounded font-bold"
                >
                  {loading ? "Processing..." : "Complete Order"}
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
              <p className="mb-8">Your order has been placed. Check your email for the claim code.</p>
              <Link
                href="/catalog"
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