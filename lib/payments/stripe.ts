import Stripe from 'stripe'
import type { ChargeParams, ChargeResult, RefundParams, RefundResult, PaymentProviderInterface } from './types'

if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV === 'production') {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_test_placeholder', {
  apiVersion: '2026-08-26.dahlia' as any,
  typescript: true,
})

/**
 * Creates a Stripe PaymentIntent for online bookings.
 * Used during the customer checkout flow.
 */
export async function createPaymentIntent(params: {
  amount: number         // amount in pence (GBP)
  bookingId: string
  bookingRef: string
  customerEmail?: string
  description?: string
}): Promise<{ clientSecret: string; paymentIntentId: string }> {
  const intent = await stripe.paymentIntents.create({
    amount: params.amount,
    currency: 'gbp',
    description: params.description ?? `Booking ${params.bookingRef}`,
    metadata: {
      bookingId: params.bookingId,
      bookingRef: params.bookingRef,
    },
    receipt_email: params.customerEmail,
    automatic_payment_methods: { enabled: true },
  })

  return {
    clientSecret: intent.client_secret!,
    paymentIntentId: intent.id,
  }
}

/**
 * StripeProvider — implements PaymentProviderInterface
 */
export class StripeProvider implements PaymentProviderInterface {
  async charge(params: ChargeParams): Promise<ChargeResult> {
    try {
      const intent = await stripe.paymentIntents.create({
        amount: params.amount,
        currency: params.currency ?? 'gbp',
        description: params.description,
        metadata: { bookingId: params.bookingId, ...params.metadata },
        automatic_payment_methods: { enabled: true },
        confirm: false, // Client confirms via Elements
      })
      return {
        success: true,
        providerTxnId: intent.id,
        status: 'pending',
        rawResponse: intent,
      }
    } catch (err: any) {
      return { success: false, status: 'failed', error: err.message }
    }
  }

  async refund(params: RefundParams): Promise<RefundResult> {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: params.providerTxnId,
        amount: params.amount,
        reason: 'requested_by_customer',
      })
      return { success: true, refundId: refund.id }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }
}

export const stripeProvider = new StripeProvider()
