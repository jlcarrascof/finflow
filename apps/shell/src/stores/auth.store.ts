import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthUser, AuthTokens } from '@finflow/types'
import { setApiToken } from '@/services/api'   // ← agregar este import


export const useAuthStore = defineStore('auth', () => {
  // ── Estado ────────────────────────────────────────────────────────────────
  // access token en MEMORIA — nunca en localStorage (seguridad XSS)
  const accessToken = ref<string | null>(null)
  const user = ref<AuthUser | null>(null)

  // ── Getters ───────────────────────────────────────────────────────────────
  const isAuthenticated = computed(() => !!accessToken.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  // ── Actions ───────────────────────────────────────────────────────────────
  function setAuth(tokens: AuthTokens, authUser: AuthUser) {
    accessToken.value = tokens.accessToken
    user.value = authUser
    setApiToken(tokens.accessToken)
  }

  function setAccessToken(tokens: AuthTokens) {
    accessToken.value = tokens.accessToken
    setApiToken(tokens.accessToken)
  }

  function clearAuth() {
    accessToken.value = null
    user.value = null
    setApiToken(null)
  }

  function getAccessToken(): string | null {
    return accessToken.value
  }

  return {
    // estado
    user,
    // getters
    isAuthenticated,
    isAdmin,
    // actions
    setAuth,
    setAccessToken,
    clearAuth,
    getAccessToken,
  }
})
