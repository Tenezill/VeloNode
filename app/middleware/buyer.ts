import { useAuthStore } from '~/stores/auth'

/** Buyer-only areas (European procurement / RFQ flows). */
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

  if (auth.user?.role !== 'buyer') {
    return navigateTo('/vendor')
  }
})
