import { SERVICE_CATALOG } from './service-details'
import type { Service, Addon } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

const now = new Date()

export const DEFAULT_SERVICES: Service[] = SERVICE_CATALOG.map(service => ({
  ...service,
  price: new Decimal(service.price),
  active: true,
  createdAt: now,
  updatedAt: now,
}))

export const DEFAULT_ADDONS: Addon[] = [
  { id: 'add-1', name: 'Extra Clay Pack (1kg)', price: new Decimal(8.0), category: 'Clay', active: true, createdAt: now, updatedAt: now },
  { id: 'add-2', name: 'Premium Metallic & Lustre Glaze', price: new Decimal(6.0), category: 'Glaze', active: true, createdAt: now, updatedAt: now },
  { id: 'add-3', name: 'Glass of Prosecco / Wine', price: new Decimal(5.5), category: 'Drinks', active: true, createdAt: now, updatedAt: now },
  { id: 'add-4', name: 'Artisan Hot Chocolate & Marshmallows', price: new Decimal(4.0), category: 'Drinks', active: true, createdAt: now, updatedAt: now },
  { id: 'add-5', name: 'Home Finishing Kit', price: new Decimal(12.0), category: 'Take-home', active: true, createdAt: now, updatedAt: now },
]

export function getDefaultSlots(serviceId: string) {
  const slots: any[] = []
  const times = [
    { start: '10:00', end: '12:00' },
    { start: '13:30', end: '15:30' },
    { start: '16:30', end: '18:30' },
    { start: '19:00', end: '21:00' },
  ]

  // Generate slots for next 14 days
  for (let d = 1; d <= 14; d++) {
    const date = new Date()
    date.setDate(date.getDate() + d)
    date.setHours(0, 0, 0, 0)

    times.forEach((t, i) => {
      slots.push({
        id: `slot-${serviceId}-${d}-${i}`,
        serviceId,
        date,
        startTime: t.start,
        endTime: t.end,
        maxCapacity: 12,
        capacityRemaining: d % 3 === 0 ? 2 : 8,
        isBlackout: false,
      })
    })
  }

  return slots
}
