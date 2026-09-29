'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Printer, FileText, Loader2, Calendar, Users, ChevronDown } from 'lucide-react'
import QRCode from 'qrcode'

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** First Saturday at least 2 weeks after sessionDate */
function getCollectionDate(d: Date): Date {
  const result = new Date(d)
  result.setDate(result.getDate() + 14)
  const dow = result.getDay() // 0=Sun … 6=Sat
  if (dow !== 6) result.setDate(result.getDate() + (6 - dow))
  return result
}

function fmtSessionDate(d: Date) {
  // "27 Sept 2026"
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function fmtCollectionDate(d: Date) {
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Booking {
  id: string
  bookingRef: string
  seats: number
  status: string
  customer: { name: string; email: string }
}

interface Slot {
  id: string
  date: string
  startTime: string
  endTime: string
  service: { name: string }
  bookings: Booking[]
}

// ─── Config ───────────────────────────────────────────────────────────────────

const WIFI_PASSWORD = process.env.NEXT_PUBLIC_WIFI_PASSWORD ?? 'Longfield23'
const GOOGLE_REVIEW_URL = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ?? 'https://g.page/r/YOUR-PLACE-ID/review'

const GOOD_TO_KNOW = [
  'Damp sponge your pottery down',
  'Squirt glaze onto tile and leave bottles at the creation station.',
  'Relax and enjoy tea on the house (Other drinks are charged)',
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function WelcomeSheetsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)
  const [qrDataUrl, setQrDataUrl] = useState('')

  const { data, isLoading } = useQuery<{ slots: Slot[] }>({
    queryKey: ['welcome-slots', selectedDate],
    queryFn: () => fetch(`/api/admin/welcome-sheets?date=${selectedDate}`).then(r => r.json()),
  })

  useEffect(() => {
    QRCode.toDataURL(GOOGLE_REVIEW_URL, {
      width: 200,
      margin: 1,
      color: { dark: '#000000', light: '#FFFFFF' },
    }).then(setQrDataUrl).catch(console.error)
  }, [])

  const slots = data?.slots ?? []
  const slot = slots.find(s => s.id === selectedSlotId) ?? slots[0] ?? null

  // Build the list of individual guests from all bookings
  // Each booking has .seats — expand into individual entries
  // We use the lead booker's name for seat 1, then "Guest 2", "Guest 3" etc.
  const guests: { name: string; bookingRef: string; seatIndex: number }[] = []
  if (slot) {
    let globalIndex = 1
    slot.bookings
      .filter(b => ['CONFIRMED', 'PAID', 'PENDING'].includes(b.status))
      .forEach(b => {
        for (let i = 0; i < b.seats; i++) {
          guests.push({
            name: i === 0 ? b.customer.name : `${b.customer.name.split(' ')[0]}'s Guest ${i}`,
            bookingRef: b.bookingRef,
            seatIndex: globalIndex++,
          })
        }
      })
  }

  const sessionDate = slot ? new Date(slot.date) : new Date()
  const collectionDate = getCollectionDate(sessionDate)
  const totalGuests = guests.length

  // Pair guests into groups of 2 for printing (2 per A4 sheet)
  const pairs: (typeof guests)[] = []
  for (let i = 0; i < guests.length; i += 2) {
    pairs.push(guests.slice(i, i + 2))
  }

  return (
    <>
      {/* Google Fonts — loaded only in browser */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Dancing+Script:wght@700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap"
        rel="stylesheet"
      />

      <div className="space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
          <div>
            <h1 className="font-playfair text-3xl font-bold text-clay">Welcome Sheets</h1>
            <p className="text-clay-light mt-1">
              One card per guest · 2 cards per A4 sheet · matches your studio design
            </p>
          </div>
          <button
            onClick={() => window.print()}
            disabled={!slot || guests.length === 0}
            className="btn-primary flex items-center gap-2 py-3 px-6 disabled:opacity-50"
          >
            <Printer size={18} />
            Print {totalGuests > 0 ? `${totalGuests} Cards (${pairs.length} sheet${pairs.length !== 1 ? 's' : ''})` : 'Welcome Sheets'}
          </button>
        </div>

        {/* ── Controls ── */}
        <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-5 no-print">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label htmlFor="ws-date" className="block text-xs text-clay-light mb-1 font-medium">Session Date</label>
              <input
                id="ws-date"
                type="date"
                value={selectedDate}
                onChange={e => { setSelectedDate(e.target.value); setSelectedSlotId(null) }}
                className="border border-parchment rounded-xl px-3 py-2 text-clay text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/30"
              />
            </div>

            {isLoading ? (
              <div className="flex items-center gap-2 text-clay-light text-sm">
                <Loader2 size={14} className="animate-spin" /> Loading sessions...
              </div>
            ) : slots.length === 0 ? (
              <p className="text-clay-light text-sm self-center">No sessions found for this date.</p>
            ) : (
              <div>
                <label htmlFor="ws-slot" className="block text-xs text-clay-light mb-1 font-medium">Session</label>
                <div className="relative">
                  <select
                    id="ws-slot"
                    value={selectedSlotId ?? slots[0]?.id ?? ''}
                    onChange={e => setSelectedSlotId(e.target.value)}
                    className="appearance-none border border-parchment rounded-xl px-3 py-2 pr-8 text-clay text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                  >
                    {slots.map(s => {
                      const count = s.bookings.filter(b => ['CONFIRMED', 'PAID', 'PENDING'].includes(b.status)).reduce((n, b) => n + b.seats, 0)
                      return (
                        <option key={s.id} value={s.id}>
                          {s.startTime} – {s.service.name} ({count} guest{count !== 1 ? 's' : ''})
                        </option>
                      )
                    })}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-clay-light pointer-events-none" />
                </div>
              </div>
            )}
          </div>

          {slot && (
            <div className="mt-4 p-3 bg-cream rounded-xl border border-parchment text-sm text-clay-light flex flex-wrap gap-5">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-terracotta" />
                {sessionDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={14} className="text-terracotta" />
                {totalGuests} individual guest card{totalGuests !== 1 ? 's' : ''} to print
              </span>
              <span className="flex items-center gap-1.5">
                <FileText size={14} className="text-terracotta" />
                {pairs.length} A4 sheet{pairs.length !== 1 ? 's' : ''} · Collection: {fmtCollectionDate(collectionDate)}
              </span>
            </div>
          )}
        </div>

        {/* ── On-screen preview ── */}
        {slot && guests.length > 0 && (
          <div className="no-print bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-5">
            <p className="text-xs text-clay-light uppercase tracking-wide mb-4 font-medium flex items-center gap-2">
              <FileText size={14} /> Preview (showing card 1 of {totalGuests})
            </p>
            <div className="bg-gray-100 rounded-xl p-6 flex justify-center overflow-auto">
              <div style={{ transform: 'scale(0.55)', transformOrigin: 'top center' }}>
                <GuestCard
                  guestName={guests[0].name}
                  sessionDateStr={fmtSessionDate(sessionDate)}
                  cardIndex={guests[0].seatIndex}
                  totalGuests={totalGuests}
                  collectionDate={collectionDate}
                  wifiPassword={WIFI_PASSWORD}
                  qrDataUrl={qrDataUrl}
                  goodToKnow={GOOD_TO_KNOW}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Print-only output: 2 cards per A4 page ── */}
        {slot && guests.length > 0 && (
          <div className="print-only">
            {pairs.map((pair, pairIdx) => (
              <div key={pairIdx} className="print-page">
                {pair.map(guest => (
                  <GuestCard
                    key={guest.seatIndex}
                    guestName={guest.name}
                    sessionDateStr={fmtSessionDate(sessionDate)}
                    cardIndex={guest.seatIndex}
                    totalGuests={totalGuests}
                    collectionDate={collectionDate}
                    wifiPassword={WIFI_PASSWORD}
                    qrDataUrl={qrDataUrl}
                    goodToKnow={GOOD_TO_KNOW}
                  />
                ))}
                {/* If odd number of guests, pad last page with blank */}
                {pair.length === 1 && <div style={{ width: '96mm' }} />}
              </div>
            ))}
          </div>
        )}

        <style jsx global>{`
          /* ── Screen styles ── */
          @media screen {
            .print-only { display: none !important; }
          }

          /* ── Print styles ── */
          @media print {
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            body * { visibility: hidden !important; }
            .print-only { display: block !important; }
            .print-only, .print-only * { visibility: visible !important; }
            .print-only { position: fixed; inset: 0; }
            .no-print { display: none !important; }

            @page {
              size: A4 landscape;
              margin: 8mm;
            }

            .print-page {
              display: flex;
              flex-direction: row;
              gap: 6mm;
              align-items: flex-start;
              page-break-after: always;
              width: 100%;
              height: 100%;
            }
            .print-page:last-child { page-break-after: auto; }
          }
        `}</style>
      </div>
    </>
  )
}

// ─── Guest Card ───────────────────────────────────────────────────────────────

function GuestCard({
  guestName,
  sessionDateStr,
  cardIndex,
  totalGuests,
  collectionDate,
  wifiPassword,
  qrDataUrl,
  goodToKnow,
}: {
  guestName: string
  sessionDateStr: string
  cardIndex: number
  totalGuests: number
  collectionDate: Date
  wifiPassword: string
  qrDataUrl: string
  goodToKnow: string[]
}) {
  const cardStyle: React.CSSProperties = {
    width: '96mm',
    minHeight: '190mm',
    backgroundColor: '#FFFFFF',
    fontFamily: '"Crimson Text", Georgia, serif',
    padding: '12mm 10mm',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    border: '0.5mm solid #e5e5e5',
    borderRadius: '2mm',
    position: 'relative',
  }

  return (
    <div style={cardStyle}>

      {/* ── Studio name ── */}
      <div style={{ marginBottom: '2mm' }}>
        <p style={{
          margin: 0,
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: '13pt',
          fontWeight: 700,
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: '#2c2c2c',
          lineHeight: 1.1,
        }}>
          Your Pottery Barn
        </p>
      </div>

      {/* ── Botanical leaves + tagline ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3mm' }}>
        <LeafIcon />
        <p style={{
          margin: 0,
          fontSize: '6pt',
          letterSpacing: '2.5px',
          textTransform: 'uppercase',
          color: '#555',
          fontFamily: 'Georgia, serif',
        }}>
          Arts &amp; Crafts Studio
        </p>
        <LeafIcon flip />
      </div>

      {/* ── "welcome" script ── */}
      <div style={{ marginBottom: '4mm', lineHeight: 1 }}>
        <p style={{
          margin: 0,
          fontFamily: '"Dancing Script", cursive',
          fontSize: '42pt',
          fontWeight: 700,
          color: '#1a1a1a',
          lineHeight: 0.9,
          letterSpacing: '-1px',
        }}>
          welcome
        </p>
      </div>

      {/* ── Guest name ── */}
      <div style={{ marginBottom: '1.5mm' }}>
        <p style={{
          margin: 0,
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: '28pt',
          fontWeight: 900,
          color: '#111111',
          lineHeight: 1.05,
          letterSpacing: '-0.5px',
        }}>
          {guestName}
        </p>
      </div>

      {/* ── Date + card index ── */}
      <p style={{
        margin: '0 0 5mm 0',
        fontFamily: '"Crimson Text", Georgia, serif',
        fontSize: '11pt',
        fontWeight: 600,
        color: '#C9A227',
        letterSpacing: '0.5px',
      }}>
        {sessionDateStr} - {cardIndex}
      </p>

      {/* ── Good to know ── */}
      <div style={{ width: '100%', textAlign: 'center', marginBottom: '4mm' }}>
        <p style={{
          margin: '0 0 2mm 0',
          fontFamily: '"Crimson Text", Georgia, serif',
          fontSize: '10pt',
          fontWeight: 600,
          fontStyle: 'italic',
          color: '#1a1a1a',
          letterSpacing: '0.3px',
        }}>
          Good to know:
        </p>
        <div style={{ textAlign: 'left', display: 'inline-block', maxWidth: '80mm' }}>
          {goodToKnow.map((tip, i) => (
            <p key={i} style={{
              margin: '0 0 1.5mm 0',
              fontSize: '8pt',
              color: '#333',
              lineHeight: 1.4,
              fontFamily: '"Crimson Text", Georgia, serif',
            }}>
              - {tip}
            </p>
          ))}
        </div>

        {/* WiFi */}
        <p style={{
          margin: '3mm 0 0 0',
          fontSize: '8pt',
          color: '#333',
          fontFamily: '"Crimson Text", Georgia, serif',
          letterSpacing: '0.2px',
        }}>
          WIFI password: <span style={{ fontWeight: 600, letterSpacing: '1px' }}>{wifiPassword}</span>
        </p>
      </div>

      {/* ── Collection date ── */}
      <div style={{
        width: '100%',
        background: '#f9f9f9',
        border: '0.3mm solid #ddd',
        borderRadius: '1.5mm',
        padding: '2.5mm 4mm',
        marginBottom: '4mm',
        textAlign: 'center',
      }}>
        <p style={{ margin: '0 0 0.5mm 0', fontSize: '7pt', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#777' }}>
          🎨 Your pottery is ready to collect on
        </p>
        <p style={{
          margin: 0,
          fontSize: '9pt',
          fontWeight: 700,
          color: '#1a1a1a',
          fontFamily: '"Playfair Display", Georgia, serif',
        }}>
          {fmtCollectionDate(collectionDate)}
        </p>
      </div>

      {/* ── Spacer ── */}
      <div style={{ flex: 1 }} />

      {/* ── Google review footer ── */}
      <div style={{
        width: '100%',
        borderTop: '0.3mm solid #ccc',
        paddingTop: '4mm',
        display: 'flex',
        alignItems: 'center',
        gap: '4mm',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'left', maxWidth: '52mm' }}>
          <p style={{
            margin: '0 0 1.5mm 0',
            fontFamily: '"Dancing Script", cursive',
            fontSize: '15pt',
            fontWeight: 700,
            color: '#1a1a1a',
            lineHeight: 1.1,
          }}>
            Enjoyed your time at the barn?
          </p>
          <p style={{
            margin: 0,
            fontSize: '7.5pt',
            color: '#444',
            lineHeight: 1.45,
            fontFamily: 'Georgia, serif',
          }}>
            Your <strong>Google</strong> review will mean the world to us. It helps other families/friends discover creative time together. Please scan here:
          </p>
        </div>

        {/* QR code */}
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt="Google Review QR code"
            style={{ width: '28mm', height: '28mm', flexShrink: 0 }}
          />
        ) : (
          <div style={{
            width: '28mm',
            height: '28mm',
            background: '#f5f5f5',
            border: '0.5mm solid #ccc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18pt',
            flexShrink: 0,
          }}>
            ⭐
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Botanical leaf SVG ───────────────────────────────────────────────────────

function LeafIcon({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="28"
      height="12"
      viewBox="0 0 28 12"
      style={{ transform: flip ? 'scaleX(-1)' : undefined, flexShrink: 0 }}
    >
      <path d="M2 6 Q6 1 10 4 Q14 7 18 3 Q22 0 26 5" stroke="#555" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M6 6 Q8 3 10 4" stroke="#555" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      <path d="M12 5.5 Q14 3 16 4" stroke="#555" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      <path d="M18 4.5 Q20 2 22 3" stroke="#555" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      <circle cx="4" cy="7" r="0.8" fill="#555"/>
      <circle cx="10" cy="9" r="0.8" fill="#555"/>
      <circle cx="16" cy="8" r="0.8" fill="#555"/>
      <circle cx="22" cy="6" r="0.8" fill="#555"/>
    </svg>
  )
}
