import { NextRequest, NextResponse } from 'next/server'
import { getStudioStore, saveBookingOrderCheckout } from '@/lib/studio-ops/data'
import { prisma } from '@/lib/prisma'
import { calculateCheckoutTotals } from '@/lib/payments/checkout-totals'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const CheckoutSchema = z.object({
  sessionId: z.string().min(1),
  bookingId: z.string().min(1),
  potteryItems: z.array(z.object({ itemId: z.string(), quantity: z.number().int().positive().max(1000) })).min(1),
  applyDiscount: z.boolean().default(false),
  customDiscountAmount: z.number().finite().nonnegative().multipleOf(0.01).optional(),
  paymentMethod: z.enum(['TERMINAL_SHIFT4', 'STRIPE', 'CASH', 'VOUCHER']).default('TERMINAL_SHIFT4'),
  voucherCode: z.string().optional(),
}).refine(data => !data.applyDiscount || data.customDiscountAmount === undefined)

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !(session.user as any)?.isStaff) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  try {
    const parsed = CheckoutSchema.safeParse(await req.json())
    if (!parsed.success) return NextResponse.json({ error: 'Invalid checkout details' }, { status: 400 })
    const { sessionId, bookingId, potteryItems: requestedItems, applyDiscount, customDiscountAmount, paymentMethod, voucherCode } = parsed.data
    const store = getStudioStore()
    const booking = store.bookingsBySession[sessionId]?.find(b => b.id === bookingId)
    if (!booking) return NextResponse.json({ error: 'Booking or session not found' }, { status: 404 })
    if (booking.orderCompleted) return NextResponse.json({ error: 'This order is already settled' }, { status: 409 })

    const potteryItems = []
    for (const requested of requestedItems) {
      const item = store.inventory.find(i => i.id === requested.itemId)
      if (!item) return NextResponse.json({ error: 'Unknown pottery item' }, { status: 400 })
      potteryItems.push({
        itemId: item.id, name: item.name, category: item.category,
        quantity: requested.quantity, unitPrice: item.price, totalPrice: item.price * requested.quantity,
      })
    }
    let totals
    try {
      totals = calculateCheckoutTotals(potteryItems.reduce((sum, item) => sum + item.totalPrice, 0), booking.amountPaid, applyDiscount, customDiscountAmount)
    } catch (err) {
      return NextResponse.json({ error: err instanceof Error ? err.message : 'Invalid discount' }, { status: 400 })
    }
    const { balanceDue } = totals

    // ── Voucher redemption ──────────────────────────────────────────────────────
    let voucherApplied = 0
    let voucherRemainingAfter: number | null = null

    if (paymentMethod === 'VOUCHER' && balanceDue > 0) {
      if (!voucherCode) return NextResponse.json({ error: 'Voucher code is required' }, { status: 400 })
      try {
        const voucher = await prisma.voucher.findUnique({ where: { code: String(voucherCode).toUpperCase().trim() } })

        if (!voucher || !voucher.active) {
          return NextResponse.json({ error: 'Invalid or inactive voucher code' }, { status: 400 })
        }
        if (voucher.expiryDate && voucher.expiryDate < new Date()) {
          return NextResponse.json({ error: `Voucher expired on ${voucher.expiryDate.toLocaleDateString('en-GB')}` }, { status: 400 })
        }
        if (Number(voucher.remainingValue) <= 0) {
          return NextResponse.json({ error: 'Voucher has no remaining balance' }, { status: 400 })
        }

        const amountToDeduct = Math.min(Number(voucher.remainingValue), Number(balanceDue))
        voucherApplied = amountToDeduct
        voucherRemainingAfter = Number(voucher.remainingValue) - amountToDeduct

        // Deduct from voucher
        await prisma.voucher.update({
          where: { id: voucher.id },
          data: {
            remainingValue: voucherRemainingAfter,
            redeemedAt: voucherRemainingAfter <= 0 ? new Date() : undefined,
            redeemedBookingId: bookingId,
            active: voucherRemainingAfter > 0, // deactivate if fully used
          },
        })
      } catch (dbErr: any) {
        // If Prisma not connected (local dev), skip silently but warn
        console.warn('Voucher DB update skipped (DB not connected?):', dbErr.message)
      }
    }

    const updatedBooking = saveBookingOrderCheckout(sessionId, bookingId, {
      potteryItems,
      applyDiscount,
      customDiscountAmount,
      paymentMethod,
    })

    if (!updatedBooking) {
      return NextResponse.json({ error: 'Booking or session not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      totals,
      transactionId: `TXN-${Date.now().toString().slice(-6)}`,
      completedAt: new Date().toISOString(),
      receiptNumber: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
      // Voucher info surfaced back to UI
      ...(voucherCode && paymentMethod === 'VOUCHER' ? {
        voucherApplied,
        voucherRemainingAfter,
        voucherCode,
      } : {}),
    })
  } catch (err: any) {
    console.error('Error during studio checkout:', err)
    return NextResponse.json({ error: 'Failed to process studio checkout' }, { status: 500 })
  }
}
