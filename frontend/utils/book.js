"use client";
import axios from "./axios";
import { useState, useContext, createContext, useMemo } from "react";


const BookContext = createContext();

export const BookProvider = ({children}) => {
    const [books, setBooks] = useState([]);
    const [bookById, setBookById] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inventory, setInventory] = useState([]);
    const [discount, setDiscount] = useState([]);
    const [bookForDis, setBookForDis] = useState([]);
    const fetchBooks = async( filter = {}) => {
        try {
            const response = await axios.get('/book', { params: filter});
            console.log("FetchBooks Response:", response.data);
            setBooks(response.data.books);
            setLoading(false);    
        } catch (error) {
            const errorMessage = error.response?.data?.Message || 'Error fetching books';
            
            console.error('Error fetching the Books',errorMessage);
            throw error?.response?.data;
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
            throw error?.response?.data;
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
            throw error?.response?.data?.message;
        } finally {
            setLoading(false);
        }
    };
    
    const updateBook = async (id, formData) => {
        const token = localStorage.getItem("token");
        const data = {
          ISBN: formData.ISBN,
          BookTitle: formData.BookTitle,
          BookDescription: formData.BookDescription,
          PublicationDate: formData.PublicationDate,
          BookLanguage: formData.BookLanguage,
          BookPrice: formData.BookPrice,
          InitialStockCount: formData.InitialStockCount,
          LibraryAvailable: formData.LibraryAvailable,
          AuthorName: formData.AuthorName,
          PublisherName: formData.PublisherName,
          GenreName: formData.GenreName,
          FormatName: formData.FormatName,
          IsAwardWinner: formData.IsAwardWinner,
          IsExclusive: formData.IsExclusive,
        };
    
        try {
          const response = await axios.put(`/book/${id}`, data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setBooks((prevBooks) =>
            prevBooks.map((book) =>
              book.bookId === id ? { ...book, ...data } : book
            )
          );
          return { status: "success", message: "Book updated successfully" };
        } catch (error) {
          const errorMessage = error.response?.data?.Message || "Error updating book";
          console.error("Error updating book", error, error.response?.data);
          throw errorMessage;
        } finally {
          setLoading(false);
        }
      };
    
    const deleteBook = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.delete(`/book/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBooks((prevBooks) => prevBooks.filter((book) => book.bookId !== id));
            return {status: 'success', message: 'Book deleted successfully'}
        } catch (error) {
            const errorMessage = error.response?.data?.Message || 'Error deleting book';
            
            console.error('Error deleting book',errorMessage);
            throw error?.response?.data?.message;
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


    const createDiscount = async (data) => {
        const token = localStorage.getItem('token');
        Object.keys(data).forEach((key) => {
            data.append(key, data[key]);
        });

        try {
            const response = await axios.post('/discount/create', {data}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setDiscount((prevDiscount) => [...prevDiscount, response.data]);
            return {status: 'success', message: 'Discount created successfully'}
        } catch (error) {
            console.error('Error creating discount',error);
            throw error?.response?.data?.Message;
        }
    };

    const fetchallDiscount = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('/discount/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setDiscount(response.data);
        } catch (error) {
            console.error('Error fetching discount',error);
            throw error?.response?.data?.Message;
        }
    };

    const fetchBookToAddForDisc = () => {
        const token = localStorage.getItem('token');
        try {
            const response = axios.get('/book/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setBookForDis(response.data);
            
        } catch (error) {
            const errorRes = error.response?.data?.Message || 'Error fetching books';
            console.error('Error fetching the Books',errorRes);
            throw errorRes;
        }
    }



    const value = useMemo(() => ({
        books,
        bookById,
        loading,
        inventory,
        discount,
        bookForDis,
        fetchBookToAddForDisc,
        fetchBooks,
        fetchBooksById,
        createBook,
        updateBook,
        deleteBook,
        updateBookinventory,
        createDiscount,
        fetchallDiscount,
    }), [books, bookById, discount, loading, inventory, bookForDis]);

    return (
        <BookContext.Provider value={value}>
          {children}
        </BookContext.Provider>
      ); 
}



export { BookContext };


