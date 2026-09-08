/**
 * PaymentProvider interface
 * Both Stripe (online) and Shift4 (terminal) implement this interface,
 * writing to the same `payments` table with channel: 'ONLINE' | 'TERMINAL'
 */

export interface ChargeParams {
  bookingId: string
  amount: number        // in pence/cents
  currency?: string
  description?: string
  metadata?: Record<string, string>
}

export interface ChargeResult {
  success: boolean
  providerTxnId?: string
  status: 'succeeded' | 'pending' | 'failed'
  error?: string
  rawResponse?: unknown
}

export interface RefundParams {
  providerTxnId: string
  amount?: number       // partial refund amount in pence, omit for full refund
  reason?: string
}

export interface RefundResult {
  success: boolean
  refundId?: string
  error?: string
}

export interface PaymentProviderInterface {
  charge(params: ChargeParams): Promise<ChargeResult>
  refund(params: RefundParams): Promise<RefundResult>
}
