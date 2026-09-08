'use client'

import { SiteHeader } from '@/components/customer/SiteHeader'
import { SiteFooter } from '@/components/customer/SiteFooter'
import Link from 'next/link'
import { Calendar, Clock, MapPin, Download, Ticket, Sparkles, User } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

const SAMPLE_CUSTOMER_BOOKINGS = [
  {
    ref: 'YPB-093GF9BW',
    service: 'Pick & Paint (All Ages)',
    seats: 2,
    date: new Date(Date.now() + 86400000 * 3),
    time: '10:00 – 12:00',
    status: 'CONFIRMED',
    total: 32.0,
    paid: 8.0,
  },
]

export default function AccountPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-warm-white p-6 rounded-3xl border border-parchment shadow-pottery">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center text-2xl font-bold">
                <User size={26} />
              </div>
              <div>
                <h1 className="font-playfair text-2xl font-bold text-clay">My Studio Account</h1>
                <p className="text-clay-light text-xs">guest@example.com &bull; Member since 2026</p>
              </div>
            </div>
            <Link href="/workshops" className="btn-primary py-2.5 px-5 text-xs">
              Book Another Workshop
            </Link>
          </div>

          {/* Bookings Section */}
          <div className="space-y-6">
            <h2 className="font-playfair text-2xl font-bold text-clay flex items-center gap-2">
              <Ticket size={22} className="text-terracotta" /> Upcoming & Past Bookings
            </h2>

            {SAMPLE_CUSTOMER_BOOKINGS.map((booking) => (
              <div
                key={booking.ref}
                className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/70 p-6 flex flex-col md:flex-row justify-between gap-6 items-start md:items-center"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sage/15 text-sage">
                      {booking.status}
                    </span>
                    <span className="font-mono text-xs text-clay-light">Ref: {booking.ref}</span>
                  </div>
                  <h3 className="font-playfair font-bold text-xl text-clay">{booking.service}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-clay-light">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} className="text-terracotta" /> {formatDate(booking.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} className="text-terracotta" /> {booking.time}
                    </span>
                    <span>{booking.seats} guest(s)</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
                  <div className="text-left md:text-right">
                    <p className="text-xs text-clay-light">Total: {formatCurrency(booking.total)}</p>
                    <p className="text-xs font-semibold text-sage">Deposit Paid: {formatCurrency(booking.paid)}</p>
                    <p className="text-xs text-terracotta font-medium">Balance due on arrival: {formatCurrency(booking.total - booking.paid)}</p>
                  </div>
                  <Link
                    href={`/confirmation/${booking.ref}`}
                    className="btn-secondary py-2 px-4 text-xs text-center w-full sm:w-auto"
                  >
                    View Receipt
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
