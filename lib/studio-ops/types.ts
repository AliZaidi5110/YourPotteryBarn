export interface StudioSession {
  id: string
  serviceId: string
  serviceName: string
  serviceCategory: 'Paint' | 'Clay' | 'Throwing' | 'Seasonal' | 'Music' | 'Blackout'
  servicePrice: number
  color: string
  date: string // YYYY-MM-DD
  startTime: string // "HH:MM" 24h
  endTime: string // "HH:MM" 24h
  staffName: string
  location: string
  capacityMax: number
  capacityBooked: number
  capacityRemaining: number
  waitlistCount: number
  isBlackout: boolean
  blackoutReason?: string
  notes?: string
  bookingsCount: number
  totalDepositsCollected: number
}

export interface SessionBooking {
  id: string
  bookingRef: string
  sessionId: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  seats: number
  totalAmount: number
  amountPaid: number // Upfront deposit paid
  creditApplied: number
  status: 'BOOKED' | 'PAID' | 'CONFIRMED' | 'CANCELLED' | 'NO_SHOW'
  checkedIn: boolean
  checkedInAt?: string
  registeredAt: string
  notes?: string
  potteryItems?: PotteryOrderItem[]
  orderCompleted?: boolean
  orderTotal?: number
  orderBalanceDue?: number
  serviceName?: string
}

export interface PotteryOrderItem {
  itemId: string
  name: string
  category: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface InventoryPotteryItem {
  id: string
  name: string
  category: 'Mugs' | 'Figures & Animals' | 'Bowls & Plates' | 'Vases & Home' | 'Seasonal'
  price: number
  stock: number
  sku: string
  description?: string
}

export interface OrderCheckoutPayload {
  bookingId: string
  items: Array<{
    itemId: string
    name: string
    quantity: number
    unitPrice: number
  }>
  paymentMethod: 'TERMINAL_SHIFT4' | 'STRIPE' | 'CASH' | 'CARD'
}

export interface StudioNotification {
  id: string
  bookingId?: string
  customerName: string
  recipient: string
  channel: 'EMAIL' | 'SMS'
  type: 'COLLECTION_READY' | 'FIRING_DELAY' | 'REMINDER' | 'CUSTOM'
  title: string
  message: string
  sentAt: string
  status: 'SENT' | 'DELIVERED' | 'FAILED'
}
