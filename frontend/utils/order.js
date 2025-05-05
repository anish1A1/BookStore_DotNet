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

    const AddToCart = async (bookId, quantity) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(`/cart/${bookId}`, { bookId, quantity }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCartItems((prevCart) => [...prevCart, response.data]);
            return { status: 'success', message: 'Book added to cart successfully' }
        } catch (error) {
            const errorMessage = error.response?.data?.Message || 'Error adding book to cart';
            
            console.error('Error adding book to cart',errorMessage);
            throw errorMessage.response.data;
        } finally {
            setLoading(false);
        }
    };

    const updateCart = async (bookId, quantity) => {
        const token = localStorage.getItem('token');
        try {
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
            
            console.error('Error updating book quantity',errorMessage);
            throw errorMessage.response.data;
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
            throw errorMessage.response.data;
        } finally {
            setLoading(false);
        }
    };


    
    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/orders/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setOrders(response.data);
            setLoading(false);    
        } catch (error) {
            const errorMessage = error.response?.data?.Message || 'Error fetching orders';
            
            console.error('Error fetching the Orders',errorMessage);
            throw errorMessage.response.data;
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
            throw errorMessage.response.data;
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
            throw errorMessage.response.data;
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
            throw errorMessage.response.data;
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
        fetchOrders,
        fetchOrdersById,
        AddToCart,
        removeFromCart,
        updateCart,
        fetchCart,
        AddToWishList,
        getAllWishList
    }), [orders, cartItems, wishlists, orderById, loading]);

    return (
        <OrderContext.Provider value={values}>
            {children}
        </OrderContext.Provider>
    )
    
}

export {OrderContext};