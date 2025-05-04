
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function StaffOrderDetail() {
  const router = useRouter();
  const orderId = "ORD-87654321";
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Static mock data
  const order = {
    placedOn: "Jan 20, 2023 at 2:34 PM",
    status: "pending",
    claimCode: "BC-12345-6789",
    customer: {
      name: "John Doe",
      email: "john.doe@example.com",
    
    },
    items: [
      {
        title: "Quantum Horizons",
        author: "Alice Walker",
        isbn: "978-123456710",
        price: "$24.99",
        qty: 1,
        cover:
          "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
      },
      {
        title: "Silent Echo",
        author: "Robert Frost",
        isbn: "978-123456711",
        price: "$19.99",
        qty: 2,
        cover:
          "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&q=80",
      },
      {
        title: "Midnight Gardens",
        author: "Sarah Johnson",
        isbn: "978-123456712",
        price: "$29.99",
        qty: 1,
        cover:
          "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=400&q=80",
      },
    ],
    pricing: {
      subtotal: "$104.96",
      loyaltyDiscount: "-$10.50",
      promo: "-$15.00",
      total: "$79.46",
    },
    timeline: [
      { label: "Order Placed", date: "Jan 20, 2023 at 2:34 PM", completed: true },
      { label: "Ready for Pickup", date: "Pending", completed: false },
      { label: "Completed", date: "Pending", completed: false },
    ],
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300 space-y-6 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm">
          <Link
            href="/staff/orders"
            className="text-gray-600 hover:underline"
          >
            Pending Orders
          </Link>
          <span className="mx-2">&gt;</span>
          <span>Order #{orderId}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Order Details */}
          <div className="lg:w-2/3 space-y-6">
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">Order #{orderId}</h1>
                <div className="text-gray-600">{order.placedOn}</div>
              </div>
              <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                {order.status}
              </div>
            </div>

            {/* Claim Code */}
            <div className="bg-gray-100 p-4 rounded-md">
              <div className="text-sm mb-1">Claim code</div>
              <div className="text-xl font-bold tracking-wider">
                {order.claimCode}
              </div>
            </div>

            {/* Customer Info */}
            <div className="border border-gray-300 rounded-md p-4">
              <h2 className="font-bold text-lg mb-3">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(order.customer).map(([label, value]) => (
                  <div key={label}>
                    <div className="text-sm text-gray-500">
                      {label.charAt(0).toUpperCase() + label.slice(1)}
                    </div>
                    <div>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="border border-gray-300 rounded-md p-4 space-y-4">
              <h2 className="font-bold text-lg mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-4 pb-4 border-b border-gray-200 last:border-0"
                  >
                    {/* Book Cover */}
                    <div className="w-16">
                      <img
                        src={item.cover}
                        alt={item.title}
                        className="w-full h-20 object-cover rounded"
                      />
                    </div>
                    {/* Book Details */}
                    <div className="flex-1">
                      <h3 className="font-bold">{item.title}</h3>
                      <div className="text-sm text-gray-600">{item.author}</div>
                      <div className="text-sm text-gray-600">
                        ISBN: {item.isbn}
                      </div>
                    </div>
                    {/* Quantity and Price */}
                    <div className="text-right">
                      <div className="font-bold">{item.price}</div>
                      <div className="text-sm text-gray-600">
                        Qty: {item.qty}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{order.pricing.subtotal}</span>
                </div>
                <div className="flex justify-between text-green-700">
                  <span>Loyalty Discount (10%)</span>
                  <span>{order.pricing.loyaltyDiscount}</span>
                </div>
                <div className="flex justify-between text-green-700">
                  <span>Promo Code "WELCOME15"</span>
                  <span>{order.pricing.promo}</span>
                </div>
                <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>{order.pricing.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Actions */}
          <div className="lg:w-1/3">
            <div className="border border-gray-300 rounded-md p-4 space-y-4">
              <h2 className="font-bold text-lg mb-4">Order Actions</h2>

              {/* Order Status */}
              <div>
                <div className="text-sm text-gray-500 mb-1">Current Status</div>
                <div className="px-3 py-1 bg-yellow-100 text-yellow-800 inline-block rounded">
                  {order.status}
                </div>
              </div>

              {/* Staff Notes */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Staff Notes
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded h-24"
                  placeholder="Add notes about this order..."
                />
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowConfirmation(true)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
                >
                  Mark as Fulfilled
                </button>
                <button
                  onClick={() => router.push("/staff/order")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  Print Order Details
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 rounded-md">
                  Contact Customer
                </button>
              </div>

              {/* Order Timeline */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="font-bold text-lg mb-3">Order Timeline</h3>
                <div className="space-y-3">
                  {order.timeline.map((t, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div
                        className={`w-4 h-4 rounded-full mt-1 ${
                          t.completed ? "bg-gray-800" : "bg-gray-300"
                        }`}
                      ></div>
                      <div>
                        <div
                          className={`font-medium ${
                            t.completed ? "" : "text-gray-400"
                          }`}
                        >
                          {t.label}
                        </div>
                        <div className="text-xs text-gray-500">{t.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Order Fulfilled</h2>
              <p className="mb-6">
                Order #{orderId} has been marked as fulfilled and is now ready
                for pickup. An email notification has been sent to the customer.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowConfirmation(false);
                    router.push("/staff/order");
                  }}
                  className="px-4 py-2 bg-gray-800 text-white rounded-md"
                >
                  Return to Orders
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Annotations */}
        {/* <div className="relative border-2 border-dashed border-gray-400 p-4 mt-8">
          <h2 className="font-bold mb-2">Annotations:</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <span className="font-bold">Breadcrumb Navigation:</span> Easy
              navigation back to orders list
            </li>
            <li>
              <span className="font-bold">Order Header:</span> Clear display of
              order number, date, and status
            </li>
            <li>
              <span className="font-bold">Claim Code:</span> Prominently displayed
              for customer pickup
            </li>
            <li>
              <span className="font-bold">Customer Information:</span> Contact
              details and member status
            </li>
            <li>
              <span className="font-bold">Order Items:</span> Detailed list with
              ISBN and real cover images
            </li>
            <li>
              <span className="font-bold">Order Actions:</span> "Mark as
              Fulfilled" primary action with supporting functions
            </li>
            <li>
              <span className="font-bold">Staff Notes:</span> Text area for
              order-specific notes
            </li>
            <li>
              <span className="font-bold">Order Timeline:</span> Visual
              representation of order progress
            </li>
            <li>
              <span className="font-bold">Confirmation Modal:</span> Feedback when
              order is marked as fulfilled
            </li>
            <li>
              <span className="font-bold">Two-Column Layout:</span> Order details
              on left, actions on right
            </li>
          </ul>
        </div> */}
      </div>
    </div>
  );
}
