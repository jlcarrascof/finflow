import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import api from '@/services/api'
import type { LoginDto, AuthTokens, AuthUser } from '@finflow/types'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  async function login(dto: LoginDto): Promise<void> {
    const response = await api.post<{ tokens: AuthTokens; user: AuthUser }>(
      '/auth/login',
      dto
    )
    authStore.setAuth(response.data.tokens, response.data.user)
    await router.push({ name: 'home' })
  }

  async function logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } finally {
      // Limpiar estado aunque falle el endpoint
      authStore.clearAuth()
      await router.push({ name: 'login' })
    }
  }

  async function refreshToken(): Promise<void> {
    const response = await api.post<{ tokens: AuthTokens }>('/auth/refresh')
    authStore.setAccessToken(response.data.tokens)
  }

  return { login, logout, refreshToken }
}
