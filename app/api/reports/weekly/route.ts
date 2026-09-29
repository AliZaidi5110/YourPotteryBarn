import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/reports/weekly?weekStart=2024-01-01
// Returns QuickBooks-ready weekly financial summary
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !(session.user as any)?.isStaff) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  let weekStartStr = searchParams.get('weekStart')

  // Default to start of current week (Monday)
  let weekStart: Date
  if (weekStartStr) {
    weekStart = new Date(weekStartStr)
  } else {
    weekStart = new Date()
    const day = weekStart.getDay()
    const diff = day === 0 ? -6 : 1 - day // Monday
    weekStart.setDate(weekStart.getDate() + diff)
  }
  weekStart.setHours(0, 0, 0, 0)

  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 7)

  const [payments, orderItems, bookings, vouchersSold] = await Promise.all([
    // All payments this week
    prisma.payment.findMany({
      where: { status: 'SUCCEEDED', createdAt: { gte: weekStart, lt: weekEnd } },
      include: { booking: { include: { customer: true, service: true } } },
      orderBy: { createdAt: 'asc' },
    }),
    // Stock/inventory that went out this week (via order deductions)
    prisma.orderItem.findMany({
      where: { order: { createdAt: { gte: weekStart, lt: weekEnd } } },
      include: { inventoryItem: true, order: { include: { booking: { include: { customer: true } } } } },
      orderBy: { createdAt: 'asc' },
    }),
    // Bookings taken this week
    prisma.booking.findMany({
      where: { createdAt: { gte: weekStart, lt: weekEnd }, status: { in: ['CONFIRMED', 'PAID'] } },
      include: { customer: true, service: true, slot: true },
    }),
    // Vouchers sold this week
    prisma.voucher.findMany({
      where: { createdAt: { gte: weekStart, lt: weekEnd } },
      orderBy: { createdAt: 'asc' },
    }),
  ])

  // Revenue breakdown
  const onlineRevenue = payments.filter(p => p.channel === 'ONLINE').reduce((s, p) => s + Number(p.amount), 0)
  const terminalRevenue = payments.filter(p => p.channel === 'TERMINAL').reduce((s, p) => s + Number(p.amount), 0)
  const inStoreRevenue = payments.filter(p => p.channel === 'IN_STORE').reduce((s, p) => s + Number(p.amount), 0)
  const totalRevenue = onlineRevenue + terminalRevenue + inStoreRevenue

  // Revenue by day
  const byDay: Record<string, { online: number; terminal: number; inStore: number; total: number }> = {}
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    const key = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
    byDay[key] = { online: 0, terminal: 0, inStore: 0, total: 0 }
  }
  for (const p of payments) {
    const key = new Date(p.createdAt).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
    if (byDay[key]) {
      const amt = Number(p.amount)
      if (p.channel === 'ONLINE') byDay[key].online += amt
      else if (p.channel === 'TERMINAL') byDay[key].terminal += amt
      else byDay[key].inStore += amt
      byDay[key].total += amt
    }
  }

  // Stock movement (items that left the building)
  const stockByItem: Record<string, { itemName: string; sku?: string; category?: string; quantitySold: number; totalValue: number }> = {}
  for (const item of orderItems) {
    const name = item.itemName
    if (!stockByItem[name]) stockByItem[name] = { itemName: name, sku: item.inventoryItem?.sku ?? undefined, category: item.inventoryItem?.category ?? undefined, quantitySold: 0, totalValue: 0 }
    stockByItem[name].quantitySold += item.quantity
    stockByItem[name].totalValue += Number(item.totalPrice)
  }

  // Revenue by service
  const byService: Record<string, { serviceName: string; bookingCount: number; revenue: number }> = {}
  for (const b of bookings) {
    const name = b.service.name
    if (!byService[name]) byService[name] = { serviceName: name, bookingCount: 0, revenue: 0 }
    byService[name].bookingCount++
    byService[name].revenue += Number(b.totalAmount)
  }

  // QuickBooks CSV lines
  const qbLines = [
    '!TRNS,TRNSID,TRNSTYPE,DATE,ACCNT,NAME,AMOUNT,MEMO',
    '!SPL,SPLID,TRNSTYPE,DATE,ACCNT,NAME,AMOUNT,MEMO',
    '!ENDTRNS',
  ]
  let txnId = 1000
  for (const p of payments) {
    const date = new Date(p.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
    const customerName = p.booking?.customer?.name ?? 'Walk-in'
    const memo = p.booking?.service?.name ?? 'Pottery session'
    const account = p.channel === 'ONLINE' ? 'Stripe Income' : p.channel === 'TERMINAL' ? 'Card Terminal Income' : 'Cash Income'
    qbLines.push(`TRNS,${txnId},PAYMENT,${date},${account},${customerName},${Number(p.amount).toFixed(2)},${memo}`)
    qbLines.push(`SPL,${txnId},PAYMENT,${date},Sales Income,${customerName},-${Number(p.amount).toFixed(2)},${memo}`)
    qbLines.push('ENDTRNS')
    txnId++
  }
  for (const v of vouchersSold) {
    const date = new Date(v.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
    const account = v.paymentMethod === 'CASH' ? 'Cash Income' : 'Card Terminal Income'
    qbLines.push(`TRNS,${txnId},PAYMENT,${date},${account},${v.purchasedByName ?? 'Customer'},${Number(v.salePrice ?? v.initialValue).toFixed(2)},Voucher Sale: ${v.title}`)
    qbLines.push(`SPL,${txnId},PAYMENT,${date},Voucher Liability,${v.purchasedByName ?? 'Customer'},-${Number(v.salePrice ?? v.initialValue).toFixed(2)},Voucher Sale: ${v.title}`)
    qbLines.push('ENDTRNS')
    txnId++
  }

  return NextResponse.json({
    weekStart: weekStart.toISOString(),
    weekEnd: weekEnd.toISOString(),
    summary: {
      totalRevenue,
      onlineRevenue,
      terminalRevenue,
      inStoreRevenue,
      totalBookings: bookings.length,
      totalTransactions: payments.length,
      vouchersSold: vouchersSold.length,
      voucherRevenue: vouchersSold.reduce((s, v) => s + Number(v.salePrice ?? v.initialValue), 0),
    },
    revenueByDay: Object.entries(byDay).map(([date, vals]) => ({ date, ...vals })),
    revenueByService: Object.values(byService).sort((a, b) => b.revenue - a.revenue),
    stockMovement: Object.values(stockByItem).sort((a, b) => b.totalValue - a.totalValue),
    payments: payments.map(p => ({
      id: p.id,
      date: p.createdAt,
      amount: Number(p.amount),
      channel: p.channel,
      provider: p.provider,
      status: p.status,
      providerTxnId: p.providerTxnId,
      customerName: p.booking?.customer?.name,
      serviceName: (p.booking as any)?.service?.name,
    })),
    vouchersSold: vouchersSold.map(v => ({
      code: v.code,
      title: v.title,
      salePrice: Number(v.salePrice ?? v.initialValue),
      issuedToName: v.issuedToName,
      purchasedByName: v.purchasedByName,
      paymentMethod: v.paymentMethod,
      createdAt: v.createdAt,
    })),
    quickbooksIif: qbLines.join('\n'),
  })
}
