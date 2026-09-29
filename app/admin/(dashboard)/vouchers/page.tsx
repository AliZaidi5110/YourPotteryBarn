'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Gift, Plus, Search, CheckCircle, XCircle, Loader2, Tag, Download, RefreshCw } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Voucher {
  id: string
  code: string
  type: 'MONETARY' | 'EXPERIENCE'
  title: string
  initialValue: number
  remainingValue: number
  salePrice: number
  issuedToName?: string
  issuedToEmail?: string
  purchasedByName?: string
  paymentMethod?: string
  expiryDate?: string
  active: boolean
  redeemedAt?: string
  notes?: string
  createdAt: string
}

const VOUCHER_TEMPLATES = [
  { title: 'Paint a Pot for 1', value: 18, desc: 'Single adult session' },
  { title: 'Paint a Pot for 2', value: 36, desc: 'Two adults together' },
  { title: 'Family Pottery Session', value: 55, desc: 'Up to 4 people' },
  { title: 'Throwing Taster for 1', value: 25, desc: 'Wheel throwing taster' },
  { title: 'Monetary Voucher — £20', value: 20, desc: 'Spend on anything' },
  { title: 'Monetary Voucher — £50', value: 50, desc: 'Spend on anything' },
]

export default function VouchersPage() {
  const qc = useQueryClient()
  const [q, setQ] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  // Form state
  const [form, setForm] = useState({
    type: 'MONETARY' as 'MONETARY' | 'EXPERIENCE',
    title: '',
    initialValue: 20,
    salePrice: 20,
    issuedToName: '',
    issuedToEmail: '',
    purchasedByName: '',
    paymentMethod: 'CASH' as 'CASH' | 'CARD' | 'ONLINE',
    expiryMonths: 12,
    notes: '',
  })

  const { data, isLoading, refetch } = useQuery<{ vouchers: Voucher[]; stats: any }>({
    queryKey: ['vouchers', q, statusFilter],
    queryFn: async () => {
      const p = new URLSearchParams()
      if (q) p.set('q', q)
      if (statusFilter) p.set('status', statusFilter)
      const res = await fetch(`/api/vouchers?${p}`)
      return res.json()
    },
  })

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/vouchers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      return res.json()
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['vouchers'] })
      setShowCreate(false)
      // Reset form
      setForm(prev => ({ ...prev, issuedToName: '', issuedToEmail: '', purchasedByName: '', notes: '' }))
      // Show the generated code
      alert(`✅ Voucher created!\n\nCode: ${data.voucher.code}\n\nGive this code to the customer.`)
    },
    onError: (err: any) => alert(`Error: ${err.message}`),
  })

  function applyTemplate(t: typeof VOUCHER_TEMPLATES[0]) {
    setForm(prev => ({ ...prev, title: t.title, initialValue: t.value, salePrice: t.value }))
  }

  function exportCsv() {
    const vouchers = data?.vouchers ?? []
    const rows = [
      ['Code', 'Title', 'Type', 'Initial Value', 'Remaining', 'Sale Price', 'Issued To', 'Purchased By', 'Payment', 'Expiry', 'Status', 'Redeemed At', 'Created'],
      ...vouchers.map(v => [
        v.code, v.title, v.type,
        Number(v.initialValue).toFixed(2), Number(v.remainingValue).toFixed(2), Number(v.salePrice).toFixed(2),
        v.issuedToName ?? '', v.purchasedByName ?? '', v.paymentMethod ?? '',
        v.expiryDate ? new Date(v.expiryDate).toLocaleDateString('en-GB') : '',
        v.active ? (v.redeemedAt ? 'Redeemed' : 'Active') : 'Inactive',
        v.redeemedAt ? new Date(v.redeemedAt).toLocaleDateString('en-GB') : '',
        new Date(v.createdAt).toLocaleDateString('en-GB'),
      ]),
    ]
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'vouchers.csv' })
    a.click()
  }

  const vouchers = data?.vouchers ?? []
  const totalSold = vouchers.length
  const totalRevenue = vouchers.reduce((s, v) => s + Number(v.salePrice ?? v.initialValue), 0)
  const totalOutstanding = vouchers.filter(v => v.active && !v.redeemedAt).reduce((s, v) => s + Number(v.remainingValue), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-clay">Vouchers</h1>
          <p className="text-clay-light mt-1">Sell vouchers in-studio and track redemptions at checkout.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => refetch()} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-parchment text-clay-light hover:border-terracotta hover:text-terracotta text-sm transition-all">
            <RefreshCw size={15} /> Refresh
          </button>
          <button onClick={exportCsv} className="btn-secondary flex items-center gap-2 py-2.5 text-sm">
            <Download size={15} /> Export
          </button>
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2 py-2.5 text-sm">
            <Plus size={16} /> Sell Voucher
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Vouchers Sold', value: String(totalSold), icon: '🎁', sub: 'all time' },
          { label: 'Revenue Taken', value: formatCurrency(totalRevenue), icon: '💷', sub: 'from voucher sales' },
          { label: 'Outstanding Balance', value: formatCurrency(totalOutstanding), icon: '⏳', sub: 'unredeemed value' },
        ].map(s => (
          <div key={s.label} className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-5">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-2xl font-bold text-clay">{s.value}</p>
            <p className="text-sm font-medium text-clay-light mt-0.5">{s.label}</p>
            <p className="text-xs text-clay-light/70 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-5 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-clay-light" />
          <input
            type="text"
            placeholder="Search code, name, email..."
            value={q}
            onChange={e => setQ(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-parchment rounded-xl text-clay text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/20"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-parchment rounded-xl px-3 py-2 text-clay text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/20"
        >
          <option value="">All vouchers</option>
          <option value="active">Active only</option>
          <option value="redeemed">Redeemed</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-clay-light">
            <Loader2 size={24} className="animate-spin mr-2" /> Loading vouchers...
          </div>
        ) : vouchers.length === 0 ? (
          <div className="text-center py-16 text-clay-light">
            <Gift size={40} className="mx-auto mb-3 opacity-20" />
            <p>No vouchers found.</p>
            <button onClick={() => setShowCreate(true)} className="btn-primary mt-4 text-sm py-2 px-4">Sell your first voucher</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream border-b border-parchment">
                <tr>
                  {['Code', 'Title', 'Value', 'Remaining', 'Issued To', 'Sold By', 'Payment', 'Expiry', 'Status'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-clay-light uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-parchment/50">
                {vouchers.map(v => {
                  const isExpired = v.expiryDate && new Date(v.expiryDate) < new Date()
                  const isRedeemed = !!v.redeemedAt
                  return (
                    <tr key={v.id} className="hover:bg-cream/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-bold text-terracotta whitespace-nowrap">{v.code}</td>
                      <td className="px-4 py-3 text-clay">{v.title}</td>
                      <td className="px-4 py-3 font-semibold text-clay">{formatCurrency(Number(v.initialValue))}</td>
                      <td className="px-4 py-3 font-semibold text-sage">{formatCurrency(Number(v.remainingValue))}</td>
                      <td className="px-4 py-3 text-clay-light">{v.issuedToName ?? '—'}</td>
                      <td className="px-4 py-3 text-clay-light">{v.purchasedByName ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-clay/10 text-clay">{v.paymentMethod ?? '—'}</span>
                      </td>
                      <td className="px-4 py-3 text-clay-light whitespace-nowrap text-xs">
                        {v.expiryDate ? new Date(v.expiryDate).toLocaleDateString('en-GB') : '—'}
                      </td>
                      <td className="px-4 py-3">
                        {isRedeemed ? (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-sage/10 text-sage flex items-center gap-1 w-fit">
                            <CheckCircle size={10} /> Redeemed
                          </span>
                        ) : isExpired ? (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600 flex items-center gap-1 w-fit">
                            <XCircle size={10} /> Expired
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 w-fit block">Active</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Voucher Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={e => e.target === e.currentTarget && setShowCreate(false)}>
          <div className="bg-warm-white rounded-2xl shadow-pottery-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-parchment flex items-center justify-between">
              <h2 className="font-playfair text-xl font-bold text-clay flex items-center gap-2">
                <Gift size={20} className="text-terracotta" /> Sell a Voucher
              </h2>
              <button onClick={() => setShowCreate(false)} className="text-clay-light hover:text-clay"><XCircle size={20} /></button>
            </div>

            <div className="p-6 space-y-5">
              {/* Quick templates */}
              <div>
                <p className="text-xs text-clay-light font-medium mb-2 uppercase tracking-wide">Quick Templates</p>
                <div className="grid grid-cols-2 gap-2">
                  {VOUCHER_TEMPLATES.map(t => (
                    <button
                      key={t.title}
                      onClick={() => applyTemplate(t)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition-all ${form.title === t.title ? 'border-terracotta bg-terracotta/5 text-clay' : 'border-parchment hover:border-terracotta/50 text-clay-light'}`}
                    >
                      <p className="font-semibold text-clay text-xs">{t.title}</p>
                      <p className="text-clay-light">{t.desc} · {formatCurrency(t.value)}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-parchment pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-clay-light mb-1 font-medium">Voucher Title *</label>
                    <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                      className="w-full border border-parchment rounded-xl px-3 py-2 text-clay text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/20" placeholder="e.g. Paint a Pot for 2" />
                  </div>
                  <div>
                    <label className="block text-xs text-clay-light mb-1 font-medium">Type</label>
                    <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as any }))}
                      className="w-full border border-parchment rounded-xl px-3 py-2 text-clay text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/20">
                      <option value="MONETARY">Monetary (cash value)</option>
                      <option value="EXPERIENCE">Experience (specific session)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-clay-light mb-1 font-medium">Face Value (£) *</label>
                    <input type="number" step="0.01" min="1" value={form.initialValue}
                      onChange={e => setForm(p => ({ ...p, initialValue: Number(e.target.value) }))}
                      className="w-full border border-parchment rounded-xl px-3 py-2 text-clay text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/20" />
                  </div>
                  <div>
                    <label className="block text-xs text-clay-light mb-1 font-medium">Sale Price (£)</label>
                    <input type="number" step="0.01" min="1" value={form.salePrice}
                      onChange={e => setForm(p => ({ ...p, salePrice: Number(e.target.value) }))}
                      className="w-full border border-parchment rounded-xl px-3 py-2 text-clay text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/20" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-clay-light mb-1 font-medium">Issued To (recipient name)</label>
                    <input value={form.issuedToName} onChange={e => setForm(p => ({ ...p, issuedToName: e.target.value }))}
                      className="w-full border border-parchment rounded-xl px-3 py-2 text-clay text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/20" placeholder="Recipient's name" />
                  </div>
                  <div>
                    <label className="block text-xs text-clay-light mb-1 font-medium">Recipient Email</label>
                    <input type="email" value={form.issuedToEmail} onChange={e => setForm(p => ({ ...p, issuedToEmail: e.target.value }))}
                      className="w-full border border-parchment rounded-xl px-3 py-2 text-clay text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/20" placeholder="Optional" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-clay-light mb-1 font-medium">Purchased By</label>
                    <input value={form.purchasedByName} onChange={e => setForm(p => ({ ...p, purchasedByName: e.target.value }))}
                      className="w-full border border-parchment rounded-xl px-3 py-2 text-clay text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/20" placeholder="Buyer's name" />
                  </div>
                  <div>
                    <label className="block text-xs text-clay-light mb-1 font-medium">Payment Method</label>
                    <select value={form.paymentMethod} onChange={e => setForm(p => ({ ...p, paymentMethod: e.target.value as any }))}
                      className="w-full border border-parchment rounded-xl px-3 py-2 text-clay text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/20">
                      <option value="CASH">Cash</option>
                      <option value="CARD">Card (terminal)</option>
                      <option value="ONLINE">Online</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-clay-light mb-1 font-medium">Valid for (months)</label>
                    <select value={form.expiryMonths} onChange={e => setForm(p => ({ ...p, expiryMonths: Number(e.target.value) }))}
                      className="w-full border border-parchment rounded-xl px-3 py-2 text-clay text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/20">
                      {[3,6,12,18,24].map(m => <option key={m} value={m}>{m} months</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-clay-light mb-1 font-medium">Notes</label>
                    <input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                      className="w-full border border-parchment rounded-xl px-3 py-2 text-clay text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/20" placeholder="Optional note" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="btn-secondary flex-1 py-3">Cancel</button>
                <button
                  onClick={() => createMutation.mutate()}
                  disabled={createMutation.isPending || !form.title}
                  className="btn-primary flex-1 py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {createMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Tag size={16} />}
                  Issue Voucher
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
