import React, { useEffect, useContext, useState } from 'react';
import { OrderContext } from '../../utils/order';
import { toast } from 'sonner';
const ProfileOrders = () => {
  const { fetchOrders, orders, loading,  cancelOrder } = useContext(OrderContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelClick = (orderId) => {
    setSelectedOrderId(orderId);
    setShowModal(true);
  };

  const confirmCancel = () => {
    if (selectedOrderId) {

        try {
            const response = cancelOrder(selectedOrderId); 
            toast.success(response?.message || "Order canceled successfully");
            fetchOrders();
            
        } catch (error) {
            toast.error(error?.message || "Failed to cancel order");
        }
    }
    setShowModal(false);
    setSelectedOrderId(null);
  };

  const cancelModal = () => {
    setShowModal(false);
    setSelectedOrderId(null);
  };

  if (loading) {
    return <div className="mt-20 font-bold text-2xl text-center">Loading ....</div>;
  }

  if (orders.length === 0) {
    return <div className="mt-20 font-bold text-2xl text-center">No orders found</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      {orders.map((order) => (
        <div key={order.orderId} className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="p-4 border-b flex justify-between items-center">
            <div>
              <p className="font-bold">Order #{order.orderId.slice(0, 8).toUpperCase()}</p>
              <p className="text-sm text-gray-500">
                {new Date(order.orderDate).toLocaleDateString()}
              </p>
            </div>
            <div className={`text-sm py-1 px-3 rounded-full capitalize ${
              order.status === 'Cancelled' ? 'bg-red-300 text-red-800' :     order.status === 'Fulfilled' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
            }`}>
              {order.status}
            </div>
          </div>

          <div className="p-4">
            {order.orderItems.map((item) => (
              <div key={item.orderItemId} className="flex items-center mb-4">
                <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden mr-4">
                  {item?.book?.imageUrl && (
                    <img
                      src={`http://localhost:5189${item?.book?.imageUrl}`}
                      alt={item.book.bookTitle}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <h4 className="font-bold">{item.book.bookTitle}</h4>
                  <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}

            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <div>
                <p className="text-sm">
                  Total: <span className="font-bold">NPR {order.totalAmount.toLocaleString()}</span>
                </p>
                {order.status !== 'Cancelled' && (
                    <p className="text-xs text-gray-500">Claim Code: {order.claimCode}</p>

                )}
              </div>
              {order.status === 'Pending' && (
                <button
                  onClick={() => handleCancelClick(order.orderId)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
            <p className="text-lg font-semibold mb-4">Are you sure you want to cancel this order?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmCancel}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Cancel
              </button>
              <button
                onClick={cancelModal}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                No, Keep
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileOrders;
