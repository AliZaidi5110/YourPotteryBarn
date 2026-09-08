/**
 * Shift4 Universal Transaction Gateway (UTG) Integration
 * -------------------------------------------------------
 * The UTG is a locally-installed service at the studio that communicates
 * with the physical Shift4 card terminal (card-present transactions).
 *
 * This module sends `sale` requests to the UTG endpoint and receives
 * approved/declined responses.
 *
 * LOCAL DEVELOPMENT: Set SHIFT4_MOCK_MODE=true in .env.local to use
 * mocked responses without a real terminal or Shift4 credentials.
 *
 * PRODUCTION: Set the following env vars:
 *   SHIFT4_CLIENT_GUID   — issued by Shift4 merchant services
 *   SHIFT4_AUTH_TOKEN    — issued by Shift4 merchant services
 *   SHIFT4_UTG_ENDPOINT  — URL of the locally-installed UTG (e.g. http://localhost:9001/UTGProxy)
 */

import type { ChargeParams, ChargeResult, RefundParams, RefundResult, PaymentProviderInterface } from './types'

export interface Shift4SaleParams {
  amount: number        // in pence
  bookingRef: string    // used as invoice/order ID
  bookingId: string
}

export interface Shift4TransactionResult {
  approved: boolean
  transactionId?: string
  authCode?: string
  cardLast4?: string
  cardBrand?: string
  amount?: number
  errorMessage?: string
  rawResponse?: unknown
}

// ─── Mock Mode ───────────────────────────────────────────────────────────────

async function mockSaleResponse(params: Shift4SaleParams): Promise<Shift4TransactionResult> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 2000))

  // Simulate occasional declines for realism (1 in 10 chance)
  const declined = Math.random() < 0.1

  if (declined) {
    return {
      approved: false,
      errorMessage: 'Card declined — insufficient funds (MOCK)',
      rawResponse: { mock: true, status: 'declined' },
    }
  }

  return {
    approved: true,
    transactionId: `SHIFT4-MOCK-${Date.now()}`,
    authCode: `AUTH${Math.floor(Math.random() * 999999).toString().padStart(6, '0')}`,
    cardLast4: '4242',
    cardBrand: 'Visa',
    amount: params.amount,
    rawResponse: { mock: true, status: 'approved', invoiceId: params.bookingRef },
  }
}

// ─── Real UTG Request ─────────────────────────────────────────────────────────

async function realSaleRequest(params: Shift4SaleParams): Promise<Shift4TransactionResult> {
  const utg = process.env.SHIFT4_UTG_ENDPOINT ?? 'http://localhost:9001/UTGProxy'
  const clientGuid = process.env.SHIFT4_CLIENT_GUID
  const authToken = process.env.SHIFT4_AUTH_TOKEN

  if (!clientGuid || !authToken) {
    throw new Error('Shift4 credentials not configured. Set SHIFT4_CLIENT_GUID and SHIFT4_AUTH_TOKEN.')
  }

  // Shift4 UTG XML-based sale request
  // Reference: Shift4 UTG Developer Guide (request your copy from Shift4 support)
  const amountStr = (params.amount / 100).toFixed(2)

  const xmlBody = `<?xml version="1.0" encoding="utf-8"?>
<UTGRequest>
  <ClientGuid>${clientGuid}</ClientGuid>
  <AuthToken>${authToken}</AuthToken>
  <TransactionType>Sale</TransactionType>
  <Amount>${amountStr}</Amount>
  <InvoiceNumber>${params.bookingRef}</InvoiceNumber>
  <OrderId>${params.bookingId}</OrderId>
</UTGRequest>`

  const response = await fetch(utg, {
    method: 'POST',
    headers: { 'Content-Type': 'text/xml' },
    body: xmlBody,
    signal: AbortSignal.timeout(60000), // 60s timeout for terminal interaction
  })

  if (!response.ok) {
    throw new Error(`UTG responded with HTTP ${response.status}`)
  }

  const text = await response.text()

  // Parse basic approval from XML response
  // Full parsing would require Shift4's response schema (available from Shift4 docs)
  const approved = text.includes('<Approved>true</Approved>') || text.includes('<ResponseCode>00</ResponseCode>')
  const txnIdMatch = text.match(/<TransactionId>([^<]+)<\/TransactionId>/)
  const authCodeMatch = text.match(/<AuthCode>([^<]+)<\/AuthCode>/)
  const last4Match = text.match(/<Last4>([^<]+)<\/Last4>/)
  const errorMatch = text.match(/<ErrorMessage>([^<]+)<\/ErrorMessage>/)

  return {
    approved,
    transactionId: txnIdMatch?.[1],
    authCode: authCodeMatch?.[1],
    cardLast4: last4Match?.[1],
    amount: params.amount,
    errorMessage: !approved ? (errorMatch?.[1] ?? 'Transaction declined') : undefined,
    rawResponse: text,
  }
}

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * Initiates a card-present sale via the Shift4 UTG terminal.
 * In mock mode (SHIFT4_MOCK_MODE=true), returns a simulated response.
 */
export async function initiateTerminalSale(params: Shift4SaleParams): Promise<Shift4TransactionResult> {
  const isMock = process.env.SHIFT4_MOCK_MODE === 'true'
  if (isMock) {
    console.log('[Shift4] MOCK MODE — simulating terminal sale for', params.bookingRef)
    return mockSaleResponse(params)
  }
  return realSaleRequest(params)
}

/**
 * Shift4Provider — implements PaymentProviderInterface for unified payments table.
 */
export class Shift4Provider implements PaymentProviderInterface {
  async charge(params: ChargeParams): Promise<ChargeResult> {
    try {
      const result = await initiateTerminalSale({
        amount: params.amount,
        bookingRef: params.metadata?.bookingRef ?? params.bookingId,
        bookingId: params.bookingId,
      })

      if (result.approved) {
        return {
          success: true,
          providerTxnId: result.transactionId,
          status: 'succeeded',
          rawResponse: result,
        }
      } else {
        return {
          success: false,
          status: 'failed',
          error: result.errorMessage ?? 'Terminal declined',
          rawResponse: result,
        }
      }
    } catch (err: any) {
      return { success: false, status: 'failed', error: err.message }
    }
  }

  async refund(params: RefundParams): Promise<RefundResult> {
    // Shift4 refunds require a separate UTG void/refund request
    // Implementation placeholder — requires Shift4 credentials
    const isMock = process.env.SHIFT4_MOCK_MODE === 'true'
    if (isMock) {
      return { success: true, refundId: `SHIFT4-REFUND-MOCK-${Date.now()}` }
    }
    return { success: false, error: 'Shift4 refund not yet implemented — contact Shift4 support for void/refund API details.' }
  }
}

export const shift4Provider = new Shift4Provider()
