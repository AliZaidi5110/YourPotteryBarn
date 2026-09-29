'use client'

import { useState, useEffect } from 'react'
import {
  Bell, Mail, MessageSquare, CheckCircle, Clock, Sparkles, Send,
  Users, ChevronRight, AlertCircle, RefreshCw
} from 'lucide-react'
import { StudioNotification, StudioSession, SessionBooking } from '@/lib/studio-ops/types'
import { PotteryReadyModal } from '@/components/admin/studio-ops/PotteryReadyModal'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<StudioNotification[]>([])
  const [sessions, setSessions] = useState<StudioSession[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Active modal
  const [selectedSession, setSelectedSession] = useState<StudioSession | null>(null)
  const [sessionBookings, setSessionBookings] = useState<SessionBooking[]>([])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [notifsRes, sessRes] = await Promise.all([
        fetch('/api/admin/notifications'),
        fetch('/api/admin/sessions'),
      ])
      const notifsData = await notifsRes.json()
      const sessData = await sessRes.json()

      setNotifications(notifsData.notifications || [])
      setSessions(sessData.sessions || [])
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenNotifyForSession = async (session: StudioSession) => {
    setSelectedSession(session)
    try {
      const res = await fetch(`/api/admin/sessions/${session.id}/participants`)
      const data = await res.json()
      setSessionBookings(data.bookings || [])
    } catch (e) {
      setSessionBookings([])
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-sage/15 text-sage px-2.5 py-0.5 rounded-full border border-sage/30">
              Customer Communications
            </span>
          </div>
          <h1 className="font-playfair text-3xl font-bold text-clay">
            Pottery Ready &amp; Notification Center
          </h1>
          <p className="text-clay-light text-sm mt-1">
            Trigger automated collection notices, firing delay alerts, and custom SMS/Email updates.
          </p>
        </div>

        <button
          onClick={loadData}
          className="btn-secondary py-2 px-3 text-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          Refresh Activity
        </button>
      </div>

      {/* Grid: Ready Sessions & Dispatch History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Workshop Sessions Ready for Notification (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-warm-white rounded-3xl p-6 border border-parchment shadow-pottery space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-playfair font-bold text-xl text-clay flex items-center gap-2">
                  <Sparkles size={20} className="text-terracotta" />
                  Workshops &amp; Sessions
                </h2>
                <p className="text-xs text-clay-light mt-0.5">
                  Select a past or current session to trigger batch collection notifications.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {sessions.filter(s => !s.isBlackout).map(session => (
                <div
                  key={session.id}
                  className="p-4 rounded-2xl border border-parchment hover:border-terracotta/50 bg-cream/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-pottery-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: session.color }} />
                      <h3 className="font-bold text-clay text-sm">{session.serviceName}</h3>
                    </div>
                    <p className="text-xs text-clay-light">
                      {session.date} ({session.startTime} – {session.endTime}) · {session.capacityBooked} Attendees
                    </p>
                    <p className="text-[11px] text-clay-lighter font-mono">
                      Host: {session.staffName.split(' ')[0]} · {session.location}
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenNotifyForSession(session)}
                    className="btn-primary py-2 px-3 text-xs flex items-center justify-center gap-1.5 shadow-terracotta shrink-0"
                  >
                    <Bell size={13} />
                    <span>Notify Attendees</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Notification Delivery Log (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-warm-white rounded-3xl p-6 border border-parchment shadow-pottery space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-playfair font-bold text-xl text-clay flex items-center gap-2">
                <CheckCircle size={18} className="text-sage" />
                Dispatch History
              </h2>
              <span className="text-xs bg-parchment px-2.5 py-0.5 rounded-full text-clay-light font-mono">
                {notifications.length} Sent
              </span>
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-10 text-clay-light">
                <Bell size={32} className="mx-auto mb-2 opacity-30 text-clay" />
                <p className="text-xs">No notifications sent yet.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                {notifications.map(notif => (
                  <div
                    key={notif.id}
                    className="p-3.5 rounded-2xl border border-parchment/70 bg-cream/40 text-xs space-y-2 shadow-pottery-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {notif.channel === 'SMS' ? (
                          <span className="p-1 rounded-lg bg-terracotta/10 text-terracotta">
                            <MessageSquare size={13} />
                          </span>
                        ) : (
                          <span className="p-1 rounded-lg bg-sage/10 text-sage">
                            <Mail size={13} />
                          </span>
                        )}
                        <div>
                          <p className="font-bold text-clay text-xs">{notif.customerName}</p>
                          <p className="text-[10px] text-clay-lighter font-mono">{notif.recipient}</p>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold text-sage bg-sage/15 px-2 py-0.5 rounded-full border border-sage/30">
                        {notif.status}
                      </span>
                    </div>

                    <p className="text-[11px] font-semibold text-clay">{notif.title}</p>
                    <p className="text-[11px] text-clay-light line-clamp-2 leading-relaxed bg-warm-white p-2 rounded-xl border border-parchment/50">
                      {notif.message}
                    </p>

                    <div className="text-[10px] text-clay-lighter text-right">
                      {notif.sentAt}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Pottery Ready Modal */}
      {selectedSession && (
        <PotteryReadyModal
          session={selectedSession}
          bookings={sessionBookings}
          onClose={() => setSelectedSession(null)}
          onSuccess={() => {
            loadData()
          }}
        />
      )}
    </div>
  )
}
