import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import type { ApiError } from '@finflow/types'

// Referencia al token — se actualiza desde el store
// Patrón: el store llama a setApiToken() al hacer login/refresh
let _accessToken: string | null = null

export function setApiToken(token: string | null) {
  _accessToken = token
}

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
  withCredentials: true,    // ← envía httpOnly cookie en /auth/refresh y /auth/logout
})

// ── Interceptor de REQUEST ────────────────────────────────────────────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (_accessToken) {
    config.headers.Authorization = `Bearer ${_accessToken}`
  }
  return config
})

// ── Interceptor de RESPONSE ───────────────────────────────────────────────
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
