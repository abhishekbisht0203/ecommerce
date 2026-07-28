import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

export default function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('Processing...')

  useEffect(() => {
    const access = searchParams.get('access')
    const refresh = searchParams.get('refresh')
    const error = searchParams.get('error')

    if (error) {
      setStatus('Authentication failed. Redirecting...')
      setTimeout(() => navigate('/login?error=' + error), 1500)
      return
    }

    if (access && refresh) {
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
      setStatus('Login successful! Redirecting...')
      setTimeout(() => navigate('/'), 1000)
    } else {
      setStatus('Invalid response. Redirecting...')
      setTimeout(() => navigate('/login'), 1500)
    }
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-[#EF4444] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">{status}</p>
      </div>
    </div>
  )
}