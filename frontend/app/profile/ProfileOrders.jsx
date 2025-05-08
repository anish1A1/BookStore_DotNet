import React, {useState, useEffect, useContext} from 'react'
import { OrderContext } from '../../utils/order'
const ProfileOrders = () => {
    const {fetchOrders, orders, loading} = useContext(OrderContext);
  return (
    <div>
            <h2 className="text-2xl font-bold mb-6">My Orders</h2>
            {/** Example Order Card */}
            <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">Order #BL-2023-7845</p>
                    <p className="text-sm text-gray-500">July 14, 2023</p>
                  </div>
                  <div className="bg-green-100 text-green-800 text-sm py-1 px-3 rounded-full">
                    Ready for Pickup
                  </div>
                </div>
              </div>
              <div className="p-4">
                {[{
                  id:1, cover:"https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80",
                  title:"The Silent Echo", qty:1
                },{
                  id:2, cover:"https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80",
                  title:"Quantum Horizons", qty:2
                }].map((item) => (
                  <div key={item.id} className="flex items-center mb-4">
                    <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden mr-4">
                      <img
                        src={item.cover}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold">{item.title}</h4>
                      <p className="text-xs text-gray-600">Qty: {item.qty}</p>
                    </div>
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <div>
                    <p className="text-sm">
                      Total: <span className="font-bold">$79.77</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Claim Code: BLX-45678-92K
                    </p>
                  </div>
                  <button
                    onClick={() => {}}
                    className="text-[#2C3E50] text-sm hover:underline"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
            {/** Additional orders would follow... */}
          </div>
  )
}

export default ProfileOrders
