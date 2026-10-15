// src/app/products/page.jsx
'use client';

import { useState, useEffect } from 'react';
import {
  fetchProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
} from '@/lib/api';
import Link from 'next/link';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const limit = 5; // Har page par 5 products

  // 1. Fetch Products on load & page change
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProductsApi(page, limit);
      setProducts(data || []);
    } catch (err) {
      setError(err.response?.data || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page]);

  // 2. Create or Update Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setMessage(null);
    setError(null);

    try {
      if (editingId) {
        // UPDATE (PUT)
        await updateProductApi(editingId, { name, price });
        setMessage(`Product #${editingId} updated successfully!`);
      } else {
        // CREATE (POST)
        await createProductApi({ name, price });
        setMessage('New product created successfully!');
      }

      // Reset Form & Reload
      setName('');
      setPrice('');
      setEditingId(null);
      loadProducts();
    } catch (err) {
      setError(err.response?.data || 'Action failed!');
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Edit Button Handler
  const handleEdit = (product) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 4. Cancel Edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setPrice('');
  };

  // 5. Delete Handler
  const handleDelete = async (id) => {
    if (!confirm(`Are you sure you want to delete Product #${id}?`)) return;

    setActionLoading(true);
    setMessage(null);
    setError(null);

    try {
      await deleteProductApi(id);
      setMessage(`Product #${id} deleted successfully!`);
      loadProducts();
    } catch (err) {
      setError(err.response?.data || 'Delete failed!');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6">
      {/* Top Navigation */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-800">📦 Products Store</h1>
          <p className="text-sm text-gray-500">Auto-generated CRUD with DonModel Macro</p>
        </div>
        <Link
          href="/"
          className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Notifications */}
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2.5 rounded-lg mb-4 text-sm font-medium">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2.5 rounded-lg mb-4 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Create / Edit Form Card */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          {editingId ? `✏️ Edit Product #${editingId}` : '➕ Add New Product'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Product Name
            </label>
            <input
              type="text"
              placeholder="e.g. MacBook Pro M3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="w-full sm:w-40">
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Price ($)
            </label>
            <input
              type="number"
              placeholder="e.g. 1999"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="submit"
              disabled={actionLoading}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-white font-bold transition ${
                editingId
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {actionLoading ? 'Saving...' : editingId ? 'Update' : 'Add Product'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Products Table Card */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-base font-bold text-gray-700">Products Inventory</h2>
          <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">
            Page {page} (Max {limit}/page)
          </span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500 font-medium">
            Fetching products from Rust backend...
          </div>
        ) : products.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            No products found. Add your first product above!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b">
                  <th className="p-4">ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Price</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {products.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-mono text-gray-500">#{item.id}</td>
                    <td className="p-4 font-bold text-gray-800">{item.name}</td>
                    <td className="p-4 font-mono font-semibold text-emerald-600">
                      ${item.price}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-700 hover:bg-amber-200 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700 hover:bg-red-200 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="p-4 border-t flex justify-between items-center bg-gray-50">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1 || loading}
            className="px-4 py-2 rounded-lg text-sm font-semibold border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            ← Previous
          </button>

          <span className="text-sm font-medium text-gray-600">
            Current Page: <strong className="text-indigo-600">{page}</strong>
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={products.length < limit || loading}
            className="px-4 py-2 rounded-lg text-sm font-semibold border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}