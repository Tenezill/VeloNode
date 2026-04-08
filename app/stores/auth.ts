import { defineStore } from 'pinia'

/** Buyer-facing company (EU) or vendor factory account */
export type UserRole = 'buyer' | 'vendor'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  /** Present for buyer accounts after registration */
  companyName?: string
  vatNumber?: string
}

const STORAGE_TOKEN = 'vn_token'
const STORAGE_USER = 'vn_user'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<AuthUser | null>(null)

  const isAuthenticated = computed(() => Boolean(token.value))

  /**
   * Persist session to localStorage (client only).
   * Production backends often move the token to an httpOnly cookie — swap here when the API is ready.
   */
  function persistSession(newToken: string, newUser: AuthUser) {
    token.value = newToken
    user.value = newUser
    if (!import.meta.client) return
    localStorage.setItem(STORAGE_TOKEN, newToken)
    localStorage.setItem(STORAGE_USER, JSON.stringify(newUser))
  }

  /**
   * Load session from localStorage after hard refresh / new tab.
   */
  function hydrateFromStorage() {
    if (!import.meta.client) return
    const t = localStorage.getItem(STORAGE_TOKEN)
    const u = localStorage.getItem(STORAGE_USER)
    if (!t || !u) return
    try {
      token.value = t
      user.value = JSON.parse(u) as AuthUser
    } catch {
      clearSession()
    }
  }

  function clearSession() {
    token.value = null
    user.value = null
    if (!import.meta.client) return
    localStorage.removeItem(STORAGE_TOKEN)
    localStorage.removeItem(STORAGE_USER)
  }

  return {
    token,
    user,
    isAuthenticated,
    persistSession,
    hydrateFromStorage,
    clearSession,
  }
})
