'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useMemo } from 'react'
import { formatCurrency, formatDate, formatTime } from '@/lib/utils'
import { Calendar, Search, Plus, Filter, ChevronLeft, ChevronRight, Loader2, X, Check } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  PAID: 'bg-sage/10 text-sage border-sage/20',
  CANCELLED: 'bg-red-50 text-red-500 border-red-200',
  NO_SHOW: 'bg-gray-100 text-gray-500 border-gray-200',
}

export default function BookingsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-bookings', search, statusFilter, dateFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (search) params.set('ref', search)
      if (statusFilter) params.set('status', statusFilter)
      if (dateFilter) params.set('date', dateFilter)
      const res = await fetch(`/api/bookings?${params}`)
      return res.json()
    },
  })

  const bookings = data?.bookings ?? []

  const cancelMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] })
      setSelectedBooking(null)
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-clay">Bookings</h1>
          <p className="text-clay-light mt-1">All sessions, rosters, and booking management.</p>
        </div>
        <a href="/admin/bookings/new" className="btn-primary flex items-center gap-2 py-2.5 text-sm">
          <Plus size={16} /> New Booking
        </a>
      </div>

      {/* Filters */}
      <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-clay-light" />
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by booking ref or name..."
              className="w-full pl-9 pr-4 py-2.5 border border-parchment rounded-xl text-clay text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta"
            />
          </div>
          <input
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="border border-parchment rounded-xl px-3 py-2.5 text-clay text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-parchment rounded-xl px-3 py-2.5 text-clay text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta"
          >
            <option value="">All statuses</option>
            {['PENDING', 'CONFIRMED', 'PAID', 'CANCELLED', 'NO_SHOW'].map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>
          {(search || statusFilter || dateFilter) && (
            <button
              onClick={() => { setSearch(''); setStatusFilter(''); setDateFilter('') }}
              className="text-sm text-terracotta hover:underline flex items-center gap-1"
            >
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Bookings table */}
        <div className="xl:col-span-2 bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-clay-light">
              <Loader2 size={24} className="animate-spin mr-2" /> Loading bookings...
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16 text-clay-light">
              <Calendar size={40} className="mx-auto mb-3 opacity-20" />
              <p>No bookings found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-cream border-b border-parchment">
                  <tr>
                    {['Ref', 'Customer', 'Service', 'Date & Time', 'Seats', 'Total', 'Status'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-clay-light uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-parchment/50">
                  {bookings.map((booking: any) => (
                    <tr
                      key={booking.id}
                      onClick={() => setSelectedBooking(booking)}
                      className={`hover:bg-cream cursor-pointer transition-colors ${selectedBooking?.id === booking.id ? 'bg-terracotta/5' : ''}`}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-clay whitespace-nowrap">{booking.bookingRef}</td>
                      <td className="px-4 py-3 font-medium text-clay whitespace-nowrap">{booking.customer?.name}</td>
                      <td className="px-4 py-3 text-clay-light max-w-[140px] truncate">{booking.service?.name}</td>
                      <td className="px-4 py-3 text-clay-light whitespace-nowrap text-xs">
                        {booking.slot ? `${new Date(booking.slot.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} ${booking.slot.startTime}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-clay text-center">{booking.seats}</td>
                      <td className="px-4 py-3 font-semibold text-clay whitespace-nowrap">{formatCurrency(Number(booking.totalAmount))}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${STATUS_COLORS[booking.status] ?? 'bg-gray-100'}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Booking detail panel */}
        <div>
          {selectedBooking ? (
            <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-playfair font-bold text-clay text-lg">Booking Details</h2>
                <button onClick={() => setSelectedBooking(null)} className="text-clay-light hover:text-clay p-1">
                  <X size={16} />
                </button>
              </div>

              <div className="font-mono text-xs bg-parchment text-clay px-3 py-1.5 rounded-lg w-fit">
                {selectedBooking.bookingRef}
              </div>

              <div className="space-y-2 text-sm">
                {[
                  { label: 'Customer', value: selectedBooking.customer?.name },
                  { label: 'Email', value: selectedBooking.customer?.email },
                  { label: 'Service', value: selectedBooking.service?.name },
                  { label: 'Date', value: selectedBooking.slot ? formatDate(new Date(selectedBooking.slot.date)) : '—' },
                  { label: 'Time', value: selectedBooking.slot ? `${formatTime(selectedBooking.slot.startTime)} – ${formatTime(selectedBooking.slot.endTime)}` : '—' },
                  { label: 'Seats', value: selectedBooking.seats },
                  { label: 'Total', value: formatCurrency(Number(selectedBooking.totalAmount)) },
                  { label: 'Paid', value: formatCurrency(Number(selectedBooking.amountPaid)) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-clay-light">{label}</span>
                    <span className="text-clay font-medium text-right max-w-[55%] truncate">{String(value ?? '—')}</span>
                  </div>
                ))}
              </div>

              {/* Add-ons */}
              {selectedBooking.bookingAddons?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-clay-light uppercase tracking-wide mb-2">Add-ons</p>
                  <div className="space-y-1">
                    {selectedBooking.bookingAddons.map((ba: any) => (
                      <div key={ba.id} className="flex justify-between text-xs text-clay-light">
                        <span>{ba.addon?.name} ×{ba.quantity}</span>
                        <span>{formatCurrency(Number(ba.unitPrice) * ba.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-2">
                <a
                  href={`/admin/checkout?ref=${selectedBooking.bookingRef}`}
                  className="btn-primary py-2.5 text-sm text-center"
                >
                  💳 Process Payment
                </a>
                {selectedBooking.status !== 'CANCELLED' && selectedBooking.status !== 'PAID' && (
                  <button
                    onClick={() => { if (confirm('Cancel this booking?')) cancelMutation.mutate(selectedBooking.id) }}
                    disabled={cancelMutation.isPending}
                    className="py-2.5 text-sm text-center border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-all disabled:opacity-50"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-8 text-center text-clay-light">
              <Calendar size={40} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm">Select a booking to view details and take action.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
