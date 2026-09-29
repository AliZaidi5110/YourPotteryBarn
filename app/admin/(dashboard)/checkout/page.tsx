'use client'

import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, Plus, Loader2, CreditCard, CheckCircle, XCircle, AlertCircle, RefreshCw, Printer, Minus, Calendar, Users, Tag, Banknote, SplitSquareHorizontal } from 'lucide-react'
import { formatCurrency, formatDate, formatTime } from '@/lib/utils'

interface BookingWithDetails {
  id: string
  bookingRef: string
  status: string
  seats: number
  totalAmount: number
  amountPaid: number
  creditApplied: number
  customer: { id: string; name: string; email: string; phone?: string }
  service: { id: string; name: string; price: number }
  slot: { date: string; startTime: string; endTime: string }
  bookingAddons: Array<{ id: string; quantity: number; unitPrice: number; addon: { id: string; name: string; price: number } }>
  payments: Array<{ id: string; amount: number; channel: string; provider: string; status: string; createdAt: string; providerTxnId?: string }>
}

interface Addon { id: string; name: string; price: number; category: string }
interface SplitEntry { personName: string; amount: string }

type PaymentTab = 'full' | 'split' | 'voucher'
type TerminalState = 'idle' | 'processing' | 'approved' | 'declined'

export default function CheckoutPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null)
  const [extraAddons, setExtraAddons] = useState<Record<string, number>>({})
  const [paymentTab, setPaymentTab] = useState<PaymentTab>('full')

  // Full payment state
  const [terminalState, setTerminalState] = useState<TerminalState>('idle')
  const [terminalResult, setTerminalResult] = useState<any>(null)

  // Split payment state
  const [splits, setSplits] = useState<SplitEntry[]>([])
  const [splitsSaved, setSplitsSaved] = useState(false)
  const [activeSplitIndex, setActiveSplitIndex] = useState<number | null>(null)
  const [splitTerminalState, setSplitTerminalState] = useState<TerminalState>('idle')

  // Voucher state
  const [voucherCode, setVoucherCode] = useState('')
  const [voucherInfo, setVoucherInfo] = useState<any>(null)
  const [voucherError, setVoucherError] = useState('')
  const [voucherValidating, setVoucherValidating] = useState(false)

  const qc = useQueryClient()

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ['checkout-search', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return []
      const res = await fetch(`/api/bookings?ref=${encodeURIComponent(searchQuery)}`)
      const data = await res.json()
      return data.bookings ?? []
    },
    enabled: searchQuery.length >= 3,
  })

  const { data: addons = [] } = useQuery<Addon[]>({
    queryKey: ['addons'],
    queryFn: () => fetch('/api/services/addons').then(r => r.json()),
  })

  const extraAddonTotal = Object.entries(extraAddons).reduce((sum, [id, qty]) => {
    const addon = addons.find(a => a.id === id)
    return sum + (addon ? addon.price * qty : 0)
  }, 0)

  const amountDue = selectedBooking
    ? Math.max(0, Number(selectedBooking.totalAmount) + extraAddonTotal - Number(selectedBooking.amountPaid))
    : 0

  // Full terminal payment
  const terminalMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/payments/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: selectedBooking!.id, amountPence: Math.round(amountDue * 100) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Payment failed')
      return data
    },
    onMutate: () => setTerminalState('processing'),
    onSuccess: (data) => { setTerminalState('approved'); setTerminalResult(data); qc.invalidateQueries({ queryKey: ['checkout-search'] }) },
    onError: (err: any) => { setTerminalState('declined'); setTerminalResult({ error: err.message }) },
  })

  // Save splits
  const saveSplitsMutation = useMutation({
    mutationFn: async () => {
      const validSplits = splits.filter(s => s.personName && Number(s.amount) > 0)
      const res = await fetch(`/api/bookings/${selectedBooking!.id}/split-payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ splits: validSplits.map(s => ({ personName: s.personName, amount: Number(s.amount) })) }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      return res.json()
    },
    onSuccess: () => setSplitsSaved(true),
    onError: (err: any) => alert(`Error saving splits: ${err.message}`),
  })

  // Pay a split (terminal or cash)
  const paySplitMutation = useMutation({
    mutationFn: async ({ splitId, provider }: { splitId: string; provider: string }) => {
      const res = await fetch(`/api/bookings/${selectedBooking!.id}/split-payments/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ splitId, provider, channel: provider === 'CASH' ? 'IN_STORE' : 'TERMINAL' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Payment failed')
      return data
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['split-data', selectedBooking?.id] }); qc.invalidateQueries({ queryKey: ['checkout-search'] }) },
    onError: (err: any) => alert(`Payment failed: ${err.message}`),
  })

  // Fetch split data
  const { data: splitData, refetch: refetchSplits } = useQuery({
    queryKey: ['split-data', selectedBooking?.id],
    queryFn: async () => {
      const res = await fetch(`/api/bookings/${selectedBooking!.id}/split-payments`)
      return res.json()
    },
    enabled: !!selectedBooking && paymentTab === 'split',
  })

  async function validateVoucher() {
    setVoucherValidating(true)
    setVoucherError('')
    setVoucherInfo(null)
    try {
      const res = await fetch(`/api/vouchers/validate?code=${encodeURIComponent(voucherCode.trim())}`)
      const data = await res.json()
      if (data.valid) setVoucherInfo(data.voucher)
      else setVoucherError(data.error)
    } finally {
      setVoucherValidating(false)
    }
  }

  const redeemVoucherMutation = useMutation({
    mutationFn: async () => {
      // Redeem against full booking as a payment record
      const amount = Math.min(Number(voucherInfo.remainingValue), amountDue)
      // We create a split for this amount then pay it via voucher
      const createSplit = await fetch(`/api/bookings/${selectedBooking!.id}/split-payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ splits: [{ personName: `Voucher ${voucherCode}`, amount }] }),
      })
      const { splits: [{ id }] } = await (await fetch(`/api/bookings/${selectedBooking!.id}/split-payments`)).json()
      // Find the split we just created
      const splitListRes = await fetch(`/api/bookings/${selectedBooking!.id}/split-payments`)
      const splitList = await splitListRes.json()
      const latestSplit = splitList.splitPayments?.find((s: any) => s.status === 'PENDING')
      if (!latestSplit) throw new Error('Could not find split to pay')
      const res = await fetch(`/api/bookings/${selectedBooking!.id}/split-payments/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ splitId: latestSplit.id, provider: 'VOUCHER', channel: 'IN_STORE', voucherCode }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['checkout-search'] })
      setVoucherInfo(null)
      setVoucherCode('')
      alert('✅ Voucher redeemed successfully!')
    },
    onError: (err: any) => alert(`Voucher redemption failed: ${err.message}`),
  })

  function handleSelectBooking(booking: BookingWithDetails) {
    setSelectedBooking(booking)
    setExtraAddons({})
    setTerminalState('idle')
    setTerminalResult(null)
    setSplits(Array.from({ length: booking.seats }, (_, i) => ({ personName: `Person ${i + 1}`, amount: (Number(booking.totalAmount) / booking.seats).toFixed(2) })))
    setSplitsSaved(false)
    setVoucherCode('')
    setVoucherInfo(null)
    setVoucherError('')
  }

  function autoEqualSplit() {
    if (!selectedBooking || splits.length === 0) return
    const perPerson = (amountDue / splits.length).toFixed(2)
    setSplits(splits.map(s => ({ ...s, amount: perPerson })))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-clay">POS Checkout</h1>
          <p className="text-clay-light mt-1">Search for a booking to process payment, split bills, or redeem vouchers.</p>
        </div>
        <a href="/admin/calendar" className="btn-secondary flex items-center gap-2 py-2.5 text-sm self-start sm:self-auto">
          <Calendar size={16} /> Open Operations Calendar
        </a>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left: Booking Search + Addons */}
        <div className="space-y-4">
          <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-5">
            <h2 className="font-semibold text-clay mb-4 flex items-center gap-2">
              <Search size={18} className="text-terracotta" /> Find Booking
            </h2>
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-clay-light" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by booking ref, name, or email..."
                className="w-full pl-10 pr-4 py-3 border border-parchment rounded-xl text-clay text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta"
              />
            </div>

            {searchLoading && (
              <div className="mt-3 flex items-center gap-2 text-clay-light text-sm">
                <Loader2 size={14} className="animate-spin" /> Searching...
              </div>
            )}

            {searchResults && searchResults.length > 0 && (
              <div className="mt-3 space-y-2">
                {searchResults.map((booking: BookingWithDetails) => (
                  <button
                    key={booking.id}
                    onClick={() => handleSelectBooking(booking)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${selectedBooking?.id === booking.id ? 'border-terracotta bg-terracotta/5' : 'border-parchment hover:border-terracotta/50 bg-cream'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-clay text-sm">{booking.customer.name}</p>
                        <p className="text-clay-light text-xs">{booking.service.name} · {booking.seats} seats</p>
                        <p className="text-terracotta text-xs font-mono mt-1">{booking.bookingRef}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-clay text-sm">{formatCurrency(Number(booking.totalAmount))}</p>
                        <StatusBadge status={booking.status} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {searchResults?.length === 0 && searchQuery.length >= 3 && !searchLoading && (
              <p className="mt-3 text-clay-light text-sm text-center py-4">No bookings found for &quot;{searchQuery}&quot;</p>
            )}
          </div>

          {selectedBooking && (
            <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-5">
              <h2 className="font-semibold text-clay mb-4">Add last-minute extras</h2>
              <div className="space-y-2">
                {addons.map(addon => {
                  const qty = extraAddons[addon.id] ?? 0
                  return (
                    <div key={addon.id} className={`flex items-center justify-between p-2.5 rounded-xl border text-sm ${qty > 0 ? 'border-terracotta/20 bg-terracotta/5' : 'border-parchment'}`}>
                      <div>
                        <p className="font-medium text-clay">{addon.name}</p>
                        <p className="text-terracotta text-xs">{formatCurrency(addon.price)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {qty > 0 && (
                          <>
                            <button onClick={() => setExtraAddons(p => { const u = { ...p }; if ((u[addon.id] ?? 0) <= 1) delete u[addon.id]; else u[addon.id]--; return u })}
                              className="w-6 h-6 rounded-full bg-parchment text-clay hover:bg-terracotta hover:text-warm-white transition-all flex items-center justify-center">
                              <Minus size={10} />
                            </button>
                            <span className="w-4 text-center font-bold text-clay text-xs">{qty}</span>
                          </>
                        )}
                        <button onClick={() => setExtraAddons(p => ({ ...p, [addon.id]: (p[addon.id] ?? 0) + 1 }))}
                          className={`w-6 h-6 rounded-full transition-all flex items-center justify-center ${qty > 0 ? 'bg-terracotta text-warm-white' : 'bg-parchment text-clay hover:bg-terracotta hover:text-warm-white'}`}>
                          <Plus size={10} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: Payment Panel */}
        <div>
          {!selectedBooking ? (
            <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-8 text-center text-clay-light h-full flex flex-col items-center justify-center">
              <Search size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-playfair text-xl text-clay mb-2">No booking selected</p>
              <p className="text-sm">Search for a booking reference or customer name to begin checkout.</p>
            </div>
          ) : (
            <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-6 space-y-5">
              {/* Booking details */}
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h2 className="font-playfair font-bold text-xl text-clay">{selectedBooking.customer.name}</h2>
                  <span className="font-mono text-xs bg-parchment text-clay px-2 py-1 rounded">{selectedBooking.bookingRef}</span>
                </div>
                <p className="text-clay-light text-sm">{selectedBooking.service.name}</p>
                <p className="text-clay-light text-xs">
                  {formatDate(new Date(selectedBooking.slot.date))} · {formatTime(selectedBooking.slot.startTime)} · {selectedBooking.seats} seat{selectedBooking.seats !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Amount breakdown */}
              <div className="bg-cream rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between text-clay">
                  <span>Service total</span>
                  <span>{formatCurrency(Number(selectedBooking.service.price) * selectedBooking.seats)}</span>
                </div>
                {selectedBooking.bookingAddons.map(ba => (
                  <div key={ba.id} className="flex justify-between text-clay-light">
                    <span>{ba.addon.name} ×{ba.quantity}</span>
                    <span>{formatCurrency(Number(ba.unitPrice) * ba.quantity)}</span>
                  </div>
                ))}
                {Object.entries(extraAddons).map(([addonId, qty]) => {
                  const addon = addons.find(a => a.id === addonId)
                  if (!addon) return null
                  return (
                    <div key={addonId} className="flex justify-between text-terracotta">
                      <span>+ {addon.name} ×{qty}</span>
                      <span>{formatCurrency(addon.price * qty)}</span>
                    </div>
                  )
                })}
                <div className="border-t border-parchment pt-2 flex justify-between text-clay-light">
                  <span>Already paid</span>
                  <span>−{formatCurrency(Number(selectedBooking.amountPaid))}</span>
                </div>
                <div className="flex justify-between font-bold text-clay text-base">
                  <span>Amount due</span>
                  <span className="text-terracotta text-xl">{formatCurrency(amountDue)}</span>
                </div>
              </div>

              {/* Payment type tabs */}
              {amountDue > 0 && (
                <>
                  <div className="flex rounded-xl border border-parchment overflow-hidden">
                    {([
                      { key: 'full', label: 'Full Payment', icon: <CreditCard size={14} /> },
                      { key: 'split', label: 'Split Bill', icon: <SplitSquareHorizontal size={14} /> },
                      { key: 'voucher', label: 'Voucher', icon: <Tag size={14} /> },
                    ] as { key: PaymentTab; label: string; icon: React.ReactNode }[]).map(tab => (
                      <button
                        key={tab.key}
                        onClick={() => setPaymentTab(tab.key)}
                        className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${paymentTab === tab.key ? 'bg-terracotta text-warm-white' : 'text-clay-light hover:text-clay hover:bg-cream'}`}
                      >
                        {tab.icon} {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Full Payment */}
                  {paymentTab === 'full' && (
                    <div className="space-y-3">
                      {terminalState === 'idle' && (
                        <button onClick={() => terminalMutation.mutate()} disabled={amountDue <= 0}
                          className="btn-primary w-full py-5 text-lg flex items-center justify-center gap-3 disabled:opacity-50">
                          <CreditCard size={22} /> PAY — {formatCurrency(amountDue)}
                        </button>
                      )}
                      {terminalState === 'processing' && (
                        <div className="text-center py-6 space-y-3">
                          <div className="w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center mx-auto animate-pulse">
                            <CreditCard size={28} className="text-terracotta animate-pulse" />
                          </div>
                          <p className="font-semibold text-clay text-lg">Waiting for card...</p>
                          <p className="text-clay-light text-sm">Ask the customer to tap or insert their card.</p>
                        </div>
                      )}
                      {terminalState === 'approved' && (
                        <div className="text-center py-6 space-y-3">
                          <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center mx-auto">
                            <CheckCircle size={32} className="text-sage" />
                          </div>
                          <p className="font-bold text-clay text-xl">Payment Approved!</p>
                          {terminalResult && (
                            <div className="bg-sage/10 rounded-xl p-4 text-sm text-sage space-y-1 text-left">
                              <p>✓ Card: {terminalResult.cardBrand ?? 'Card'} ****{terminalResult.cardLast4}</p>
                              <p>✓ Auth: {terminalResult.authCode}</p>
                            </div>
                          )}
                          <div className="flex gap-3 mt-4">
                            <button className="btn-secondary flex-1 py-3 flex items-center justify-center gap-2" onClick={() => window.print()}>
                              <Printer size={16} /> Print
                            </button>
                            <button className="btn-primary flex-1 py-3" onClick={() => { setSelectedBooking(null); setSearchQuery(''); setTerminalState('idle'); setTerminalResult(null) }}>
                              New transaction
                            </button>
                          </div>
                        </div>
                      )}
                      {terminalState === 'declined' && (
                        <div className="text-center py-6 space-y-3">
                          <XCircle size={40} className="mx-auto text-red-500" />
                          <p className="font-bold text-clay">Payment Declined</p>
                          <p className="text-red-600 text-sm bg-red-50 rounded-xl px-4 py-3">{terminalResult?.error}</p>
                          <button onClick={() => { setTerminalState('idle'); setTerminalResult(null) }} className="btn-primary w-full py-3">Try Again</button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Split Payment */}
                  {paymentTab === 'split' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-clay">Split {formatCurrency(amountDue)} between:</p>
                        <div className="flex gap-2">
                          <button onClick={() => setSplits(s => [...s, { personName: `Person ${s.length + 1}`, amount: '' }])}
                            className="text-xs text-terracotta hover:underline flex items-center gap-1"><Plus size={12} /> Add person</button>
                          <button onClick={autoEqualSplit} className="text-xs text-clay-light hover:text-clay hover:underline">Equal split</button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {splits.map((split, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <input value={split.personName} onChange={e => setSplits(s => s.map((x, j) => j === i ? { ...x, personName: e.target.value } : x))}
                              className="flex-1 border border-parchment rounded-xl px-3 py-2 text-clay text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/20" placeholder="Name" />
                            <div className="relative w-28">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-clay-light text-sm">£</span>
                              <input type="number" step="0.01" value={split.amount} onChange={e => setSplits(s => s.map((x, j) => j === i ? { ...x, amount: e.target.value } : x))}
                                className="w-full pl-7 pr-3 py-2 border border-parchment rounded-xl text-clay text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/20" />
                            </div>
                            {splits.length > 1 && (
                              <button onClick={() => setSplits(s => s.filter((_, j) => j !== i))} className="text-clay-light hover:text-red-500 transition-colors"><XCircle size={16} /></button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Split total check */}
                      {(() => {
                        const splitTotal = splits.reduce((s, x) => s + (Number(x.amount) || 0), 0)
                        const diff = Math.abs(splitTotal - amountDue)
                        return diff > 0.01 ? (
                          <div className="flex items-center gap-2 text-amber-700 text-xs bg-amber-50 rounded-xl px-3 py-2">
                            <AlertCircle size={14} /> Splits total {formatCurrency(splitTotal)} — {splitTotal < amountDue ? `${formatCurrency(diff)} short` : `${formatCurrency(diff)} over`}
                          </div>
                        ) : null
                      })()}

                      {!splitsSaved ? (
                        <button onClick={() => saveSplitsMutation.mutate()} disabled={saveSplitsMutation.isPending || splits.some(s => !s.personName || !s.amount)}
                          className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50">
                          {saveSplitsMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Users size={16} />}
                          Save Split & Collect Individually
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-sm text-sage font-medium flex items-center gap-2"><CheckCircle size={14} /> Splits saved — collect each payment:</p>
                          {(splitData?.splitPayments ?? []).map((sp: any, i: number) => (
                            <div key={sp.id} className={`p-3 rounded-xl border ${sp.status === 'SUCCEEDED' ? 'border-sage/30 bg-sage/5' : 'border-parchment bg-cream'}`}>
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <p className="font-semibold text-clay text-sm">{sp.personName}</p>
                                  <p className="text-terracotta text-sm font-bold">{formatCurrency(Number(sp.amount))}</p>
                                </div>
                                {sp.status === 'SUCCEEDED' ? (
                                  <span className="flex items-center gap-1 text-sage text-xs font-medium"><CheckCircle size={14} /> Paid</span>
                                ) : (
                                  <div className="flex gap-2">
                                    <button onClick={() => paySplitMutation.mutate({ splitId: sp.id, provider: 'CASH' })}
                                      disabled={paySplitMutation.isPending}
                                      className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border border-parchment hover:border-sage hover:text-sage transition-all text-clay-light">
                                      <Banknote size={12} /> Cash
                                    </button>
                                    <button onClick={() => paySplitMutation.mutate({ splitId: sp.id, provider: 'SHIFT4' })}
                                      disabled={paySplitMutation.isPending}
                                      className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-terracotta text-white hover:bg-terracotta/90 transition-all">
                                      <CreditCard size={12} /> Card
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Voucher Redemption */}
                  {paymentTab === 'voucher' && (
                    <div className="space-y-4">
                      <p className="text-sm text-clay-light">Enter a voucher code to redeem against this booking.</p>
                      <div className="flex gap-2">
                        <input
                          value={voucherCode}
                          onChange={e => { setVoucherCode(e.target.value.toUpperCase()); setVoucherInfo(null); setVoucherError('') }}
                          placeholder="YPB-XXXX-XXXX"
                          className="flex-1 border border-parchment rounded-xl px-3 py-2.5 text-clay text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/20 font-mono tracking-wider"
                        />
                        <button onClick={validateVoucher} disabled={voucherValidating || voucherCode.length < 5}
                          className="btn-secondary px-4 py-2.5 text-sm flex items-center gap-2 disabled:opacity-50">
                          {voucherValidating ? <Loader2 size={14} className="animate-spin" /> : <Tag size={14} />} Check
                        </button>
                      </div>

                      {voucherError && (
                        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-xl px-3 py-2.5">
                          <XCircle size={16} /> {voucherError}
                        </div>
                      )}

                      {voucherInfo && (
                        <div className="bg-sage/10 border border-sage/20 rounded-xl p-4 space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-sage" />
                            <p className="font-semibold text-sage text-sm">Valid Voucher</p>
                          </div>
                          <p className="text-clay font-semibold">{voucherInfo.title}</p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-xs text-clay-light">Remaining Balance</p>
                              <p className="font-bold text-clay">{formatCurrency(voucherInfo.remainingValue)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-clay-light">Will Apply</p>
                              <p className="font-bold text-terracotta">{formatCurrency(Math.min(voucherInfo.remainingValue, amountDue))}</p>
                            </div>
                          </div>
                          {voucherInfo.issuedToName && <p className="text-xs text-clay-light">Issued to: {voucherInfo.issuedToName}</p>}
                          {voucherInfo.expiryDate && <p className="text-xs text-clay-light">Expires: {new Date(voucherInfo.expiryDate).toLocaleDateString('en-GB')}</p>}

                          <button onClick={() => redeemVoucherMutation.mutate()} disabled={redeemVoucherMutation.isPending}
                            className="btn-primary w-full py-3 mt-2 flex items-center justify-center gap-2 disabled:opacity-50">
                            {redeemVoucherMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Tag size={16} />}
                            Redeem {formatCurrency(Math.min(voucherInfo.remainingValue, amountDue))}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {amountDue <= 0 && (
                <div className="bg-sage/10 rounded-xl p-4 text-sage text-sm text-center flex items-center gap-2 justify-center">
                  <CheckCircle size={16} /> This booking is fully paid.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: 'bg-amber-50 text-amber-700',
    CONFIRMED: 'bg-blue-50 text-blue-700',
    PAID: 'bg-sage/10 text-sage',
    CANCELLED: 'bg-red-50 text-red-600',
    NO_SHOW: 'bg-gray-100 text-gray-600',
  }
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}
