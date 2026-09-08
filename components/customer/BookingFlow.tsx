'use client'

import { useState, useMemo } from 'react'
import { formatCurrency, formatDate, formatTime } from '@/lib/utils'
import { Calendar, Clock, Users, ShoppingCart, ChevronRight, ChevronLeft, Minus, Plus, Check } from 'lucide-react'
import type { Service, AvailabilitySlot, Addon } from '@prisma/client'
import { CheckoutStep } from './CheckoutStep'

interface BookingFlowProps {
  service: Service
  slots: AvailabilitySlot[]
  addons: Addon[]
}

export type BookingState = {
  serviceId: string
  slotId: string | null
  selectedSlot: AvailabilitySlot | null
  seats: number
  selectedAddons: Record<string, number> // addonId → quantity
}

const STEPS = ['Date & Time', 'Guests & Add-ons', 'Payment']

export function BookingFlow({ service, slots, addons }: BookingFlowProps) {
  const [step, setStep] = useState(0)
  const [booking, setBooking] = useState<BookingState>({
    serviceId: service.id,
    slotId: null,
    selectedSlot: null,
    seats: 1,
    selectedAddons: {},
  })

  // Group slots by date
  const slotsByDate = useMemo(() => {
    const map: Record<string, AvailabilitySlot[]> = {}
    for (const slot of slots) {
      const dateKey = new Date(slot.date).toDateString()
      if (!map[dateKey]) map[dateKey] = []
      map[dateKey].push(slot)
    }
    return map
  }, [slots])

  const availableDates = Object.keys(slotsByDate)

  const addonTotal = useMemo(() => {
    return Object.entries(booking.selectedAddons).reduce((sum, [id, qty]) => {
      const addon = addons.find(a => a.id === id)
      return sum + (addon ? Number(addon.price) * qty : 0)
    }, 0)
  }, [booking.selectedAddons, addons])

  const serviceTotal = Number(service.price) * booking.seats
  const grandTotal = serviceTotal + addonTotal

  // Determine deposit amount (25% by default)
  const depositPct = 25
  const depositAmount = Math.ceil(grandTotal * depositPct / 100)

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Back link */}
      <a href="/" className="inline-flex items-center gap-2 text-clay-light hover:text-terracotta text-sm mb-6 transition-colors group">
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to all workshops
      </a>

      {/* Service summary header */}
      <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-terracotta/10 flex items-center justify-center text-2xl flex-shrink-0">
            🏺
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-playfair font-bold text-2xl text-clay mb-1">{service.name}</h1>
            <p className="text-clay-light text-sm line-clamp-2">{service.description}</p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-clay-light">
              <span className="flex items-center gap-1"><Clock size={12} /> {service.durationMinutes / 60}hr session</span>
              <span className="flex items-center gap-1"><Users size={12} /> Up to {service.maxCapacity} people</span>
              <span className="font-semibold text-terracotta text-sm">{formatCurrency(Number(service.price))} per person</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center flex-1">
            <div className={`flex items-center gap-2 ${i <= step ? 'text-terracotta' : 'text-clay-light'}`}>
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                ${i < step ? 'bg-terracotta text-warm-white' : i === step ? 'bg-terracotta text-warm-white ring-4 ring-terracotta/20' : 'bg-parchment text-clay-light'}
              `}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${i === step ? 'text-clay' : 'text-clay-light'}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 transition-all duration-300 ${i < step ? 'bg-terracotta' : 'bg-parchment'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2">
          {step === 0 && (
            <StepDateTime
              slots={slots}
              slotsByDate={slotsByDate}
              availableDates={availableDates}
              booking={booking}
              setBooking={setBooking}
              onNext={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <StepGuestsAddons
              service={service}
              addons={addons}
              booking={booking}
              setBooking={setBooking}
              onNext={() => setStep(2)}
              onBack={() => setStep(0)}
            />
          )}
          {step === 2 && (
            <CheckoutStep
              service={service}
              booking={booking}
              addons={addons}
              grandTotal={grandTotal}
              depositAmount={depositAmount}
              onBack={() => setStep(1)}
            />
          )}
        </div>

        {/* Order Summary sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-5 sticky top-24">
            <h2 className="font-playfair font-semibold text-clay text-lg mb-4">Order Summary</h2>

            {booking.selectedSlot && (
              <div className="bg-terracotta/5 rounded-xl p-3 mb-4 border border-terracotta/10">
                <p className="text-xs text-clay-light uppercase tracking-wide mb-1 font-medium">Selected slot</p>
                <p className="text-clay font-semibold text-sm">
                  {formatDate(new Date(booking.selectedSlot.date))}
                </p>
                <p className="text-terracotta font-medium text-sm">
                  {formatTime(booking.selectedSlot.startTime)} – {formatTime(booking.selectedSlot.endTime)}
                </p>
              </div>
            )}

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-clay">
                <span>{service.name} × {booking.seats}</span>
                <span className="font-semibold">{formatCurrency(serviceTotal)}</span>
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
            </div>

            <div className="divider" />

            <div className="flex justify-between items-center">
              <span className="font-semibold text-clay">Total</span>
              <span className="text-xl font-bold text-clay">{formatCurrency(grandTotal)}</span>
            </div>

            {step === 2 && (
              <div className="mt-3 p-3 bg-sage/10 rounded-xl border border-sage/20 text-xs text-sage">
                <p className="font-semibold mb-1">💳 Deposit: {formatCurrency(depositAmount)}</p>
                <p className="text-sage/70">Balance ({formatCurrency(grandTotal - depositAmount)}) due on the day.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Step 1: Date & Time ──────────────────────────────────────────────────────

function StepDateTime({
  slots, slotsByDate, availableDates, booking, setBooking, onNext
}: {
  slots: AvailabilitySlot[]
  slotsByDate: Record<string, AvailabilitySlot[]>
  availableDates: string[]
  booking: BookingState
  setBooking: (b: BookingState) => void
  onNext: () => void
}) {
  const [selectedDate, setSelectedDate] = useState<string | null>(
    availableDates[0] ?? null
  )

  const slotsForDate = selectedDate ? slotsByDate[selectedDate] ?? [] : []

  if (availableDates.length === 0) {
    return (
      <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-8 text-center">
        <div className="text-5xl mb-4">📅</div>
        <h3 className="font-playfair font-semibold text-xl text-clay mb-2">No upcoming slots</h3>
        <p className="text-clay-light">We&apos;re currently adding new dates for this session. Check back soon or contact us!</p>
      </div>
    )
  }

  return (
    <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-6">
      <h2 className="font-playfair font-semibold text-xl text-clay mb-2 flex items-center gap-2">
        <Calendar size={20} className="text-terracotta" />
        Choose your date & time
      </h2>
      <p className="text-clay-light text-sm mb-6">Select an available date, then pick your preferred time slot.</p>

      {/* Date picker */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wide text-clay-light font-medium mb-3">Available Dates</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {availableDates.slice(0, 12).map(dateStr => {
            const d = new Date(dateStr)
            const isSelected = selectedDate === dateStr
            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`
                  p-3 rounded-xl border text-sm font-medium transition-all duration-200 text-left
                  ${isSelected
                    ? 'bg-terracotta text-warm-white border-terracotta shadow-terracotta'
                    : 'bg-cream border-parchment text-clay hover:border-terracotta hover:text-terracotta'
                  }
                `}
              >
                <div className="font-semibold">{d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })}</div>
                <div className={`text-xs ${isSelected ? 'text-warm-white/80' : 'text-clay-light'}`}>
                  {d.toLocaleDateString('en-GB', { month: 'long' })}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div>
          <p className="text-xs uppercase tracking-wide text-clay-light font-medium mb-3">Available Times</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {slotsForDate.map(slot => {
              const isSelected = booking.slotId === slot.id
              const spotsLeft = slot.capacityRemaining
              const isLow = spotsLeft <= 3

              return (
                <button
                  key={slot.id}
                  onClick={() => setBooking({ ...booking, slotId: slot.id, selectedSlot: slot })}
                  className={`
                    p-4 rounded-xl border transition-all duration-200 text-left
                    ${isSelected
                      ? 'bg-terracotta text-warm-white border-terracotta shadow-terracotta'
                      : 'bg-cream border-parchment text-clay hover:border-terracotta'
                    }
                  `}
                >
                  <div className="font-semibold text-sm flex items-center gap-1">
                    <Clock size={12} />
                    {formatTime(slot.startTime)}
                  </div>
                  <div className={`text-xs mt-1 ${isSelected ? 'text-warm-white/80' : isLow ? 'text-red-500 font-medium' : 'text-clay-light'}`}>
                    {isLow ? `⚡ ${spotsLeft} left!` : `${spotsLeft} spots`}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="mt-8">
        <button
          onClick={onNext}
          disabled={!booking.slotId}
          className="btn-primary w-full flex items-center justify-center gap-2 py-4"
        >
          Continue to Guests & Add-ons
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

// ─── Step 2: Guests & Add-ons ─────────────────────────────────────────────────

function StepGuestsAddons({
  service, addons, booking, setBooking, onNext, onBack
}: {
  service: Service
  addons: Addon[]
  booking: BookingState
  setBooking: (b: BookingState) => void
  onNext: () => void
  onBack: () => void
}) {
  const addonsByCategory = useMemo(() => {
    const map: Record<string, Addon[]> = {}
    for (const addon of addons) {
      if (!map[addon.category]) map[addon.category] = []
      map[addon.category].push(addon)
    }
    return map
  }, [addons])

  function updateAddon(addonId: string, delta: number) {
    const current = booking.selectedAddons[addonId] ?? 0
    const next = Math.max(0, current + delta)
    const updated = { ...booking.selectedAddons }
    if (next === 0) {
      delete updated[addonId]
    } else {
      updated[addonId] = next
    }
    setBooking({ ...booking, selectedAddons: updated })
  }

  const maxSeats = Math.min(service.maxCapacity, booking.selectedSlot?.capacityRemaining ?? service.maxCapacity)

  return (
    <div className="space-y-4">
      {/* Seats selector */}
      <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-6">
        <h2 className="font-playfair font-semibold text-xl text-clay mb-1 flex items-center gap-2">
          <Users size={20} className="text-terracotta" />
          How many guests?
        </h2>
        <p className="text-clay-light text-sm mb-5">Select the number of people attending (including yourself).</p>

        <div className="flex items-center gap-5">
          <button
            onClick={() => setBooking({ ...booking, seats: Math.max(1, booking.seats - 1) })}
            disabled={booking.seats <= 1}
            className="w-11 h-11 rounded-full border-2 border-parchment text-clay hover:border-terracotta hover:text-terracotta disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            aria-label="Remove one guest"
          >
            <Minus size={18} />
          </button>
          <div className="text-center">
            <div className="text-4xl font-bold text-clay">{booking.seats}</div>
            <div className="text-xs text-clay-light">guest{booking.seats !== 1 ? 's' : ''}</div>
          </div>
          <button
            onClick={() => setBooking({ ...booking, seats: Math.min(maxSeats, booking.seats + 1) })}
            disabled={booking.seats >= maxSeats}
            className="w-11 h-11 rounded-full border-2 border-parchment text-clay hover:border-terracotta hover:text-terracotta disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            aria-label="Add one guest"
          >
            <Plus size={18} />
          </button>
          <div className="ml-4 text-sm text-clay-light">
            <p className="font-medium text-clay">{formatCurrency(Number(service.price) * booking.seats)}</p>
            <p>{formatCurrency(Number(service.price))} × {booking.seats}</p>
          </div>
        </div>
      </div>

      {/* Add-ons */}
      <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-6">
        <h2 className="font-playfair font-semibold text-xl text-clay mb-1 flex items-center gap-2">
          <ShoppingCart size={20} className="text-terracotta" />
          Add drinks & extras
          <span className="text-xs font-normal text-clay-light ml-1">(optional)</span>
        </h2>
        <p className="text-clay-light text-sm mb-5">Treat yourself or your guests — add these to your booking now or on the day.</p>

        {Object.entries(addonsByCategory).map(([category, categoryAddons]) => (
          <div key={category} className="mb-6 last:mb-0">
            <p className="text-xs uppercase tracking-wide text-clay-light font-semibold mb-3">{category}s</p>
            <div className="space-y-2">
              {categoryAddons.map(addon => {
                const qty = booking.selectedAddons[addon.id] ?? 0
                return (
                  <div key={addon.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${qty > 0 ? 'bg-terracotta/5 border-terracotta/20' : 'border-parchment hover:border-terracotta/30'}`}>
                    <div>
                      <p className="font-medium text-clay text-sm">{addon.name}</p>
                      <p className="text-terracotta text-xs font-semibold">{formatCurrency(Number(addon.price))}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {qty > 0 && (
                        <>
                          <button
                            onClick={() => updateAddon(addon.id, -1)}
                            className="w-7 h-7 rounded-full bg-parchment text-clay hover:bg-terracotta hover:text-warm-white transition-all flex items-center justify-center"
                            aria-label={`Remove ${addon.name}`}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-5 text-center font-bold text-clay">{qty}</span>
                        </>
                      )}
                      <button
                        onClick={() => updateAddon(addon.id, 1)}
                        className={`w-7 h-7 rounded-full transition-all flex items-center justify-center ${qty > 0 ? 'bg-terracotta text-warm-white hover:bg-terracotta-dark' : 'bg-parchment text-clay hover:bg-terracotta hover:text-warm-white'}`}
                        aria-label={`Add ${addon.name}`}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-secondary flex-1 py-4">
          <ChevronLeft size={16} className="inline mr-1" /> Back
        </button>
        <button onClick={onNext} className="btn-primary flex-1 py-4 flex items-center justify-center gap-2">
          Continue to Payment <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
