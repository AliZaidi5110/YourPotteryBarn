import { NextRequest, NextResponse } from 'next/server'
import { saveBookingOrderCheckout } from '@/lib/studio-ops/data'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sessionId, bookingId, potteryItems, grossTotal, depositDeducted, balanceDue, paymentMethod, voucherCode } = body

    if (!sessionId || !bookingId) {
      return NextResponse.json({ error: 'sessionId and bookingId are required' }, { status: 400 })
    }

    // ── Voucher redemption ──────────────────────────────────────────────────────
    let voucherApplied = 0
    let voucherRemainingAfter: number | null = null

    if (paymentMethod === 'VOUCHER' && voucherCode) {
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
      potteryItems: potteryItems || [],
      grossTotal: Number(grossTotal) || 0,
      depositDeducted: Number(depositDeducted) || 0,
      balanceDue: Number(balanceDue) || 0,
      paymentMethod: paymentMethod || 'TERMINAL_SHIFT4',
    })

    if (!updatedBooking) {
      return NextResponse.json({ error: 'Booking or session not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
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
