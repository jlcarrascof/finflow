import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import type { ApiError, AuthTokens } from '@finflow/types'

let _accessToken: string | null = null

export function setApiToken(token: string | null) {
  _accessToken = token
}

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
  withCredentials: true,
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
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh')  // ← NUEVO
    ) {
      originalRequest._retry = true

      try {
        const { data } = await api.post<{ tokens: AuthTokens }>('/auth/refresh')

        setApiToken(data.tokens.accessToken)

        const { useAuthStore } = await import('@/stores/auth.store')
        const { getActivePinia } = await import('pinia')
        if (getActivePinia()) {
          useAuthStore().setAccessToken(data.tokens)
        }

        originalRequest.headers.Authorization = `Bearer ${data.tokens.accessToken}`
        return api(originalRequest)

      } catch {
        setApiToken(null)

        const { useAuthStore } = await import('@/stores/auth.store')
        const { getActivePinia } = await import('pinia')
        if (getActivePinia()) {
          useAuthStore().clearAuth()
        }

        window.location.href = '/login'
        return Promise.reject(error)
      }
    }

    const apiError: ApiError = {
      message: error.response?.data?.message ?? 'Error inesperado',
      statusCode: error.response?.status ?? 500,
      errors: error.response?.data?.errors,
    }
    return Promise.reject(apiError)
  }
)

export default api
