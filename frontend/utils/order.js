'use client';
import axios from "./axios";
import { useState, useContext, createContext, useMemo } from "react";


const OrderContext = createContext();

export const OrderProvider =({children}) => {
    const [orders, setOrders] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [orderById, setOrderById] = useState([]);
    const [loading, setLoading] = useState(true);
    const [wishlists, setWishlists] = useState([]);
    const [cartWhole, setCartWhole] = useState([]); 


    const fetchCart = async () => {
        const token = localStorage.getItem('token');
        try{

            const response = await axios.get('/cart', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            setCartItems(response.data);
        
        } catch (error) {
        const errorMessage = error.response?.data?.Message || 'Error fetching cart';
        
        console.error('Error fetching the Cart',errorMessage);
        throw error?.response?.data;
        } finally {
            setLoading(false);
        }
    };

    const fetchCartWhole = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('/cart/whole-data', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setCartWhole(response.data);
            console.log("Cart data is ", response.data);
        } catch (error) {
            const errorMessage = error.response?.data?.Message || 'Error fetching cart';
            
            console.error('Error fetching the Cart',errorMessage);
            throw error?.response?.data;
        }
    }

    const AddToCart = async (bookId, quantity) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(`/cart/${bookId}`, { quantity }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCartItems((prevCart) => [...prevCart, response.data]);
            return { status: 'success', message: 'Book added to cart successfully' }
        } catch (error) {
            const errorMessage = error.response?.data?.Message || 'Error adding book to cart';
            
            // console.error('Error adding book to cart',errorMessage);
            throw error?.response?.data;
        } finally {
            setLoading(false);
        }
    };

    const updateCart = async (bookId, quantity) => {
        const token = localStorage.getItem('token');
        try {
            console.log("Sending PUT request to:", `/cart/${bookId}`, "with payload:", { quantity });
            console.log("Authorization header:", `Bearer ${token}`);
            const response = await axios.put(`/cart/${bookId}`, { quantity }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCartItems(prevCart => prevCart.map(item => item.id === bookId ? response.data : item));
            console.log("Data is ", response.data);
            return { status: 'success', message: 'Book quantity updated successfully' }
        } catch (error) {
            const errorMessage = error.response?.data?.Message || 'Error updating book quantity';
            
            // console.error('Error updating book quantity',errorMessage);
            throw error?.response?.data;
        } finally {
            setLoading(false);
        }
    }
    
    const removeFromCart = async (bookId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.delete(`/cart/${bookId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCartItems(prevCart => prevCart.filter(item => item.id !== bookId));
            return { status: 'success', message: 'Book removed from cart successfully' }


        } catch (error) {
            const errorMessage = error.response?.data?.Message || 'Error removing book from cart';
            
            console.error('Error removing book from cart',errorMessage);
            throw error?.response?.data;
        } finally {
            setLoading(false);
        }
    };


    
    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/order/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setOrders(response.data);
            setLoading(false);    
        } catch (error) {
            const errorMessage = error.response?.data?.Message || 'Error fetching orders';
            
            console.error('Error fetching the Orders',errorMessage);
            throw error?.response?.data;
        } finally {
            setLoading(false);
        }
    };

    const fetchOrdersById = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/orders/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setOrderById(response.data);
        } catch (error) {
            const errorMessage = error.response?.data?.Message || 'Error fetching orders';
            
            console.error('Error fetching the Orders by Id',errorMessage);
            throw error?.response?.data;
        } finally {
            setLoading(false);
        }
    };

    const AddToWishList = async (bookId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(`/wishlist/${bookId}`, { bookId }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setWishlists((prevWishlists) => [...prevWishlists, response.data]);
            return { status: 'success', message: 'Book added to wishlist successfully' }
        } catch (error) {
            const errorMessage = error.response?.data?.Message || 'Error adding book to wishlist';
            
            console.error('Error adding book to wishlist',errorMessage);
            throw error?.response?.data;
        } finally {
            setLoading(false);
        }
    };

    const getAllWishList = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/wishlist/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setWishlists(response.data);
            setLoading(false);    
        } catch (error) {
            const errorMessage = error.response?.data?.Message || 'Error fetching wishlist';
            
            console.error('Error fetching the wishlist',errorMessage);
            throw error?.response?.data;
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishList = async (bookId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.delete(`/wishlist/${bookId}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setWishlists(prevWishlists => prevWishlists.filter(item => item.id !== bookId));
            console.log("Wishlist removed ", response.data);
            return { status: 'success', message: 'Book removed from wishlist successfully' }
        } catch (error) {
            const errorMessage = error.response?.data?.Message || 'Error removing book from wishlist';
            
            console.error('Error removing book from wishlist',errorMessage);
            throw error?.response?.data;
        } finally {
            setLoading(false);
        }
    };
    const placeOrder = async ({ email, cartItems, TotalAmount }) => {
        const token = localStorage.getItem('token');
        try {
          setLoading(true);
          console.log("Placing order:", { email, cartItems });
          const response = await axios.post('/order', { email, cartItems, TotalAmount }, {
            headers: { Authorization: `Bearer ${token}` },
          });
          await fetchCart(); // Clear cart after successful order
          return { status: 'success', message: response.data.message || 'Order placed successfully' };
        } catch (error) {
          const errorMessage = error.response?.data?.Message || 'Error placing order';
          console.error('Place order error:', errorMessage, error.response?.data);
          throw error.response?.data;
        } finally {
          setLoading(false);
        }
      };



    const values = useMemo(() => ({
        orders,
        orderById,
        loading,
        cartItems,
        wishlists,
        cartWhole,
        fetchOrders,
        fetchOrdersById,
        AddToCart,
        removeFromCart,
        updateCart,
        fetchCart,
        AddToWishList,
        getAllWishList,
        removeFromWishList,
        placeOrder,
        fetchCartWhole,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [orders, cartItems, wishlists, orderById, loading, cartWhole]);

    return (
        <OrderContext.Provider value={values}>
            {children}
        </OrderContext.Provider>
    )
    
}

export {OrderContext};