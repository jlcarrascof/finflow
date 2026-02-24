import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import type { ApiError } from '@finflow/types'

// Instancia central de Axios
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000,
})

// ── Interceptor de REQUEST ──────────────────────────────────────────────────
// Adjunta el token JWT a cada petición automáticamente
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Interceptor de RESPONSE ─────────────────────────────────────────────────
// Normaliza los errores a la forma ApiError para toda la app
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const apiError: ApiError = {
      message: error.response?.data?.message ?? 'Error inesperado',
      statusCode: error.response?.status ?? 500,
      errors: error.response?.data?.errors,
    }
    return Promise.reject(apiError)
  }
)

export default api
