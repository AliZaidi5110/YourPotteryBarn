import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { sendBookingReminder } from '@/lib/notifications/email'
import { sendReminderSMS } from '@/lib/notifications/sms'
import { formatDate, formatTime } from '@/lib/utils'

// This route is called by Vercel Cron — set in vercel.json
// It fires hourly and sends reminders for bookings at 48h and 2h windows.
export async function GET(req: NextRequest) {
  // Verify this is a Vercel cron call
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const now = new Date()
  const windows = [
    { hours: 48, label: '48h' },
    { hours: 2,  label: '2h' },
  ]

  let totalSent = 0

  for (const { hours } of windows) {
    const windowStart = new Date(now.getTime() + (hours - 0.5) * 3600000)
    const windowEnd   = new Date(now.getTime() + (hours + 0.5) * 3600000)

    // Find bookings whose slot starts in this window
    const bookings = await prisma.booking.findMany({
      where: {
        status: { in: ['CONFIRMED', 'PENDING'] },
        slot: {
          date: { gte: windowStart, lt: windowEnd },
        },
      },
      include: {
        customer: true,
        service: true,
        slot: true,
      },
    })

    for (const booking of bookings) {
      const emailData = {
        customerName: booking.customer.name,
        customerEmail: booking.customer.email,
        bookingRef: booking.bookingRef,
        serviceName: booking.service.name,
        date: formatDate(new Date(booking.slot.date)),
        time: `${formatTime(booking.slot.startTime)} – ${formatTime(booking.slot.endTime)}`,
        seats: booking.seats,
        totalAmount: String(booking.totalAmount),
        amountPaid: String(booking.amountPaid),
        hoursUntil: hours,
      }

      await sendBookingReminder(emailData).catch(console.error)

      if (booking.customer.phone) {
        await sendReminderSMS({
          to: booking.customer.phone,
          customerName: booking.customer.name,
          bookingRef: booking.bookingRef,
          serviceName: booking.service.name,
          date: formatDate(new Date(booking.slot.date)),
          time: formatTime(booking.slot.startTime),
          hoursUntil: hours,
        }).catch(console.error)
      }

      totalSent++
    }
  }

  return NextResponse.json({ ok: true, remindersSent: totalSent })
}
