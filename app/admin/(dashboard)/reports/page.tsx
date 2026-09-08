'use client'

import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react'

const COLORS = ['#C4613A', '#4A7C59', '#5C3D2E', '#8B6147', '#7AAB88', '#B8916E']

export default function ReportsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: () => fetch('/api/reports').then(r => r.json()),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32 text-clay-light">
        <Loader2 size={32} className="animate-spin mr-3" /> Loading reports...
      </div>
    )
  }

  const revenueByDay = data?.revenueByDay ?? []
  const revenueByService = data?.revenueByService ?? []
  const bookingsByMonth = data?.bookingsByMonth ?? []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-playfair text-3xl font-bold text-clay">Reports & Analytics</h1>
        <p className="text-clay-light mt-1">Revenue, occupancy, and customer insights.</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: formatCurrency(data?.totalRevenue ?? 0), sub: 'all time', icon: '💰' },
          { label: 'Total Bookings', value: String(data?.totalBookings ?? 0), sub: 'all time', icon: '📅' },
          { label: 'Avg. Booking Value', value: formatCurrency(data?.avgBookingValue ?? 0), sub: 'per booking', icon: '📊' },
          { label: 'Repeat Customers', value: `${data?.repeatCustomerRate ?? 0}%`, sub: 'have booked 2+', icon: '❤️' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-5">
            <div className="text-2xl mb-2">{kpi.icon}</div>
            <p className="text-2xl font-bold text-clay">{kpi.value}</p>
            <p className="text-sm font-medium text-clay-light mt-0.5">{kpi.label}</p>
            <p className="text-xs text-clay-light/70">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue by day chart */}
      <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-6">
        <h2 className="font-playfair font-semibold text-xl text-clay mb-5">Revenue (last 30 days)</h2>
        {revenueByDay.length === 0 ? (
          <div className="text-center py-12 text-clay-light">No payment data yet.</div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueByDay} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8DCC8" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#8B6147' }} />
              <YAxis tick={{ fontSize: 12, fill: '#8B6147' }} tickFormatter={v => `£${v}`} />
              <Tooltip
                contentStyle={{ background: '#FFFDF9', border: '1px solid #E8DCC8', borderRadius: 12, fontSize: 13 }}
                formatter={(value: any) => [formatCurrency(value), 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#C4613A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by service */}
        <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-6">
          <h2 className="font-playfair font-semibold text-xl text-clay mb-5">Revenue by Workshop</h2>
          {revenueByService.length === 0 ? (
            <div className="text-center py-12 text-clay-light">No data yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={revenueByService} dataKey="revenue" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }: { name?: string; percent?: number }) => `${(name ?? '').split(' ')[0]} ${(((percent ?? 0) * 100)).toFixed(0)}%`}>
                  {revenueByService.map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bookings over time */}
        <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-6">
          <h2 className="font-playfair font-semibold text-xl text-clay mb-5">Bookings per Month</h2>
          {bookingsByMonth.length === 0 ? (
            <div className="text-center py-12 text-clay-light">No data yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={bookingsByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8DCC8" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#8B6147' }} />
                <YAxis tick={{ fontSize: 12, fill: '#8B6147' }} />
                <Tooltip contentStyle={{ background: '#FFFDF9', border: '1px solid #E8DCC8', borderRadius: 12, fontSize: 13 }} />
                <Line type="monotone" dataKey="count" stroke="#4A7C59" strokeWidth={2} dot={{ fill: '#4A7C59', strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Most popular services table */}
      {revenueByService.length > 0 && (
        <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-6">
          <h2 className="font-playfair font-semibold text-xl text-clay mb-4">Most Popular Workshops</h2>
          <div className="space-y-3">
            {revenueByService.slice(0, 6).map((s: any, i: number) => {
              const maxRevenue = revenueByService[0]?.revenue ?? 1
              const pct = (s.revenue / maxRevenue) * 100
              return (
                <div key={s.name} className="flex items-center gap-4">
                  <span className="text-clay-light text-sm w-5">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-clay text-sm font-medium">{s.name}</span>
                      <span className="text-terracotta text-sm font-bold">{formatCurrency(s.revenue)}</span>
                    </div>
                    <div className="h-2 bg-parchment rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-terracotta/70 transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-clay-light text-xs mt-1">{s.bookingCount} bookings</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
