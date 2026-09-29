import { StudioSession, SessionBooking, InventoryPotteryItem, StudioNotification, PotteryOrderItem } from './types'

// ─── Default Pottery Inventory Catalog ───────────────────────────────────────
export const DEFAULT_POTTERY_INVENTORY: InventoryPotteryItem[] = [
  // Mugs
  { id: 'inv-1', name: 'Classic Ceramic Mug', category: 'Mugs', price: 15.00, stock: 45, sku: 'MUG-CLS-01', description: 'Smooth 350ml standard mug, perfect for personal lettering or splash patterns.' },
  { id: 'inv-2', name: 'Chunky Stoneware Mug', category: 'Mugs', price: 16.00, stock: 32, sku: 'MUG-CHK-02', description: 'Heavy-bottom rustic mug with comfortable oversized handle.' },
  { id: 'inv-3', name: 'Espresso Cup & Saucer Set', category: 'Mugs', price: 14.00, stock: 24, sku: 'MUG-ESP-03', description: 'Cute matching espresso set ready for detailed dotwork glaze.' },
  { id: 'inv-4', name: 'Giant Latte / Soup Mug', category: 'Mugs', price: 18.00, stock: 20, sku: 'MUG-SOUP-04', description: 'Generous 500ml bowl mug with flared rim.' },

  // Figures & Animals
  { id: 'inv-5', name: 'Sitting Cat Figurine', category: 'Figures & Animals', price: 18.00, stock: 28, sku: 'FIG-CAT-01', description: 'Detailed ceramic cat statue with collar and whiskers surface.' },
  { id: 'inv-6', name: 'Dachshund Sausage Dog', category: 'Figures & Animals', price: 18.00, stock: 22, sku: 'FIG-DOG-02', description: 'Playful pup ornament, customer favorite for gifts.' },
  { id: 'inv-7', name: 'Sleeping Fox Ornament', category: 'Figures & Animals', price: 20.00, stock: 18, sku: 'FIG-FOX-03', description: 'Curled woodland fox with textured tail.' },
  { id: 'inv-8', name: 'Barn Owl Sculpture', category: 'Figures & Animals', price: 16.00, stock: 15, sku: 'FIG-OWL-04', description: 'Intricate feather embossing ideal for translucent wash glazes.' },
  { id: 'inv-9', name: 'Garden Gnome with Mushroom', category: 'Figures & Animals', price: 19.00, stock: 14, sku: 'FIG-GNM-05', description: 'Whimsical garden-ready figurine.' },

  // Bowls & Plates
  { id: 'inv-10', name: 'Cereal / Dessert Bowl', category: 'Bowls & Plates', price: 20.00, stock: 35, sku: 'BWL-CRL-01', description: 'Everyday glazed ceramic bowl, 16cm diameter.' },
  { id: 'inv-11', name: 'Wide Rim Pasta Bowl', category: 'Bowls & Plates', price: 22.00, stock: 25, sku: 'BWL-PST-02', description: 'Restaurant-style shallow pasta dish, 22cm diameter.' },
  { id: 'inv-12', name: 'Artisan Dinner Plate', category: 'Bowls & Plates', price: 24.00, stock: 30, sku: 'PLT-DNR-01', description: 'Flat rimmed plate with organic hand-pressed edge.' },
  { id: 'inv-13', name: 'Heart Trinket Dish', category: 'Bowls & Plates', price: 12.00, stock: 40, sku: 'DSH-HRT-01', description: 'Small jewelry or key bowl with scalloped lip.' },
  { id: 'inv-14', name: 'Oval Charcuterie Serving Platter', category: 'Bowls & Plates', price: 28.00, stock: 16, sku: 'PLT-SRV-02', description: 'Large 32cm centerpiece tray for grazing spreads.' },

  // Vases & Home
  { id: 'inv-15', name: 'Fluted Bud Vase', category: 'Vases & Home', price: 22.00, stock: 20, sku: 'VAS-BUD-01', description: 'Narrow neck modern vase for single dried stems.' },
  { id: 'inv-16', name: 'Cylindrical Flower Vase', category: 'Vases & Home', price: 26.00, stock: 15, sku: 'VAS-CYL-02', description: 'Stately 20cm vase offering a generous canvas for bold artwork.' },
  { id: 'inv-17', name: 'Herb Planter with Saucer', category: 'Vases & Home', price: 22.00, stock: 18, sku: 'PLN-HRB-01', description: 'Indoor plant pot with drainage holes and catch dish.' },
  { id: 'inv-18', name: 'Traditional Afternoon Teapot', category: 'Vases & Home', price: 35.00, stock: 10, sku: 'TPT-TRD-01', description: '4-cup teapot with matching lid, our grandest pottery blank.' },
]

// ─── Studio Services Catalog (Browser-Safe) ─────────────────────────────────
export const STUDIO_SERVICES_CATALOG = [
  { id: 'srv-1', name: 'Pick & Paint (All Ages)', category: 'Paint' as const, price: 12.00, duration: 120, capacity: 20 },
  { id: 'srv-2', name: 'Adults Only Pick & Paint (BYOB)', category: 'Paint' as const, price: 12.00, duration: 120, capacity: 16 },
  { id: 'srv-3', name: 'Beginners Pottery Throwing Workshop', category: 'Throwing' as const, price: 60.00, duration: 120, capacity: 8 },
  { id: 'srv-4', name: 'Clay Session – Charcuterie Board', category: 'Clay' as const, price: 40.00, duration: 90, capacity: 10 },
  { id: 'srv-5', name: 'Clay Session – Tree OR Angel Luminaries', category: 'Clay' as const, price: 25.00, duration: 90, capacity: 12 },
  { id: 'srv-6', name: 'Wreath Making Workshop', category: 'Seasonal' as const, price: 45.00, duration: 120, capacity: 12 },
  { id: 'srv-7', name: 'Clay Session – Christmas Tree Decs', category: 'Seasonal' as const, price: 25.00, duration: 90, capacity: 14 },
  { id: 'srv-8', name: 'Christmassy Pick & Paint', category: 'Seasonal' as const, price: 16.00, duration: 120, capacity: 20 },
  { id: 'srv-9', name: 'Ukulele Fun & Music', category: 'Music' as const, price: 10.00, duration: 60, capacity: 15 },
]

// ─── Staff & Locations ───────────────────────────────────────────────────────
export const STUDIO_STAFF = [
  'Emma Harrison (Lead Ceramist)',
  'Liam Davies (Studio Potter)',
  'Chloe Bennett (Workshop Host)',
  'Sarah Jenkins (Studio Owner)',
  'Marcus Vance (Kiln Tech)',
]

export const STUDIO_LOCATIONS = [
  'Main Studio - Tables 1-4',
  'Main Studio - Tables 5-8',
  'Wheel Room - Wheels 1-8',
  'Glaze Bar & Mezzanine',
  'Private Party Barn',
]

// ─── Helper to generate relative date strings ─────────────────────────────────
export function getRelativeDate(offsetDays: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().split('T')[0]
}

// ─── Seed Sessions ────────────────────────────────────────────────────────────
function createInitialSessions(): StudioSession[] {
  return [
    // Today: Pick & Paint morning
    {
      id: 'sess-today-1',
      serviceId: 'srv-1',
      serviceName: 'Pick & Paint (All Ages)',
      serviceCategory: 'Paint',
      servicePrice: 12.00,
      color: '#C4613A',
      date: getRelativeDate(0),
      startTime: '10:00',
      endTime: '12:00',
      staffName: 'Emma Harrison (Lead Ceramist)',
      location: 'Main Studio - Tables 1-4',
      capacityMax: 14,
      capacityBooked: 14,
      capacityRemaining: 0,
      waitlistCount: 2,
      isBlackout: false,
      notes: 'Fully booked weekend morning session. Keep sponges stocked on Table 2.',
      bookingsCount: 4,
      totalDepositsCollected: 168.00,
    },
    // Today: Pottery Throwing afternoon
    {
      id: 'sess-today-2',
      serviceId: 'srv-3',
      serviceName: 'Beginners Pottery Throwing Workshop',
      serviceCategory: 'Throwing',
      servicePrice: 60.00,
      color: '#4A7C59',
      date: getRelativeDate(0),
      startTime: '13:30',
      endTime: '15:30',
      staffName: 'Liam Davies (Studio Potter)',
      location: 'Wheel Room - Wheels 1-8',
      capacityMax: 8,
      capacityBooked: 6,
      capacityRemaining: 2,
      waitlistCount: 0,
      isBlackout: false,
      notes: 'Prepare 8x 1kg stoneware clay balls and splash pans prior to arrival.',
      bookingsCount: 3,
      totalDepositsCollected: 360.00,
    },
    // Today: Blackout block late afternoon
    {
      id: 'sess-today-3',
      serviceId: 'blackout',
      serviceName: 'Staff Kiln Unloading & Stacking',
      serviceCategory: 'Blackout',
      servicePrice: 0,
      color: '#71717A',
      date: getRelativeDate(0),
      startTime: '16:00',
      endTime: '17:30',
      staffName: 'Marcus Vance (Kiln Tech)',
      location: 'Kiln Room & Loading Bay',
      capacityMax: 0,
      capacityBooked: 0,
      capacityRemaining: 0,
      waitlistCount: 0,
      isBlackout: true,
      blackoutReason: 'Bisque kiln cooling check & shelf re-wash. Closed for public booking.',
      bookingsCount: 0,
      totalDepositsCollected: 0,
    },
    // Today: Adults Only Pick & Paint evening
    {
      id: 'sess-today-4',
      serviceId: 'srv-2',
      serviceName: 'Adults Only Pick & Paint (BYOB)',
      serviceCategory: 'Paint',
      servicePrice: 12.00,
      color: '#A04E2D',
      date: getRelativeDate(0),
      startTime: '18:30',
      endTime: '20:30',
      staffName: 'Chloe Bennett (Workshop Host)',
      location: 'Main Studio - Tables 1-4',
      capacityMax: 16,
      capacityBooked: 11,
      capacityRemaining: 5,
      waitlistCount: 0,
      isBlackout: false,
      notes: 'Prosecco glasses cleaned and chilled in fridge.',
      bookingsCount: 3,
      totalDepositsCollected: 132.00,
    },

    // Tomorrow: Clay Session Charcuterie
    {
      id: 'sess-tmr-1',
      serviceId: 'srv-4',
      serviceName: 'Clay Session – Charcuterie Board',
      serviceCategory: 'Clay',
      servicePrice: 40.00,
      color: '#8B6147',
      date: getRelativeDate(1),
      startTime: '10:30',
      endTime: '12:00',
      staffName: 'Emma Harrison (Lead Ceramist)',
      location: 'Main Studio - Tables 5-8',
      capacityMax: 10,
      capacityBooked: 9,
      capacityRemaining: 1,
      waitlistCount: 0,
      isBlackout: false,
      notes: 'Rolling pins, texture mats, and stamps ready.',
      bookingsCount: 3,
      totalDepositsCollected: 360.00,
    },
    // Tomorrow: Pick & Paint afternoon
    {
      id: 'sess-tmr-2',
      serviceId: 'srv-1',
      serviceName: 'Pick & Paint (All Ages)',
      serviceCategory: 'Paint',
      servicePrice: 12.00,
      color: '#C4613A',
      date: getRelativeDate(1),
      startTime: '13:30',
      endTime: '15:30',
      staffName: 'Sarah Jenkins (Studio Owner)',
      location: 'Main Studio - Tables 1-4',
      capacityMax: 20,
      capacityBooked: 15,
      capacityRemaining: 5,
      waitlistCount: 0,
      isBlackout: false,
      notes: 'Includes birthday party booking of 6 children.',
      bookingsCount: 4,
      totalDepositsCollected: 180.00,
    },

    // Day +2: Wreath Making Workshop
    {
      id: 'sess-day2-1',
      serviceId: 'srv-6',
      serviceName: 'Wreath Making Workshop',
      serviceCategory: 'Seasonal',
      servicePrice: 45.00,
      color: '#2D5A3D',
      date: getRelativeDate(2),
      startTime: '11:00',
      endTime: '13:00',
      staffName: 'Chloe Bennett (Workshop Host)',
      location: 'Private Party Barn',
      capacityMax: 12,
      capacityBooked: 12,
      capacityRemaining: 0,
      waitlistCount: 4,
      isBlackout: false,
      notes: 'Fresh foliage arriving 9am.',
      bookingsCount: 4,
      totalDepositsCollected: 540.00,
    },
    // Day +2: Staff Block Time
    {
      id: 'sess-day2-2',
      serviceId: 'blackout',
      serviceName: 'Private Studio Buyout / Cleaning',
      serviceCategory: 'Blackout',
      servicePrice: 0,
      color: '#71717A',
      date: getRelativeDate(2),
      startTime: '15:00',
      endTime: '17:00',
      staffName: 'Sarah Jenkins (Studio Owner)',
      location: 'Main Studio - Tables 1-4',
      capacityMax: 0,
      capacityBooked: 0,
      capacityRemaining: 0,
      waitlistCount: 0,
      isBlackout: true,
      blackoutReason: 'Corporate private studio buyout.',
      bookingsCount: 0,
      totalDepositsCollected: 0,
    },

    // Day +3: Pottery Throwing Evening
    {
      id: 'sess-day3-1',
      serviceId: 'srv-3',
      serviceName: 'Beginners Pottery Throwing Workshop',
      serviceCategory: 'Throwing',
      servicePrice: 60.00,
      color: '#4A7C59',
      date: getRelativeDate(3),
      startTime: '18:00',
      endTime: '20:00',
      staffName: 'Liam Davies (Studio Potter)',
      location: 'Wheel Room - Wheels 1-8',
      capacityMax: 8,
      capacityBooked: 8,
      capacityRemaining: 0,
      waitlistCount: 3,
      isBlackout: false,
      notes: 'Full house wheel throwing session.',
      bookingsCount: 4,
      totalDepositsCollected: 480.00,
    },

    // Day -1 (Yesterday): Past Pick & Paint Session (Perfect for Pottery Ready notifications!)
    {
      id: 'sess-past-1',
      serviceId: 'srv-1',
      serviceName: 'Pick & Paint (All Ages)',
      serviceCategory: 'Paint',
      servicePrice: 12.00,
      color: '#C4613A',
      date: getRelativeDate(-1),
      startTime: '14:00',
      endTime: '16:00',
      staffName: 'Emma Harrison (Lead Ceramist)',
      location: 'Main Studio - Tables 1-4',
      capacityMax: 16,
      capacityBooked: 14,
      capacityRemaining: 2,
      waitlistCount: 0,
      isBlackout: false,
      notes: 'Completed session. Glaze firing loaded into Kiln #2.',
      bookingsCount: 4,
      totalDepositsCollected: 168.00,
    },
    // Day -3 (Past Workshop): Past Charcuterie Session ready for collection
    {
      id: 'sess-past-2',
      serviceId: 'srv-4',
      serviceName: 'Clay Session – Charcuterie Board',
      serviceCategory: 'Clay',
      servicePrice: 40.00,
      color: '#8B6147',
      date: getRelativeDate(-3),
      startTime: '11:00',
      endTime: '12:30',
      staffName: 'Liam Davies (Studio Potter)',
      location: 'Main Studio - Tables 5-8',
      capacityMax: 10,
      capacityBooked: 10,
      capacityRemaining: 0,
      waitlistCount: 0,
      isBlackout: false,
      notes: 'Kiln firing finished. Boards glazed in clear satin. Ready for collection notify.',
      bookingsCount: 3,
      totalDepositsCollected: 400.00,
    },
  ]
}

// ─── Seed Bookings / Rosters ──────────────────────────────────────────────────
function createInitialBookings(): Record<string, SessionBooking[]> {
  return {
    // Today's Pick & Paint Morning (sess-today-1)
    'sess-today-1': [
      {
        id: 'bk-101',
        bookingRef: 'YPB-SPH60',
        sessionId: 'sess-today-1',
        customerId: 'cust-1',
        customerName: 'Sophie Miller',
        customerEmail: 'sophie.miller@example.co.uk',
        customerPhone: '+44 7700 900123',
        seats: 5,
        totalAmount: 60.00,
        amountPaid: 60.00, // Upfront deposit collected
        creditApplied: 0,
        status: 'PAID',
        checkedIn: true,
        checkedInAt: '10:05',
        registeredAt: '2 days ago',
        notes: 'Birthday celebration for daughter (turning 9). Brought cupcakes.',
        potteryItems: [
          { itemId: 'inv-1', name: 'Classic Ceramic Mug', category: 'Mugs', quantity: 2, unitPrice: 15.00, totalPrice: 30.00 },
          { itemId: 'inv-5', name: 'Sitting Cat Figurine', category: 'Figures & Animals', quantity: 1, unitPrice: 18.00, totalPrice: 18.00 },
          { itemId: 'inv-11', name: 'Wide Rim Pasta Bowl', category: 'Bowls & Plates', quantity: 1, unitPrice: 22.00, totalPrice: 22.00 },
        ],
        orderCompleted: false,
      },
      {
        id: 'bk-102',
        bookingRef: 'YPB-JMS24',
        sessionId: 'sess-today-1',
        customerId: 'cust-2',
        customerName: 'James Wilson',
        customerEmail: 'j.wilson@mailservice.com',
        customerPhone: '+44 7891 234567',
        seats: 3,
        totalAmount: 36.00,
        amountPaid: 36.00,
        creditApplied: 0,
        status: 'PAID',
        checkedIn: true,
        checkedInAt: '10:12',
        registeredAt: '3 days ago',
        notes: 'Requested quiet table away from the door.',
        potteryItems: [
          { itemId: 'inv-2', name: 'Chunky Stoneware Mug', category: 'Mugs', quantity: 3, unitPrice: 16.00, totalPrice: 48.00 },
        ],
        orderCompleted: true,
        orderTotal: 48.00,
        orderBalanceDue: 12.00,
      },
      {
        id: 'bk-103',
        bookingRef: 'YPB-OLV48',
        sessionId: 'sess-today-1',
        customerId: 'cust-3',
        customerName: 'Olivia Clark',
        customerEmail: 'olivia.clark@icloud.com',
        customerPhone: '+44 7912 345678',
        seats: 4,
        totalAmount: 48.00,
        amountPaid: 48.00,
        creditApplied: 0,
        status: 'PAID',
        checkedIn: false,
        registeredAt: '1 week ago',
        notes: 'Family of 4, 2 toddlers.',
      },
      {
        id: 'bk-104',
        bookingRef: 'YPB-DVP24',
        sessionId: 'sess-today-1',
        customerId: 'cust-4',
        customerName: 'David Patel',
        customerEmail: 'd.patel@horizon.co.uk',
        customerPhone: '+44 7723 456789',
        seats: 2,
        totalAmount: 24.00,
        amountPaid: 24.00,
        creditApplied: 0,
        status: 'CONFIRMED',
        checkedIn: false,
        registeredAt: 'Yesterday',
        notes: 'Couple pottery date.',
      },
    ],

    // Today's Pottery Throwing (sess-today-2)
    'sess-today-2': [
      {
        id: 'bk-201',
        bookingRef: 'YPB-THW01',
        sessionId: 'sess-today-2',
        customerId: 'cust-5',
        customerName: 'Hannah Davies',
        customerEmail: 'hannah.d@example.com',
        customerPhone: '+44 7800 112233',
        seats: 2,
        totalAmount: 120.00,
        amountPaid: 120.00,
        creditApplied: 0,
        status: 'PAID',
        checkedIn: false,
        registeredAt: '5 days ago',
      },
      {
        id: 'bk-202',
        bookingRef: 'YPB-THW02',
        sessionId: 'sess-today-2',
        customerId: 'cust-6',
        customerName: 'George Edwards',
        customerEmail: 'george.e@gmail.com',
        customerPhone: '+44 7900 445566',
        seats: 2,
        totalAmount: 120.00,
        amountPaid: 120.00,
        creditApplied: 0,
        status: 'PAID',
        checkedIn: false,
        registeredAt: '4 days ago',
      },
      {
        id: 'bk-203',
        bookingRef: 'YPB-THW03',
        sessionId: 'sess-today-2',
        customerId: 'cust-7',
        customerName: 'Maya Patel',
        customerEmail: 'maya.patel@outlook.com',
        customerPhone: '+44 7711 778899',
        seats: 2,
        totalAmount: 120.00,
        amountPaid: 120.00,
        creditApplied: 0,
        status: 'PAID',
        checkedIn: false,
        registeredAt: 'Yesterday',
      },
    ],

    // Past Charcuterie Session ready for collection (sess-past-2)
    'sess-past-2': [
      {
        id: 'bk-past-201',
        bookingRef: 'YPB-CHARC-1',
        sessionId: 'sess-past-2',
        customerId: 'cust-8',
        customerName: 'Charlotte Taylor',
        customerEmail: 'c.taylor@glazemail.com',
        customerPhone: '+44 7855 223344',
        seats: 4,
        totalAmount: 160.00,
        amountPaid: 160.00,
        creditApplied: 0,
        status: 'PAID',
        checkedIn: true,
        registeredAt: '2 weeks ago',
        notes: 'Hand-carved botanical pattern on 4 charcuterie platters.',
      },
      {
        id: 'bk-past-202',
        bookingRef: 'YPB-CHARC-2',
        sessionId: 'sess-past-2',
        customerId: 'cust-9',
        customerName: 'Lucas Campbell',
        customerEmail: 'lucas.campbell@speedy.co.uk',
        customerPhone: '+44 7811 990011',
        seats: 3,
        totalAmount: 120.00,
        amountPaid: 120.00,
        creditApplied: 0,
        status: 'PAID',
        checkedIn: true,
        registeredAt: '2 weeks ago',
        notes: 'Hexagonal serving boards with gold dip glaze edge.',
      },
      {
        id: 'bk-past-203',
        bookingRef: 'YPB-CHARC-3',
        sessionId: 'sess-past-2',
        customerId: 'cust-10',
        customerName: 'Emily & Ben Wright',
        customerEmail: 'wright.family@post.com',
        customerPhone: '+44 7744 556677',
        seats: 3,
        totalAmount: 120.00,
        amountPaid: 120.00,
        creditApplied: 0,
        status: 'PAID',
        checkedIn: true,
        registeredAt: '2 weeks ago',
      },
    ],

    // Past Pick & Paint (sess-past-1)
    'sess-past-1': [
      {
        id: 'bk-past-101',
        bookingRef: 'YPB-PST01',
        sessionId: 'sess-past-1',
        customerId: 'cust-11',
        customerName: 'Grace Robinson',
        customerEmail: 'grace.robinson@artisan.co.uk',
        customerPhone: '+44 7799 123890',
        seats: 4,
        totalAmount: 48.00,
        amountPaid: 48.00,
        creditApplied: 0,
        status: 'PAID',
        checkedIn: true,
        registeredAt: '4 days ago',
      },
      {
        id: 'bk-past-102',
        bookingRef: 'YPB-PST02',
        sessionId: 'sess-past-1',
        customerId: 'cust-12',
        customerName: 'Nathaniel Cooper',
        customerEmail: 'n.cooper@citypost.com',
        customerPhone: '+44 7833 456123',
        seats: 5,
        totalAmount: 60.00,
        amountPaid: 60.00,
        creditApplied: 0,
        status: 'PAID',
        checkedIn: true,
        registeredAt: '5 days ago',
      },
      {
        id: 'bk-past-103',
        bookingRef: 'YPB-PST03',
        sessionId: 'sess-past-1',
        customerId: 'cust-13',
        customerName: 'Chloe & Mia Foster',
        customerEmail: 'foster.sisters@gmail.com',
        customerPhone: '+44 7712 987654',
        seats: 3,
        totalAmount: 36.00,
        amountPaid: 36.00,
        creditApplied: 0,
        status: 'PAID',
        checkedIn: true,
        registeredAt: '5 days ago',
      },
      {
        id: 'bk-past-104',
        bookingRef: 'YPB-PST04',
        sessionId: 'sess-past-1',
        customerId: 'cust-14',
        customerName: 'Aaron Thorne',
        customerEmail: 'aaron.thorne@techhub.co.uk',
        customerPhone: '+44 7822 334455',
        seats: 2,
        totalAmount: 24.00,
        amountPaid: 24.00,
        creditApplied: 0,
        status: 'PAID',
        checkedIn: true,
        registeredAt: '3 days ago',
      },
    ],
  }
}

// ─── Seed Notifications ───────────────────────────────────────────────────────
function createInitialNotifications(): StudioNotification[] {
  return [
    {
      id: 'notif-1',
      customerName: 'Charlotte Taylor',
      recipient: 'c.taylor@glazemail.com',
      channel: 'EMAIL',
      type: 'COLLECTION_READY',
      title: 'Your Pottery is Ready for Collection! ✨',
      message: 'Hi Charlotte, your pottery from Clay Session – Charcuterie Board has been glazed, fired, and is ready for collection at Your Pottery Barn! Collection hours: Wed-Sun 10am-5pm. Ref: YPB-CHARC-1',
      sentAt: 'Today at 09:30 AM',
      status: 'DELIVERED',
    },
    {
      id: 'notif-2',
      customerName: 'Lucas Campbell',
      recipient: '+44 7811 990011',
      channel: 'SMS',
      type: 'COLLECTION_READY',
      title: 'Your Pottery is Ready',
      message: 'Hi Lucas, your pottery from Charcuterie Board session is fired & ready for collection at Your Pottery Barn! Quote ref YPB-CHARC-2 on arrival.',
      sentAt: 'Today at 09:32 AM',
      status: 'DELIVERED',
    },
  ]
}

// ─── Singleton Store In Memory (Global) ───────────────────────────────────────
interface StudioOpsState {
  sessions: StudioSession[]
  bookingsBySession: Record<string, SessionBooking[]>
  notifications: StudioNotification[]
  inventory: InventoryPotteryItem[]
}

const globalForStore = globalThis as unknown as {
  __studioOpsStore?: StudioOpsState
}

export function getStudioStore(): StudioOpsState {
  if (!globalForStore.__studioOpsStore) {
    globalForStore.__studioOpsStore = {
      sessions: createInitialSessions(),
      bookingsBySession: createInitialBookings(),
      notifications: createInitialNotifications(),
      inventory: [...DEFAULT_POTTERY_INVENTORY],
    }
  }
  return globalForStore.__studioOpsStore
}

// ─── Store Methods ────────────────────────────────────────────────────────────

export function listSessions(filters?: { date?: string; weekStart?: string; serviceId?: string }): StudioSession[] {
  const store = getStudioStore()
  let list = [...store.sessions]

  if (filters?.date) {
    list = list.filter(s => s.date === filters.date)
  }
  if (filters?.serviceId) {
    list = list.filter(s => s.serviceId === filters.serviceId)
  }

  return list.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date)
    return a.startTime.localeCompare(b.startTime)
  })
}

export function getSessionById(id: string): StudioSession | undefined {
  const store = getStudioStore()
  return store.sessions.find(s => s.id === id)
}

export function createSession(data: {
  serviceId: string
  serviceName: string
  serviceCategory: 'Paint' | 'Clay' | 'Throwing' | 'Seasonal' | 'Music' | 'Blackout'
  servicePrice: number
  date: string
  startTime: string
  endTime: string
  staffName: string
  location: string
  capacityMax: number
  isBlackout?: boolean
  blackoutReason?: string
  notes?: string
}): StudioSession {
  const store = getStudioStore()
  const id = `sess-${Date.now()}`

  const categoryColors: Record<string, string> = {
    Paint: '#C4613A',
    Throwing: '#4A7C59',
    Clay: '#8B6147',
    Seasonal: '#2D5A3D',
    Music: '#9333EA',
    Blackout: '#71717A',
  }

  const newSession: StudioSession = {
    id,
    serviceId: data.serviceId,
    serviceName: data.serviceName,
    serviceCategory: data.serviceCategory,
    servicePrice: data.servicePrice,
    color: categoryColors[data.serviceCategory] || '#C4613A',
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    staffName: data.staffName,
    location: data.location,
    capacityMax: data.capacityMax,
    capacityBooked: 0,
    capacityRemaining: data.capacityMax,
    waitlistCount: 0,
    isBlackout: !!data.isBlackout,
    blackoutReason: data.blackoutReason,
    notes: data.notes,
    bookingsCount: 0,
    totalDepositsCollected: 0,
  }

  store.sessions.push(newSession)
  store.bookingsBySession[id] = []
  return newSession
}

export function updateSession(id: string, updates: Partial<StudioSession>): StudioSession | undefined {
  const store = getStudioStore()
  const index = store.sessions.findIndex(s => s.id === id)
  if (index === -1) return undefined

  store.sessions[index] = {
    ...store.sessions[index],
    ...updates,
    capacityRemaining: Math.max(0, (updates.capacityMax ?? store.sessions[index].capacityMax) - store.sessions[index].capacityBooked),
  }
  return store.sessions[index]
}

export function deleteSession(id: string): boolean {
  const store = getStudioStore()
  const initialLen = store.sessions.length
  store.sessions = store.sessions.filter(s => s.id !== id)
  delete store.bookingsBySession[id]
  return store.sessions.length < initialLen
}

export function getSessionBookings(sessionId: string): SessionBooking[] {
  const store = getStudioStore()
  return store.bookingsBySession[sessionId] || []
}

export function addParticipantToSession(sessionId: string, participant: {
  customerName: string
  customerEmail: string
  customerPhone?: string
  seats: number
  depositPaid: number
  notes?: string
}): { booking: SessionBooking; session: StudioSession } {
  const store = getStudioStore()
  const session = store.sessions.find(s => s.id === sessionId)
  if (!session) throw new Error('Session not found')

  const bookingId = `bk-man-${Date.now()}`
  const bookingRef = `YPB-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

  const newBooking: SessionBooking = {
    id: bookingId,
    bookingRef,
    sessionId,
    customerId: `cust-${Date.now()}`,
    customerName: participant.customerName,
    customerEmail: participant.customerEmail,
    customerPhone: participant.customerPhone,
    seats: participant.seats,
    totalAmount: session.servicePrice * participant.seats,
    amountPaid: participant.depositPaid,
    creditApplied: 0,
    status: participant.depositPaid >= (session.servicePrice * participant.seats) ? 'PAID' : 'BOOKED',
    checkedIn: false,
    registeredAt: 'Just now (Walk-in / Phone)',
    notes: participant.notes,
  }

  if (!store.bookingsBySession[sessionId]) {
    store.bookingsBySession[sessionId] = []
  }
  store.bookingsBySession[sessionId].push(newBooking)

  // Update session stats
  session.capacityBooked += participant.seats
  session.capacityRemaining = Math.max(0, session.capacityMax - session.capacityBooked)
  session.bookingsCount += 1
  session.totalDepositsCollected += participant.depositPaid

  return { booking: newBooking, session }
}

export function toggleBookingCheckIn(sessionId: string, bookingId: string): SessionBooking | undefined {
  const store = getStudioStore()
  const bookings = store.bookingsBySession[sessionId]
  if (!bookings) return undefined

  const booking = bookings.find(b => b.id === bookingId)
  if (!booking) return undefined

  booking.checkedIn = !booking.checkedIn
  booking.checkedInAt = booking.checkedIn ? new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : undefined
  return booking
}

export function updateBookingStatus(sessionId: string, bookingId: string, status: SessionBooking['status']): SessionBooking | undefined {
  const store = getStudioStore()
  const bookings = store.bookingsBySession[sessionId]
  if (!bookings) return undefined

  const booking = bookings.find(b => b.id === bookingId)
  if (!booking) return undefined

  booking.status = status
  return booking
}

export function saveBookingOrderCheckout(sessionId: string, bookingId: string, payload: {
  potteryItems: PotteryOrderItem[]
  grossTotal: number
  depositDeducted: number
  balanceDue: number
  paymentMethod: string
}): SessionBooking | undefined {
  const store = getStudioStore()
  const bookings = store.bookingsBySession[sessionId]
  if (!bookings) return undefined

  const booking = bookings.find(b => b.id === bookingId)
  if (!booking) return undefined

  booking.potteryItems = payload.potteryItems
  booking.orderCompleted = true
  booking.orderTotal = payload.grossTotal
  booking.orderBalanceDue = payload.balanceDue
  booking.status = 'PAID'

  return booking
}

export function getNotifications(): StudioNotification[] {
  const store = getStudioStore()
  return [...store.notifications].reverse()
}

export function createNotification(data: {
  bookingId?: string
  customerName: string
  recipient: string
  channel: 'EMAIL' | 'SMS'
  type: 'COLLECTION_READY' | 'FIRING_DELAY' | 'REMINDER' | 'CUSTOM'
  title: string
  message: string
}): StudioNotification {
  const store = getStudioStore()
  const newNotif: StudioNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    bookingId: data.bookingId,
    customerName: data.customerName,
    recipient: data.recipient,
    channel: data.channel,
    type: data.type,
    title: data.title,
    message: data.message,
    sentAt: 'Just now',
    status: 'DELIVERED',
  }
  store.notifications.push(newNotif)
  return newNotif
}
