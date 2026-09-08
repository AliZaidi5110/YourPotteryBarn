'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { formatCurrency, formatDate, formatTime } from '@/lib/utils'
import { CreditCard, Shield, ChevronLeft, Loader2, Gift, Tag } from 'lucide-react'
import type { Service, Addon } from '@prisma/client'
import type { BookingState } from './BookingFlow'

interface CheckoutStepProps {
  service: Service
  booking: BookingState
  addons: Addon[]
  grandTotal: number
  depositAmount: number
  onBack: () => void
}

export function CheckoutStep({ service, booking, addons, grandTotal, depositAmount, onBack }: CheckoutStepProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [giftCode, setGiftCode] = useState('')
  const [giftApplied, setGiftApplied] = useState<{ code: string; amount: number } | null>(null)
  const [guestInfo, setGuestInfo] = useState({
    name: (session?.user?.name as string) || 'Jane Doe',
    email: (session?.user?.email as string) || 'guest@example.com',
    phone: '07700 900123',
  })

  const effectiveTotal = Math.max(0, depositAmount - (giftApplied?.amount ?? 0))
  const balanceDue = grandTotal - depositAmount

  async function applyGiftCard() {
    if (!giftCode.trim()) return
    try {
      const res = await fetch('/api/gift-cards/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: giftCode }),
      })
      const data = await res.json()
      if (data.valid) {
        setGiftApplied({ code: giftCode, amount: data.remainingBalance })
      } else {
        setError('Invalid or expired gift card code.')
      }
    } catch {
      setError('Could not validate gift card.')
    }
  }

  async function handleBooking() {
    if (!guestInfo.name || !guestInfo.email) {
      setError('Please fill in your name and email.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Create booking
      const bookingRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: booking.serviceId,
          slotId: booking.slotId,
          seats: booking.seats,
          addons: Object.entries(booking.selectedAddons).map(([addonId, qty]) => ({ addonId, qty })),
          guestInfo,
          giftCardCode: giftApplied?.code,
        }),
      })

      if (!bookingRes.ok) {
        const err = await bookingRes.json()
        throw new Error(err.message ?? 'Booking failed. Please try again.')
      }

      const { bookingRef, clientSecret } = await bookingRes.json()

      if (effectiveTotal > 0 && clientSecret && clientSecret !== 'mock_pi_secret_test') {
        // Redirect to Stripe-hosted payment page
        router.push(`/book/pay?bookingRef=${bookingRef}&clientSecret=${encodeURIComponent(clientSecret)}`)
      } else {
        // Demo payment or fully covered
        router.push(`/confirmation/${bookingRef}`)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Guest Info */}
      {!session && (
        <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-6">
          <h2 className="font-playfair font-semibold text-xl text-clay mb-1">Your details</h2>
          <p className="text-clay-light text-sm mb-5">We&apos;ll send your booking confirmation to this email.</p>

          <div className="space-y-4">
            <div>
              <label htmlFor="guest-name" className="block text-sm font-medium text-clay mb-1.5">Full name *</label>
              <input
                id="guest-name"
                type="text"
                value={guestInfo.name}
                onChange={e => setGuestInfo({ ...guestInfo, name: e.target.value })}
                className="w-full border border-parchment rounded-xl px-4 py-3 text-clay bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-all"
                placeholder="Jane Smith"
                required
              />
            </div>
            <div>
              <label htmlFor="guest-email" className="block text-sm font-medium text-clay mb-1.5">Email address *</label>
              <input
                id="guest-email"
                type="email"
                value={guestInfo.email}
                onChange={e => setGuestInfo({ ...guestInfo, email: e.target.value })}
                className="w-full border border-parchment rounded-xl px-4 py-3 text-clay bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-all"
                placeholder="jane@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="guest-phone" className="block text-sm font-medium text-clay mb-1.5">Mobile number <span className="text-clay-light">(for reminders)</span></label>
              <input
                id="guest-phone"
                type="tel"
                value={guestInfo.phone}
                onChange={e => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                className="w-full border border-parchment rounded-xl px-4 py-3 text-clay bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-all"
                placeholder="+44 7700 900000"
              />
            </div>
          </div>
        </div>
      )}

      {/* Payment Summary */}
      <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-6">
        <h2 className="font-playfair font-semibold text-xl text-clay mb-5 flex items-center gap-2">
          <CreditCard size={20} className="text-terracotta" />
          Payment
        </h2>

        {/* Booking summary */}
        <div className="bg-cream rounded-xl p-4 mb-4 text-sm space-y-2">
          <div className="flex justify-between text-clay">
            <span>{service.name} × {booking.seats}</span>
            <span className="font-semibold">{formatCurrency(Number(service.price) * booking.seats)}</span>
          </div>
          {Object.entries(booking.selectedAddons).map(([addonId, qty]) => {
            const addon = addons.find(a => a.id === addonId)
            if (!addon || qty === 0) return null
            return (
              <div key={addonId} className="flex justify-between text-clay-light">
                <span>{addon.name} × {qty}</span>
                <span>{formatCurrency(Number(addon.price) * qty)}</span>
              </div>
            )
          })}
          <div className="border-t border-parchment pt-2 flex justify-between font-semibold text-clay">
            <span>Total</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        </div>

        {/* Gift card */}
        <div className="mb-4">
          <label htmlFor="gift-code" className="block text-sm font-medium text-clay mb-1.5 flex items-center gap-1.5">
            <Gift size={14} /> Gift card / promo code
          </label>
          {giftApplied ? (
            <div className="flex items-center gap-2 p-3 bg-sage/10 rounded-xl border border-sage/20 text-sm text-sage">
              <Tag size={14} />
              <span className="font-medium">{giftApplied.code}</span>
              <span className="ml-auto">−{formatCurrency(Math.min(giftApplied.amount, depositAmount))}</span>
              <button onClick={() => setGiftApplied(null)} className="text-clay-light hover:text-terracotta ml-2 text-xs">Remove</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                id="gift-code"
                type="text"
                value={giftCode}
                onChange={e => setGiftCode(e.target.value.toUpperCase())}
                className="flex-1 border border-parchment rounded-xl px-4 py-2.5 text-clay text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-all"
                placeholder="YPB-GIFTCARD"
              />
              <button
                onClick={applyGiftCard}
                className="px-4 py-2.5 bg-parchment text-clay text-sm font-medium rounded-xl hover:bg-terracotta hover:text-warm-white transition-all"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {/* Deposit info */}
        <div className="bg-sage/10 rounded-xl p-4 mb-5 border border-sage/20">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sage font-semibold text-sm">Deposit due today (25%)</span>
            <span className="text-sage font-bold">{formatCurrency(effectiveTotal)}</span>
          </div>
          <p className="text-sage/70 text-xs">Remaining balance of {formatCurrency(balanceDue)} is due in-studio on the day.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Trust signals */}
        <div className="flex items-center gap-2 text-xs text-clay-light mb-5">
          <Shield size={14} className="text-sage" />
          <span>Secure payment via Stripe. Your card details are never stored by us.</span>
        </div>

        <div className="flex gap-3">
          <button onClick={onBack} className="btn-secondary py-4 px-6">
            <ChevronLeft size={16} className="inline" />
          </button>
          <button
            onClick={handleBooking}
            disabled={isLoading}
            className="btn-primary flex-1 py-4 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <><Loader2 size={18} className="animate-spin" /> Processing...</>
            ) : (
              <>Pay Deposit — {formatCurrency(effectiveTotal)}</>
            )}
          </button>
        </div>

        <p className="text-center text-xs text-clay-light mt-3">
          By booking you agree to our <a href="/terms" className="text-terracotta underline">cancellation policy</a>.
        </p>
      </div>
    </div>
  )
}
