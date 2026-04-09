export type VatFieldStatus = 'idle' | 'checking' | 'valid' | 'invalid'

export interface VatCheckResponse {
  valid: boolean
  mock?: boolean
  message?: string
  reason?: string
}

/** Matches backend `checkEuVat` test VAT — no network call (avoids VIES timeouts / fetch errors). */
const TEST_VAT_NORMALIZED = 'DE123456789'

function normalizeVat(raw: string): string {
  return raw.replace(/\s+/g, '').toUpperCase()
}

/**
 * Debounced VAT checks against our Nitro `/api/vat/check` route (live VIES + mock fallback).
 * Keeps buyer registration from submitting before we have a positive validation signal.
 */
export function useVatAsyncValidation(debounceMs = 450) {
  const status = ref<VatFieldStatus>('idle')
  const lastMessage = ref<string>('')
  const isMock = ref(false)

  let timer: ReturnType<typeof setTimeout> | null = null

  function clearTimer() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  /**
   * Call whenever the VAT string changes (we debounce network traffic).
   */
  function scheduleValidate(rawVat: string) {
    clearTimer()
    lastMessage.value = ''
    isMock.value = false

    const normalized = normalizeVat(rawVat)
    if (!normalized) {
      status.value = 'idle'
      return
    }

    if (normalized === TEST_VAT_NORMALIZED) {
      status.value = 'valid'
      isMock.value = false
      lastMessage.value = ''
      return
    }

    status.value = 'checking'
    timer = setTimeout(async () => {
      try {
        const res = await $fetch<VatCheckResponse>('/api/vat/check', {
          method: 'POST',
          body: { vat: normalized },
        })
        isMock.value = Boolean(res.mock)
        lastMessage.value = res.message || ''
        status.value = res.valid ? 'valid' : 'invalid'
      } catch {
        status.value = 'invalid'
        lastMessage.value = 'Unable to validate VAT right now.'
      }
    }, debounceMs)
  }

  onScopeDispose(() => {
    clearTimer()
  })

  /** Clears feedback when the user switches account type or empties the field externally. */
  function reset() {
    clearTimer()
    status.value = 'idle'
    lastMessage.value = ''
    isMock.value = false
  }

  return {
    status,
    lastMessage,
    isMock,
    scheduleValidate,
    reset,
  }
}
