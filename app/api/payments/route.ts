import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { stripe } from '@/lib/payments/stripe'
import { z } from 'zod'

// GET /api/payments — list payments (admin only)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !(session.user as any)?.isStaff) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')
  const channel = searchParams.get('channel')
  const status = searchParams.get('status')
  const limit = parseInt(searchParams.get('limit') ?? '100')
  const offset = parseInt(searchParams.get('offset') ?? '0')

  const where: any = {}
  if (channel) where.channel = channel
  if (status) where.status = status
  if (date) {
    const d = new Date(date)
    where.createdAt = { gte: d, lt: new Date(d.getTime() + 86400000) }
  }

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      include: {
        booking: {
          include: { customer: true, service: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.payment.count({ where }),
  ])

  // Today's totals
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayPayments = await prisma.payment.groupBy({
    by: ['channel'],
    where: {
      createdAt: { gte: today },
      status: 'SUCCEEDED',
    },
    _sum: { amount: true },
    _count: true,
  })

  return NextResponse.json({ payments, total, todayTotals: todayPayments })
}

// POST /api/payments/refund — issue refund (owner only)
const RefundSchema = z.object({
  paymentId: z.string(),
  amount: z.number().positive().optional(),
  reason: z.string().optional(),
})

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as any)?.role
  if (!session || role !== 'owner') {
    return NextResponse.json({ error: 'Owner permission required' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { paymentId, amount, reason } = RefundSchema.parse(body)

    const payment = await prisma.payment.findUnique({ where: { id: paymentId } })
    if (!payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 })

    if (payment.provider === 'STRIPE' && payment.providerTxnId) {
      const refund = await stripe.refunds.create({
        payment_intent: payment.providerTxnId,
        amount: amount ? Math.round(amount * 100) : undefined,
        reason: 'requested_by_customer',
      })

      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'REFUNDED', metadata: refund as any },
      })

      return NextResponse.json({ success: true, refundId: refund.id })
    }

    // For Shift4 / manual refunds — mark as voided
    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'VOIDED' },
    })

    return NextResponse.json({ success: true, note: 'Marked as voided. For Shift4 terminal refunds, process via the Shift4 merchant portal.' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
