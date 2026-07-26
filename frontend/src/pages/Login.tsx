import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiUser, FiEye, FiEyeOff } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      await login(username, password, remember)
      toast.success('Login successful')
      navigate('/')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex w-screen h-screen overflow-hidden" style={{ margin: 'calc(-1 * theme(padding.6)) calc(-1 * theme(padding.16))', width: 'calc(100vw)' }}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/images/boat_premium_background.jpg')` }}
      />
      <div className="z-10 absolute right-10 top-1/2 transform -translate-y-1/2 max-w-md w-full p-8">
        <div className="bg-white/15 backdrop-blur-xl rounded-xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-6">
            <img
              src="https://www.boat-lifestyle.com/cdn/shop/files/boAt_logo_black_24889e30-925c-4185-a028-9fef497a8e44.svg?v=1732879339"
              alt="boAt"
              className="w-20 mb-4 brightness-0 invert"
            />
            <h2 className="text-2xl font-semibold text-white mb-2">Welcome Back</h2>
            <p className="text-sm text-gray-200">Sign in to continue shopping</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username / Email"
                className="w-full px-4 py-3 pr-12 bg-white/25 border-none rounded-lg text-white focus:bg-white/35 outline-none placeholder-gray-300"
              />
              <FiUser className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
            </div>

            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 pr-12 bg-white/25 border-none rounded-lg text-white focus:bg-white/35 outline-none placeholder-gray-300"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                {showPwd ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-200">
              <label className="flex items-center">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="mr-2" />
                Keep me Signed in
              </label>
              <Link to="/password-reset" className="underline">Forgot Password?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#ff6b6b] to-[#f0e130] text-white py-3 rounded-lg font-medium shadow-md hover:scale-105 transform transition disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="text-center text-sm text-gray-200 mt-4">
              Don't have an account? <Link to="/register" className="underline">Create Account</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
