'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { CreditCard, Download, RefreshCw, Loader2 } from 'lucide-react'

const CHANNEL_COLORS: Record<string, string> = {
  ONLINE: 'bg-blue-50 text-blue-700',
  TERMINAL: 'bg-terracotta/10 text-terracotta',
}

const STATUS_COLORS: Record<string, string> = {
  SUCCEEDED: 'bg-sage/10 text-sage',
  PENDING: 'bg-amber-50 text-amber-700',
  FAILED: 'bg-red-50 text-red-600',
  REFUNDED: 'bg-gray-100 text-gray-600',
  VOIDED: 'bg-gray-100 text-gray-600',
}

export default function PaymentsPage() {
  const [dateFilter, setDateFilter] = useState('')
  const [channelFilter, setChannelFilter] = useState('')

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['payments', dateFilter, channelFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (dateFilter) params.set('date', dateFilter)
      if (channelFilter) params.set('channel', channelFilter)
      const res = await fetch(`/api/payments?${params}`)
      return res.json()
    },
  })

  const payments = data?.payments ?? []
  const todayTotals: Array<{ channel: string; _sum: { amount: number | null }; _count: number }> = data?.todayTotals ?? []

  const totalOnline = todayTotals.find(t => t.channel === 'ONLINE')?._sum.amount ?? 0
  const totalTerminal = todayTotals.find(t => t.channel === 'TERMINAL')?._sum.amount ?? 0

  function exportCsv() {
    const rows = [
      ['Date', 'Booking Ref', 'Customer', 'Service', 'Amount', 'Channel', 'Provider', 'Status', 'Transaction ID'],
      ...payments.map((p: any) => [
        new Date(p.createdAt).toLocaleString('en-GB'),
        p.booking?.bookingRef ?? '',
        p.booking?.customer?.name ?? '',
        p.booking?.service?.name ?? '',
        Number(p.amount).toFixed(2),
        p.channel,
        p.provider,
        p.status,
        p.providerTxnId ?? '',
      ]),
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `payments-${dateFilter || 'all'}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-clay">Payments & Reconciliation</h1>
          <p className="text-clay-light mt-1">Full transaction log — online and terminal combined.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => refetch()} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-parchment text-clay-light hover:border-terracotta hover:text-terracotta text-sm transition-all">
            <RefreshCw size={15} /> Refresh
          </button>
          <button onClick={exportCsv} className="btn-secondary flex items-center gap-2 py-2.5 text-sm">
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* Today's Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-5">
          <p className="text-xs text-clay-light uppercase tracking-wide mb-1">Online (Stripe)</p>
          <p className="text-2xl font-bold text-blue-700">{formatCurrency(totalOnline)}</p>
          <p className="text-xs text-clay-light">today</p>
        </div>
        <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-5">
          <p className="text-xs text-clay-light uppercase tracking-wide mb-1">Terminal (Shift4)</p>
          <p className="text-2xl font-bold text-terracotta">{formatCurrency(totalTerminal)}</p>
          <p className="text-xs text-clay-light">today</p>
        </div>
        <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-5">
          <p className="text-xs text-clay-light uppercase tracking-wide mb-1">Combined Today</p>
          <p className="text-2xl font-bold text-clay">{formatCurrency(Number(totalOnline) + Number(totalTerminal))}</p>
          <p className="text-xs text-clay-light">all channels</p>
        </div>
        <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-5">
          <p className="text-xs text-clay-light uppercase tracking-wide mb-1">Transactions</p>
          <p className="text-2xl font-bold text-clay">{payments.length}</p>
          <p className="text-xs text-clay-light">in this view</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-5">
        <div className="flex flex-wrap gap-4">
          <div>
            <label htmlFor="date-filter" className="block text-xs text-clay-light mb-1 font-medium">Date</label>
            <input
              id="date-filter"
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="border border-parchment rounded-xl px-3 py-2 text-clay text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta"
            />
          </div>
          <div>
            <label htmlFor="channel-filter" className="block text-xs text-clay-light mb-1 font-medium">Channel</label>
            <select
              id="channel-filter"
              value={channelFilter}
              onChange={e => setChannelFilter(e.target.value)}
              className="border border-parchment rounded-xl px-3 py-2 text-clay text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta"
            >
              <option value="">All channels</option>
              <option value="ONLINE">Online (Stripe)</option>
              <option value="TERMINAL">Terminal (Shift4)</option>
            </select>
          </div>
          {(dateFilter || channelFilter) && (
            <div className="flex items-end">
              <button onClick={() => { setDateFilter(''); setChannelFilter('') }} className="text-sm text-terracotta hover:underline">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-clay-light">
            <Loader2 size={24} className="animate-spin mr-2" /> Loading payments...
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-16 text-clay-light">
            <CreditCard size={40} className="mx-auto mb-3 opacity-20" />
            <p>No transactions found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream border-b border-parchment">
                <tr>
                  {['Date & Time', 'Booking', 'Customer', 'Service', 'Amount', 'Channel', 'Status', 'Transaction ID'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-clay-light uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-parchment/50">
                {payments.map((payment: any) => (
                  <tr key={payment.id} className="hover:bg-cream/50 transition-colors">
                    <td className="px-4 py-3 text-clay-light whitespace-nowrap">
                      {new Date(payment.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-clay whitespace-nowrap">
                      {payment.booking?.bookingRef ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-clay whitespace-nowrap">
                      {payment.booking?.customer?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-clay-light max-w-[160px] truncate">
                      {payment.booking?.service?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3 font-semibold text-clay whitespace-nowrap">
                      {formatCurrency(Number(payment.amount))}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${CHANNEL_COLORS[payment.channel] ?? 'bg-gray-100 text-gray-600'}`}>
                        {payment.channel === 'ONLINE' ? '🌐 Online' : '🖥️ Terminal'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[payment.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-clay-light max-w-[140px] truncate">
                      {payment.providerTxnId ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
