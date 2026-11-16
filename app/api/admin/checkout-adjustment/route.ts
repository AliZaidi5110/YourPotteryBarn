import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateCheckoutTotals } from '@/lib/payments/checkout-totals'
import { withApprovedAddonDetails } from '@/lib/service-details'
import { z } from 'zod'

const AdjustmentSchema = z.object({
  bookingId: z.string().min(1),
  applyDiscount: z.boolean(),
  customDiscountAmount: z.number().finite().nonnegative().multipleOf(0.01).optional(),
  addons: z.array(z.object({ addonId: z.string(), quantity: z.number().int().positive().max(1000) })).default([]),
}).refine(data => !data.applyDiscount || data.customDiscountAmount === undefined)

// Save the agreed total before collecting card, cash, split, or voucher payments.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !(session.user as any)?.isStaff) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  try {
    const parsed = AdjustmentSchema.safeParse(await req.json())
    if (!parsed.success) return NextResponse.json({ error: 'Invalid checkout details' }, { status: 400 })
    const { bookingId, applyDiscount, customDiscountAmount, addons } = parsed.data

    const result = await prisma.$transaction(async tx => {
      const booking = await tx.booking.findUnique({ where: { id: bookingId } })
      if (!booking) throw new Error('Booking not found')
      if (booking.status === 'CANCELLED' || booking.status === 'NO_SHOW') throw new Error('This booking cannot be checked out')

      let extraTotal = 0
      for (const entry of addons) {
        const addon = await tx.addon.findUnique({ where: { id: entry.addonId } })
        if (!addon || !addon.active) throw new Error('An extra is no longer available')
        const price = Number(withApprovedAddonDetails(addon).price)
        extraTotal += price * entry.quantity
        await tx.bookingAddon.create({
          data: { bookingId, addonId: addon.id, quantity: entry.quantity, unitPrice: price },
        })
      }

      // Restore the original total before recalculating, so retries never compound the discount.
      const totals = calculateCheckoutTotals(
        Number(booking.totalAmount) + Number(booking.checkoutDiscountAmount) + extraTotal,
        Number(booking.amountPaid),
        applyDiscount,
        customDiscountAmount,
      )
      if (totals.totalAmount !== Number(booking.totalAmount)) {
        // Pending splits must be rebuilt for the new balance; collected payments remain intact.
        await tx.splitPayment.deleteMany({ where: { bookingId, status: 'PENDING' } })
      }
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: {
          totalAmount: totals.totalAmount,
          checkoutDiscountAmount: totals.discountAmount,
          checkoutDiscountType: totals.discountType,
          status: totals.balanceDue === 0 ? 'PAID' : 'CONFIRMED',
        },
        include: { customer: true, service: true, slot: true, bookingAddons: { include: { addon: true } }, payments: true },
      })
      return { booking: updatedBooking, totals }
    }, { isolationLevel: 'Serializable' })
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Could not update checkout' }, { status: 400 })
  }
}
