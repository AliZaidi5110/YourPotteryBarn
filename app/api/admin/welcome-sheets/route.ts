import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/admin/welcome-sheets?date=2024-01-15
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !(session.user as any)?.isStaff) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const dateStr = new URL(req.url).searchParams.get('date')
  if (!dateStr) return NextResponse.json({ error: 'date required' }, { status: 400 })

  const date = new Date(dateStr)
  date.setHours(0, 0, 0, 0)
  const nextDay = new Date(date)
  nextDay.setDate(nextDay.getDate() + 1)

  const slots = await prisma.availabilitySlot.findMany({
    where: { date: { gte: date, lt: nextDay } },
    include: {
      service: { select: { name: true } },
      bookings: {
        where: { status: { in: ['CONFIRMED', 'PAID', 'PENDING'] } },
        include: { customer: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { startTime: 'asc' },
  })

  return NextResponse.json({ slots })
}
