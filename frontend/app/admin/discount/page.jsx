"use client";
import { useState, useEffect, useContext } from "react";
import { PlusIcon, CalendarIcon, PercentIcon, EditIcon, TrashIcon } from "lucide-react";
import { BookContext } from "../../../utils/book";
import axios from "../../../utils/axios"; // Ensure API calls work

export default function DiscountsManagementPage() {
  // const { fetchallDiscount, discount, fetchBookToAddForDisc, bookForDis } = useContext(BookContext);
  const [discounts, setDiscounts] = useState([]);
  const [books, setBooks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteId, setShowDeleteId] = useState(null);
  const [formData, setFormData] = useState({ bookId: "", percentage: "", startDate: "", endDate: "", isOnSale: false });

  useEffect(() => {
    fetchDiscounts();
    fetchBooks();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get("/discount/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); 

      if (response.status !== 200) {
        throw new Error("Error fetching discounts");
      }
  
      setDiscounts(response.data);
    } catch (error) {
      console.error("Error fetching discounts:", error?.response?.data?.Message || 'Error fetching discounts');
    }
  };
  
  const fetchBooks = async () => {
    try {
      const response = await axios.get("/discount/books/no-discounts"); 
      setBooks(response.data);

    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const updatedFormData = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(), 
      endDate: new Date(formData.endDate).toISOString(), 
    };
  
    try {
      await axios.post("/discount/create", updatedFormData);
      setShowForm(false);
      fetchDiscounts(); 
    } catch (error) {
      console.error("Error creating discount:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/discount/${showDeleteId}`);
      setDiscounts(discounts.filter(d => d.discountId !== showDeleteId));
      setShowDeleteId(null);
    } catch (error) {
      console.error("Error deleting discount:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-300 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Discounts Management</h1>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md">
            <PlusIcon size={16} />
            <span>Create New Discount</span>
          </button>
        </div>

        {/* Discount List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {discounts.map((d) => (
            <div key={d.discountId} className="border border-gray-300 rounded-md bg-white">
              <div className="bg-green-100 p-2 text-sm font-bold text-green-800 flex justify-between">
                <span>{d.isOnSale ? "On Sale" : "Inactive"}</span>
                <div className="flex items-center gap-1">
                  <CalendarIcon size={14} />
                  <span>Ends on {new Date(d.endDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold">{d.bookName || "General Discount"}</h3>
                <div className="text-sm text-gray-600">Discount: {d.percentage}%</div>
                <div className="flex justify-end gap-2 mt-4">
                  <button className="px-3 py-1 border border-red-300 text-red-600 text-sm rounded-md" onClick={() => setShowDeleteId(d.discountId)}>
                    Deactivate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Discount Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full space-y-4">
            <h2 className="text-xl font-bold">{editingId ? "Edit Discount" : "Create New Discount"}</h2>

            <div>
              <label className="block font-medium">Select Book:</label>
              <select value={formData.bookId} onChange={(e) => setFormData({ ...formData, bookId: e.target.value })} className="w-full border p-2 rounded">
                <option value="">Select a book</option>
                {books.map((book) => (
                  <option key={book.bookId} value={book.bookId}>
                    {book.bookTitle}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium">Discount Percentage:</label>
              <input type="number" value={formData.percentage} onChange={(e) => setFormData({ ...formData, percentage: e.target.value })} className="w-full border p-2 rounded" />
            </div>

            <div>
              <label className="block font-medium">Start Date:</label>
              <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="w-full border p-2 rounded" />
            </div>

            <div>
              <label className="block font-medium">End Date:</label>
              <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="w-full border p-2 rounded" />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.isOnSale} onChange={(e) => setFormData({ ...formData, isOnSale: e.target.checked })} />
                Mark as "On Sale"
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded-md">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded-md">
                {editingId ? "Save" : "Create"}
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
            <p>Are you sure you want to deactivate this discount?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteId(null)} className="px-4 py-2 border border-gray-300 rounded-md">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md">
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}