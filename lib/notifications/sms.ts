import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID ?? 'placeholder',
  process.env.TWILIO_AUTH_TOKEN ?? 'placeholder'
)

const FROM = process.env.TWILIO_FROM_NUMBER ?? '+441234567890'
const STUDIO_NAME = process.env.NEXT_PUBLIC_STUDIO_NAME ?? 'Your Pottery Barn'

function isTwilioConfigured(): boolean {
  return !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER)
}

export async function sendBookingConfirmationSMS(params: {
  to: string
  customerName: string
  bookingRef: string
  serviceName: string
  date: string
  time: string
}) {
  if (!isTwilioConfigured()) {
    console.log('[SMS] Twilio not configured — skipping SMS to', params.to)
    return
  }

  const message = `Hi ${params.customerName}! Your ${STUDIO_NAME} booking is confirmed 🎉\n\n` +
    `📋 ${params.serviceName}\n` +
    `📅 ${params.date} at ${params.time}\n` +
    `🔖 Ref: ${params.bookingRef}\n\n` +
    `See you soon! Reply to this number for any questions.`

  return client.messages.create({ to: params.to, from: FROM, body: message })
}

export async function sendReminderSMS(params: {
  to: string
  customerName: string
  bookingRef: string
  serviceName: string
  date: string
  time: string
  hoursUntil: number
}) {
  if (!isTwilioConfigured()) {
    console.log('[SMS] Twilio not configured — skipping reminder SMS to', params.to)
    return
  }

  const urgency = params.hoursUntil <= 2 ? '⏰' : '📅'
  const timeframe = params.hoursUntil <= 2 ? `in ${params.hoursUntil}hrs` : 'tomorrow'
  const message = `${urgency} ${STUDIO_NAME} reminder: ${params.serviceName} is ${timeframe} at ${params.time}.\n` +
    `Ref: ${params.bookingRef}. Can't make it? Email hello@yourpottery.co.uk ASAP.`

  return client.messages.create({ to: params.to, from: FROM, body: message })
}
