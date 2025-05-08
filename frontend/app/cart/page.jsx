'use client'
import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { MinusIcon, PlusIcon, XIcon } from 'lucide-react'
import { OrderContext } from '../../utils/order'
import { toast } from 'sonner'
import { AuthContext } from '../../utils/auth'
import { useRouter } from 'next/navigation'
const initialcartItem = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKi5lknrw7SIwZ01RQRqyvtXz2bFxrUsGVpA&s',
    price: 10.99,
    onSale: false,
    salePrice: 0,
    quantity: 1,
  },
  {
    id: 2,
    title: '1984',
    author: 'George Orwell',
    cover: 'https://m.media-amazon.com/images/I/81vHA1+GmhS.jpg',
    price: 8.99,
    onSale: true,
    salePrice: 7.49,
    quantity: 2,
  },
]

export default function CartPage() {
  const router = useRouter();
  const {removeFromCart, updateCart, fetchCart,  cartItems,loading, fetchOrders, orders } = useContext(OrderContext);
  const [cartItem, setcartItem] = useState(initialcartItem)

  const {user, fetchUserData} = useContext(AuthContext);

  

  useEffect(() => {

      fetchCart()
    // fetchOrders()
  },[]);
  
  const [quantity, setQuantity] = useState([]);
  
  useEffect(() => {
    if(user) {
      const initialQuantities = {};
      cartItem?.forEach((item) => {
        initialQuantities[item.id] = item.quantity
      })

    }
  },[cartItem]);

  // const handleQuantityChange = (id, qty) => setQuantity({ ...quantity, [id]: qty });

  const increaseQuantity = async (cartItemId, currentQuantity) => {
    const newQuantity = currentQuantity + 1;
    await updateQuantity(cartItemId, newQuantity);
    fetchCart(); // refresh cart from backend
  };
  
  const decreaseQuantity = async (cartItemId, currentQuantity) => {
    if (currentQuantity <= 1) return;
    const newQuantity = currentQuantity - 1;
    await updateQuantity(cartItemId, newQuantity);
    fetchCart(); // refresh cart from backend
  };
  



      const updateQuantity = async (id, quantity) => {

        setQuantity((prev) => ({ ...prev, [id]: quantity }));
        console.log("Data is ", id, quantity);
        try {
          const response = await updateCart(id, quantity);
          toast.success(response.message);
        } catch (error) {
          toast.error(error?.response?.data?.message || "Failed to update quantity");
          console.error("Failed to update quantity:", error?.response);

          setQuantity((prev) => ({ ...prev, [id]: prev[id] }));
        }
      };

      const removeItem = async (bookId) => {
        try {
          const response = await removeFromCart(bookId);
          toast.success(response.message);
          fetchCart();
        } catch (error) {
          toast.error(error?.response?.data?.message || "Failed to Remove from Cart");
          console.error("Failed to Remove from Cart:", error?.response);
        }
      };


      // Totals
      const subtotal = cartItems?.reduce((sum, item) => {
        const price = item?.onSale ? item?.salePrice : item?.bookPrice
        return sum + price * item?.quantity
      }, 0)
      const discountPercent = 5
      const discount = parseFloat(
        (subtotal * (discountPercent / 100)).toFixed(2)
      )
      const total = parseFloat((subtotal - discount).toFixed(2))
      


      const validCartItems = Array.isArray(cartItems) ? cartItems : [];

      const totalQuantity = validCartItems.reduce((sum, item) => sum + item.quantity, 0);

      const totalPrice = validCartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      
      const discountBy5Percent = totalQuantity >= 5 ? totalPrice * 0.05 : 0;
          // console.log("cartItems", cartItems);
          // console.log("totalQuantity", totalQuantity);
          // console.log("totalPrice", totalPrice);
          // console.log("discountBy5Percent", discountBy5Percent);



      if(loading) {
        return <p className='text-center py-20'>Loading...</p>
      }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#2C3E50] mb-6">Your Cart</h1>

        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="w-full lg:w-2/3">
              <div className="border-b pb-2 mb-4 hidden md:flex">
                <div className="w-1/2 font-bold">Product</div>
                <div className="w-1/6 font-bold text-center">Price</div>
                <div className="w-1/6 font-bold text-center">Qty</div>
                <div className="w-1/6 font-bold text-right">Total</div>
              </div>
              {cartItems.map((item) => (
                <div
                  key={item?.cartItemId + item?.book?.bookId}
                  className="flex flex-col md:flex-row items-center border-b py-4"
                >
                  {/* Product Info */}
                  <div className="w-full md:w-1/2 flex items-center mb-4 md:mb-0">
                    <div className="w-20 h-24 bg-gray-100 rounded overflow-hidden mr-4">
                      
                      {console.log("Item Book ImageUrl:", item?.book?.imageUrl)}
                      {item?.book?.imageUrl ? (
                      <img
                        src={`http://localhost:5189${item?.book?.imageUrl}`}
                        alt={item?.book?.bookTitle}
                        className="w-full  object-cover rounded"
                      />
                    ) : (
                      <div className="w-full flex items-center justify-center bg-gray-200 rounded">
                        <span className="text-gray-600">No Image Available</span>
                      </div>
                    )}
                    

                    </div>
                    <div>
                      <h3 className="font-bold">{item?.book?.bookTitle}</h3>
                      <p className="text-sm text-gray-600">{item?.book?.authorName}</p>
                      <p className="text-xs text-gray-500">Format: {item?.book?.formatName}</p>
                      <button
                        onClick={() => updateQuantity(item.cartItemId)}
                        className="text-red-500 text-xs flex items-center mt-2 md:hidden cursor-pointer p-3 "
                      >
                        <XIcon size={18} className="mr-1 cursor-pointer" /> Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="w-full md:w-1/6 text-center mb-4 md:mb-0">
                    <div className="md:hidden text-sm text-gray-500 mb-1">Price:</div>
                    ${item.onSale ? item.salePrice : item?.book?.bookPrice}
                  </div>

                  <div className="w-full md:w-1/6 flex justify-center mb-4 md:mb-0">
                  <div className="md:hidden text-sm text-gray-500 mr-2">Qty:</div>
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => decreaseQuantity(item.book.bookId, item.quantity)}
                      className="px-2 py-1 border-r"
                      disabled={item.quantity <= 1}
                    >
                      <MinusIcon size={14} />
                    </button>
                    <span className="px-3">{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.book.bookId, item.quantity)}
                      className="px-2 py-1 border-l"
                    >
                      <PlusIcon size={14} />
                    </button>
                  </div>
                </div>


                  {/* Total & Remove */}
                  <div className="w-full md:w-1/6 text-right mb-4 md:mb-0">
                    <div className="md:hidden text-sm text-gray-500 mb-1">Total:</div>
                    <span className="font-bold">
                      {/* $ {((item.onSale ? item.salePrice : item.price) * item.quantity).toFixed(2)} */}
                      ${item.unitPrice * item.quantity}
                    </span>
                    <button
                      onClick={() => removeItem(item?.book?.bookId)}
                      className="text-red-500 text-xs hidden md:block mt-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              {/* Cart Actions */}
              <div className="flex justify-between mt-6">
                <Link href="/catalog" className="text-[#E3B23C] font-bold hover:underline">
                  Continue Shopping
                </Link>
                
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-1/3">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>${!isNaN(totalPrice) ? totalPrice.toFixed(2) : '0.00'}</span>

                  </div>
                  {totalQuantity && totalQuantity >= 5 && (
                    
                    <div className="flex justify-between text-green-600">
                    <span>Discount (5%)</span>
                    <span>-${discountBy5Percent.toFixed(2)}</span>
                  </div>
                  )}
                </div>
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>
                    ${!isNaN(totalPrice - discountBy5Percent) ? (totalPrice - discountBy5Percent).toFixed(2) : '0.00'}
                  </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Order 3 more books to qualify for 10% discount
                  </p>
                </div>
                <Link href="/checkout" className="block w-full bg-[#E3B23C] hover:bg-[#d1a436] text-white py-3 rounded font-bold transition-colors mb-4 text-center">
                  Proceed to Checkout
                </Link>
                <p className="text-sm text-center text-gray-500">
                  We accept credit cards, PayPal, and BookLux gift cards
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="mb-6">Looks like you haven’t added any books yet.</p>
            <Link href="/catalog" className="bg-[#E3B23C] hover:bg-[#d1a436] text-white px-6 py-3 rounded font-bold transition-colors">
              Browse Collection
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
