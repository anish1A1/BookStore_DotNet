// app/admin/book-management/page.jsx
"use client";
import { BookContext } from "../../../utils/book";
import { useState, useMemo, useEffect, useContext } from "react";
import { PlusIcon, SearchIcon, EditIcon, TrashIcon } from "lucide-react";
import AddBook from "../components/AddBook";


export default function BookManagementPage() {
  const {fetchBooks, createBook, updateBook, deleteBook, updateBookinventory, books, loading, inventory} = useContext(BookContext);
  
  useEffect(() => {
    try {
      const getData = async () => {
        await fetchBooks();
      }
      getData();
    } catch (error) {
      console.error('Error fetching the Books',error);
    }
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteId, setShowDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    ISBN : "",
    BookTitle: "",
    BookDescription: "",
    PublicationDate: "",
    BookLanguage : "",
    BookPrice : 0,
    InitialStockCount : 0,
    LibraryAvailable: true,
    AuthorName: "",
    PublisherName: "",
    GenreName: "Fiction",
    FormatName: "Paperback",
    IsExclusive: false,
    IsAwardWinner: false
  });

  const filteredBooks = useMemo(() => {
    if (!Array.isArray(books)) return [];
    return books.filter(
      (b) =>
        b.BookTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.AuthorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.ISBN?.includes(searchTerm)
    );
  }, [books, searchTerm]);
  

  function openAdd() {
    setEditingId(null);
    setFormData({
      ISBN: "",
      BookTitle: "",
      BookDescription: "",
      PublicationDate: "",
      BookLanguage: "",
      BookPrice: 0,
      InitialStockCount: 0,
      LibraryAvailable: true,
      AuthorName: "",
      PublisherName: "0",
      GenreName: "Fiction",
      FormatName: "Paperback",
      IsExclusive: false,
      IsAwardWinner: false
    });
    setShowForm(true);
  }
  
  function openEdit(book) {
    setEditingId(book.id);
    setFormData({
      ISBN: book.ISBN,
      BookTitle: book.BookTitle,
      BookDescription: book.BookDescription,
      PublicationDate: book.PublicationDate,
      BookLanguage: book.BookLanguage,
      BookPrice: book.BookPrice,
      InitialStockCount: book.InitialStockCount,
      LibraryAvailable: book.LibraryAvailable,
      AuthorName: book.AuthorName,
      PublisherName: book.PublisherName,
      GenreName: book.GenreName,
      FormatName: book.FormatName,
      IsExclusive: book.IsExclusive,
      IsAwardWinner: book.IsAwardWinner
    });
    setShowForm(true);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const bookData = { ...formData };
  
    try {
      if (editingId) {
        await updateBook(editingId, bookData);
      } else {
        await createBook(bookData);
      }
      
      // await fetchBooks(); // Refresh book list
      setShowForm(false);
    } catch (error) {
      console.error("Error saving book", error);
    }
  };

  function confirmDelete(id) {
    setShowDeleteId(id);
  }

  const handleDelete = async () => {
    try {
      await deleteBook(showDeleteId);
      await fetchBooks(); // Refresh book list
      setShowDeleteId(null);
    } catch (error) {
      console.error("Error deleting book", error);
    }
  };

  const handleUpdateInventory = async (bookId, updatedStock) => {
    try {
      await updateBookinventory(bookId, { stock: updatedStock });
      await fetchBooks(); // Refresh books after inventory update
    } catch (error) {
      console.error("Error updating inventory", error);
    }
  };


  return (
    <div className="bg-gray-100 min-h-screen p-6">
  <div className="max-w-6xl mx-auto space-y-6">

    {/* Header */}
    <div className="bg-white p-6 rounded-lg shadow border border-gray-300 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Book Management</h1>
      <button
        onClick={openAdd}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md"
      >
        <PlusIcon size={16} />
        <span>Add New Book</span>
      </button>
    </div>

    {/* Search */}
    <div className="bg-white p-6 rounded-lg shadow border border-gray-300 flex gap-4">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search by title, author, or ISBN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 pl-10 border border-gray-300 rounded"
        />
        <SearchIcon className="absolute left-3 top-2.5 text-gray-400" size={18} />
      </div>
    </div>

    {/* Table */}
    <div className="bg-white p-6 rounded-lg shadow border border-gray-300 overflow-x-auto">
      
      {/* ✅ Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <span className="text-gray-600 text-lg font-medium">Loading books...</span>
        </div>
      )}

      

      {/* ✅ No Books Found */}
      {!loading && books.length === 0 && (
        <div className="text-center text-gray-500 py-10">
          <p className="text-lg font-medium">No books found.</p>
        </div>
      )}

      {/* Book Table */}
      {books.length > 0 && !loading && (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {["Cover", "Title", "Author", "ISBN", "Category", "Price", "Stock", "Actions"].map((h) => (
                <th key={h} className="p-3 border border-gray-300 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.bookId + b.isbn} className="hover:bg-gray-50">
                <td className="p-3 border border-gray-300">
                  {b.imageUrl ? (
                    <img src={`http://localhost:5189${b.imageUrl}`} alt={b.BookTitle} className="w-10 h-12 object-cover rounded" />
                  ) : (
                    <span className="text-gray-500">No Image</span>
                  )}
                </td>
                <td className="p-3 border border-gray-300">{b.bookTitle}</td>
                <td className="p-3 border border-gray-300">{b.authorName}</td>
                <td className="p-3 border border-gray-300">{b.isbn}</td>
                <td className="p-3 border border-gray-300">{b.genreName}</td>
                <td className="p-3 border border-gray-300">${b.bookPrice}</td>
                <td className="p-3 border border-gray-300">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${b.InitialStockCount === 0
                        ? "bg-red-500"
                        : b.InitialStockCount < 10
                        ? "bg-yellow-500"
                        : "bg-green-500"
                      }`}
                    ></div>
                    <span>{b.stockCount}</span>
                  </div>
                </td>
                <td className="p-3 border border-gray-300">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(b)}
                      className="p-1 bg-blue-100 text-blue-700 rounded"
                    >
                      <EditIcon size={16} />
                    </button>
                    <button
                      onClick={() => confirmDelete(b.id)}
                      className="p-1 bg-red-100 text-red-700 rounded"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>

    {/* Footer info */}
    <div className="text-sm text-gray-500">
      Showing {filteredBooks.length} of {books.length} books
    </div>
  </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <AddBook
        setShowForm={setShowForm}
      />
      
      )}

      {/* Delete Confirmation */}
      {showDeleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full space-y-4">
            <h2 className="text-lg font-bold">Confirm Delete</h2>
            <p>Are you sure you want to delete this book?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteId(null)}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
