'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Users,
  MapPin, Plus, Lock, Sparkles, Filter, Move, Check, AlertCircle, RefreshCw, X
} from 'lucide-react'
import { StudioSession, SessionBooking } from '@/lib/studio-ops/types'
import { STUDIO_STAFF, STUDIO_LOCATIONS, STUDIO_SERVICES_CATALOG } from '@/lib/studio-ops/data'
import { ParticipantDrawer } from './ParticipantDrawer'
import { formatCurrency } from '@/lib/utils'

interface AdminCalendarProps {
  initialSessions?: StudioSession[]
}

type CalendarView = 'week' | 'day'

// Hours from 09:00 to 21:00 (9am - 9pm)
const HOURS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
]

export function AdminCalendar({ initialSessions }: AdminCalendarProps) {
  const [sessions, setSessions] = useState<StudioSession[]>(initialSessions || [])
  const [view, setView] = useState<CalendarView>('week')
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [selectedStaff, setSelectedStaff] = useState<string>('All')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  // Selected session for drawer
  const [activeSession, setActiveSession] = useState<StudioSession | null>(null)
  const [activeBookings, setActiveBookings] = useState<SessionBooking[]>([])
  const [isLoadingBookings, setIsLoadingBookings] = useState(false)

  // Quick Action Slot Click Modal
  const [slotModalData, setSlotModalData] = useState<{
    date: string
    time: string
  } | null>(null)
  const [slotModalTab, setSlotModalTab] = useState<'workshop' | 'blackout'>('workshop')

  // New Workshop Form State
  const [newServiceId, setNewServiceId] = useState(STUDIO_SERVICES_CATALOG[0].id)
  const [newStartTime, setNewStartTime] = useState('10:00')
  const [newEndTime, setNewEndTime] = useState('12:00')
  const [newStaff, setNewStaff] = useState(STUDIO_STAFF[0])
  const [newLocation, setNewLocation] = useState(STUDIO_LOCATIONS[0])
  const [newCapacity, setNewCapacity] = useState(16)
  const [newNotes, setNewNotes] = useState('')

  // Blackout block state
  const [blackoutReason, setBlackoutReason] = useState('Private Event / Studio Buyout')
  const [blackoutStaff, setBlackoutStaff] = useState(STUDIO_STAFF[3])

  // Drag and drop state
  const [draggedSessionId, setDraggedSessionId] = useState<string | null>(null)
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null)

  // Reschedule modal
  const [rescheduleSession, setRescheduleSession] = useState<StudioSession | null>(null)
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleTime, setRescheduleTime] = useState('')

  // Fetch sessions on mount / date change
  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/admin/sessions')
      const data = await res.json()
      if (data.sessions) {
        setSessions(data.sessions)
      }
    } catch (e) {
      console.warn('Failed to reload sessions', e)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  // Calculate week days for current date (Monday through Sunday)
  const weekDays = useMemo(() => {
    const days: { date: Date; dateStr: string; label: string; isToday: boolean }[] = []
    const curr = new Date(currentDate)
    
    // Set to Monday of current week
    const day = curr.getDay()
    const diff = curr.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
    const monday = new Date(curr.setDate(diff))

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      const dateStr = d.toISOString().split('T')[0]
      const todayStr = new Date().toISOString().split('T')[0]

      days.push({
        date: d,
        dateStr,
        label: d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
        isToday: dateStr === todayStr,
      })
    }
    return days
  }, [currentDate])

  // Current day string
  const currentDayStr = currentDate.toISOString().split('T')[0]

  // Filtered sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter(s => {
      const matchesStaff = selectedStaff === 'All' || s.staffName.includes(selectedStaff)
      const matchesCategory = selectedCategory === 'All' || s.serviceCategory === selectedCategory
      return matchesStaff && matchesCategory
    })
  }, [sessions, selectedStaff, selectedCategory])

  // Navigation handlers
  const handlePrev = () => {
    const d = new Date(currentDate)
    if (view === 'week') {
      d.setDate(d.getDate() - 7)
    } else {
      d.setDate(d.getDate() - 1)
    }
    setCurrentDate(d)
  }

  const handleNext = () => {
    const d = new Date(currentDate)
    if (view === 'week') {
      d.setDate(d.getDate() + 7)
    } else {
      d.setDate(d.getDate() + 1)
    }
    setCurrentDate(d)
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  // Load participant roster when clicking a session card
  const handleSessionClick = async (session: StudioSession) => {
    setActiveSession(session)
    setIsLoadingBookings(true)

    try {
      const res = await fetch(`/api/admin/sessions/${session.id}/participants`)
      const data = await res.json()
      setActiveBookings(data.bookings || [])
    } catch (err) {
      console.error(err)
      setActiveBookings([])
    } finally {
      setIsLoadingBookings(false)
    }
  }

  // Quick slot click handler
  const handleSlotClick = (dateStr: string, timeStr: string) => {
    setSlotModalData({ date: dateStr, time: timeStr })
    setNewStartTime(timeStr)
    // auto set end time 2h later
    const h = parseInt(timeStr.split(':')[0]) + 2
    setNewEndTime(`${h < 10 ? '0' : ''}${h}:00`)
  }

  // Create Workshop Session Submit
  const handleCreateWorkshop = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!slotModalData) return

    const selectedService = STUDIO_SERVICES_CATALOG.find(s => s.id === newServiceId) || STUDIO_SERVICES_CATALOG[0]

    try {
      const res = await fetch('/api/admin/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService.id,
          serviceName: selectedService.name,
          serviceCategory: selectedService.category,
          servicePrice: Number(selectedService.price),
          date: slotModalData.date,
          startTime: newStartTime,
          endTime: newEndTime,
          staffName: newStaff,
          location: newLocation,
          capacityMax: Number(newCapacity),
          notes: newNotes,
        }),
      })

      const data = await res.json()
      if (data.session) {
        setSessions(prev => [...prev, data.session])
        setSlotModalData(null)
      }
    } catch (err) {
      console.error(err)
      alert('Failed to schedule session.')
    }
  }

  // Create Blackout Block Submit
  const handleCreateBlackout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!slotModalData) return

    try {
      const res = await fetch('/api/admin/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: 'blackout',
          serviceName: blackoutReason,
          serviceCategory: 'Blackout',
          servicePrice: 0,
          date: slotModalData.date,
          startTime: newStartTime,
          endTime: newEndTime,
          staffName: blackoutStaff,
          location: newLocation,
          capacityMax: 0,
          isBlackout: true,
          blackoutReason,
        }),
      })

      const data = await res.json()
      if (data.session) {
        setSessions(prev => [...prev, data.session])
        setSlotModalData(null)
      }
    } catch (err) {
      console.error(err)
      alert('Failed to block staff time.')
    }
  }

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, session: StudioSession) => {
    e.dataTransfer.setData('text/plain', session.id)
    setDraggedSessionId(session.id)
  }

  const handleDragOver = (e: React.DragEvent, slotKey: string) => {
    e.preventDefault()
    setDragOverSlot(slotKey)
  }

  const handleDrop = async (e: React.DragEvent, targetDate: string, targetTime: string) => {
    e.preventDefault()
    setDragOverSlot(null)
    const sessionId = e.dataTransfer.getData('text/plain') || draggedSessionId
    if (!sessionId) return

    const session = sessions.find(s => s.id === sessionId)
    if (!session) return

    // Calculate new end time maintaining duration
    const [startH, startM] = session.startTime.split(':').map(Number)
    const [endH, endM] = session.endTime.split(':').map(Number)
    const durationMins = (endH * 60 + endM) - (startH * 60 + startM)

    const [newStartH, newStartM] = targetTime.split(':').map(Number)
    const newEndTotalMins = newStartH * 60 + newStartM + durationMins
    const newEndH = Math.floor(newEndTotalMins / 60)
    const newEndM = newEndTotalMins % 60
    const calculatedEndTime = `${newEndH < 10 ? '0' : ''}${newEndH}:${newEndM < 10 ? '0' : ''}${newEndM}`

    // Optimistic UI update
    setSessions(prev =>
      prev.map(s =>
        s.id === sessionId
          ? { ...s, date: targetDate, startTime: targetTime, endTime: calculatedEndTime }
          : s
      )
    )

    // Backend update
    try {
      await fetch(`/api/admin/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: targetDate,
          startTime: targetTime,
          endTime: calculatedEndTime,
        }),
      })
    } catch (err) {
      console.error(err)
      fetchSessions()
    }

    setDraggedSessionId(null)
  }

  // Reschedule Dialog Submit
  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rescheduleSession || !rescheduleDate || !rescheduleTime) return

    try {
      const res = await fetch(`/api/admin/sessions/${rescheduleSession.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: rescheduleDate,
          startTime: rescheduleTime,
        }),
      })
      const data = await res.json()
      if (data.session) {
        setSessions(prev => prev.map(s => s.id === rescheduleSession.id ? data.session : s))
        if (activeSession?.id === rescheduleSession.id) {
          setActiveSession(data.session)
        }
        setRescheduleSession(null)
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Add Participant Handlers (Module 2 integration)
  const handleAddParticipant = async (participantData: any) => {
    if (!activeSession) return

    try {
      const res = await fetch(`/api/admin/sessions/${activeSession.id}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(participantData),
      })
      const data = await res.json()
      if (data.booking) {
        setActiveBookings(prev => [...prev, data.booking])
        // Update session in list
        if (data.session) {
          setSessions(prev => prev.map(s => s.id === activeSession.id ? data.session : s))
          setActiveSession(data.session)
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleToggleCheckIn = async (bookingId: string) => {
    if (!activeSession) return

    try {
      const res = await fetch(`/api/admin/sessions/${activeSession.id}/participants`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, action: 'toggleCheckIn' }),
      })
      const data = await res.json()
      if (data.booking) {
        setActiveBookings(prev =>
          prev.map(b => b.id === bookingId ? data.booking : b)
        )
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-5">
      {/* Calendar Top Control Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-warm-white p-5 rounded-3xl border border-parchment shadow-pottery">
        
        {/* Title & Navigation */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-cream p-1 rounded-2xl border border-parchment">
            <button
              onClick={handlePrev}
              className="p-2 text-clay hover:bg-parchment/60 rounded-xl transition-colors"
              title="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleToday}
              className="px-3.5 py-1.5 text-xs font-semibold text-clay hover:bg-parchment/60 rounded-xl transition-colors"
            >
              Today
            </button>
            <button
              onClick={handleNext}
              className="p-2 text-clay hover:bg-parchment/60 rounded-xl transition-colors"
              title="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div>
            <h2 className="font-playfair text-xl font-bold text-clay">
              {view === 'week'
                ? `${weekDays[0].label} — ${weekDays[6].label}`
                : currentDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </h2>
            <p className="text-xs text-clay-light">
              Interactive studio timetable · Drag sessions to reschedule or click slot to add
            </p>
          </div>
        </div>

        {/* Filters & View Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Staff Filter */}
          <select
            value={selectedStaff}
            onChange={e => setSelectedStaff(e.target.value)}
            className="px-3 py-2 text-xs font-medium border border-parchment rounded-xl bg-cream text-clay focus:outline-none focus:border-terracotta"
          >
            <option value="All">All Staff Members</option>
            {STUDIO_STAFF.map(s => (
              <option key={s} value={s.split(' ')[0]}>{s}</option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs font-medium border border-parchment rounded-xl bg-cream text-clay focus:outline-none focus:border-terracotta"
          >
            <option value="All">All Categories</option>
            <option value="Paint">Pick & Paint</option>
            <option value="Throwing">Pottery Throwing</option>
            <option value="Clay">Clay Workshops</option>
            <option value="Seasonal">Seasonal Specials</option>
            <option value="Blackout">Blackout Blocks</option>
          </select>

          {/* View Toggle (Day / Week) */}
          <div className="flex items-center bg-cream p-1 rounded-2xl border border-parchment">
            <button
              onClick={() => setView('day')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                view === 'day'
                  ? 'bg-clay text-warm-white shadow-sm'
                  : 'text-clay-light hover:text-clay'
              }`}
            >
              Day Grid
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                view === 'week'
                  ? 'bg-clay text-warm-white shadow-sm'
                  : 'text-clay-light hover:text-clay'
              }`}
            >
              Weekly Grid
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="bg-warm-white rounded-3xl border border-parchment shadow-pottery-xl overflow-hidden flex flex-col">
        
        {/* Days Header */}
        <div className="grid grid-cols-[70px_repeat(7,1fr)] border-b border-parchment bg-cream/60">
          <div className="p-3 text-[11px] font-mono font-bold text-clay-light border-r border-parchment flex items-center justify-center">
            TIME
          </div>
          {(view === 'week' ? weekDays : [{ date: currentDate, dateStr: currentDayStr, label: currentDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' }), isToday: currentDayStr === new Date().toISOString().split('T')[0] }]).map(d => (
            <div
              key={d.dateStr}
              className={`p-3 text-center border-r border-parchment last:border-r-0 ${
                d.isToday ? 'bg-terracotta/10 text-terracotta font-bold' : 'text-clay'
              }`}
            >
              <p className="text-xs uppercase tracking-wider font-semibold">{d.label.split(' ')[0]}</p>
              <p className="text-sm font-bold font-playfair">{d.label.split(' ').slice(1).join(' ')}</p>
            </div>
          ))}
        </div>

        {/* Time Slots Grid Body */}
        <div className="divide-y divide-parchment/60 overflow-y-auto max-h-[720px]">
          {HOURS.map(hour => {
            const daysToShow = view === 'week' ? weekDays : [{ dateStr: currentDayStr }]

            return (
              <div
                key={hour}
                className={`grid ${
                  view === 'week' ? 'grid-cols-[70px_repeat(7,1fr)]' : 'grid-cols-[70px_1fr]'
                } min-h-[96px] group`}
              >
                {/* Time Axis Column */}
                <div className="p-2 text-right pr-3 text-xs font-mono text-clay-lighter border-r border-parchment bg-cream/20 flex flex-col justify-start">
                  <span>{hour}</span>
                </div>

                {/* Day Columns */}
                {daysToShow.map(dayCol => {
                  const dateStr = dayCol.dateStr
                  const slotKey = `${dateStr}-${hour}`

                  // Find sessions that match this date and start around this hour
                  const slotSessions = filteredSessions.filter(s => {
                    if (s.date !== dateStr) return false
                    const [sHour] = s.startTime.split(':')
                    const [currHour] = hour.split(':')
                    return parseInt(sHour) === parseInt(currHour)
                  })

                  const isDropHover = dragOverSlot === slotKey

                  return (
                    <div
                      key={slotKey}
                      onDragOver={e => handleDragOver(e, slotKey)}
                      onDrop={e => handleDrop(e, dateStr, hour)}
                      className={`p-1.5 border-r border-parchment last:border-r-0 relative transition-colors ${
                        isDropHover ? 'bg-terracotta/15 border-2 border-dashed border-terracotta' : 'hover:bg-cream/40'
                      }`}
                    >
                      {/* Empty Slot Click Trigger */}
                      {slotSessions.length === 0 && (
                        <button
                          onClick={() => handleSlotClick(dateStr, hour)}
                          className="w-full h-full min-h-[80px] rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-terracotta/5 hover:bg-terracotta/10 border border-dashed border-terracotta/30 text-terracotta text-xs font-medium gap-1"
                        >
                          <Plus size={14} /> Add Session
                        </button>
                      )}

                      {/* Rendered Session Cards */}
                      {slotSessions.map(session => {
                        const isFull = session.capacityRemaining <= 0
                        return (
                          <div
                            key={session.id}
                            draggable
                            onDragStart={e => handleDragStart(e, session)}
                            onClick={() => handleSessionClick(session)}
                            className={`rounded-2xl p-3 shadow-pottery-sm cursor-pointer transition-all hover:shadow-pottery hover:scale-[1.01] mb-2 select-none border ${
                              session.isBlackout
                                ? 'bg-zinc-100 border-zinc-300 text-zinc-700'
                                : 'bg-warm-white border-parchment'
                            }`}
                            style={{
                              borderLeftWidth: '5px',
                              borderLeftColor: session.color,
                            }}
                          >
                            {/* Card Top: Title & Move Icon */}
                            <div className="flex items-start justify-between gap-1 mb-1">
                              <h4 className="font-bold text-clay text-xs leading-snug truncate">
                                {session.serviceName}
                              </h4>
                              <span
                                className="text-clay-lighter hover:text-clay p-0.5 cursor-grab"
                                title="Drag to reschedule"
                              >
                                <Move size={12} />
                              </span>
                            </div>

                            {/* Card Time & Staff */}
                            <div className="text-[11px] text-clay-light space-y-0.5">
                              <p className="flex items-center gap-1 font-mono">
                                <Clock size={11} className="text-terracotta shrink-0" />
                                <span>{session.startTime} – {session.endTime}</span>
                              </p>
                              <p className="truncate text-clay-lighter">
                                {session.staffName.split(' ')[0]} · {session.location.split('-')[0]}
                              </p>
                            </div>

                            {/* Card Bottom: Live Capacity Counter */}
                            <div className="mt-2 pt-1.5 border-t border-parchment/60 flex items-center justify-between">
                              {session.isBlackout ? (
                                <span className="text-[10px] font-medium text-zinc-500 flex items-center gap-1">
                                  <Lock size={10} /> Blocked Time
                                </span>
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                                      isFull
                                        ? 'bg-red-50 text-red-600 border border-red-200'
                                        : 'bg-sage/15 text-sage'
                                    }`}
                                  >
                                    {session.capacityBooked}/{session.capacityMax} 👤
                                  </span>
                                  {session.waitlistCount > 0 && (
                                    <span className="text-[9px] bg-amber-100 text-amber-800 px-1 rounded font-medium">
                                      W:{session.waitlistCount}
                                    </span>
                                  )}
                                </div>
                              )}

                              {!session.isBlackout && session.totalDepositsCollected > 0 && (
                                <span className="text-[10px] font-mono font-semibold text-terracotta">
                                  {formatCurrency(session.totalDepositsCollected)}
                                </span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Action Slot Click Modal */}
      {slotModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-clay/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-warm-white w-full max-w-lg rounded-3xl p-6 shadow-pottery-xl border border-parchment">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-playfair font-bold text-xl text-clay">Schedule Session or Block</h3>
                <p className="text-xs text-clay-light">
                  {slotModalData.date} at {slotModalData.time}
                </p>
              </div>
              <button
                onClick={() => setSlotModalData(null)}
                className="text-clay-light hover:text-clay p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="grid grid-cols-2 gap-2 mb-4 bg-cream p-1 rounded-2xl border border-parchment">
              <button
                type="button"
                onClick={() => setSlotModalTab('workshop')}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  slotModalTab === 'workshop'
                    ? 'bg-clay text-warm-white shadow-sm'
                    : 'text-clay-light hover:text-clay'
                }`}
              >
                Class / Workshop Session
              </button>
              <button
                type="button"
                onClick={() => setSlotModalTab('blackout')}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  slotModalTab === 'blackout'
                    ? 'bg-clay text-warm-white shadow-sm'
                    : 'text-clay-light hover:text-clay'
                }`}
              >
                Block Staff Time
              </button>
            </div>

            {/* Tab 1: Workshop Session Form */}
            {slotModalTab === 'workshop' && (
              <form onSubmit={handleCreateWorkshop} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-clay block mb-1">Select Workshop Service</label>
                  <select
                    value={newServiceId}
                    onChange={e => setNewServiceId(e.target.value)}
                    className="w-full px-3 py-2 border border-parchment rounded-xl bg-cream/50 text-clay outline-none"
                  >
                    {STUDIO_SERVICES_CATALOG.map(srv => (
                      <option key={srv.id} value={srv.id}>
                        {srv.name} ({srv.category}) — {formatCurrency(Number(srv.price))}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-clay block mb-1">Start Time</label>
                    <input
                      type="text"
                      value={newStartTime}
                      onChange={e => setNewStartTime(e.target.value)}
                      className="w-full px-3 py-2 border border-parchment rounded-xl bg-cream/50 text-clay font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-clay block mb-1">End Time</label>
                    <input
                      type="text"
                      value={newEndTime}
                      onChange={e => setNewEndTime(e.target.value)}
                      className="w-full px-3 py-2 border border-parchment rounded-xl bg-cream/50 text-clay font-mono outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-clay block mb-1">Assigned Ceramist / Host</label>
                    <select
                      value={newStaff}
                      onChange={e => setNewStaff(e.target.value)}
                      className="w-full px-3 py-2 border border-parchment rounded-xl bg-cream/50 text-clay outline-none"
                    >
                      {STUDIO_STAFF.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-clay block mb-1">Session Capacity (Seats)</label>
                    <input
                      type="number"
                      min={1}
                      max={40}
                      value={newCapacity}
                      onChange={e => setNewCapacity(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-parchment rounded-xl bg-cream/50 text-clay font-mono outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-clay block mb-1">Studio Table / Location</label>
                  <select
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-parchment rounded-xl bg-cream/50 text-clay outline-none"
                  >
                    {STUDIO_LOCATIONS.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-clay block mb-1">Internal Notes</label>
                  <input
                    type="text"
                    value={newNotes}
                    onChange={e => setNewNotes(e.target.value)}
                    placeholder="e.g. Set up extra aprons, birthday party setup..."
                    className="w-full px-3 py-2 border border-parchment rounded-xl bg-cream/50 text-clay outline-none"
                  />
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSlotModalData(null)}
                    className="btn-secondary flex-1 py-2 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1 py-2 text-xs"
                  >
                    Create Session
                  </button>
                </div>
              </form>
            )}

            {/* Tab 2: Blackout Block Form */}
            {slotModalTab === 'blackout' && (
              <form onSubmit={handleCreateBlackout} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-clay block mb-1">Reason for Blackout</label>
                  <input
                    type="text"
                    required
                    value={blackoutReason}
                    onChange={e => setBlackoutReason(e.target.value)}
                    placeholder="e.g. Kiln Stacking, Private Studio Buyout, Staff Meeting"
                    className="w-full px-3 py-2 border border-parchment rounded-xl bg-cream/50 text-clay outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-clay block mb-1">Start Time</label>
                    <input
                      type="text"
                      value={newStartTime}
                      onChange={e => setNewStartTime(e.target.value)}
                      className="w-full px-3 py-2 border border-parchment rounded-xl bg-cream/50 text-clay font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-clay block mb-1">End Time</label>
                    <input
                      type="text"
                      value={newEndTime}
                      onChange={e => setNewEndTime(e.target.value)}
                      className="w-full px-3 py-2 border border-parchment rounded-xl bg-cream/50 text-clay font-mono outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-clay block mb-1">Staff Member / Tech</label>
                  <select
                    value={blackoutStaff}
                    onChange={e => setBlackoutStaff(e.target.value)}
                    className="w-full px-3 py-2 border border-parchment rounded-xl bg-cream/50 text-clay outline-none"
                  >
                    {STUDIO_STAFF.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSlotModalData(null)}
                    className="btn-secondary flex-1 py-2 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1 py-2 text-xs bg-zinc-700 hover:bg-zinc-800"
                  >
                    Lock / Block Time
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-clay/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-warm-white w-full max-w-sm rounded-3xl p-6 shadow-pottery-xl border border-parchment">
            <h3 className="font-playfair font-bold text-lg text-clay mb-2">
              Reschedule: {rescheduleSession.serviceName}
            </h3>
            <p className="text-xs text-clay-light mb-4">
              Currently: {rescheduleSession.date} at {rescheduleSession.startTime}
            </p>

            <form onSubmit={handleRescheduleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-clay block mb-1">New Date</label>
                <input
                  type="date"
                  required
                  value={rescheduleDate}
                  onChange={e => setRescheduleDate(e.target.value)}
                  className="w-full px-3 py-2 border border-parchment rounded-xl bg-cream/40 text-clay outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-clay block mb-1">New Start Time</label>
                <input
                  type="text"
                  required
                  value={rescheduleTime}
                  onChange={e => setRescheduleTime(e.target.value)}
                  placeholder="14:00"
                  className="w-full px-3 py-2 border border-parchment rounded-xl bg-cream/40 text-clay font-mono outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setRescheduleSession(null)}
                  className="btn-secondary flex-1 py-2 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 py-2 text-xs"
                >
                  Save Time
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Slide-out Participant Drawer (Module 2) */}
      {activeSession && (
        <ParticipantDrawer
          session={activeSession}
          bookings={activeBookings}
          onClose={() => setActiveSession(null)}
          onAddParticipant={handleAddParticipant}
          onToggleCheckIn={handleToggleCheckIn}
          onRescheduleClick={sess => {
            setRescheduleSession(sess)
            setRescheduleDate(sess.date)
            setRescheduleTime(sess.startTime)
          }}
        />
      )}
    </div>
  )
}
