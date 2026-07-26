import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', rpassword: '' })
  const [agree, setAgree] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agree) {
      toast.error('You must agree to the terms and conditions')
      return
    }
    if (form.password !== form.rpassword) {
      toast.error('Passwords do not match')
      return
    }
    try {
      const res = await api.post('/register/', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (res.data.success) {
        toast.success('Registered successfully')
        navigate(res.data.redirect || '/login')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 px-4" style={{ minHeight: 'calc(100vh - 6rem)' }}>
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
        <header className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-purple-700">Create Your Account</h2>
          <p className="text-sm text-gray-500 mt-2">Join us and start your journey</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Username</label>
            <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Email Address</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Repeat Password</label>
            <input type="password" value={form.rpassword} onChange={(e) => setForm({ ...form, rpassword: e.target.value })} required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none" />
          </div>

          <div className="flex items-start gap-2">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 accent-purple-600" />
            <label className="text-sm text-gray-600">I agree to the terms and conditions</label>
          </div>

          <button type="submit" className="w-full bg-purple-600 text-white font-semibold py-2 rounded-xl hover:bg-purple-700 transition">
            Sign Up
          </button>

          <div className="text-center text-sm text-gray-400 mt-2">or</div>

          <Link to="/login" className="w-full block text-center bg-gray-100 border border-gray-300 text-gray-800 font-medium py-2 rounded-xl hover:bg-gray-200 transition mt-2">
            Already have an account? Login
          </Link>
        </form>
      </div>
    </div>
  )
}
