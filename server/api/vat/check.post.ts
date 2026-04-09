import { checkVatViaVies } from '../../utils/viesSoap'

/**
 * POST /api/vat/check
 * Body: { vat: "DE123456789" } — EU VAT including country prefix (recommended)
 *
 * Tries live VIES SOAP first. On failure (timeout, parse error, outage), returns a MOCK response
 * so development is not blocked — see `mock` flag in the JSON body.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<{ vat?: string }>(event)
  const raw = String(body?.vat ?? '')
    .replace(/\s+/g, '')
    .toUpperCase()

  const match = /^([A-Z]{2})([A-Z0-9.+*]{2,30})$/.exec(raw)
  if (!match) {
    return {
      valid: false,
      mock: false,
      reason: 'invalid_format',
      message: 'Use an EU VAT number starting with a 2-letter country code.',
    }
  }

  const countryCode = match[1]!
  const vatNumber = match[2]!

  /** Same as Express `checkEuVat` — stable demo / test number without calling VIES. */
  if (raw === 'DE123456789') {
    return {
      valid: true,
      mock: false,
      name: 'Test Company',
      countryCode,
      vatNumber,
    }
  }

  try {
    const live = await checkVatViaVies(countryCode, vatNumber)
    return {
      valid: live.valid,
      mock: false,
      name: live.name,
      countryCode: live.countryCode,
      vatNumber: live.vatNumber,
    }
  } catch {
    /**
     * Offline / throttled / XML changes — UI still needs to progress for demos.
     * Frontend MUST treat `mock: true` as non-production assurance.
     */
    const plausible = vatNumber.length >= 6
    return {
      valid: plausible,
      mock: true,
      reason: 'vies_unreachable',
      message:
        'Could not query VIES right now — using mock validation. Hook this route to your Node API in production.',
      countryCode,
      vatNumber,
    }
  }
})
