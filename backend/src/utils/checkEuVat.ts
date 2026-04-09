const VIES_CHECK_URL =
  'https://ec.europa.eu/taxation_customs/vies/rest-api/check-vat-number'

/** Hard-coded test VAT: no external call (local / CI friendly). */
const TEST_VAT_NORMALIZED = 'DE123456789'

export type VatCheckResult =
  | { isValid: true; companyName?: string }
  | { isValid: false; companyName?: string; error?: string }

type ViesJson = {
  actionSucceed?: boolean
  valid?: boolean
  name?: string
  errorWrappers?: Array<{ error?: string; message?: string }>
}

/** Normalized VAT string (no spaces, upper case) for comparisons and API responses. */
export function normalizeEuVat(raw: string): string {
  return raw.replace(/\s+/g, '').toUpperCase()
}

function parseCountryAndNumber(normalized: string): { countryCode: string; vatNumber: string } | null {
  const match = /^([A-Z]{2})([A-Z0-9.+*]{2,30})$/.exec(normalized)
  if (!match) return null
  return { countryCode: match[1]!, vatNumber: match[2]! }
}

function traderNameFromVies(name: string | undefined): string | undefined {
  if (!name || name === '---') return undefined
  const t = name.trim()
  return t.length > 0 ? t : undefined
}

/**
 * Validates an EU VAT ID: first two letters = `countryCode`, remainder = `vatNumber` sent to VIES REST.
 * @see https://ec.europa.eu/taxation_customs/vies/rest-api/check-vat-number
 */
export async function checkEuVat(rawVat: string): Promise<VatCheckResult> {
  const normalized = normalizeEuVat(rawVat)

  if (normalized === TEST_VAT_NORMALIZED) {
    return { isValid: true, companyName: 'Test Company' }
  }

  const parts = parseCountryAndNumber(normalized)
  if (!parts) {
    return {
      isValid: false,
      error: 'Use an EU VAT number: 2-letter country code followed by the national number.',
    }
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20_000)

  try {
    const res = await fetch(VIES_CHECK_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        countryCode: parts.countryCode,
        vatNumber: parts.vatNumber,
      }),
      signal: controller.signal,
    })

    const text = await res.text()
    let data: ViesJson
    try {
      data = JSON.parse(text) as ViesJson
    } catch {
      return {
        isValid: false,
        error: 'Invalid response from VAT validation service.',
      }
    }

    if (data.actionSucceed === false && Array.isArray(data.errorWrappers)) {
      const first = data.errorWrappers[0]
      const code = first?.error ?? 'VIES_ERROR'
      const msg = first?.message ?? code
      return { isValid: false, error: msg }
    }

    if (data.valid === true) {
      return {
        isValid: true,
        companyName: traderNameFromVies(data.name),
      }
    }

    if (data.valid === false) {
      return { isValid: false, error: 'VAT number is not valid according to VIES.' }
    }

    return { isValid: false, error: 'Unexpected response from VAT validation service.' }
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return { isValid: false, error: 'VAT validation service timed out. Try again.' }
    }
    return {
      isValid: false,
      error: 'Could not reach VAT validation service. Try again later.',
    }
  } finally {
    clearTimeout(timeout)
  }
}
