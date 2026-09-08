import type { Service, Addon } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

const now = new Date()

export const DEFAULT_SERVICES: Service[] = [
  {
    id: 'srv-1',
    name: 'Pick & Paint (All Ages)',
    description: "Choose from our wide selection of ceramic pieces and paint them however you like! Perfect for all ages — whether it's a family day out or a fun afternoon with friends. All paints, brushes, and guidance included.",
    price: new Decimal(12.0),
    durationMinutes: 120,
    maxCapacity: 20,
    category: 'Paint',
    imageUrl: '/images/services/pick-paint.jpg',
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'srv-2',
    name: 'Adults Only Pick & Paint',
    description: 'An 18+ twist on our classic Pick & Paint session. Enjoy a relaxed, creative evening with fellow adults. Complimentary welcome drink available. Perfect for date nights, hen dos, or just a night out with mates.',
    price: new Decimal(12.0),
    durationMinutes: 120,
    maxCapacity: 16,
    category: 'Paint',
    imageUrl: '/images/services/pick-paint-adults.jpg',
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'srv-3',
    name: 'Beginners Pottery Throwing Workshop',
    description: 'Discover the ancient craft of throwing clay on a pottery wheel! Our patient instructors will guide you through centering, opening, and shaping your very first vessel. All clay, tools, and firing included.',
    price: new Decimal(60.0),
    durationMinutes: 120,
    maxCapacity: 8,
    category: 'Throwing',
    imageUrl: '/images/services/pottery-throwing.jpg',
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'srv-4',
    name: 'Clay Session – Charcuterie Board',
    description: 'Create your own stunning clay charcuterie board — the perfect centrepiece for your next dinner party. Flatten, texture, and finish your board before it goes to the kiln. Glazing options available.',
    price: new Decimal(40.0),
    durationMinutes: 90,
    maxCapacity: 10,
    category: 'Clay',
    imageUrl: '/images/services/charcuterie-board.jpg',
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'srv-5',
    name: 'Clay Session – Tree OR Angel Luminaries',
    description: 'Hand-build a beautiful tree or angel luminary from clay. When fired and lit with a tea light, these create a magical glowing centrepiece. Choose your design on the day.',
    price: new Decimal(25.0),
    durationMinutes: 90,
    maxCapacity: 12,
    category: 'Clay',
    imageUrl: '/images/services/luminaries.jpg',
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'srv-6',
    name: 'Wreath Making Workshop',
    description: "Learn the art of wreath making from our expert instructor. You'll leave with a beautiful, handcrafted wreath to display in your home. All materials included — foliage, ribbon, decorations, and a wire base.",
    price: new Decimal(45.0),
    durationMinutes: 120,
    maxCapacity: 12,
    category: 'Seasonal',
    imageUrl: '/images/services/wreath-making.jpg',
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'srv-7',
    name: 'Clay Session – Christmas Tree Decs',
    description: 'Make a set of handmade clay Christmas tree decorations — stars, baubles, angels, and more. Roll, cut, texture, and personalise your designs. Fired and ready to collect within a week.',
    price: new Decimal(25.0),
    durationMinutes: 90,
    maxCapacity: 14,
    category: 'Seasonal',
    imageUrl: '/images/services/christmas-decs.jpg',
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'srv-8',
    name: 'Christmassy Pick & Paint',
    description: 'Our festive take on Pick & Paint — choose from Christmas-themed ceramics (baubles, mugs, plates, snowmen) and paint them in your own style. Mulled wine available to purchase. Get in the festive spirit!',
    price: new Decimal(16.0),
    durationMinutes: 120,
    maxCapacity: 20,
    category: 'Seasonal',
    imageUrl: '/images/services/christmas-paint.jpg',
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'srv-9',
    name: 'Ukulele Fun',
    description: 'A beginner-friendly, fun introduction to the ukulele. No experience needed — just a love of music and a sense of humour! Learn a few chords and strum along to popular songs in this lively group session.',
    price: new Decimal(10.0),
    durationMinutes: 60,
    maxCapacity: 15,
    category: 'Music',
    imageUrl: '/images/services/ukulele.jpg',
    active: true,
    createdAt: now,
    updatedAt: now,
  },
]

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
