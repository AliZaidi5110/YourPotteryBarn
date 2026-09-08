import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createPaymentIntent } from '@/lib/payments/stripe'
import { sendBookingConfirmation } from '@/lib/notifications/email'
import { sendBookingConfirmationSMS } from '@/lib/notifications/sms'
import { generateBookingRef, formatDate, formatTime, formatCurrency } from '@/lib/utils'
import { BookingStatus } from '@prisma/client'
import QRCode from 'qrcode'
import { z } from 'zod'

const CreateBookingSchema = z.object({
  serviceId: z.string(),
  slotId: z.string(),
  seats: z.number().min(1).max(30),
  addons: z.array(z.object({ addonId: z.string(), qty: z.number().min(1) })).optional(),
  guestInfo: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
  }),
  giftCardCode: z.string().optional(),
})

import { DEFAULT_SERVICES, DEFAULT_ADDONS } from '@/lib/mock-data'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = CreateBookingSchema.parse(body)

    // Verify slot availability
    let slot = null
    try {
      slot = await prisma.availabilitySlot.findUnique({
        where: { id: data.slotId },
      })
    } catch (e) {
      console.warn('DB offline while verifying slot:', e)
    }

    // Handle mock slots or offline development demo
    if (!slot || data.slotId.startsWith('slot-')) {
      const mockService = DEFAULT_SERVICES.find(s => s.id === data.serviceId) ?? DEFAULT_SERVICES[0]
      const serviceTotal = Number(mockService.price) * data.seats
      const addonTotal = (data.addons ?? []).reduce((sum, item) => {
        const a = DEFAULT_ADDONS.find(ad => ad.id === item.addonId)
        return sum + (a ? Number(a.price) * item.qty : 0)
      }, 0)
      const grandTotal = serviceTotal + addonTotal
      const depositPct = parseFloat(process.env.BOOKING_DEPOSIT_PERCENTAGE ?? '25') / 100
      const depositAmount = Math.max(0, Math.ceil(grandTotal * depositPct))
      const bookingRef = generateBookingRef()

      return NextResponse.json({
        bookingRef,
        bookingId: `demo-${bookingRef}`,
        clientSecret: 'mock_pi_secret_test',
        totalAmount: grandTotal,
        depositAmount,
      })
    }

    if (slot.capacityRemaining < data.seats) {
      return NextResponse.json({ message: 'This slot no longer has enough capacity. Please choose another time.' }, { status: 409 })
    }

    // Get service
    const service = await prisma.service.findUnique({ where: { id: data.serviceId } })
    if (!service) return NextResponse.json({ message: 'Service not found.' }, { status: 404 })

    // Get or create customer
    let customer = await prisma.customer.findUnique({ where: { email: data.guestInfo.email } })
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: data.guestInfo.name,
          email: data.guestInfo.email,
          phone: data.guestInfo.phone,
        },
      })
    }

    // Calculate totals
    const addonDetails = await Promise.all(
      (data.addons ?? []).map(async ({ addonId, qty }) => {
        const addon = await prisma.addon.findUnique({ where: { id: addonId } })
        return addon ? { addon, qty } : null
      })
    )
    const validAddons = addonDetails.filter(Boolean) as Array<{ addon: { id: string; price: any }; qty: number }>

    const serviceTotal = Number(service.price) * data.seats
    const addonTotal = validAddons.reduce((sum, { addon, qty }) => sum + Number(addon.price) * qty, 0)
    const grandTotal = serviceTotal + addonTotal

    // Gift card credit
    let creditApplied = 0
    if (data.giftCardCode) {
      const giftCard = await prisma.giftCard.findUnique({
        where: { code: data.giftCardCode, active: true },
      })
      if (giftCard && Number(giftCard.remainingBalance) > 0) {
        creditApplied = Math.min(Number(giftCard.remainingBalance), grandTotal)
      }
    }

    // Customer credit
    if (Number(customer.creditBalance) > 0) {
      creditApplied = Math.min(Number(customer.creditBalance) + creditApplied, grandTotal)
    }

    const depositPct = parseFloat(process.env.BOOKING_DEPOSIT_PERCENTAGE ?? '25') / 100
    const depositAmount = Math.max(0, Math.ceil(grandTotal * depositPct) - creditApplied)

    const bookingRef = generateBookingRef()

    // Generate QR code
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const qrCode = await QRCode.toDataURL(`${appUrl}/confirmation/${bookingRef}`)

    // Create booking in transaction
    const booking = await prisma.$transaction(async (tx) => {
      // Decrement slot capacity
      await tx.availabilitySlot.update({
        where: { id: data.slotId },
        data: { capacityRemaining: { decrement: data.seats } },
      })

      // Apply credit deductions
      if (data.giftCardCode) {
        const giftCard = await tx.giftCard.findUnique({ where: { code: data.giftCardCode } })
        if (giftCard) {
          const deduction = Math.min(Number(giftCard.remainingBalance), creditApplied)
          await tx.giftCard.update({
            where: { id: giftCard.id },
            data: { remainingBalance: { decrement: deduction } },
          })
        }
      }

      if (Number(customer!.creditBalance) > 0) {
        await tx.customer.update({
          where: { id: customer!.id },
          data: { creditBalance: { decrement: Math.min(Number(customer!.creditBalance), creditApplied) } },
        })
      }

      // Create booking
      const b = await tx.booking.create({
        data: {
          bookingRef,
          customerId: customer!.id,
          serviceId: data.serviceId,
          slotId: data.slotId,
          seats: data.seats,
          totalAmount: grandTotal,
          amountPaid: creditApplied,
          creditApplied,
          status: BookingStatus.PENDING,
          qrCode,
          bookingAddons: {
            create: validAddons.map(({ addon, qty }) => ({
              addonId: addon.id,
              quantity: qty,
              unitPrice: addon.price,
            })),
          },
        },
      })

      return b
    })

    // Create Stripe PaymentIntent if deposit > 0
    let clientSecret: string | undefined
    if (depositAmount > 0) {
      const { clientSecret: cs, paymentIntentId } = await createPaymentIntent({
        amount: Math.round(depositAmount * 100), // pence
        bookingId: booking.id,
        bookingRef,
        customerEmail: customer.email,
        description: `Deposit for ${service.name} — ${bookingRef}`,
      })
      clientSecret = cs

      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          amount: depositAmount,
          channel: 'ONLINE',
          provider: 'STRIPE',
          providerTxnId: paymentIntentId,
          status: 'PENDING',
        },
      })
    } else {
      // Fully covered by credit
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: BookingStatus.CONFIRMED, amountPaid: grandTotal },
      })
    }

    // Send notifications (fire and forget)
    const emailData = {
      customerName: customer.name,
      customerEmail: customer.email,
      bookingRef,
      serviceName: service.name,
      date: formatDate(new Date(slot.date)),
      time: `${formatTime(slot.startTime)} – ${formatTime(slot.endTime)}`,
      seats: data.seats,
      totalAmount: formatCurrency(grandTotal),
      amountPaid: formatCurrency(creditApplied),
      addons: validAddons.map(({ addon, qty }) => ({
        name: (addon as any).name,
        quantity: qty,
        price: formatCurrency(Number(addon.price) * qty),
      })),
    }

    sendBookingConfirmation(emailData).catch(console.error)

    if (customer.phone) {
      sendBookingConfirmationSMS({
        to: customer.phone,
        customerName: customer.name,
        bookingRef,
        serviceName: service.name,
        date: formatDate(new Date(slot.date)),
        time: formatTime(slot.startTime),
      }).catch(console.error)
    }

    return NextResponse.json({ bookingRef, bookingId: booking.id, clientSecret })
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return NextResponse.json({ message: 'Invalid request data.', errors: err.errors }, { status: 400 })
    }
    console.error('Booking creation error:', err)
    return NextResponse.json({ message: 'Failed to create booking.' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const ref = searchParams.get('ref')
  const customerId = searchParams.get('customerId')
  const status = searchParams.get('status')
  const date = searchParams.get('date')
  const limit = parseInt(searchParams.get('limit') ?? '50')
  const offset = parseInt(searchParams.get('offset') ?? '0')

  const where: any = {}
  if (ref) where.bookingRef = ref
  if (customerId) where.customerId = customerId
  if (status) where.status = status
  if (date) {
    const d = new Date(date)
    where.slot = { date: { gte: d, lt: new Date(d.getTime() + 86400000) } }
  }

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: {
        customer: true,
        service: true,
        slot: true,
        bookingAddons: { include: { addon: true } },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.booking.count({ where }),
  ])

  return NextResponse.json({ bookings, total })
}
