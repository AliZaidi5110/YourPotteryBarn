'use client'

import { useState } from 'react'
import {
  X, Bell, Mail, MessageSquare, Check, Sparkles, AlertTriangle,
  Send, Users, CheckCircle2, Clock, MapPin, Edit3
} from 'lucide-react'
import { SessionBooking, StudioSession } from '@/lib/studio-ops/types'

interface PotteryReadyModalProps {
  session: StudioSession
  bookings: SessionBooking[]
  preSelectedBookingIds?: string[]
  onClose: () => void
  onSuccess?: () => void
}

type NotificationTemplateType = 'COLLECTION_READY' | 'FIRING_DELAY' | 'CUSTOM'

export function PotteryReadyModal({
  session,
  bookings,
  preSelectedBookingIds = [],
  onClose,
  onSuccess,
}: PotteryReadyModalProps) {
  // Selected attendees
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    if (preSelectedBookingIds.length > 0) return preSelectedBookingIds
    return bookings.map(b => b.id)
  })

  // Template Type
  const [templateType, setTemplateType] = useState<NotificationTemplateType>('COLLECTION_READY')
  const [channel, setChannel] = useState<'EMAIL' | 'SMS' | 'BOTH'>('EMAIL')
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [sentCount, setSentCount] = useState(0)

  // Default templates
  const TEMPLATES: Record<NotificationTemplateType, { title: string; message: string }> = {
    COLLECTION_READY: {
      title: '✨ Your Pottery is Glazed, Fired & Ready for Collection!',
      message:
        'Hi {name},\n\nGreat news! Your ceramic pieces from your workshop ({service}) on {sessionDate} have been carefully glazed, kiln-fired, and are now ready for collection at {studioAddress}!\n\nOur collection desk is open Wed–Sun, 10:00am – 5:00pm. Please have your booking reference {bookingRef} handy on arrival.\n\nWe cannot wait for you to see your finished artwork!\nWarm regards,\nYour Pottery Barn Team',
    },
    FIRING_DELAY: {
      title: '⏳ Studio Kiln Update: Small Firing Delay for Your Pottery',
      message:
        'Hi {name},\n\nA quick update regarding your pottery from {service} on {sessionDate}. Our high-temperature kiln cycle is taking an additional 48 hours for gradual, gentle cooling to ensure zero thermal cracking on your pieces.\n\nYour items will now be ready for collection starting this Friday at {studioAddress}. Quote ref {bookingRef} when popping in.\n\nThank you so much for your patience!\nYour Pottery Barn Team',
    },
    CUSTOM: {
      title: 'Studio Message from Your Pottery Barn',
      message:
        'Hi {name},\n\nWe have an update regarding your {service} session on {sessionDate} (Ref: {bookingRef}). Please get in touch if you have any questions!\n\nYour Pottery Barn Team',
    },
  }

  const [customTitle, setCustomTitle] = useState(TEMPLATES.COLLECTION_READY.title)
  const [customMessage, setCustomMessage] = useState(TEMPLATES.COLLECTION_READY.message)

  // Select all or toggle
  const handleToggleSelectAll = () => {
    if (selectedIds.length === bookings.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(bookings.map(b => b.id))
    }
  }

  const handleToggleAttendee = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  // Switch template
  const handleSelectTemplate = (type: NotificationTemplateType) => {
    setTemplateType(type)
    setCustomTitle(TEMPLATES[type].title)
    setCustomMessage(TEMPLATES[type].message)
  }

  // Insert tag helper
  const handleInsertTag = (tag: string) => {
    setCustomMessage(prev => prev + ` ${tag}`)
  }

  // Sample preview target
  const sampleBooking = bookings.find(b => selectedIds.includes(b.id)) || bookings[0]

  const previewMessage = sampleBooking
    ? customMessage
        .replace(/\{name\}/g, sampleBooking.customerName)
        .replace(/\{service\}/g, session.serviceName)
        .replace(/\{sessionDate\}/g, session.date)
        .replace(/\{bookingRef\}/g, sampleBooking.bookingRef)
        .replace(/\{studioAddress\}/g, 'Hartley, Longfield, Kent DA3')
    : customMessage

  // Send trigger
  const handleSendNotifications = async () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one attendee to notify.')
      return
    }

    setIsSending(true)

    const recipientList = bookings
      .filter(b => selectedIds.includes(b.id))
      .map(b => ({
        bookingId: b.id,
        name: b.customerName,
        email: b.customerEmail,
        phone: b.customerPhone,
        bookingRef: b.bookingRef,
        sessionDate: session.date,
        serviceName: session.serviceName,
      }))

    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: recipientList,
          type: templateType,
          title: customTitle,
          messageTemplate: customMessage,
          channel: channel === 'BOTH' ? 'EMAIL' : channel,
        }),
      })

      const data = await res.json()
      setIsSending(false)
      setIsSent(true)
      setSentCount(data.count || recipientList.length)
      if (onSuccess) onSuccess()
    } catch (err) {
      console.error(err)
      setIsSending(false)
      alert('Failed to dispatch notifications. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-clay/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-warm-white w-full max-w-4xl h-[92vh] max-h-[820px] rounded-3xl shadow-pottery-xl flex flex-col overflow-hidden border border-parchment">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-parchment flex items-center justify-between bg-cream/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sage text-warm-white flex items-center justify-center shadow-pottery-sm">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="font-playfair font-bold text-xl text-clay">Pottery Ready Notification Center</h2>
              <p className="text-xs text-clay-light">
                {session.serviceName} · {session.date} ({session.startTime} – {session.endTime})
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

        {!isSent ? (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
            
            {/* Left Col: Attendee Selector & Template Chooser (5 cols) */}
            <div className="lg:col-span-5 p-5 border-r border-parchment/60 flex flex-col overflow-y-auto bg-cream/20">
              
              {/* Template Buttons */}
              <div className="space-y-2 mb-4">
                <label className="text-xs font-bold text-clay uppercase tracking-wider block">
                  1. Quick Notification Trigger
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectTemplate('COLLECTION_READY')}
                    className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                      templateType === 'COLLECTION_READY'
                        ? 'border-sage bg-sage/10 text-sage font-bold shadow-sm'
                        : 'border-parchment bg-warm-white text-clay-light hover:text-clay'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-sage">
                      <Sparkles size={14} />
                      <span className="font-bold">Pottery Ready</span>
                    </div>
                    <span className="text-[11px] text-clay-light">Glazed & ready to collect</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectTemplate('FIRING_DELAY')}
                    className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                      templateType === 'FIRING_DELAY'
                        ? 'border-amber-500 bg-amber-50 text-amber-800 font-bold shadow-sm'
                        : 'border-parchment bg-warm-white text-clay-light hover:text-clay'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-amber-700">
                      <Clock size={14} />
                      <span className="font-bold">Firing Delay</span>
                    </div>
                    <span className="text-[11px] text-clay-light">Kiln cooling delay notice</span>
                  </button>
                </div>
              </div>

              {/* Delivery Channel */}
              <div className="mb-4">
                <label className="text-xs font-bold text-clay uppercase tracking-wider block mb-1.5">
                  2. Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'EMAIL', label: 'Email', icon: Mail },
                    { id: 'SMS', label: 'SMS', icon: MessageSquare },
                    { id: 'BOTH', label: 'Both', icon: Send },
                  ].map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setChannel(c.id as any)}
                      className={`p-2 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                        channel === c.id
                          ? 'border-terracotta bg-terracotta text-warm-white font-bold'
                          : 'border-parchment bg-warm-white text-clay-light hover:text-clay'
                      }`}
                    >
                      <c.icon size={13} />
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Attendee Roster Checklist */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-clay uppercase tracking-wider">
                    3. Select Attendees ({selectedIds.length}/{bookings.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    className="text-xs text-terracotta hover:underline font-medium"
                  >
                    {selectedIds.length === bookings.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-56">
                  {bookings.map(b => {
                    const isSelected = selectedIds.includes(b.id)
                    return (
                      <label
                        key={b.id}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer text-xs transition-all ${
                          isSelected
                            ? 'border-sage/40 bg-sage/10 text-clay'
                            : 'border-parchment bg-warm-white text-clay-light hover:bg-cream'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleAttendee(b.id)}
                          className="w-4 h-4 rounded text-sage focus:ring-sage border-parchment"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-clay truncate">{b.customerName}</p>
                          <p className="text-[11px] text-clay-light truncate">
                            {channel === 'SMS' ? (b.customerPhone || b.customerEmail) : b.customerEmail}
                          </p>
                        </div>
                        <span className="font-mono text-[10px] bg-parchment px-1.5 py-0.5 rounded text-clay-light">
                          {b.seats} 👤
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right Col: Inline Text Editor & Live Preview (7 cols) */}
            <div className="lg:col-span-7 p-5 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                
                {/* Subject line (Email) */}
                <div>
                  <label className="text-xs font-semibold text-clay block mb-1">
                    Notification Subject / Headline
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={e => setCustomTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-parchment rounded-xl text-clay text-sm bg-cream/30 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta font-medium"
                  />
                </div>

                {/* Inline Message Editor */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-clay flex items-center gap-1.5">
                      <Edit3 size={13} className="text-terracotta" />
                      Personalize Message (Staff Inline Editor)
                    </label>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-clay-light">Insert Tag:</span>
                      {['{name}', '{sessionDate}', '{bookingRef}'].map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleInsertTag(tag)}
                          className="text-[10px] bg-parchment/80 hover:bg-terracotta hover:text-warm-white text-clay px-1.5 py-0.5 rounded transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    rows={6}
                    value={customMessage}
                    onChange={e => setCustomMessage(e.target.value)}
                    className="w-full p-3 border border-parchment rounded-xl text-clay text-xs bg-warm-white focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta leading-relaxed font-sans"
                  />
                </div>

                {/* Live Customer Preview */}
                <div>
                  <label className="text-xs font-semibold text-clay block mb-1 text-clay-light uppercase tracking-wider">
                    Customer Inbox Preview
                  </label>
                  <div className="bg-cream/70 border border-parchment rounded-2xl p-4 text-xs space-y-2">
                    <div className="flex items-center justify-between text-clay-light border-b border-parchment/60 pb-2">
                      <span className="font-semibold text-clay">From: Your Pottery Barn &lt;hello@yourpottery.co.uk&gt;</span>
                      <span className="text-[10px] font-mono">To: {sampleBooking?.customerName || 'Customer'}</span>
                    </div>
                    <p className="font-bold text-clay text-sm">{customTitle}</p>
                    <div className="whitespace-pre-wrap text-clay-light leading-relaxed text-[11px] pt-1">
                      {previewMessage}
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-parchment flex items-center justify-between gap-3 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs text-clay-light hover:text-clay font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendNotifications}
                  disabled={isSending || selectedIds.length === 0}
                  className="btn-primary py-3 px-6 text-sm flex items-center gap-2 shadow-terracotta disabled:opacity-50"
                >
                  <Send size={15} />
                  <span>
                    {isSending
                      ? 'Dispatching Notifications...'
                      : `Send to ${selectedIds.length} Attendee${selectedIds.length !== 1 ? 's' : ''}`}
                  </span>
                </button>
              </div>

            </div>
          </div>
        ) : (
          /* Sent Confirmation State */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-sage/20 text-sage flex items-center justify-center shadow-pottery-sm">
              <CheckCircle2 size={44} />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-sage bg-sage/15 px-3 py-1 rounded-full border border-sage/30">
                Dispatched Successfully
              </span>
              <h3 className="font-playfair font-bold text-3xl text-clay mt-3">
                {sentCount} Notification{sentCount !== 1 ? 's' : ''} Sent!
              </h3>
              <p className="text-sm text-clay-light mt-1 max-w-md mx-auto">
                Customers have been alerted via {channel} with collection details and their booking references.
              </p>
            </div>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="btn-primary px-8 py-3 text-sm"
              >
                Close & Return to Calendar
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
