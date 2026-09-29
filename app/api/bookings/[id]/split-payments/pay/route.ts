import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { initiateTerminalSale } from '@/lib/payments/shift4'
import { BookingStatus, PaymentStatus } from '@prisma/client'
import { z } from 'zod'

const PaySplitSchema = z.object({
  splitId: z.string(),
  channel: z.enum(['TERMINAL', 'IN_STORE', 'ONLINE']).default('TERMINAL'),
  provider: z.enum(['SHIFT4', 'CASH', 'GIFT_CARD', 'VOUCHER']).default('SHIFT4'),
  voucherCode: z.string().optional(),
  amountOverride: z.number().positive().optional(), // if partial
})

// POST /api/bookings/[id]/split-payments/pay
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !(session.user as any)?.isStaff) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const body = await req.json()
  const { splitId, channel, provider, voucherCode, amountOverride } = PaySplitSchema.parse(body)

  const split = await prisma.splitPayment.findUnique({
    where: { id: splitId },
    include: { booking: { include: { customer: true, service: true, slot: true } } },
  })

  if (!split) return NextResponse.json({ error: 'Split not found' }, { status: 404 })
  if (split.status === 'SUCCEEDED') return NextResponse.json({ error: 'Already paid' }, { status: 400 })
  if (split.bookingId !== params.id) return NextResponse.json({ error: 'Split does not belong to this booking' }, { status: 400 })

  const amountToPay = amountOverride ?? Number(split.amount)

  // Handle cash payment instantly
  if (provider === 'CASH') {
    await prisma.$transaction(async (tx) => {
      await tx.splitPayment.update({
        where: { id: splitId },
        data: { status: PaymentStatus.SUCCEEDED, provider: 'CASH', channel: 'IN_STORE', paidAt: new Date() },
      })
      // Update booking amountPaid
      const booking = await tx.booking.findUnique({ where: { id: params.id } })
      if (booking) {
        const newPaid = Number(booking.amountPaid) + amountToPay
        const isFullyPaid = newPaid >= Number(booking.totalAmount)
        await tx.booking.update({
          where: { id: params.id },
          data: { amountPaid: newPaid, status: isFullyPaid ? BookingStatus.PAID : BookingStatus.CONFIRMED },
        })
      }
    })
    return NextResponse.json({ success: true, method: 'cash' })
  }

  // Handle voucher redemption
  if (provider === 'VOUCHER' && voucherCode) {
    const voucher = await prisma.voucher.findUnique({ where: { code: voucherCode } })
    if (!voucher || !voucher.active) return NextResponse.json({ error: 'Invalid or expired voucher' }, { status: 400 })
    if (Number(voucher.remainingValue) < amountToPay) {
      return NextResponse.json({ error: `Insufficient voucher balance (£${Number(voucher.remainingValue).toFixed(2)} remaining)` }, { status: 400 })
    }

    await prisma.$transaction(async (tx) => {
      await tx.voucher.update({
        where: { id: voucher.id },
        data: {
          remainingValue: Number(voucher.remainingValue) - amountToPay,
          redeemedAt: new Date(),
          redeemedBookingId: params.id,
          active: Number(voucher.remainingValue) - amountToPay <= 0 ? false : true,
        },
      })
      await tx.splitPayment.update({
        where: { id: splitId },
        data: { status: PaymentStatus.SUCCEEDED, provider: 'VOUCHER', channel: 'IN_STORE', providerTxnId: voucherCode, paidAt: new Date() },
      })
      const booking = await tx.booking.findUnique({ where: { id: params.id } })
      if (booking) {
        const newPaid = Number(booking.amountPaid) + amountToPay
        const isFullyPaid = newPaid >= Number(booking.totalAmount)
        await tx.booking.update({
          where: { id: params.id },
          data: { amountPaid: newPaid, status: isFullyPaid ? BookingStatus.PAID : BookingStatus.CONFIRMED },
        })
      }
    })
    return NextResponse.json({ success: true, method: 'voucher', voucherCode })
  }

  // Handle terminal payment via Shift4
  const result = await initiateTerminalSale({
    amount: Math.round(amountToPay * 100),
    bookingRef: split.booking.bookingRef,
    bookingId: split.bookingId,
  })

  if (result.approved) {
    await prisma.$transaction(async (tx) => {
      await tx.splitPayment.update({
        where: { id: splitId },
        data: {
          status: PaymentStatus.SUCCEEDED,
          provider: 'SHIFT4',
          channel: 'TERMINAL',
          providerTxnId: result.transactionId,
          paidAt: new Date(),
        },
      })
      const booking = await tx.booking.findUnique({ where: { id: params.id } })
      if (booking) {
        const newPaid = Number(booking.amountPaid) + amountToPay
        const isFullyPaid = newPaid >= Number(booking.totalAmount)
        await tx.booking.update({
          where: { id: params.id },
          data: { amountPaid: newPaid, status: isFullyPaid ? BookingStatus.PAID : BookingStatus.CONFIRMED },
        })
      }
    })
    return NextResponse.json({ success: true, transactionId: result.transactionId, authCode: result.authCode, cardLast4: result.cardLast4, cardBrand: result.cardBrand })
  } else {
    return NextResponse.json({ success: false, error: result.errorMessage ?? 'Card declined' }, { status: 402 })
  }
}
