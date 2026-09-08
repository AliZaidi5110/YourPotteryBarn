import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { initiateTerminalSale } from '@/lib/payments/shift4'
import { sendPaymentReceipt } from '@/lib/notifications/email'
import { formatCurrency, formatDate } from '@/lib/utils'
import { BookingStatus, PaymentStatus } from '@prisma/client'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const TerminalPaymentSchema = z.object({
  bookingId: z.string(),
  amountPence: z.number().positive(), // amount in pence
})

export async function POST(req: NextRequest) {
  // Require staff/admin session
  const session = await getServerSession(authOptions)
  if (!session || !(session.user as any)?.isStaff) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { bookingId, amountPence } = TerminalPaymentSchema.parse(body)

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true, service: true, slot: true },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Create pending payment record
    const payment = await prisma.payment.create({
      data: {
        bookingId,
        amount: amountPence / 100,
        channel: 'TERMINAL',
        provider: 'SHIFT4',
        status: 'PENDING',
      },
    })

    // Initiate terminal sale
    const result = await initiateTerminalSale({
      amount: amountPence,
      bookingRef: booking.bookingRef,
      bookingId: booking.id,
    })

    if (result.approved) {
      // Update payment to succeeded
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.SUCCEEDED,
          providerTxnId: result.transactionId,
          metadata: result as any,
        },
      })

      // Update booking
      const newAmountPaid = Number(booking.amountPaid) + amountPence / 100
      const isFullyPaid = newAmountPaid >= Number(booking.totalAmount)

      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          amountPaid: newAmountPaid,
          status: isFullyPaid ? BookingStatus.PAID : BookingStatus.CONFIRMED,
        },
      })

      // Send receipt
      sendPaymentReceipt({
        customerName: booking.customer.name,
        customerEmail: booking.customer.email,
        bookingRef: booking.bookingRef,
        serviceName: booking.service.name,
        date: formatDate(new Date(booking.slot.date)),
        amountCharged: formatCurrency(amountPence / 100),
        paymentMethod: `Card Terminal (${result.cardBrand ?? 'Card'} ****${result.cardLast4 ?? ''})`,
        transactionId: result.transactionId,
      }).catch(console.error)

      return NextResponse.json({
        success: true,
        paymentId: payment.id,
        transactionId: result.transactionId,
        authCode: result.authCode,
        cardLast4: result.cardLast4,
        cardBrand: result.cardBrand,
        isFullyPaid,
      })
    } else {
      // Declined
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.FAILED,
          metadata: result as any,
        },
      })

      return NextResponse.json({
        success: false,
        error: result.errorMessage ?? 'Card declined. Please try again or use another method.',
      }, { status: 402 })
    }
  } catch (err: any) {
    console.error('Terminal payment error:', err)
    return NextResponse.json({ error: err.message ?? 'Terminal payment failed' }, { status: 500 })
  }
}
