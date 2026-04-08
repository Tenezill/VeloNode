import { useAuthStore } from '~/stores/auth'

/**
 * Restores JWT + user profile from localStorage before middleware/components run on the client.
 */
export default defineNuxtPlugin(() => {
  const auth = useAuthStore()
  auth.hydrateFromStorage()
})
