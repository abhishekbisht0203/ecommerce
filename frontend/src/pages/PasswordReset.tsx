import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function PasswordReset() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('email', email)
      await api.post('/password-reset/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setSent(true)
      toast.success('Reset link sent if the email exists')
    } catch {
      toast.success('If an account exists, a reset link has been sent')
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 border rounded shadow text-center bg-white">
        <h2 className="text-2xl font-bold mb-4">Email Sent</h2>
        <p className="text-gray-600">If an account exists with the email you provided, a password reset link has been sent.</p>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] bg-gradient-to-tr from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-xl p-8 md:p-10 w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Reset your password</h1>
          <p className="text-sm text-gray-500 mb-6">We'll send a reset link to your registered email.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:outline-none" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition">
            Send Reset Link
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          <Link to="/login" className="text-blue-600 hover:underline">Back to login</Link>
        </div>
      </div>
    </div>
  )
}
