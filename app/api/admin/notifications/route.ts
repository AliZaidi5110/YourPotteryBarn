import { NextRequest, NextResponse } from 'next/server'
import { getNotifications, createNotification } from '@/lib/studio-ops/data'

export async function GET(req: NextRequest) {
  try {
    const notifications = getNotifications()
    return NextResponse.json({ notifications })
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { recipients, type, title, messageTemplate, channel } = body

    if (!Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: 'At least one recipient is required' }, { status: 400 })
    }

    const createdNotifications = []

    for (const r of recipients) {
      // Replace dynamic placeholders
      const personalizedMessage = messageTemplate
        .replace(/\{name\}/g, r.name || 'valued guest')
        .replace(/\{bookingRef\}/g, r.bookingRef || 'your booking')
        .replace(/\{sessionDate\}/g, r.sessionDate || 'your recent session')
        .replace(/\{service\}/g, r.serviceName || 'pottery workshop')
        .replace(/\{studioAddress\}/g, process.env.NEXT_PUBLIC_STUDIO_ADDRESS || 'Hartley, Longfield, Kent DA3')

      const notif = createNotification({
        bookingId: r.bookingId,
        customerName: r.name,
        recipient: channel === 'SMS' ? (r.phone || r.email) : r.email,
        channel: channel || 'EMAIL',
        type: type || 'COLLECTION_READY',
        title: title || 'Your Pottery Barn Update',
        message: personalizedMessage,
      })

      createdNotifications.push(notif)
    }

    return NextResponse.json({
      success: true,
      count: createdNotifications.length,
      notifications: createdNotifications,
      dispatchedAt: new Date().toISOString(),
    })
  } catch (err: any) {
    console.error('Error dispatching notifications:', err)
    return NextResponse.json({ error: 'Failed to dispatch notifications' }, { status: 500 })
  }
}
