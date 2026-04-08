import { useAuthStore } from '~/stores/auth'

/**
 * Requires any authenticated session (JWT present in Pinia / localStorage).
 * Runs on the client only because tokens are stored in localStorage for this MVP.
 */
export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const auth = useAuthStore()
  auth.hydrateFromStorage()

  if (!auth.isAuthenticated) {
    return navigateTo({
      path: '/auth/login',
      query: { redirect: to.fullPath },
    })
  }
})
