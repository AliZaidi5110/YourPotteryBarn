import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// GET /api/bookings/[id]/split-payments - list all split payments for a booking
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !(session.user as any)?.isStaff) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      customer: true,
      service: true,
      slot: true,
      splitPayments: { orderBy: { createdAt: 'asc' } },
      payments: { where: { status: 'SUCCEEDED' } },
    },
  })

  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })

  const totalPaidViaSplit = booking.splitPayments
    .filter(s => s.status === 'SUCCEEDED')
    .reduce((sum, s) => sum + Number(s.amount), 0)

  const totalPaidViaMain = booking.payments.reduce((sum, p) => sum + Number(p.amount), 0)

  return NextResponse.json({
    booking: {
      id: booking.id,
      bookingRef: booking.bookingRef,
      totalAmount: Number(booking.totalAmount),
      amountPaid: Number(booking.amountPaid),
      seats: booking.seats,
      customer: booking.customer,
      service: booking.service,
      slot: booking.slot,
    },
    splitPayments: booking.splitPayments,
    totalPaidViaSplit,
    totalPaidViaMain,
    amountStillDue: Math.max(0, Number(booking.totalAmount) - Number(booking.amountPaid)),
  })
}

const CreateSplitSchema = z.object({
  splits: z.array(
    z.object({
      personName: z.string().min(1),
      personEmail: z.string().email().optional().or(z.literal('')),
      amount: z.number().positive(),
    })
  ).min(1),
})

// POST /api/bookings/[id]/split-payments - create split payment entries
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !(session.user as any)?.isStaff) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const booking = await prisma.booking.findUnique({ where: { id: params.id } })
  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })

  const body = await req.json()
  const { splits } = CreateSplitSchema.parse(body)

  // Delete any existing PENDING splits before creating new set
  await prisma.splitPayment.deleteMany({
    where: { bookingId: params.id, status: 'PENDING' },
  })

  const created = await prisma.splitPayment.createMany({
    data: splits.map(s => ({
      bookingId: params.id,
      personName: s.personName,
      personEmail: s.personEmail || null,
      amount: s.amount,
      status: 'PENDING',
    })),
  })

  return NextResponse.json({ success: true, created: created.count })
}
