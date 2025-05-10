import React, { useContext, useEffect, useState } from "react";
import { OrderContext } from "../../utils/order";
import { toast } from "sonner";
import axios from "../../utils/axios";

const ProfileReviews = () => {
  const { fetchOrders, orders, loading } = useContext(OrderContext);
  const [reviews, setReviews] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [myReviews, setMyReviews] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const res = await axios.get("/review/my", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setMyReviews(res.data);
      } catch (err) {
        console.error("Failed to fetch user reviews:", err);
      }
    };

    fetchMyReviews();
  }, []);

  const getExistingReview = (orderId, bookId) =>
    myReviews.find((r) => r.orderId === orderId && r.bookId === bookId);

  const handleInputChange = (orderId, bookId, field, value) => {
    setReviews((prev) => ({
      ...prev,
      [`${orderId}-${bookId}`]: {
        ...(prev[`${orderId}-${bookId}`] || {}),
        [field]: value,
      },
    }));
  };

  const handleSubmitReview = async (orderId, bookId) => {
    const reviewData = reviews[`${orderId}-${bookId}`];
    if (!reviewData?.rating || !reviewData?.comment) {
      toast.error("Please provide both rating and comment.");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(
        "/review",
        {
          orderId,
          bookId,
          rating: Number(reviewData.rating),
          comment: reviewData.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Review submitted successfully!");
      setMyReviews((prev) => [
        ...prev,
        {
          orderId,
          bookId,
          rating: Number(reviewData.rating),
          comment: reviewData.comment,
        },
      ]);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const fulfilledOrders = orders.filter((o) => o.status === "Fulfilled");

  if (loading) {
    return (
      <div className="mt-20 text-center text-xl font-semibold">Loading...</div>
    );
  }

  if (fulfilledOrders.length === 0) {
    return (
      <div className="mt-20 text-center text-xl font-semibold">
        No fulfilled orders found.
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-6">My Fulfilled Orders</h2>

      {fulfilledOrders.map((order) => (
        <div
          key={order.orderId}
          className="bg-white shadow-md rounded-lg mb-6 p-4"
        >
          <div className="mb-4 border-b pb-2">
            <p className="font-semibold">
              Order #{order.orderId.slice(0, 8).toUpperCase()}
            </p>
            <p className="text-sm text-gray-600">
              {new Date(order.orderDate).toLocaleDateString()}
            </p>
          </div>

          {order.orderItems.map((item) => {
            const key = `${order.orderId}-${item.book.bookId}`;
            const review = reviews[key] || {};
            const existingReview = getExistingReview(
              order.orderId,
              item.book.bookId
            );

            return (
              <div key={item.orderItemId} className="mb-6">
                <div className="flex items-center gap-4 mb-2">
                  <img
                    src={`http://localhost:5189${item.book.imageUrl}`}
                    alt={item.book.bookTitle}
                    className="w-16 h-20 object-cover rounded"
                  />
                  <div>
                    <h4 className="font-bold">{item.book.bookTitle}</h4>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="ml-20">
                  {existingReview ? (
                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded border">
                      <p>
                        <strong>Your Review:</strong>
                      </p>
                      <p>⭐ Rating: {existingReview.rating}</p>
                      <p>💬 Comment: {existingReview.comment}</p>
                    </div>
                  ) : (
                    <>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="1"
                        value={review.rating || ""}
                        onChange={(e) =>
                          handleInputChange(
                            order.orderId,
                            item.book.bookId,
                            "rating",
                            e.target.value
                          )
                        }
                        placeholder="Rating (0–5)"
                        className="border rounded p-1 w-24 mr-4"
                      />
                      <textarea
                        value={review.comment || ""}
                        onChange={(e) =>
                          handleInputChange(
                            order.orderId,
                            item.book.bookId,
                            "comment",
                            e.target.value
                          )
                        }
                        placeholder="Write your review..."
                        className="border rounded w-full mt-2 p-2 text-sm"
                      />
                      <button
                        onClick={() =>
                          handleSubmitReview(order.orderId, item.book.bookId)
                        }
                        disabled={submitting}
                        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        {submitting ? "Submitting..." : "Submit Review"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ProfileReviews;
