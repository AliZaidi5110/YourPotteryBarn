import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [
    totalRevenue,
    totalBookings,
    revenueByDay,
    bookingsByMonth,
    customerStats,
    serviceRevenue,
  ] = await Promise.all([
    // Total revenue
    prisma.payment.aggregate({
      where: { status: 'SUCCEEDED' },
      _sum: { amount: true },
    }),
    // Total bookings
    prisma.booking.count({ where: { status: { in: ['CONFIRMED', 'PAID'] } } }),
    // Revenue by day (last 30 days)
    prisma.payment.groupBy({
      by: ['createdAt'],
      where: { status: 'SUCCEEDED', createdAt: { gte: thirtyDaysAgo } },
      _sum: { amount: true },
    }),
    // Bookings by month
    prisma.booking.findMany({
      where: { status: { in: ['CONFIRMED', 'PAID'] } },
      select: { createdAt: true },
    }),
    // Customer repeat rate
    prisma.customer.findMany({
      include: { _count: { select: { bookings: true } } },
    }),
    // Revenue by service
    prisma.booking.findMany({
      where: { status: { in: ['CONFIRMED', 'PAID'] } },
      select: { totalAmount: true, service: { select: { name: true } }, createdAt: true },
    }),
  ])

  // Process revenue by day
  const revenueByDayMap: Record<string, number> = {}
  for (const r of revenueByDay) {
    const date = new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    revenueByDayMap[date] = (revenueByDayMap[date] ?? 0) + Number(r._sum.amount ?? 0)
  }
  const revenueByDayArr = Object.entries(revenueByDayMap).map(([date, revenue]) => ({ date, revenue }))

  // Process bookings by month
  const monthMap: Record<string, number> = {}
  for (const b of bookingsByMonth) {
    const month = new Date(b.createdAt).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })
    monthMap[month] = (monthMap[month] ?? 0) + 1
  }
  const bookingsByMonthArr = Object.entries(monthMap).map(([month, count]) => ({ month, count }))

  // Repeat customer rate
  const repeatCustomers = customerStats.filter(c => c._count.bookings >= 2).length
  const repeatRate = customerStats.length > 0 ? Math.round((repeatCustomers / customerStats.length) * 100) : 0

  // Average booking value
  const avg = totalBookings > 0 ? Number(totalRevenue._sum.amount ?? 0) / totalBookings : 0

  // Revenue by service
  const serviceMap: Record<string, { revenue: number; bookingCount: number }> = {}
  for (const b of serviceRevenue as any[]) {
    const name = b.service?.name ?? 'Unknown'
    if (!serviceMap[name]) serviceMap[name] = { revenue: 0, bookingCount: 0 }
    serviceMap[name].revenue += Number(b.totalAmount ?? 0)
    serviceMap[name].bookingCount++
  }
  const revenueByServiceArr = Object.entries(serviceMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)

  return NextResponse.json({
    totalRevenue: Number(totalRevenue._sum.amount ?? 0),
    totalBookings,
    avgBookingValue: avg,
    repeatCustomerRate: repeatRate,
    revenueByDay: revenueByDayArr,
    bookingsByMonth: bookingsByMonthArr,
    revenueByService: revenueByServiceArr,
  })
}
