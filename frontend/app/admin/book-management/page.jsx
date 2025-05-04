// app/admin/book-management/page.jsx
"use client";

import { useState, useMemo } from "react";
import { PlusIcon, SearchIcon, EditIcon, TrashIcon } from "lucide-react";

export default function BookManagementPage() {
  const initialBooks = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: i + 1,
        title: `Book Title ${i + 1}`,
        author: "Author Name",
        isbn: `978-1234567${i}90`,
        category: ["Fiction", "Non-Fiction", "Children's"][i % 3],
        price: (19.99 + i).toFixed(2),
        stock: [0, 5, 20, 8][i % 4],
        cover: `https://picsum.photos/seed/book${i}/60/90`,
      })),
    []
  );

  const [books, setBooks] = useState(initialBooks);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteId, setShowDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "Fiction",
    price: "",
    stock: "0",
    cover: "",
  });

  const filteredBooks = useMemo(
    () =>
      books.filter(
        (b) =>
          b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.isbn.includes(searchTerm)
      ),
    [books, searchTerm]
  );

  function openAdd() {
    setEditingId(null);
    setFormData({ title: "", author: "", isbn: "", category: "Fiction", price: "", stock: "0", cover: "" });
    setShowForm(true);
  }

  function openEdit(book) {
    setEditingId(book.id);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      price: book.price,
      stock: String(book.stock),
      cover: book.cover,
    });
    setShowForm(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    // clamp stock to non-negative integer
    const stockVal = Math.max(0, parseInt(formData.stock, 10) || 0);
    const normalized = { ...formData, stock: stockVal };

    if (editingId) {
      setBooks((bs) =>
        bs.map((b) =>
          b.id === editingId ? { ...b, ...normalized } : b
        )
      );
    } else {
      const newBook = { ...normalized, id: books.length + 1 };
      setBooks((bs) => [...bs, newBook]);
    }
    setShowForm(false);
  }

  function confirmDelete(id) {
    setShowDeleteId(id);
  }

  function handleDelete() {
    setBooks((bs) => bs.filter((b) => b.id !== showDeleteId));
    setShowDeleteId(null);
  }

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
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {[
                  "Cover",
                  "Title",
                  "Author",
                  "ISBN",
                  "Category",
                  "Price",
                  "Stock",
                  "Actions",
                ].map((h) => (
                  <th key={h} className="p-3 border border-gray-300 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="p-3 border border-gray-300">
                    <img
                      src={b.cover}
                      alt="cover"
                      className="w-10 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="p-3 border border-gray-300">{b.title}</td>
                  <td className="p-3 border border-gray-300">{b.author}</td>
                  <td className="p-3 border border-gray-300">{b.isbn}</td>
                  <td className="p-3 border border-gray-300">{b.category}</td>
                  <td className="p-3 border border-gray-300">${b.price}</td>
                  <td className="p-3 border border-gray-300">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          b.stock === 0
                            ? 'bg-red-500'
                            : b.stock < 10
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                      ></div>
                      <span>{b.stock}</span>
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
        </div>

        {/* Footer info */}
        <div className="text-sm text-gray-500">
          Showing {filteredBooks.length} of {books.length} books
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full space-y-4">
            <h2 className="text-xl font-bold">
              {editingId ? 'Edit Book' : 'Add New Book'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['title', 'author', 'isbn', 'price', 'stock', 'cover'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium capitalize mb-1">{field}</label>
                  <input
                    type={field === 'stock' ? 'number' : 'text'}
                    min={field==='stock'?0:undefined}
                    value={formData[field]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option>Fiction</option>
                  <option>Non-Fiction</option>
                  <option>Children's</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gray-800 text-white rounded-md"
              >
                {editingId ? 'Save Changes' : 'Add Book'}
              </button>
            </div>
          </form>
        </div>
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
