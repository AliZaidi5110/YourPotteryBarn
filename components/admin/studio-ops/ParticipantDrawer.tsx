'use client'

import { useState } from 'react'
import {
  X, Users, Plus, Calendar, Clock, MapPin, UserCheck, Phone, Mail,
  CreditCard, ChevronRight, Bell, AlertCircle, ShoppingBag, CheckCircle, MessageSquare
} from 'lucide-react'
import { StudioSession, SessionBooking } from '@/lib/studio-ops/types'
import { formatCurrency } from '@/lib/utils'
import { StudioPosModal } from './StudioPosModal'
import { PotteryReadyModal } from './PotteryReadyModal'

interface ParticipantDrawerProps {
  session: StudioSession
  bookings: SessionBooking[]
  onClose: () => void
  onAddParticipant: (newParticipant: {
    customerName: string
    customerEmail: string
    customerPhone?: string
    seats: number
    depositPaid: number
    notes?: string
  }) => void
  onToggleCheckIn: (bookingId: string) => void
  onRescheduleClick: (session: StudioSession) => void
}

export function ParticipantDrawer({
  session,
  bookings,
  onClose,
  onAddParticipant,
  onToggleCheckIn,
  onRescheduleClick,
}: ParticipantDrawerProps) {
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedBookingForPos, setSelectedBookingForPos] = useState<SessionBooking | null>(null)
  const [showNotificationModal, setShowNotificationModal] = useState(false)

  // Manual participant form state
  const [manualName, setManualName] = useState('')
  const [manualEmail, setManualEmail] = useState('')
  const [manualPhone, setManualPhone] = useState('')
  const [manualSeats, setManualSeats] = useState(2)
  const [manualDeposit, setManualDeposit] = useState(session.servicePrice * 2)
  const [manualNotes, setManualNotes] = useState('')

  // Calculate capacity percentage
  const capacityPercent = Math.min(
    100,
    Math.round((session.capacityBooked / (session.capacityMax || 1)) * 100)
  )

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualName || !manualEmail) {
      alert('Please provide name and email')
      return
    }

    onAddParticipant({
      customerName: manualName,
      customerEmail: manualEmail,
      customerPhone: manualPhone || undefined,
      seats: Number(manualSeats),
      depositPaid: Number(manualDeposit),
      notes: manualNotes || undefined,
    })

    setShowAddModal(false)
    setManualName('')
    setManualEmail('')
    setManualPhone('')
    setManualNotes('')
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-clay/40 backdrop-blur-xs transition-opacity animate-fade-in" onClick={onClose} />
      
      {/* Sliding Drawer Container */}
      <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-warm-white shadow-pottery-xl border-l border-parchment flex flex-col transform transition-transform duration-300 ease-out">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-parchment bg-cream/50">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: session.color }}
                />
                <span className="text-xs uppercase tracking-wider font-bold text-clay-light font-mono">
                  {session.serviceCategory} Session
                </span>
                {session.isBlackout && (
                  <span className="text-[10px] bg-zinc-200 text-zinc-700 px-2 py-0.5 rounded-full font-bold">
                    Blackout / Staff Block
                  </span>
                )}
              </div>
              <h2 className="font-playfair text-2xl font-bold text-clay">
                {session.serviceName}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-clay-light hover:text-clay hover:bg-parchment/60 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Session Meta Strip */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-clay-light">
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-terracotta shrink-0" />
              <span>{session.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-terracotta shrink-0" />
              <span>{session.startTime} – {session.endTime}</span>
            </div>
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <MapPin size={15} className="text-terracotta shrink-0" />
              <span className="truncate">{session.location}</span>
            </div>
          </div>

          {/* Staff & Capacity Pill */}
          <div className="mt-4 pt-3 border-t border-parchment/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-clay text-warm-white text-[10px] font-bold flex items-center justify-center">
                {session.staffName.split(' ')[0][0]}
              </div>
              <span className="text-xs font-medium text-clay">{session.staffName}</span>
            </div>

            {/* Capacity Progress Bar */}
            {!session.isBlackout && (
              <div className="flex items-center gap-2">
                <div className="w-28 h-2 bg-parchment rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      capacityPercent >= 100
                        ? 'bg-terracotta'
                        : capacityPercent >= 70
                        ? 'bg-amber-600'
                        : 'bg-sage'
                    }`}
                    style={{ width: `${capacityPercent}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-clay font-mono">
                  {session.capacityBooked}/{session.capacityMax} 👤
                </span>
                {session.waitlistCount > 0 && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium">
                    Waitlist: {session.waitlistCount}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="px-6 py-3 bg-cream/30 border-b border-parchment flex flex-wrap items-center gap-2">
          {!session.isBlackout && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary py-2 px-3.5 text-xs flex items-center gap-1.5 shadow-terracotta"
            >
              <Plus size={14} /> Add Participant Manually
            </button>
          )}

          <button
            onClick={() => onRescheduleClick(session)}
            className="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5"
          >
            <Clock size={14} /> Reschedule Session
          </button>

          <button
            onClick={() => setShowNotificationModal(true)}
            className="px-3 py-2 rounded-xl text-xs font-medium bg-sage/10 text-sage hover:bg-sage/20 border border-sage/20 flex items-center gap-1.5 transition-colors"
          >
            <Bell size={14} /> Pottery Ready & Messages
          </button>
        </div>

        {/* Participant Roster List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-playfair font-bold text-lg text-clay flex items-center gap-2">
              <Users size={18} className="text-terracotta" />
              Attendance Roster ({bookings.length} Bookings · {session.capacityBooked} Attendees)
            </h3>
            <span className="text-xs text-clay-light font-mono">
              Total Deposits: {formatCurrency(session.totalDepositsCollected)}
            </span>
          </div>

          {session.isBlackout ? (
            <div className="p-8 text-center bg-cream/40 rounded-2xl border border-parchment">
              <p className="text-sm font-semibold text-clay">This slot is blocked for staff operations.</p>
              <p className="text-xs text-clay-light mt-1">{session.blackoutReason || 'No bookings permitted.'}</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-parchment rounded-2xl bg-cream/20">
              <Users size={36} className="mx-auto mb-2 opacity-30 text-clay" />
              <p className="text-sm font-medium text-clay">No participants booked in this session yet.</p>
              <p className="text-xs text-clay-light mt-1">
                Click &apos;Add Participant Manually&apos; to register walk-ins or phone reservations.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map(booking => {
                return (
                  <div
                    key={booking.id}
                    className="p-4 rounded-2xl border border-parchment bg-warm-white hover:border-terracotta/40 transition-all shadow-pottery-sm space-y-3"
                  >
                    {/* Top Row: Name, Status Badge, Guests */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-clay text-base">{booking.customerName}</h4>
                          <span className="font-mono text-[10px] bg-parchment text-clay-light px-1.5 py-0.5 rounded">
                            {booking.bookingRef}
                          </span>
                        </div>
                        <p className="text-xs text-clay-light flex items-center gap-2 mt-0.5">
                          <span>{booking.customerEmail}</span>
                          {booking.customerPhone && (
                            <>
                              <span>·</span>
                              <span>{booking.customerPhone}</span>
                            </>
                          )}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          booking.status === 'PAID'
                            ? 'bg-sage/15 text-sage border border-sage/30'
                            : booking.status === 'CANCELLED'
                            ? 'bg-red-50 text-red-600'
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {booking.status}
                        </span>
                        <p className="text-xs font-mono font-bold text-clay mt-1">
                          {booking.seats} 👤 guest{booking.seats !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    {/* Middle Row: Deposit & Registration Info */}
                    <div className="bg-cream/60 rounded-xl p-2.5 flex flex-wrap items-center justify-between text-xs">
                      <div>
                        <span className="text-clay-light">Upfront Deposit: </span>
                        <span className="font-bold text-terracotta font-mono">
                          {formatCurrency(booking.amountPaid)} Paid
                        </span>
                        {booking.totalAmount > booking.amountPaid && (
                          <span className="text-clay-lighter text-[11px] ml-1">
                            (of {formatCurrency(booking.totalAmount)})
                          </span>
                        )}
                      </div>
                      <div className="text-clay-lighter text-[11px]">
                        Registered: {booking.registeredAt}
                      </div>
                    </div>

                    {/* Notes if any */}
                    {booking.notes && (
                      <p className="text-xs text-clay bg-amber-50/60 border border-amber-200/50 rounded-xl p-2 italic">
                        &quot;{booking.notes}&quot;
                      </p>
                    )}

                    {/* Action Buttons Row */}
                    <div className="pt-2 border-t border-parchment/60 flex flex-wrap items-center justify-between gap-2">
                      {/* Attendance Toggle */}
                      <button
                        onClick={() => onToggleCheckIn(booking.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          booking.checkedIn
                            ? 'bg-sage text-warm-white shadow-sm'
                            : 'bg-parchment text-clay hover:bg-sage hover:text-warm-white'
                        }`}
                      >
                        <UserCheck size={14} />
                        {booking.checkedIn ? (
                          <span>Checked In ✓ ({booking.checkedInAt || '10:00'})</span>
                        ) : (
                          <span>Mark Attended</span>
                        )}
                      </button>

                      {/* Open Order Details & POS Button */}
                      <button
                        onClick={() => setSelectedBookingForPos(booking)}
                        className="btn-primary py-1.5 px-3.5 text-xs flex items-center gap-1.5 shadow-terracotta"
                      >
                        <ShoppingBag size={14} />
                        <span>Open Order Details (POS)</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>

                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-parchment bg-cream/40 flex justify-between items-center text-xs text-clay-light">
          <span>Your Pottery Barn · Operations Dashboard</span>
          <button onClick={onClose} className="hover:text-clay font-medium">
            Close Drawer
          </button>
        </div>

      </aside>

      {/* Manual Participant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-clay/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-warm-white w-full max-w-md rounded-3xl p-6 shadow-pottery-xl border border-parchment">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-playfair font-bold text-xl text-clay flex items-center gap-2">
                <Plus size={18} className="text-terracotta" />
                Add Participant Manually
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-clay-light hover:text-clay">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-clay block mb-1">Primary Guest Full Name *</label>
                <input
                  type="text"
                  required
                  value={manualName}
                  onChange={e => setManualName(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full px-3 py-2 border border-parchment rounded-xl bg-cream/40 text-clay text-xs focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-clay block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={manualEmail}
                  onChange={e => setManualEmail(e.target.value)}
                  placeholder="eleanor@example.co.uk"
                  className="w-full px-3 py-2 border border-parchment rounded-xl bg-cream/40 text-clay text-xs focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-clay block mb-1">Mobile Phone Number</label>
                <input
                  type="tel"
                  value={manualPhone}
                  onChange={e => setManualPhone(e.target.value)}
                  placeholder="+44 7700 900123"
                  className="w-full px-3 py-2 border border-parchment rounded-xl bg-cream/40 text-clay text-xs focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-clay block mb-1">Guests / Seats</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={manualSeats}
                    onChange={e => {
                      const s = parseInt(e.target.value) || 1
                      setManualSeats(s)
                      setManualDeposit(session.servicePrice * s)
                    }}
                    className="w-full px-3 py-2 border border-parchment rounded-xl bg-cream/40 text-clay text-xs font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-clay block mb-1">Upfront Deposit (£)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={manualDeposit}
                    onChange={e => setManualDeposit(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-parchment rounded-xl bg-cream/40 text-clay text-xs font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-clay block mb-1">Session Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={manualNotes}
                  onChange={e => setManualNotes(e.target.value)}
                  placeholder="Special occasion, seating preference, walk-in cash..."
                  className="w-full px-3 py-2 border border-parchment rounded-xl bg-cream/40 text-clay text-xs outline-none"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary flex-1 py-2 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 py-2 text-xs"
                >
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POS Itemization & Deposit Top-Up Modal */}
      {selectedBookingForPos && (
        <StudioPosModal
          booking={selectedBookingForPos}
          sessionName={session.serviceName}
          sessionDate={session.date}
          onClose={() => setSelectedBookingForPos(null)}
          onOrderSaved={(updatedBooking) => {
            setSelectedBookingForPos(null)
          }}
        />
      )}

      {/* Notification Center Modal */}
      {showNotificationModal && (
        <PotteryReadyModal
          session={session}
          bookings={bookings}
          onClose={() => setShowNotificationModal(false)}
        />
      )}
    </>
  )
}
