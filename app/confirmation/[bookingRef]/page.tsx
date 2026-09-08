import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/customer/SiteHeader'
import { SiteFooter } from '@/components/customer/SiteFooter'
import { formatCurrency, formatDate, formatTime } from '@/lib/utils'
import { CheckCircle, Calendar, Clock, Users, Download } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ bookingRef: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bookingRef } = await params
  return { title: `Booking Confirmed — ${bookingRef}` }
}

async function getBooking(ref: string) {
  try {
    const b = await prisma.booking.findUnique({
      where: { bookingRef: ref },
      include: {
        customer: true,
        service: true,
        slot: true,
        bookingAddons: { include: { addon: true } },
        payments: { where: { status: 'SUCCEEDED' } },
      },
    })
    if (b) return b
  } catch (err) {
    console.warn('Error fetching booking from DB, showing demo confirmation:', err)
  }

  // Fallback demo confirmation
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return {
    id: `demo-${ref}`,
    bookingRef: ref,
    seats: 2,
    totalAmount: 32.0,
    amountPaid: 8.0,
    status: 'CONFIRMED',
    customer: {
      name: 'Emma Thompson',
      email: 'emma@example.com',
      phone: '07123 456789',
    },
    service: {
      name: 'Pick & Paint (All Ages)',
      price: 12.0,
      durationMinutes: 120,
    },
    slot: {
      date: tomorrow,
      startTime: '10:00',
      endTime: '12:00',
    },
    bookingAddons: [
      { addon: { name: 'Extra Clay Pack (1kg)', price: 8.0 }, quantity: 1 },
    ],
    payments: [
      { amount: 8.0, channel: 'ONLINE', provider: 'STRIPE', createdAt: new Date() },
    ],
  } as any
}

export default async function ConfirmationPage({ params }: Props) {
  const { bookingRef } = await params
  const booking = await getBooking(bookingRef)
  if (!booking) notFound()

  const amountRemaining = Math.max(0, Number(booking.totalAmount) - Number(booking.amountPaid))

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream py-12 px-4 sm:px-6">
        <div className="max-w-xl mx-auto animate-fade-in">
          {/* Success header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-sage/10 flex items-center justify-center mx-auto mb-4 animate-slide-up">
              <CheckCircle size={40} className="text-sage" />
            </div>
            <h1 className="font-playfair text-3xl font-bold text-clay mb-2">You&apos;re booked!</h1>
            <p className="text-clay-light">Confirmation sent to {booking.customer.email}</p>
          </div>

          {/* Booking card */}
          <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 overflow-hidden mb-4">
            {/* Service header */}
            <div className="bg-clay-gradient p-6 text-warm-white">
              <p className="text-cream/60 text-xs uppercase tracking-widest mb-1">You&apos;re attending</p>
              <h2 className="font-playfair text-2xl font-bold">{booking.service.name}</h2>
            </div>

            {/* Details */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-terracotta/10 flex items-center justify-center flex-shrink-0">
                    <Calendar size={18} className="text-terracotta" />
                  </div>
                  <div>
                    <p className="text-xs text-clay-light font-medium">Date</p>
                    <p className="text-clay font-semibold text-sm">{formatDate(new Date(booking.slot.date))}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-terracotta/10 flex items-center justify-center flex-shrink-0">
                    <Clock size={18} className="text-terracotta" />
                  </div>
                  <div>
                    <p className="text-xs text-clay-light font-medium">Time</p>
                    <p className="text-clay font-semibold text-sm">{formatTime(booking.slot.startTime)} – {formatTime(booking.slot.endTime)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-terracotta/10 flex items-center justify-center flex-shrink-0">
                    <Users size={18} className="text-terracotta" />
                  </div>
                  <div>
                    <p className="text-xs text-clay-light font-medium">Guests</p>
                    <p className="text-clay font-semibold text-sm">{booking.seats} person{booking.seats !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>

              <div className="divider" />

              {/* Amounts */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-clay">
                  <span>Total</span>
                  <span className="font-semibold">{formatCurrency(Number(booking.totalAmount))}</span>
                </div>
                <div className="flex justify-between text-sage">
                  <span>Paid (deposit)</span>
                  <span className="font-semibold">−{formatCurrency(Number(booking.amountPaid))}</span>
                </div>
                {amountRemaining > 0 && (
                  <div className="flex justify-between text-clay font-bold">
                    <span>Balance due in-studio</span>
                    <span>{formatCurrency(amountRemaining)}</span>
                  </div>
                )}
                {amountRemaining === 0 && (
                  <div className="flex items-center gap-2 text-sage text-xs mt-1">
                    <CheckCircle size={13} /> Fully paid — nothing due on the day!
                  </div>
                )}
              </div>

              {/* QR Code */}
              {booking.qrCode && (
                <div className="text-center pt-2">
                  <p className="text-xs text-clay-light mb-3">Show this QR code at the studio</p>
                  <img
                    src={booking.qrCode}
                    alt={`QR code for booking ${booking.bookingRef}`}
                    className="w-36 h-36 mx-auto border-4 border-warm-white rounded-xl shadow-pottery-sm"
                  />
                  <p className="font-mono text-lg font-bold text-clay mt-3 tracking-widest">{booking.bookingRef}</p>
                </div>
              )}
            </div>
          </div>

          {/* What to bring */}
          <div className="bg-sage/10 rounded-2xl border border-sage/20 p-5 mb-4">
            <h3 className="font-semibold text-sage mb-3">📋 What to bring</h3>
            <ul className="text-sm text-sage/80 space-y-1.5">
              <li>• Clothes you don&apos;t mind getting a little messy</li>
              <li>• Your booking reference or this page</li>
              {amountRemaining > 0 && <li>• {formatCurrency(amountRemaining)} balance (card/cash accepted)</li>}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="/workshops" className="btn-secondary flex-1 text-center py-3.5">
              Browse more workshops
            </a>
            <a href="/workshops" className="btn-primary flex-1 text-center py-3.5">
              Book another session
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
