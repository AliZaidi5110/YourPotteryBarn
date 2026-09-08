import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder')
const FROM = `${process.env.RESEND_FROM_NAME ?? 'Your Pottery Barn'} <${process.env.RESEND_FROM_EMAIL ?? 'bookings@yourpottery.co.uk'}>`

export interface BookingEmailData {
  customerName: string
  customerEmail: string
  bookingRef: string
  serviceName: string
  date: string
  time: string
  seats: number
  totalAmount: string
  amountPaid: string
  qrCodeUrl?: string
  addons?: Array<{ name: string; quantity: number; price: string }>
}

// ─── Booking Confirmation ─────────────────────────────────────────────────────

export async function sendBookingConfirmation(data: BookingEmailData) {
  const addonsHtml = data.addons?.length
    ? `<tr><td colspan="2" style="padding-top:16px;font-weight:600;color:#5C3D2E;">Add-ons</td></tr>
       ${data.addons.map(a => `<tr><td style="padding:4px 0;color:#6b7280;">${a.name} ×${a.quantity}</td><td style="text-align:right;color:#5C3D2E;">${a.price}</td></tr>`).join('')}`
    : ''

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF7F0;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F0;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(92,61,46,0.1);">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#C4613A 0%,#8B4513 100%);padding:40px;text-align:center;">
          <h1 style="margin:0;color:#FFFFFF;font-size:28px;letter-spacing:1px;">Your Pottery Barn</h1>
          <p style="margin:8px 0 0;color:#FAD7C0;font-size:14px;">✨ Booking Confirmed!</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:40px;">
          <p style="color:#5C3D2E;font-size:18px;margin:0 0 8px;">Hello ${data.customerName}!</p>
          <p style="color:#6b7280;margin:0 0 32px;">Your booking is confirmed. We can't wait to see you!</p>

          <!-- Booking Summary Box -->
          <div style="background:#FAF7F0;border-radius:12px;padding:24px;margin-bottom:24px;border-left:4px solid #C4613A;">
            <h2 style="margin:0 0 16px;color:#5C3D2E;font-size:20px;">${data.serviceName}</h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;">
              <tr><td style="padding:4px 0;color:#6b7280;">📅 Date</td><td style="text-align:right;color:#5C3D2E;font-weight:600;">${data.date}</td></tr>
              <tr><td style="padding:4px 0;color:#6b7280;">🕐 Time</td><td style="text-align:right;color:#5C3D2E;font-weight:600;">${data.time}</td></tr>
              <tr><td style="padding:4px 0;color:#6b7280;">👥 Seats</td><td style="text-align:right;color:#5C3D2E;font-weight:600;">${data.seats}</td></tr>
              ${addonsHtml}
              <tr><td colspan="2" style="border-top:1px solid #E5D5C8;margin:16px 0;padding:16px 0 0;"></td></tr>
              <tr><td style="color:#6b7280;">Total</td><td style="text-align:right;color:#5C3D2E;font-weight:700;font-size:18px;">${data.totalAmount}</td></tr>
              <tr><td style="color:#6b7280;">Paid today</td><td style="text-align:right;color:#4A7C59;font-weight:600;">${data.amountPaid}</td></tr>
            </table>
          </div>

          <!-- Booking Ref -->
          <div style="background:#5C3D2E;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
            <p style="margin:0 0 4px;color:#FAD7C0;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Booking Reference</p>
            <p style="margin:0;color:#FFFFFF;font-size:28px;font-family:monospace;letter-spacing:4px;">${data.bookingRef}</p>
          </div>

          <!-- What to Bring -->
          <div style="border:1px solid #E5D5C8;border-radius:12px;padding:20px;margin-bottom:24px;">
            <h3 style="margin:0 0 12px;color:#5C3D2E;font-size:16px;">📋 What to bring</h3>
            <ul style="margin:0;padding-left:20px;color:#6b7280;line-height:1.8;">
              <li>Clothes you don't mind getting a little messy</li>
              <li>Your booking reference (or show this email at the front desk)</li>
              <li>Any remaining balance due</li>
            </ul>
          </div>

          <p style="color:#6b7280;font-size:14px;text-align:center;">Questions? Email us at <a href="mailto:hello@yourpottery.co.uk" style="color:#C4613A;">hello@yourpottery.co.uk</a></p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#FAF7F0;padding:24px;text-align:center;border-top:1px solid #E5D5C8;">
          <p style="margin:0;color:#9ca3af;font-size:12px;">Your Pottery Barn · ${process.env.NEXT_PUBLIC_STUDIO_ADDRESS ?? 'Studio Address'}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  return resend.emails.send({
    from: FROM,
    to: data.customerEmail,
    subject: `✨ Booking Confirmed — ${data.serviceName} (${data.bookingRef})`,
    html,
  })
}

// ─── Reminder ─────────────────────────────────────────────────────────────────

export async function sendBookingReminder(data: BookingEmailData & { hoursUntil: number }) {
  const urgency = data.hoursUntil <= 2 ? '⏰ Starting soon!' : '📅 Reminder'
  const message = data.hoursUntil <= 2
    ? `Your session starts in just ${data.hoursUntil} hour${data.hoursUntil !== 1 ? 's' : ''}!`
    : `Your session is tomorrow — we're looking forward to seeing you!`

  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#FAF7F0;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F0;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(92,61,46,0.1);">
        <tr><td style="background:linear-gradient(135deg,#4A7C59 0%,#2D5A3D 100%);padding:40px;text-align:center;">
          <h1 style="margin:0;color:#FFFFFF;font-size:24px;">Your Pottery Barn</h1>
          <p style="margin:8px 0 0;color:#B8DECA;font-size:16px;">${urgency}</p>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="color:#5C3D2E;font-size:18px;margin:0 0 8px;">Hi ${data.customerName}!</p>
          <p style="color:#6b7280;margin:0 0 32px;">${message}</p>
          <div style="background:#FAF7F0;border-radius:12px;padding:24px;border-left:4px solid #4A7C59;">
            <h2 style="margin:0 0 16px;color:#5C3D2E;font-size:18px;">${data.serviceName}</h2>
            <p style="margin:4px 0;color:#6b7280;">📅 ${data.date} at ${data.time}</p>
            <p style="margin:4px 0;color:#6b7280;">👥 ${data.seats} seat${data.seats !== 1 ? 's' : ''}</p>
            <p style="margin:4px 0;color:#5C3D2E;font-weight:600;">Ref: ${data.bookingRef}</p>
          </div>
          <p style="color:#9ca3af;font-size:13px;margin-top:24px;text-align:center;">
            Need to cancel? Email <a href="mailto:hello@yourpottery.co.uk" style="color:#C4613A;">hello@yourpottery.co.uk</a> as soon as possible.
          </p>
        </td></tr>
        <tr><td style="background:#FAF7F0;padding:20px;text-align:center;border-top:1px solid #E5D5C8;">
          <p style="margin:0;color:#9ca3af;font-size:12px;">Your Pottery Barn</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  return resend.emails.send({
    from: FROM,
    to: data.customerEmail,
    subject: `${urgency} — ${data.serviceName} today at ${data.time}`,
    html,
  })
}

// ─── Receipt ──────────────────────────────────────────────────────────────────

export async function sendPaymentReceipt(data: {
  customerName: string
  customerEmail: string
  bookingRef: string
  serviceName: string
  date: string
  amountCharged: string
  paymentMethod: string
  transactionId?: string
}) {
  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#FAF7F0;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F0;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:16px;overflow:hidden;">
        <tr><td style="background:#5C3D2E;padding:32px;text-align:center;">
          <h1 style="margin:0;color:#FFFFFF;font-size:22px;">Payment Receipt</h1>
          <p style="margin:6px 0 0;color:#FAD7C0;">Your Pottery Barn</p>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="color:#5C3D2E;font-size:16px;">Hello ${data.customerName},</p>
          <p style="color:#6b7280;">Payment received for your booking. Thank you!</p>
          <table width="100%" style="font-size:15px;border-collapse:collapse;margin-top:24px;">
            <tr style="background:#FAF7F0;"><td style="padding:12px;color:#6b7280;border-radius:8px 0 0 8px;">Booking</td><td style="padding:12px;text-align:right;color:#5C3D2E;font-weight:600;">${data.bookingRef}</td></tr>
            <tr><td style="padding:12px;color:#6b7280;">Service</td><td style="padding:12px;text-align:right;color:#5C3D2E;">${data.serviceName}</td></tr>
            <tr style="background:#FAF7F0;"><td style="padding:12px;color:#6b7280;">Date</td><td style="padding:12px;text-align:right;color:#5C3D2E;">${data.date}</td></tr>
            <tr><td style="padding:12px;color:#6b7280;">Payment method</td><td style="padding:12px;text-align:right;color:#5C3D2E;">${data.paymentMethod}</td></tr>
            ${data.transactionId ? `<tr style="background:#FAF7F0;"><td style="padding:12px;color:#6b7280;">Transaction ID</td><td style="padding:12px;text-align:right;color:#5C3D2E;font-size:12px;font-family:monospace;">${data.transactionId}</td></tr>` : ''}
            <tr style="border-top:2px solid #C4613A;"><td style="padding:16px 12px;color:#5C3D2E;font-weight:700;font-size:18px;">Amount charged</td><td style="padding:16px 12px;text-align:right;color:#C4613A;font-weight:700;font-size:22px;">${data.amountCharged}</td></tr>
          </table>
        </td></tr>
        <tr><td style="background:#FAF7F0;padding:20px;text-align:center;border-top:1px solid #E5D5C8;">
          <p style="margin:0;color:#9ca3af;font-size:12px;">Your Pottery Barn · ${process.env.NEXT_PUBLIC_STUDIO_ADDRESS ?? ''}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  return resend.emails.send({
    from: FROM,
    to: data.customerEmail,
    subject: `Receipt — ${data.bookingRef} — ${data.amountCharged}`,
    html,
  })
}
