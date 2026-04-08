/**
 * Calls the EU Commission VIES `checkVat` SOAP endpoint from the server (avoids browser CORS issues).
 *
 * Docs / contract: https://ec.europa.eu/taxation_customs/vies/
 * Note: the live service can be slow or temporarily unavailable; callers should handle failures and fall back.
 */

export interface ViesCheckResult {
  valid: boolean
  /** Registered name when VIES returns it */
  name?: string
  /** Member state as submitted */
  countryCode: string
  /** VAT digits without country prefix */
  vatNumber: string
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function checkVatViaVies(
  countryCode: string,
  vatNumber: string,
): Promise<ViesCheckResult> {
  const cc = countryCode.toUpperCase()
  const vn = vatNumber.replace(/\s+/g, '')

  const envelope = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:urn="urn:ec.europa.eu:taxud:vies:services:checkVat:types">
  <soapenv:Header/>
  <soapenv:Body>
    <urn:checkVat>
      <urn:countryCode>${escapeXml(cc)}</urn:countryCode>
      <urn:vatNumber>${escapeXml(vn)}</urn:vatNumber>
    </urn:checkVat>
  </soapenv:Body>
</soapenv:Envelope>`

  const res = await fetch(
    'https://ec.europa.eu/taxation_customs/vies/services/checkVatService',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        // Empty SOAPAction is accepted by this endpoint in common integrations
        SOAPAction: '',
      },
      body: envelope,
      // VIES can be sluggish — allow generous timeout for MVP
      signal: AbortSignal.timeout(12_000),
    },
  )

  const text = await res.text()
  const validMatch = /<valid>\s*(true|false)\s*<\/valid>/i.exec(text)
  if (!validMatch) {
    throw new Error('Unexpected VIES SOAP payload')
  }

  const nameMatch = /<name>\s*([^<]*?)\s*<\/name>/i.exec(text)

  return {
    valid: validMatch[1]!.toLowerCase() === 'true',
    name: nameMatch?.[1]?.trim() || undefined,
    countryCode: cc,
    vatNumber: vn,
  }
}
