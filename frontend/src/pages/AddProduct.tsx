import { useState, useEffect } from 'react'
import api from '../api/axios'
import { fetchCategories } from '../services/dummyjson'
import toast from 'react-hot-toast'
import type { Category } from '../types/product'

export default function AddProduct() {
  const [form, setForm] = useState({ name: '', description: '', price: '', image: '', category: '' })
  const [submitting, setSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetchCategories().then(setCategories)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, value]) => formData.append(key, value))
      await api.post('/form/', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Product added successfully')
      setForm({ name: '', description: '', price: '', image: '', category: '' })
    } catch {
      toast.error('Failed to add product')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required
            className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2 border">
            <option value="">-- Select --</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={submitting}
          className="w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </section>
  )
}
