import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { formatCurrency } from '@/lib/utils'
import { Calendar, CreditCard, Users, AlertTriangle, TrendingUp, Clock } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }
export const dynamic = 'force-dynamic'

async function getDashboardData() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today.getTime() + 86400000)

  try {
    const [
      todayBookings,
      todayRevenue,
      pendingPayments,
      totalCustomers,
      upcomingBookings,
    ] = await Promise.all([
      prisma.booking.findMany({
        where: { slot: { date: { gte: today, lt: tomorrow } } },
        include: { customer: true, service: true, slot: true },
        orderBy: { slot: { startTime: 'asc' } },
      }),
      prisma.payment.aggregate({
        where: {
          status: 'SUCCEEDED',
          createdAt: { gte: today, lt: tomorrow },
        },
        _sum: { amount: true },
      }),
      prisma.booking.count({
        where: { status: 'PENDING' },
      }),
      prisma.customer.count(),
      prisma.booking.count({
        where: {
          slot: { date: { gte: today, lt: new Date(today.getTime() + 7 * 86400000) } },
          status: { in: ['PENDING', 'CONFIRMED', 'PAID'] },
        },
      }),
    ])

    return { todayBookings, todayRevenue: Number(todayRevenue._sum.amount ?? 0), pendingPayments, totalCustomers, upcomingBookings }
  } catch (err) {
    console.warn('Dashboard DB not reachable, returning fallback stats:', err)
    return { todayBookings: [], todayRevenue: 0, pendingPayments: 0, totalCustomers: 0, upcomingBookings: 0 }
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  const data = await getDashboardData()
  const role = (session?.user as any)?.role

  // Group by session/slot
  const sessionMap: Record<string, typeof data.todayBookings> = {}
  for (const b of data.todayBookings) {
    const key = `${b.slot.startTime}-${b.serviceId}`
    if (!sessionMap[key]) sessionMap[key] = []
    sessionMap[key].push(b)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-playfair text-3xl font-bold text-clay">
          Good {getGreeting()}, {session?.user?.name?.split(' ')[0] ?? 'there'} 👋
        </h1>
        <p className="text-clay-light mt-1">
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={<CreditCard size={20} />}
          label="Today's Revenue"
          value={formatCurrency(data.todayRevenue)}
          color="terracotta"
          sub="online + terminal"
        />
        <KpiCard
          icon={<Calendar size={20} />}
          label="Today's Bookings"
          value={String(data.todayBookings.length)}
          color="clay"
          sub={`${data.upcomingBookings} this week`}
        />
        <KpiCard
          icon={<AlertTriangle size={20} />}
          label="Pending Payment"
          value={String(data.pendingPayments)}
          color="amber"
          sub="bookings unpaid"
        />
        <KpiCard
          icon={<Users size={20} />}
          label="Total Customers"
          value={String(data.totalCustomers)}
          color="sage"
          sub="registered"
        />
      </div>

      {/* Today's Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-6">
          <h2 className="font-playfair font-semibold text-xl text-clay mb-4 flex items-center gap-2">
            <Clock size={18} className="text-terracotta" />
            Today&apos;s Sessions
          </h2>

          {data.todayBookings.length === 0 ? (
            <div className="text-center py-8 text-clay-light">
              <Calendar size={40} className="mx-auto mb-3 opacity-30" />
              <p>No bookings today.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(sessionMap).map(([key, bookings]) => {
                const first = bookings[0]
                const totalSeats = bookings.reduce((s, b) => s + b.seats, 0)
                const paidCount = bookings.filter(b => b.status === 'PAID').length

                return (
                  <div key={key} className="flex items-center gap-4 p-3 bg-cream rounded-xl border border-parchment">
                    <div className="flex-shrink-0 w-12 text-center">
                      <p className="text-terracotta font-bold text-sm">{first.slot.startTime}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-clay text-sm truncate">{first.service.name}</p>
                      <p className="text-clay-light text-xs">{totalSeats} guests · {paidCount}/{bookings.length} paid</p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${paidCount === bookings.length ? 'bg-sage/10 text-sage' : 'bg-amber-50 text-amber-700'}`}>
                        {paidCount === bookings.length ? 'All paid' : `${bookings.length - paidCount} unpaid`}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-6">
          <h2 className="font-playfair font-semibold text-xl text-clay mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/admin/checkout',  label: 'POS Checkout',     icon: '💳', desc: 'Take a payment' },
              { href: '/admin/bookings?new=true', label: 'New Booking', icon: '➕', desc: 'Add manually' },
              { href: '/admin/customers', label: 'Customers',        icon: '👥', desc: 'View CRM' },
              { href: '/admin/reports',   label: 'Reports',          icon: '📊', desc: 'See analytics' },
            ].map(action => (
              <a
                key={action.href}
                href={action.href}
                className="flex flex-col items-start p-4 bg-cream rounded-xl border border-parchment hover:border-terracotta hover:bg-terracotta/5 transition-all group"
              >
                <span className="text-2xl mb-2">{action.icon}</span>
                <p className="font-semibold text-clay text-sm group-hover:text-terracotta transition-colors">{action.label}</p>
                <p className="text-clay-light text-xs">{action.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function KpiCard({ icon, label, value, color, sub }: {
  icon: React.ReactNode
  label: string
  value: string
  color: 'terracotta' | 'clay' | 'sage' | 'amber'
  sub: string
}) {
  const colors = {
    terracotta: 'bg-terracotta/10 text-terracotta',
    clay: 'bg-clay/10 text-clay',
    sage: 'bg-sage/10 text-sage',
    amber: 'bg-amber-50 text-amber-700',
  }

  return (
    <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-clay">{value}</p>
      <p className="text-sm font-medium text-clay-light mt-0.5">{label}</p>
      <p className="text-xs text-clay-light/70 mt-1">{sub}</p>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
