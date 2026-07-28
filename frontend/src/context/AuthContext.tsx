import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import api from '../api/axios'

interface User {
  id: number
  username: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string, remember?: boolean) => Promise<void>
  googleLogin: (credential: string) => Promise<void>
  logout: () => Promise<void>
  handleCallback: (access: string, refresh: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = useCallback(async () => {
    try {
      const res = await api.get('/api/auth/user/')
      setUser(res.data)
      return res.data
    } catch {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      setUser(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const access = localStorage.getItem('access_token')
    if (!access) {
      setLoading(false)
      setUser(null)
      return
    }
    checkAuth()
  }, [checkAuth])

  const login = async (username: string, password: string, remember?: boolean) => {
    const res = await api.post('/login/', { username, password, remember })
    if (res.data.access) {
      localStorage.setItem('access_token', res.data.access)
      localStorage.setItem('refresh_token', res.data.refresh)
    }
    setUser(res.data.user)
  }

  const googleLogin = async (credential: string) => {
    const res = await api.post('/api/auth/google/', { credential })
    if (res.data.access) {
      localStorage.setItem('access_token', res.data.access)
      localStorage.setItem('refresh_token', res.data.refresh)
    }
    setUser(res.data.user)
  }

  const handleCallback = async (access: string, refresh: string) => {
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
    setLoading(true)
    await checkAuth()
  }

  const logout = async () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    try {
      await api.get('/logout/')
    } catch {
      // best-effort
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, googleLogin, logout, handleCallback }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}