'use client'

import { useState, useMemo } from 'react'
import {
  X, Search, Plus, Minus, CreditCard, CheckCircle, Printer, Send,
  Sparkles, AlertCircle, ShoppingBag, Receipt, ArrowRight, ShieldCheck, RefreshCw
} from 'lucide-react'
import { SessionBooking, InventoryPotteryItem, PotteryOrderItem } from '@/lib/studio-ops/types'
import { DEFAULT_POTTERY_INVENTORY } from '@/lib/studio-ops/data'
import { formatCurrency } from '@/lib/utils'

interface StudioPosModalProps {
  booking: SessionBooking
  sessionName: string
  sessionDate: string
  onClose: () => void
  onOrderSaved?: (updatedBooking: SessionBooking) => void
}

type PosStep = 'itemization' | 'terminal' | 'success'

export function StudioPosModal({
  booking,
  sessionName,
  sessionDate,
  onClose,
  onOrderSaved,
}: StudioPosModalProps) {
  const [step, setStep] = useState<PosStep>(booking.orderCompleted ? 'success' : 'itemization')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [paymentProvider, setPaymentProvider] = useState<'SHIFT4' | 'STRIPE' | 'CASH'>('SHIFT4')
  const [isProcessing, setIsProcessing] = useState(false)
  const [receiptData, setReceiptData] = useState<any>(null)

  // Initialize selected items from existing booking or empty
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {}
    if (booking.potteryItems && booking.potteryItems.length > 0) {
      booking.potteryItems.forEach(item => {
        initial[item.itemId] = item.quantity
      })
    }
    return initial
  })

  // Categories list
  const categories = ['All', 'Mugs', 'Figures & Animals', 'Bowls & Plates', 'Vases & Home']

  // Filter inventory
  const filteredInventory = useMemo(() => {
    return DEFAULT_POTTERY_INVENTORY.filter(item => {
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCat && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  // Calculate line items and totals
  const selectedLineItems: PotteryOrderItem[] = useMemo(() => {
    const list: PotteryOrderItem[] = []
    Object.entries(itemQuantities).forEach(([itemId, qty]) => {
      if (qty > 0) {
        const item = DEFAULT_POTTERY_INVENTORY.find(i => i.id === itemId)
        if (item) {
          list.push({
            itemId: item.id,
            name: item.name,
            category: item.category,
            quantity: qty,
            unitPrice: item.price,
            totalPrice: item.price * qty,
          })
        }
      }
    })
    return list
  }, [itemQuantities])

  // Totals
  const grossTotal = useMemo(() => {
    return selectedLineItems.reduce((acc, curr) => acc + curr.totalPrice, 0)
  }, [selectedLineItems])

  const depositPaid = Number(booking.amountPaid) || 0
  const balanceDue = Math.max(0, grossTotal - depositPaid)
  const creditSurplus = Math.max(0, depositPaid - grossTotal)

  // Quantity updates
  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setItemQuantities(prev => {
      const current = prev[itemId] || 0
      const next = Math.max(0, current + delta)
      const updated = { ...prev }
      if (next === 0) {
        delete updated[itemId]
      } else {
        updated[itemId] = next
      }
      return updated
    })
  }

  // Handle Checkout Action
  const handleCollectPayment = async () => {
    setIsProcessing(true)
    setStep('terminal')

    try {
      // Simulate POS terminal handshake (Shift4 / Stripe)
      const res = await fetch('/api/admin/checkout-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: booking.sessionId,
          bookingId: booking.id,
          potteryItems: selectedLineItems,
          grossTotal,
          depositDeducted: Math.min(depositPaid, grossTotal),
          balanceDue,
          paymentMethod: paymentProvider === 'SHIFT4' ? 'TERMINAL_SHIFT4' : paymentProvider,
        }),
      })

      const data = await res.json()

      // Terminal animation delay for authentic feel
      setTimeout(() => {
        setIsProcessing(false)
        setStep('success')
        setReceiptData(data)
        if (onOrderSaved && data.booking) {
          onOrderSaved(data.booking)
        }
      }, 1500)
    } catch (err) {
      console.error(err)
      setIsProcessing(false)
      alert('Error connecting to terminal. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-clay/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-warm-white w-full max-w-5xl h-[92vh] max-h-[850px] rounded-3xl shadow-pottery-xl flex flex-col overflow-hidden border border-parchment">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-parchment flex items-center justify-between bg-cream/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-terracotta text-warm-white flex items-center justify-center shadow-terracotta">
              <ShoppingBag size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-playfair font-bold text-xl text-clay">In-Studio Pottery POS & Itemization</h2>
                <span className="text-xs font-mono bg-parchment/80 text-clay px-2 py-0.5 rounded-md font-medium">
                  {booking.bookingRef}
                </span>
              </div>
              <p className="text-xs text-clay-light">
                {booking.customerName} · {sessionName} ({booking.seats} guest{booking.seats !== 1 ? 's' : ''})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-clay-light hover:text-clay hover:bg-parchment/50 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Upfront Credit Banner */}
        <div className="bg-gradient-to-r from-terracotta-pale via-warm-white to-sage-pale/40 px-6 py-3 border-b border-parchment/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-sage/20 text-sage flex items-center justify-center shrink-0">
              <ShieldCheck size={16} />
            </div>
            <div>
              <p className="text-xs font-bold text-clay uppercase tracking-wider">Upfront Booking Credit Collected</p>
              <p className="text-sm font-semibold text-terracotta">
                {formatCurrency(depositPaid)} Paid via Apple Pay / Card ({booking.seats} participant{booking.seats !== 1 ? 's' : ''})
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sage/15 text-sage border border-sage/30">
              <Sparkles size={13} />
              Deducts Automatically from Painted Items
            </span>
          </div>
        </div>

        {/* Content Body */}
        {step === 'itemization' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
            
            {/* Left Column: Pottery Item Catalog (8 cols) */}
            <div className="lg:col-span-7 xl:col-span-7 p-5 flex flex-col overflow-hidden border-r border-parchment/60">
              {/* Filter bar */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4 shrink-0">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-clay-light" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search ceramic pieces (e.g. Mug, Cat, Bowl)..."
                    className="w-full pl-10 pr-4 py-2 border border-parchment rounded-xl text-clay text-sm bg-cream/50 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-clay-light hover:text-clay"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Categories Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-3 shrink-0 scrollbar-none">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-clay text-warm-white shadow-sm'
                        : 'bg-cream text-clay-light hover:text-clay hover:bg-parchment/60'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Inventory Items Grid */}
              <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
                {filteredInventory.map(item => {
                  const qty = itemQuantities[item.id] || 0
                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                        qty > 0
                          ? 'border-terracotta bg-terracotta/5 shadow-pottery-sm'
                          : 'border-parchment/70 bg-cream/40 hover:border-terracotta/40 hover:bg-cream'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h4 className="font-semibold text-clay text-sm leading-snug">{item.name}</h4>
                          <span className="font-bold text-terracotta text-sm shrink-0">
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                        <p className="text-[11px] text-clay-light line-clamp-2 leading-relaxed">
                          {item.description || item.category}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-parchment/50 flex items-center justify-between">
                        <span className="text-[10px] text-clay-lighter font-mono">
                          Stock: {item.stock}
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          {qty > 0 && (
                            <>
                              <button
                                onClick={() => handleUpdateQuantity(item.id, -1)}
                                className="w-7 h-7 rounded-lg bg-parchment text-clay hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors"
                              >
                                <Minus size={13} />
                              </button>
                              <span className="w-6 text-center font-bold text-clay text-xs">
                                {qty}
                              </span>
                            </>
                          )}
                          <button
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                            className={`h-7 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                              qty > 0
                                ? 'bg-terracotta text-warm-white shadow-terracotta'
                                : 'bg-parchment/80 text-clay hover:bg-terracotta hover:text-warm-white'
                            }`}
                          >
                            <Plus size={13} />
                            {qty === 0 && 'Select'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right Column: Order Details & Live Calculations (5 cols) */}
            <div className="lg:col-span-5 xl:col-span-5 p-5 flex flex-col justify-between bg-cream/30 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-playfair font-bold text-lg text-clay flex items-center gap-2">
                    <Receipt size={18} className="text-terracotta" />
                    Selected Pottery Pieces
                  </h3>
                  <span className="text-xs bg-parchment px-2.5 py-0.5 rounded-full text-clay-light font-medium">
                    {selectedLineItems.reduce((acc, i) => acc + i.quantity, 0)} items selected
                  </span>
                </div>

                {/* Selected Items List */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedLineItems.length === 0 ? (
                    <div className="text-center py-8 text-clay-light border border-dashed border-parchment rounded-2xl bg-warm-white/50">
                      <ShoppingBag size={28} className="mx-auto mb-2 opacity-30 text-clay" />
                      <p className="text-xs">No pottery items selected yet.</p>
                      <p className="text-[11px] text-clay-lighter mt-0.5">Click &apos;+&apos; on any ceramic piece to add.</p>
                    </div>
                  ) : (
                    selectedLineItems.map(item => (
                      <div
                        key={item.itemId}
                        className="flex items-center justify-between p-2.5 bg-warm-white rounded-xl border border-parchment/60 text-xs shadow-pottery-sm"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-semibold text-clay truncate">{item.name}</p>
                          <p className="text-clay-light text-[11px]">
                            {item.quantity} × {formatCurrency(item.unitPrice)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-bold text-clay">{formatCurrency(item.totalPrice)}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.itemId, -1)}
                            className="text-clay-light hover:text-red-500 p-1"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Automatic Balance Calculation Box */}
                <div className="bg-warm-white rounded-2xl p-4 border border-parchment space-y-2.5 shadow-pottery-sm">
                  <div className="flex justify-between text-xs text-clay">
                    <span>Gross Pottery Total</span>
                    <span className="font-semibold">{formatCurrency(grossTotal)}</span>
                  </div>

                  <div className="flex justify-between text-xs text-sage font-medium">
                    <span>Less Deposit Paid (Upfront Credit)</span>
                    <span className="font-semibold">−{formatCurrency(Math.min(depositPaid, grossTotal))}</span>
                  </div>

                  {depositPaid > grossTotal && (
                    <div className="text-[11px] text-clay-light italic bg-sage/10 p-2 rounded-lg">
                      Remaining credit available for café & future booking: {formatCurrency(creditSurplus)}
                    </div>
                  )}

                  <div className="pt-2 border-t border-parchment flex justify-between items-baseline">
                    <div>
                      <span className="font-bold text-clay text-sm block">Balance Due (Top-Up)</span>
                      <span className="text-[10px] text-clay-light">Payable at studio counter</span>
                    </div>
                    <span className="font-playfair font-bold text-2xl text-terracotta">
                      {formatCurrency(balanceDue)}
                    </span>
                  </div>
                </div>

                {/* Payment Gateway / Provider Selector */}
                {balanceDue > 0 && (
                  <div>
                    <label className="text-xs font-semibold text-clay block mb-1.5">Payment Terminal / Channel</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'SHIFT4', label: 'Shift4 Card', icon: CreditCard },
                        { id: 'STRIPE', label: 'Stripe Reader', icon: CreditCard },
                        { id: 'CASH', label: 'Cash / Split', icon: Receipt },
                      ].map(p => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPaymentProvider(p.id as any)}
                          className={`p-2 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                            paymentProvider === p.id
                              ? 'border-terracotta bg-terracotta/10 text-terracotta font-bold'
                              : 'border-parchment bg-warm-white text-clay-light hover:text-clay'
                          }`}
                        >
                          <p.icon size={15} />
                          <span>{p.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-parchment space-y-2">
                <button
                  onClick={handleCollectPayment}
                  disabled={selectedLineItems.length === 0}
                  className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2 shadow-terracotta disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CreditCard size={18} />
                  {balanceDue > 0 ? (
                    <span>Collect Balance & Finish ({formatCurrency(balanceDue)})</span>
                  ) : (
                    <span>Settle & Mark Fulfilled (£0.00 Due)</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 text-xs text-clay-light hover:text-clay text-center"
                >
                  Keep Open / Save Draft
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Terminal Loading State */}
        {step === 'terminal' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-terracotta/10 flex items-center justify-center animate-pulse-soft">
              <CreditCard size={36} className="text-terracotta animate-pulse" />
            </div>
            <div>
              <h3 className="font-playfair font-bold text-2xl text-clay">Contacting Shift4 Terminal...</h3>
              <p className="text-sm text-clay-light mt-1">Please ask the customer to tap or insert card on the desk reader.</p>
              <p className="text-xs font-mono font-bold text-terracotta mt-2 bg-terracotta/10 px-3 py-1 rounded-full inline-block">
                Amount to charge: {formatCurrency(balanceDue)}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-clay-light mt-4">
              <RefreshCw size={14} className="animate-spin text-terracotta" />
              <span>Awaiting payment authorization...</span>
            </div>
          </div>
        )}

        {/* Success / Fulfilled State */}
        {step === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-5 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-sage/15 flex items-center justify-center shadow-pottery-sm">
              <CheckCircle size={44} className="text-sage" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-sage bg-sage/10 px-3 py-1 rounded-full border border-sage/20">
                Transaction Completed & Fulfilled
              </span>
              <h3 className="font-playfair font-bold text-3xl text-clay mt-2">
                Order Settled Successfully!
              </h3>
              <p className="text-sm text-clay-light mt-1">
                Receipt #{receiptData?.receiptNumber || 'REC-829104'} · {booking.customerName}
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-cream/60 rounded-2xl border border-parchment p-5 w-full max-w-md text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between border-b border-parchment pb-2 font-sans font-semibold text-clay">
                <span>{booking.serviceName || sessionName}</span>
                <span>{booking.seats} Guests</span>
              </div>
              <div className="space-y-1 py-1">
                {selectedLineItems.map(item => (
                  <div key={item.itemId} className="flex justify-between text-clay-light">
                    <span>{item.quantity}x {item.name}</span>
                    <span>{formatCurrency(item.totalPrice)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-parchment pt-2 space-y-1 font-sans">
                <div className="flex justify-between text-clay-light">
                  <span>Gross Total</span>
                  <span>{formatCurrency(grossTotal)}</span>
                </div>
                <div className="flex justify-between text-sage font-medium">
                  <span>Booking Credit Deducted</span>
                  <span>−{formatCurrency(Math.min(depositPaid, grossTotal))}</span>
                </div>
                <div className="flex justify-between text-clay font-bold text-sm pt-1 border-t border-parchment">
                  <span>Amount Paid on Counter</span>
                  <span className="text-terracotta">{formatCurrency(balanceDue)}</span>
                </div>
              </div>
            </div>

            {/* Receipt Print & Next Actions */}
            <div className="flex flex-wrap gap-3 justify-center w-full max-w-md">
              <button
                onClick={() => window.print()}
                className="btn-secondary flex-1 py-3 flex items-center justify-center gap-2 text-sm"
              >
                <Printer size={16} /> Print Receipt
              </button>
              <button
                onClick={onClose}
                className="btn-primary flex-1 py-3 flex items-center justify-center gap-2 text-sm"
              >
                Done / Back to Roster
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
