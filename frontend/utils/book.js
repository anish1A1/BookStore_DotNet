"use client";
import axios from "./axios";
import { useState, useContext, createContext, useMemo } from "react";


const BookContext = createContext();

export const BookProvider = ({children}) => {
    const [books, setBooks] = useState([]);
    const [bookById, setBookById] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inventory, setInventory] = useState([]);

    const fetchBooks = async( filter = {}) => {
        try {
            const response = await axios.get('/book', { params: filter});
            setBooks(response.data.books);
            setLoading(false);    
        } catch (error) {
            const errorMessage = error.response?.data?.Message || 'Error fetching books';
            
            console.error('Error fetching the Books',errorMessage);
            throw errorMessage.response.data;
        } finally {
            setLoading(false);
        }
    };

    const fetchBooksById = async (id) => {
        try {
            const response = await axios.get(`/book/${id}`);
            setBookById(response.data);
        } catch (error) {
            const errorMessage = error.response?.data?.Message || 'Error fetching books';
            
            console.error('Error fetching the Books by Id',errorMessage);
            throw errorMessage.response.data;
        } finally {
            setLoading(false);
        }
    };

    const createBook = async (formData) => {
        const token = localStorage.getItem('token');
        const data = new FormData();

        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
            console.log(key, formData[key]);
        });

        try {
            const response = await axios.post('/book/create/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            setBooks((prevBooks) => [...prevBooks, response.data]);
            return {status: 'success', message: 'Book created successfully'}
        } catch (error) {
            const errorMessage = error.response?.data?.Message || 'Error creating book';
            
            console.error('Error creating book',errorMessage);
            throw errorMessage.response.data;
        } finally {
            setLoading(false);
        }
    };
    
    const updateBook = async (id, formData, router) => {
        const token = localStorage.getItem('token');
        const data = new FormData();

        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });

        try {
            const response = await axios.put(`/book/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            setBooks(prevBooks => prevBooks.map(book => book.id === id ? response.data : book));
            router.push('/books');
            return {status: 'success', message: 'Book updated successfully'}
        } catch (error) {
            const errorMessage = error.response?.data?.Message || 'Error updating book';
            
            console.error('Error updating book',errorMessage);
            throw errorMessage.response.data;
        } finally {
            setLoading(false);
        }
    };
    
    const deleteBook = async (id, router) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.delete(`/book/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            router.push('/books');
            setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
            return {status: 'success', message: 'Book deleted successfully'}
        } catch (error) {
            const errorMessage = error.response?.data?.Message || 'Error deleting book';
            
            console.error('Error deleting book',errorMessage);
            throw errorMessage.response.data;
        } finally {
            setLoading(false);
        }
    };

    const updateBookinventory = async (id, formData, router) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put(`/book/${id}/inventory`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            router.push('/books');
            setInventory(prevInventory => prevInventory.map(book => book.id === id ? response.data : book));
            return {status: 'success', message: 'Book inventory updated successfully'}
        } catch (error) {
            const errorMessage = error.response?.data?.Message || 'Error updating book inventory';
            
            console.error('Error updating book inventory',errorMessage);
            throw errorMessage.response.data;
        } finally {
            setLoading(false);
        }
    };

    const value = useMemo(() => ({
        books,
        bookById,
        loading,
        inventory,
        fetchBooks,
        fetchBooksById,
        createBook,
        updateBook,
        deleteBook,
        updateBookinventory
    }), [books, bookById, loading, inventory]);

    return (
        <BookContext.Provider value={value}>
          {children}
        </BookContext.Provider>
      ); 
}



export { BookContext };


