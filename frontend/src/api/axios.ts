import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: { 'Content-Type': 'application/json' },
})

const AUTH_SKIP_PATHS = ['/api/auth/google/']

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const skip = AUTH_SKIP_PATHS.some(path => config.url?.startsWith(path))
  if (skip) return config

  const token = localStorage.getItem('access_token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: unknown) => void
  reject: (reason: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then(token => {
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`
        }
        return api(originalRequest)
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      isRefreshing = false
      return Promise.reject(error)
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || ''}/api/token/refresh/`,
        { refresh: refreshToken }
      )
      const newAccess = res.data.access
      localStorage.setItem('access_token', newAccess)
      processQueue(null, newAccess)

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccess}`
      }
      return api(originalRequest)
    } catch {
      processQueue(error, null)
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      return Promise.reject(error)
    } finally {
      isRefreshing = false
    }
  }
)

export default api