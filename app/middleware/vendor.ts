import { useAuthStore } from '~/stores/auth'

/** Vendor / factory dashboard (Alibaba-style integrations). */
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

  if (auth.user?.role !== 'vendor') {
    return navigateTo('/dashboard')
  }
})
