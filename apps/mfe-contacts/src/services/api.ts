import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import type { ApiError } from '@finflow/types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
  withCredentials: true,
})

// El MFE obtiene el token de localStorage (que la Shell guardará allí)
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // El MFE le avisa a la Shell que el token expiró o es inválido
      window.dispatchEvent(new CustomEvent('auth:expired'))
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
