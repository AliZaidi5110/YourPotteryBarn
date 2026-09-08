import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { sendPaymentReceipt } from '@/lib/notifications/email'
import { formatCurrency, formatDate } from '@/lib/utils'
import { BookingStatus, PaymentStatus } from '@prisma/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', { apiVersion: '2026-08-26.dahlia' as any })

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.error('Stripe webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const intent = event.data.object as Stripe.PaymentIntent
      const bookingId = intent.metadata.bookingId
      const bookingRef = intent.metadata.bookingRef

      if (!bookingId) break

      // Update payment record
      await prisma.payment.updateMany({
        where: { providerTxnId: intent.id },
        data: {
          status: PaymentStatus.SUCCEEDED,
          metadata: intent as any,
        },
      })

      // Update booking status
      const booking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          amountPaid: { increment: intent.amount / 100 },
          status: BookingStatus.CONFIRMED,
        },
        include: { customer: true, service: true, slot: true },
      })

      // Send receipt
      sendPaymentReceipt({
        customerName: booking.customer.name,
        customerEmail: booking.customer.email,
        bookingRef: booking.bookingRef,
        serviceName: booking.service.name,
        date: formatDate(new Date(booking.slot.date)),
        amountCharged: formatCurrency(intent.amount / 100),
        paymentMethod: 'Card (Online)',
        transactionId: intent.id,
      }).catch(console.error)

      break
    }

    case 'payment_intent.payment_failed': {
      const intent = event.data.object as Stripe.PaymentIntent
      if (!intent.metadata.bookingId) break

      await prisma.payment.updateMany({
        where: { providerTxnId: intent.id },
        data: { status: PaymentStatus.FAILED },
      })
      break
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge
      if (charge.payment_intent) {
        await prisma.payment.updateMany({
          where: { providerTxnId: charge.payment_intent as string },
          data: { status: PaymentStatus.REFUNDED },
        })
      }
      break
    }

    default:
      console.log(`Unhandled Stripe event: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
