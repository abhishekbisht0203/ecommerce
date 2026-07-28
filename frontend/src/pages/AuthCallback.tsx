import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { handleCallback } = useAuth()

  useEffect(() => {
    const access = searchParams.get('access')
    const refresh = searchParams.get('refresh')
    const error = searchParams.get('error')

    if (error || !access || !refresh) {
      navigate('/login', { replace: true })
      return
    }

    handleCallback(access, refresh)
      .then(() => navigate('/', { replace: true }))
      .catch(() => navigate('/login', { replace: true }))
  }, [searchParams, navigate, handleCallback])

  return <div>Signing you in...</div>
}