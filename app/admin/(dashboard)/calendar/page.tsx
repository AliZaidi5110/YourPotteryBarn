import { AdminCalendar } from '@/components/admin/studio-ops/AdminCalendar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Operations Calendar | Your Pottery Barn Admin',
  description: 'Interactive studio operations calendar, workshop rosters, and staff scheduling grid.',
}

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-terracotta/15 text-terracotta px-2.5 py-0.5 rounded-full border border-terracotta/30">
              Studio Operations Engine
            </span>
            <span className="text-xs text-clay-light font-medium">
              Live Station Timetable
            </span>
          </div>
          <h1 className="font-playfair text-3xl font-bold text-clay">
            Studio Operations Calendar
          </h1>
          <p className="text-clay-light text-sm mt-1">
            Manage daily classes, participant rosters, wheel room capacity, and staff blackout blocks.
          </p>
        </div>
      </div>

      {/* Main Operations Calendar */}
      <AdminCalendar />
    </div>
  )
}
