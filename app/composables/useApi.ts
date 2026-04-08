import type { FetchOptions } from 'ofetch'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '~/stores/auth'

export interface ApiErrorBody {
  message?: string
  error?: string
}

/**
 * Typed wrapper around `$fetch` for the custom Node.js REST API.
 * - Injects `Authorization: Bearer <jwt>` when the Pinia auth store has a token.
 * - Prefixes requests with `runtimeConfig.public.apiBase`.
 * - Surfaces server error messages via PrimeVue Toast when possible.
 */
export function useApi() {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  /**
   * Small helper so call sites can read a friendly error string.
   */
  function getErrorDetail(data: unknown, fallback: string): string {
    if (data && typeof data === 'object') {
      const b = data as ApiErrorBody
      if (typeof b.message === 'string') return b.message
      if (typeof b.error === 'string') return b.error
    }
    return fallback
  }

  type ApiFetchOptions = FetchOptions<'json'> & { quiet?: boolean }

  async function api<T>(path: string, options?: ApiFetchOptions): Promise<T> {
    const { quiet, ...fetchOpts } = options ?? {}
    try {
      return await $fetch<T>(path, {
        ...fetchOpts,
        baseURL: config.public.apiBase,
        headers: {
          ...(fetchOpts?.headers as Record<string, string> | undefined),
          Accept: 'application/json',
          ...(authStore.token
            ? { Authorization: `Bearer ${authStore.token}` }
            : {}),
        },
      })
    } catch (err: unknown) {
      if (import.meta.client && !quiet) {
        try {
          const toast = useToast()
          // `$fetch` errors often carry `data` on the thrown object
          const anyErr = err as {
            data?: unknown
            statusMessage?: string
            message?: string
          }
          const detail = getErrorDetail(
            anyErr.data,
            anyErr.statusMessage ||
              anyErr.message ||
              'Request failed. Please try again.',
          )
          toast.add({
            severity: 'error',
            summary: 'Could not reach the server',
            detail,
            life: 6500,
          })
        } catch {
          /* Toast only works after PrimeVue ToastService plugin is registered */
        }
      }
      throw err
    }
  }

  return {
    api,
    apiBase: computed(() => config.public.apiBase as string),
  }
}
