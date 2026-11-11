// Client-approved information, shared by the public catalogue and booking pages.
export const SERVICE_DETAILS: Record<string, { description: string; durationMinutes: number; maxCapacity?: number; imageUrl: string | null }> = {
  'Pick & Paint (All Ages)': {
    description: "Choose from our wide selection of ceramic pieces and paint them however you like! Perfect for all ages, whether it's a family day out or a fun afternoon with friends. All paints, brushes, materials, tools and guidance provided. Your £12 booking payment is deducted from the pottery you choose on the day. Pottery starts from £12, with no additional studio fee.",
    durationMinutes: 120, maxCapacity: 30, imageUrl: '/images/gallery/gallery-3.avif',
  },
  'Adults Only Pick & Paint': {
    description: 'An 18+ twist on our classic Pick & Paint session. Enjoy a relaxed, creative evening with fellow adults. We sell a selection of drinks and snacks but English tea is always on the house! All materials & tools provided. Your £12 booking payment is deducted from the pottery you choose on the day.',
    durationMinutes: 120, maxCapacity: 30, imageUrl: '/images/gallery/gallery-4.avif',
  },
  'Beginners Pottery Throwing Workshop': {
    description: 'Try throwing clay on a pottery wheel. We will guide you through centring, opening and shaping your first piece. All materials & tools provided, with firing included. Come wearing trousers and short nails will make the process a whole lot easier! Wheel-thrown pottery is normally ready for collection after approximately 3 weeks.',
    durationMinutes: 120, imageUrl: '/images/gallery/gallery-6.avif',
  },
  'Clay Session – Charcuterie Board': {
    description: 'Create your own clay charcuterie board. Flatten, texture and finish your board with guidance along the way. All materials & tools provided. Your hand-built piece is normally ready for collection after 2 weeks.',
    durationMinutes: 120, imageUrl: null,
  },
  'Clay Session – Tree OR Angel Luminaries': {
    description: 'Hand-build a tree or angel luminary from clay, with space for a tea light. Choose your design on the day. All materials & tools provided. Your hand-built piece is normally ready for collection after 2 weeks.',
    durationMinutes: 120, imageUrl: null,
  },
  'Wreath Making Workshop': {
    description: "Make a handcrafted wreath to display in your home, with guidance from our instructor. All materials & tools provided, including foliage, ribbon, decorations and a wire base.",
    durationMinutes: 120, imageUrl: null,
  },
  'Clay Session – Christmas Tree Decs': {
    description: 'Make handmade clay Christmas tree decorations. Roll, cut, texture and personalise your designs. All materials & tools provided. Your pieces are normally ready for collection after 2 weeks.',
    durationMinutes: 120, imageUrl: null,
  },
  'Christmassy Pick & Paint': {
    description: 'Our festive take on Pick & Paint. Choose from seasonal ceramics and paint them in your own style. All materials & tools provided. We sell a selection of drinks and snacks but English tea is always on the house! Painted pottery is normally ready for collection after 2 weeks.',
    durationMinutes: 120, imageUrl: '/images/gallery/gallery-3.avif',
  },
  'Ukulele Fun': {
    description: 'A beginner-friendly introduction to the ukulele. No experience needed. Learn a few chords and strum along to popular songs in this two-hour group session.',
    durationMinutes: 120, imageUrl: null,
  },
}

export function withApprovedServiceDetails<T extends { name: string }>(service: T): T {
  const details = SERVICE_DETAILS[service.name]
  return details ? { ...service, ...details } : service
}

const SERVICE_BASE = [
  { id: 'srv-1', name: 'Pick & Paint (All Ages)', price: 12, category: 'Paint', maxCapacity: 30 },
  { id: 'srv-2', name: 'Adults Only Pick & Paint', price: 12, category: 'Paint', maxCapacity: 30 },
  { id: 'srv-3', name: 'Beginners Pottery Throwing Workshop', price: 60, category: 'Throwing', maxCapacity: 8 },
  { id: 'srv-4', name: 'Clay Session – Charcuterie Board', price: 40, category: 'Clay', maxCapacity: 10 },
  { id: 'srv-5', name: 'Clay Session – Tree OR Angel Luminaries', price: 25, category: 'Clay', maxCapacity: 12 },
  { id: 'srv-6', name: 'Wreath Making Workshop', price: 45, category: 'Seasonal', maxCapacity: 12 },
  { id: 'srv-7', name: 'Clay Session – Christmas Tree Decs', price: 25, category: 'Seasonal', maxCapacity: 14 },
  { id: 'srv-8', name: 'Christmassy Pick & Paint', price: 16, category: 'Seasonal', maxCapacity: 20 },
  { id: 'srv-9', name: 'Ukulele Fun', price: 10, category: 'Music', maxCapacity: 15 },
] as const

export const SERVICE_CATALOG = SERVICE_BASE.map(service => ({ ...service, ...SERVICE_DETAILS[service.name], maxCapacity: SERVICE_DETAILS[service.name].maxCapacity ?? service.maxCapacity }))

export function isPaintingSeatBooking(service: { name: string }): boolean {
  return service.name === 'Pick & Paint (All Ages)' || service.name === 'Adults Only Pick & Paint'
}

export function amountDueAtBooking(service: { name: string }, total: number, depositPercentage = 25): number {
  return isPaintingSeatBooking(service) ? total : Math.ceil(total * depositPercentage / 100)
}

export function withApprovedAddonDetails<T extends { name: string }>(addon: T): T {
  return /^(english )?tea$/i.test(addon.name.trim()) ? { ...addon, price: 0 } : addon
}
