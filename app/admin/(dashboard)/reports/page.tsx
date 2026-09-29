'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BarChart3, Download, Loader2, Package, TrendingUp, CreditCard, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

function getMondayOfWeek(offset = 0): Date {
  const d = new Date()
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff + offset * 7)
  d.setHours(0, 0, 0, 0)
  return d
}

function fmtWeekRange(start: Date) {
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  return `${start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
}

export default function ReportsPage() {
  const [weekOffset, setWeekOffset] = useState(0)
  const weekStart = getMondayOfWeek(weekOffset)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['weekly-report', weekStart.toISOString().split('T')[0]],
    queryFn: async () => {
      const res = await fetch(`/api/reports/weekly?weekStart=${weekStart.toISOString().split('T')[0]}`)
      return res.json()
    },
  })

  function downloadQb() {
    if (!data?.quickbooksIif) return
    const blob = new Blob([data.quickbooksIif], { type: 'text/plain' })
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: `quickbooks-${weekStart.toISOString().split('T')[0]}.iif`,
    })
    a.click()
  }

  function downloadCsv() {
    if (!data) return
    const rows = [
      ['Date', 'Customer', 'Service', 'Amount', 'Channel', 'Provider', 'Transaction ID'],
      ...(data.payments ?? []).map((p: any) => [
        new Date(p.date).toLocaleDateString('en-GB'),
        p.customerName ?? '',
        p.serviceName ?? '',
        Number(p.amount).toFixed(2),
        p.channel,
        p.provider,
        p.providerTxnId ?? '',
      ]),
    ]
    const csv = (rows as string[][]).map(r => r.map((c: string) => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: `payments-${weekStart.toISOString().split('T')[0]}.csv`,
    })
    a.click()
  }

  function downloadStockCsv() {
    if (!data) return
    const rows = [
      ['Item', 'SKU', 'Category', 'Qty Sold', 'Total Value'],
      ...(data.stockMovement ?? []).map((s: any) => [
        s.itemName, s.sku ?? '', s.category ?? '', String(s.quantitySold), Number(s.totalValue).toFixed(2),
      ]),
    ]
    const csv = (rows as string[][]).map(r => r.map((c: string) => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: `stock-movement-${weekStart.toISOString().split('T')[0]}.csv`,
    })
    a.click()
  }

  const summary = data?.summary ?? {}
  const byDay: any[] = data?.revenueByDay ?? []
  const byService: any[] = data?.revenueByService ?? []
  const stock: any[] = data?.stockMovement ?? []
  const vouchersSold: any[] = data?.vouchersSold ?? []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-clay">Weekly Reports</h1>
          <p className="text-clay-light mt-1">Financial summary for QuickBooks, stock control, and performance tracking.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => refetch()} className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-parchment text-clay-light hover:border-terracotta text-sm transition-all">
            <RefreshCw size={14} />
          </button>
          <button onClick={downloadCsv} className="btn-secondary flex items-center gap-2 py-2.5 text-sm">
            <Download size={15} /> Payments CSV
          </button>
          <button onClick={downloadStockCsv} className="btn-secondary flex items-center gap-2 py-2.5 text-sm">
            <Download size={15} /> Stock CSV
          </button>
          <button onClick={downloadQb} className="btn-primary flex items-center gap-2 py-2.5 text-sm">
            <Download size={15} /> QuickBooks IIF
          </button>
        </div>
      </div>

      {/* Week navigation */}
      <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-4 flex items-center gap-4">
        <button onClick={() => setWeekOffset(w => w - 1)} className="p-2 rounded-xl border border-parchment hover:border-terracotta text-clay-light hover:text-terracotta transition-all">
          <ChevronLeft size={18} />
        </button>
        <div className="flex-1 text-center">
          <p className="font-semibold text-clay">{fmtWeekRange(weekStart)}</p>
          <p className="text-xs text-clay-light">{weekOffset === 0 ? 'This week' : weekOffset === -1 ? 'Last week' : `${Math.abs(weekOffset)} weeks ago`}</p>
        </div>
        <button onClick={() => setWeekOffset(w => Math.min(0, w + 1))} disabled={weekOffset >= 0} className="p-2 rounded-xl border border-parchment hover:border-terracotta text-clay-light hover:text-terracotta transition-all disabled:opacity-30">
          <ChevronRight size={18} />
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-clay-light"><Loader2 size={24} className="animate-spin mr-2" /> Loading report...</div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Revenue', value: formatCurrency(summary.totalRevenue ?? 0), icon: '💷', sub: 'all channels', color: 'text-terracotta' },
              { label: 'Online (Stripe)', value: formatCurrency(summary.onlineRevenue ?? 0), icon: '🌐', sub: 'Stripe payments', color: 'text-blue-700' },
              { label: 'Terminal (Shift4)', value: formatCurrency(summary.terminalRevenue ?? 0), icon: '🖥️', sub: 'card + cash in-store', color: 'text-terracotta' },
              { label: 'Vouchers Sold', value: formatCurrency(summary.voucherRevenue ?? 0), icon: '🎁', sub: `${summary.vouchersSold ?? 0} vouchers`, color: 'text-sage' },
            ].map(k => (
              <div key={k.label} className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-5">
                <p className="text-2xl mb-2">{k.icon}</p>
                <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
                <p className="text-sm font-medium text-clay-light mt-0.5">{k.label}</p>
                <p className="text-xs text-clay-light/70 mt-1">{k.sub}</p>
              </div>
            ))}
          </div>

          {/* QuickBooks Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-2xl">📊</span>
            <div>
              <p className="font-semibold text-blue-800 text-sm">QuickBooks Export Ready</p>
              <p className="text-blue-700 text-xs mt-1">
                Click <strong>QuickBooks IIF</strong> to download an IIF file you can import directly into QuickBooks Desktop.
                It includes all payments split by account (Stripe Income, Card Terminal Income, Cash Income, Voucher Liability).
                In QuickBooks go to <code className="bg-blue-100 px-1 rounded">File → Utilities → Import → IIF Files</code>.
              </p>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-6">
            <h2 className="font-playfair font-semibold text-xl text-clay mb-5 flex items-center gap-2">
              <TrendingUp size={18} className="text-terracotta" /> Revenue by Day
            </h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={byDay} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `£${v}`} />
                <Tooltip formatter={(v: any) => typeof v === 'number' ? formatCurrency(v) : v} />
                <Legend />
                <Bar dataKey="online" name="Online" fill="#3B82F6" radius={[4,4,0,0]} />
                <Bar dataKey="terminal" name="Terminal" fill="#C17F4B" radius={[4,4,0,0]} />
                <Bar dataKey="inStore" name="In-Store" fill="#6B8F71" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue by Service */}
            <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-6">
              <h2 className="font-playfair font-semibold text-xl text-clay mb-4 flex items-center gap-2">
                <BarChart3 size={18} className="text-terracotta" /> Revenue by Service
              </h2>
              {byService.length === 0 ? (
                <p className="text-clay-light text-sm text-center py-8">No bookings this week.</p>
              ) : (
                <div className="space-y-3">
                  {byService.map((s: any) => (
                    <div key={s.serviceName} className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between mb-1">
                          <p className="text-sm font-medium text-clay truncate">{s.serviceName}</p>
                          <p className="text-sm font-bold text-clay ml-2">{formatCurrency(s.revenue)}</p>
                        </div>
                        <div className="w-full bg-parchment rounded-full h-1.5">
                          <div className="bg-terracotta h-1.5 rounded-full transition-all" style={{ width: `${Math.min(100, (s.revenue / (byService[0]?.revenue || 1)) * 100)}%` }} />
                        </div>
                        <p className="text-xs text-clay-light mt-0.5">{s.bookingCount} bookings</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stock Movement */}
            <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-playfair font-semibold text-xl text-clay flex items-center gap-2">
                  <Package size={18} className="text-terracotta" /> Stock Out
                </h2>
                <button onClick={downloadStockCsv} className="text-xs text-terracotta hover:underline flex items-center gap-1">
                  <Download size={12} /> CSV
                </button>
              </div>
              {stock.length === 0 ? (
                <p className="text-clay-light text-sm text-center py-8">No stock movement this week.</p>
              ) : (
                <div className="space-y-2">
                  {stock.slice(0, 10).map((s: any) => (
                    <div key={s.itemName} className="flex items-center justify-between p-2.5 bg-cream rounded-xl border border-parchment text-sm">
                      <div>
                        <p className="font-medium text-clay">{s.itemName}</p>
                        {s.sku && <p className="text-xs text-clay-light">SKU: {s.sku}</p>}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-clay">×{s.quantitySold}</p>
                        <p className="text-xs text-terracotta">{formatCurrency(s.totalValue)}</p>
                      </div>
                    </div>
                  ))}
                  {stock.length > 10 && <p className="text-xs text-clay-light text-center">+{stock.length - 10} more (download CSV)</p>}
                </div>
              )}
            </div>
          </div>

          {/* Vouchers Sold This Week */}
          {vouchersSold.length > 0 && (
            <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-6">
              <h2 className="font-playfair font-semibold text-xl text-clay mb-4 flex items-center gap-2">
                🎁 Vouchers Sold This Week
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-cream border-b border-parchment">
                    <tr>
                      {['Code', 'Title', 'Sale Price', 'Issued To', 'Purchased By', 'Payment', 'Date'].map(h => (
                        <th key={h} className="text-left px-4 py-2 text-xs font-semibold text-clay-light uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-parchment/50">
                    {vouchersSold.map((v: any) => (
                      <tr key={v.code} className="hover:bg-cream/50">
                        <td className="px-4 py-2 font-mono text-xs font-bold text-terracotta">{v.code}</td>
                        <td className="px-4 py-2 text-clay">{v.title}</td>
                        <td className="px-4 py-2 font-semibold text-clay">{formatCurrency(v.salePrice)}</td>
                        <td className="px-4 py-2 text-clay-light">{v.issuedToName ?? '—'}</td>
                        <td className="px-4 py-2 text-clay-light">{v.purchasedByName ?? '—'}</td>
                        <td className="px-4 py-2"><span className="px-2 py-0.5 rounded-full text-xs bg-clay/10 text-clay">{v.paymentMethod}</span></td>
                        <td className="px-4 py-2 text-clay-light text-xs">{new Date(v.createdAt).toLocaleDateString('en-GB')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
