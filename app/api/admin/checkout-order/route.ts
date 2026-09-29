import { NextRequest, NextResponse } from 'next/server'
import { saveBookingOrderCheckout } from '@/lib/studio-ops/data'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sessionId, bookingId, potteryItems, grossTotal, depositDeducted, balanceDue, paymentMethod } = body

    if (!sessionId || !bookingId) {
      return NextResponse.json({ error: 'sessionId and bookingId are required' }, { status: 400 })
    }

    const updatedBooking = saveBookingOrderCheckout(sessionId, bookingId, {
      potteryItems: potteryItems || [],
      grossTotal: Number(grossTotal) || 0,
      depositDeducted: Number(depositDeducted) || 0,
      balanceDue: Number(balanceDue) || 0,
      paymentMethod: paymentMethod || 'TERMINAL_SHIFT4',
    })

    if (!updatedBooking) {
      return NextResponse.json({ error: 'Booking or session not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      transactionId: `TXN-${Date.now().toString().slice(-6)}`,
      completedAt: new Date().toISOString(),
      receiptNumber: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
    })
  } catch (err: any) {
    console.error('Error during studio checkout:', err)
    return NextResponse.json({ error: 'Failed to process studio checkout' }, { status: 500 })
  }
}
