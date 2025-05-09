"use client";

import React from "react";
import { toast } from "sonner";

const AddBook = ({ setShowForm, formData, setFormData, handleSubmit, editingId }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, imageFile: e.target.files[0] });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full space-y-4"
      >
        <h2 className="text-xl font-bold">{editingId ? "Edit Book" : "Add New Book"}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
          {/* Left Wing */}
          <div className="space-y-4">
            {/* ISBN */}
            <div>
              <label className="block text-sm font-medium mb-1">ISBN</label>
              <input
                type="text"
                name="ISBN"
                value={formData.ISBN}
                onChange={handleChange}
                placeholder="ISBN"
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                name="BookTitle"
                value={formData.BookTitle}
                onChange={handleChange}
                placeholder="Book Title"
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <input
                type="text"
                name="BookDescription"
                value={formData.BookDescription}
                onChange={handleChange}
                placeholder="Description"
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Publication Date */}
            <div>
              <label className="block text-sm font-medium mb-1">Publication Date</label>
              <input
                type="date"
                name="PublicationDate"
                value={formData.PublicationDate}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium mb-1">Language</label>
              <input
                type="text"
                name="BookLanguage"
                value={formData.BookLanguage}
                onChange={handleChange}
                placeholder="Language"
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          {/* Right Wing */}
          <div className="space-y-4">
            {/* Author Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Author Name</label>
              <input
                type="text"
                name="AuthorName"
                value={formData.AuthorName}
                onChange={handleChange}
                placeholder="Author Name"
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Publisher Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Publisher Name</label>
              <input
                type="text"
                name="PublisherName"
                value={formData.PublisherName}
                onChange={handleChange}
                placeholder="Publisher Name"
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                name="BookPrice"
                min={0}
                value={formData.BookPrice}
                onChange={handleChange}
                placeholder="Price"
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Stock Count */}
            <div>
              <label className="block text-sm font-medium mb-1">Stock Count</label>
              <input
                type="number"
                name="InitialStockCount"
                min={0}
                value={formData.InitialStockCount}
                onChange={handleChange}
                placeholder="Stock Count"
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Genre */}
            <div>
              <label className="block text-sm font-medium mb-1">Genre</label>
              <select
                name="GenreName"
                value={formData.GenreName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="Fiction">Fiction</option>
                <option value="Mystery">Mystery</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Children's">Children's</option>
                <option value="Non-Fiction">Non-Fiction</option>
              </select>
            </div>

            {/* Format */}
            <div>
              <label className="block text-sm font-medium mb-1">Format</label>
              <select
                name="FormatName"
                value={formData.FormatName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="Paperback">Paperback</option>
                <option value="Hardcover">Hardcover</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Signed">Signed</option>
                <option value="Ebook">Ebook</option>
              </select>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium mb-1">Book Cover</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="LibraryAvailable"
                  checked={formData.LibraryAvailable}
                  onChange={handleChange}
                />
                Library Available
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="IsExclusive"
                  checked={formData.IsExclusive}
                  onChange={handleChange}
                />
                Exclusive
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="IsAwardWinner"
                  checked={formData.IsAwardWinner}
                  onChange={handleChange}
                />
                Award Winner
              </label>
            </div>

            {/* Preview Image */}
            {formData.imageFile && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(formData.imageFile)}
                  alt="Preview"
                  className="w-32 h-40 object-cover rounded"
                />
              </div>
            )}
          </div>
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {editingId ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;