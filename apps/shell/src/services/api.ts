import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import type { ApiError, AuthTokens } from '@finflow/types'

let _accessToken: string | null = null

export function setApiToken(token: string | null) {
  _accessToken = token
}

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
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

    // ── 401 → intentar refresh automático (solo una vez) ──────────────────
    if (
      error.response?.status === 401 &&
      !originalRequest._retry              // evita bucle infinito
    ) {
      originalRequest._retry = true

      try {
        // Llamar /auth/refresh — el refresh token viaja automáticamente
        // en la httpOnly cookie gracias a withCredentials: true
        const { data } = await api.post<{ tokens: AuthTokens }>('/auth/refresh')

        // Actualizar el token en memoria
        setApiToken(data.tokens.accessToken)

        // Actualizar también el store de Pinia
        const { useAuthStore } = await import('@/stores/auth.store')
        const { getActivePinia } = await import('pinia')
        if (getActivePinia()) {
          useAuthStore().setAccessToken(data.tokens)
        }

        // Reintentar la petición original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${data.tokens.accessToken}`
        return api(originalRequest)

      } catch {
        // Refresh también falló → sesión expirada → forzar logout
        setApiToken(null)

        const { useAuthStore } = await import('@/stores/auth.store')
        const { getActivePinia } = await import('pinia')
        if (getActivePinia()) {
          useAuthStore().clearAuth()
        }

        // Redirigir al login
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }

    // ── Otros errores → normalizar a ApiError ─────────────────────────────
    const apiError: ApiError = {
      message: error.response?.data?.message ?? 'Error inesperado',
      statusCode: error.response?.status ?? 500,
      errors: error.response?.data?.errors,
    }
    return Promise.reject(apiError)
  }
)

export default api
