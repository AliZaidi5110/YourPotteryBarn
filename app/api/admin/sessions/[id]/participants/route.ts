import { NextRequest, NextResponse } from 'next/server'
import {
  getSessionBookings,
  addParticipantToSession,
  toggleBookingCheckIn,
  updateBookingStatus,
} from '@/lib/studio-ops/data'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(context.params)
    const id = resolvedParams?.id
    const bookings = getSessionBookings(id)
    return NextResponse.json({ bookings })
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch participants' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(context.params)
    const id = resolvedParams?.id
    const body = await req.json()
    const { booking, session } = addParticipantToSession(id, body)
    return NextResponse.json({ booking, session }, { status: 201 })
  } catch (err: any) {
    console.error('Error adding participant:', err)
    return NextResponse.json({ error: err.message || 'Failed to add participant' }, { status: 400 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { bookingId, action, status } = body

    if (action === 'toggleCheckIn') {
      const updated = toggleBookingCheckIn(id, bookingId)
      if (!updated) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
      return NextResponse.json({ booking: updated })
    }

    if (action === 'updateStatus' && status) {
      const updated = updateBookingStatus(id, bookingId, status)
      if (!updated) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
      return NextResponse.json({ booking: updated })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update participant' }, { status: 500 })
  }
}
