import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
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
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const res = await api.get('/api/auth/user/')
      setUser(res.data)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const login = async (username: string, password: string, remember?: boolean) => {
    const res = await api.post('/login/', { username, password, remember })
    if (res.data.token) {
      localStorage.setItem('auth_token', res.data.token)
    }
    await checkAuth()
  }

  const logout = async () => {
    localStorage.removeItem('auth_token')
    try {
      await api.get('/logout/')
    } catch {
      // best-effort: session logout may fail cross-origin
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
