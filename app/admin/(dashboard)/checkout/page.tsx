'use client'

import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, Plus, Loader2, CreditCard, CheckCircle, XCircle, AlertCircle, RefreshCw, Printer, Minus } from 'lucide-react'
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

interface Addon {
  id: string
  name: string
  price: number
  category: string
}

type TerminalState = 'idle' | 'processing' | 'approved' | 'declined' | 'error'

export default function CheckoutPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null)
  const [extraAddons, setExtraAddons] = useState<Record<string, number>>({})
  const [terminalState, setTerminalState] = useState<TerminalState>('idle')
  const [terminalResult, setTerminalResult] = useState<any>(null)
  const queryClient = useQueryClient()

  // Search bookings
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

  // Fetch addons list
  const { data: addons = [] } = useQuery<Addon[]>({
    queryKey: ['addons'],
    queryFn: () => fetch('/api/services/addons').then(r => r.json()),
  })

  // Calculate amounts
  const extraAddonTotal = Object.entries(extraAddons).reduce((sum, [id, qty]) => {
    const addon = addons.find(a => a.id === id)
    return sum + (addon ? addon.price * qty : 0)
  }, 0)

  const amountDue = selectedBooking
    ? Math.max(0, Number(selectedBooking.totalAmount) + extraAddonTotal - Number(selectedBooking.amountPaid))
    : 0

  // Terminal payment mutation
  const terminalMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/payments/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: selectedBooking!.id,
          amountPence: Math.round(amountDue * 100),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Payment failed')
      return data
    },
    onMutate: () => setTerminalState('processing'),
    onSuccess: (data) => {
      setTerminalState('approved')
      setTerminalResult(data)
      queryClient.invalidateQueries({ queryKey: ['checkout-search'] })
    },
    onError: (err: any) => {
      setTerminalState('declined')
      setTerminalResult({ error: err.message })
    },
  })

  function resetTerminal() {
    setTerminalState('idle')
    setTerminalResult(null)
  }

  function handleSelectBooking(booking: BookingWithDetails) {
    setSelectedBooking(booking)
    setExtraAddons({})
    resetTerminal()
  }

  function updateExtraAddon(addonId: string, delta: number) {
    setExtraAddons(prev => {
      const curr = prev[addonId] ?? 0
      const next = Math.max(0, curr + delta)
      const updated = { ...prev }
      if (next === 0) delete updated[addonId]
      else updated[addonId] = next
      return updated
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-3xl font-bold text-clay">POS Checkout</h1>
        <p className="text-clay-light mt-1">Search for a booking and take payment via the Shift4 card terminal.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left: Booking Search */}
        <div className="space-y-4">
          <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-5">
            <h2 className="font-semibold text-clay mb-4 flex items-center gap-2">
              <Search size={18} className="text-terracotta" /> Find Booking
            </h2>
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-clay-light" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by booking ref, name, or email..."
                className="w-full pl-10 pr-4 py-3 border border-parchment rounded-xl text-clay text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta"
                aria-label="Search bookings"
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
                        <p className="text-clay-light text-xs">{booking.service.name}</p>
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

          {/* Extra Add-ons */}
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
                            <button onClick={() => updateExtraAddon(addon.id, -1)} className="w-6 h-6 rounded-full bg-parchment text-clay hover:bg-terracotta hover:text-warm-white transition-all flex items-center justify-center">
                              <Minus size={10} />
                            </button>
                            <span className="w-4 text-center font-bold text-clay text-xs">{qty}</span>
                          </>
                        )}
                        <button onClick={() => updateExtraAddon(addon.id, 1)} className={`w-6 h-6 rounded-full transition-all flex items-center justify-center ${qty > 0 ? 'bg-terracotta text-warm-white' : 'bg-parchment text-clay hover:bg-terracotta hover:text-warm-white'}`}>
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

              {/* Terminal payment section */}
              {terminalState === 'idle' && (
                <button
                  onClick={() => terminalMutation.mutate()}
                  disabled={amountDue <= 0}
                  className="btn-primary w-full py-5 text-lg flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <CreditCard size={22} /> PAY — {formatCurrency(amountDue)}
                </button>
              )}

              {terminalState === 'processing' && (
                <div className="text-center py-6 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center mx-auto animate-pulse-soft">
                    <CreditCard size={28} className="text-terracotta animate-pulse" />
                  </div>
                  <p className="font-semibold text-clay text-lg">Waiting for card...</p>
                  <p className="text-clay-light text-sm">Ask the customer to tap or insert their card on the terminal.</p>
                  <p className="text-xs text-clay-light bg-terracotta/5 rounded-lg px-3 py-2">Amount: {formatCurrency(amountDue)}</p>
                </div>
              )}

              {terminalState === 'approved' && (
                <div className="text-center py-6 space-y-3 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center mx-auto">
                    <CheckCircle size={32} className="text-sage" />
                  </div>
                  <p className="font-bold text-clay text-xl">Payment Approved!</p>
                  {terminalResult && (
                    <div className="bg-sage/10 rounded-xl p-4 text-sm text-sage space-y-1 text-left">
                      <p>✓ Card: {terminalResult.cardBrand ?? 'Card'} ****{terminalResult.cardLast4}</p>
                      <p>✓ Auth code: {terminalResult.authCode}</p>
                      <p>✓ Transaction: {terminalResult.transactionId}</p>
                    </div>
                  )}
                  <div className="flex gap-3 mt-4">
                    <button className="btn-secondary flex-1 py-3 flex items-center justify-center gap-2" onClick={() => window.print()}>
                      <Printer size={16} /> Print receipt
                    </button>
                    <button className="btn-primary flex-1 py-3" onClick={() => { setSelectedBooking(null); setSearchQuery(''); resetTerminal() }}>
                      New transaction
                    </button>
                  </div>
                </div>
              )}

              {terminalState === 'declined' && (
                <div className="text-center py-6 space-y-3 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                    <XCircle size={32} className="text-red-500" />
                  </div>
                  <p className="font-bold text-clay text-xl">Payment Declined</p>
                  <p className="text-red-600 text-sm bg-red-50 rounded-xl px-4 py-3">
                    {terminalResult?.error ?? 'The card was declined. Please ask the customer to try another card.'}
                  </p>
                  <button onClick={resetTerminal} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                    <RefreshCw size={16} /> Try Again
                  </button>
                </div>
              )}

              {amountDue <= 0 && terminalState === 'idle' && (
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



