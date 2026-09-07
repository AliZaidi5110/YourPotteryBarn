import { PrismaClient, BookingStatus, PaymentChannel, PaymentProvider, PaymentStatus, StaffRole } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ─── Services ───────────────────────────────────────────────────────────────
  const services = [
    {
      name: 'Pick & Paint (All Ages)',
      description: 'Choose from our wide selection of ceramic pieces and paint them however you like! Perfect for all ages — whether it\'s a family day out or a fun afternoon with friends. All paints, brushes, and guidance included.',
      price: 12.00,
      durationMinutes: 120,
      maxCapacity: 20,
      category: 'Paint',
      imageUrl: '/images/services/pick-paint.jpg',
    },
    {
      name: 'Adults Only Pick & Paint',
      description: 'An 18+ twist on our classic Pick & Paint session. Enjoy a relaxed, creative evening with fellow adults. Complimentary welcome drink available. Perfect for date nights, hen dos, or just a night out with mates.',
      price: 12.00,
      durationMinutes: 120,
      maxCapacity: 16,
      category: 'Paint',
      imageUrl: '/images/services/pick-paint-adults.jpg',
    },
    {
      name: 'Wreath Making Workshop',
      description: 'Learn the art of wreath making from our expert instructor. You\'ll leave with a beautiful, handcrafted wreath to display in your home. All materials included — foliage, ribbon, decorations, and a wire base.',
      price: 45.00,
      durationMinutes: 120,
      maxCapacity: 12,
      category: 'Seasonal',
      imageUrl: '/images/services/wreath-making.jpg',
    },
    {
      name: 'Beginners Pottery Throwing Workshop',
      description: 'Discover the ancient craft of throwing clay on a pottery wheel! Our patient instructors will guide you through centering, opening, and shaping your very first vessel. All clay, tools, and firing included.',
      price: 60.00,
      durationMinutes: 120,
      maxCapacity: 8,
      category: 'Throwing',
      imageUrl: '/images/services/pottery-throwing.jpg',
    },
    {
      name: 'Clay Session – Charcuterie Board',
      description: 'Create your own stunning clay charcuterie board — the perfect centrepiece for your next dinner party. Flatten, texture, and finish your board before it goes to the kiln. Glazing options available.',
      price: 40.00,
      durationMinutes: 90,
      maxCapacity: 10,
      category: 'Clay',
      imageUrl: '/images/services/charcuterie-board.jpg',
    },
    {
      name: 'Clay Session – Tree OR Angel Luminaries',
      description: 'Hand-build a beautiful tree or angel luminary from clay. When fired and lit with a tea light, these create a magical glowing centrepiece. Choose your design on the day.',
      price: 25.00,
      durationMinutes: 90,
      maxCapacity: 12,
      category: 'Clay',
      imageUrl: '/images/services/luminaries.jpg',
    },
    {
      name: 'Clay Session – Christmas Tree Decs',
      description: 'Make a set of handmade clay Christmas tree decorations — stars, baubles, angels, and more. Roll, cut, texture, and personalise your designs. Fired and ready to collect within a week.',
      price: 25.00,
      durationMinutes: 90,
      maxCapacity: 14,
      category: 'Seasonal',
      imageUrl: '/images/services/christmas-decs.jpg',
    },
    {
      name: 'Christmassy Pick & Paint',
      description: 'Our festive take on Pick & Paint — choose from Christmas-themed ceramics (baubles, mugs, plates, snowmen) and paint them in your own style. Mulled wine available to purchase. Get in the festive spirit!',
      price: 16.00,
      durationMinutes: 120,
      maxCapacity: 20,
      category: 'Seasonal',
      imageUrl: '/images/services/christmas-paint.jpg',
    },
    {
      name: 'Ukulele Fun',
      description: 'A beginner-friendly, fun introduction to the ukulele. No experience needed — just a love of music and a sense of humour! Learn a few chords and strum along to popular songs in this lively group session.',
      price: 10.00,
      durationMinutes: 60,
      maxCapacity: 15,
      category: 'Music',
      imageUrl: '/images/services/ukulele.jpg',
    },
  ]

  console.log('📦 Creating services...')
  const createdServices: Record<string, string> = {}
  for (const service of services) {
    const s = await prisma.service.upsert({
      where: { name: service.name } as any,
      update: service,
      create: service,
    })
    createdServices[service.name] = s.id
    console.log(`  ✓ ${service.name}`)
  }

  // ─── Add-ons ─────────────────────────────────────────────────────────────────
  const addons = [
    { name: 'Tea', price: 2.50, category: 'Drink' },
    { name: 'Coffee', price: 2.50, category: 'Drink' },
    { name: 'Hot Chocolate', price: 3.00, category: 'Drink' },
    { name: 'Prosecco Glass', price: 6.00, category: 'Drink' },
    { name: 'Prosecco Bottle', price: 22.00, category: 'Drink' },
    { name: 'Soft Drink / Juice', price: 2.00, category: 'Drink' },
    { name: 'Water Bottle', price: 1.50, category: 'Drink' },
    { name: 'Snack Pack (crisps + biscuits)', price: 3.50, category: 'Food' },
    { name: 'Cheese & Crackers Plate', price: 7.00, category: 'Food' },
    { name: 'Brownie', price: 2.50, category: 'Food' },
    { name: 'Extra Clay Block', price: 5.00, category: 'Equipment' },
    { name: 'Studio Apron', price: 4.00, category: 'Equipment' },
    { name: 'Photo Print of Finished Piece', price: 5.00, category: 'Other' },
    { name: 'Gift Wrapping', price: 3.00, category: 'Other' },
  ]

  console.log('📦 Creating add-ons...')
  for (const addon of addons) {
    await prisma.addon.upsert({
      where: { name: addon.name } as any,
      update: addon,
      create: addon,
    })
    console.log(`  ✓ ${addon.name}`)
  }

  // ─── Sample Availability Slots (next 4 weeks) ─────────────────────────────
  console.log('📅 Creating availability slots...')
  const pickPaintId = Object.values(createdServices)[0]
  const throwingId = Object.values(createdServices)[3]

  // Create a few sample slots for the next 14 days
  const today = new Date()
  for (let i = 1; i <= 14; i++) {
    const slotDate = new Date(today)
    slotDate.setDate(today.getDate() + i)

    // Skip Mondays (index 1)
    if (slotDate.getDay() === 1) continue

    // Pick & Paint at 10am and 2pm
    await prisma.availabilitySlot.create({
      data: {
        serviceId: pickPaintId,
        date: slotDate,
        startTime: '10:00',
        endTime: '12:00',
        capacityRemaining: 20,
      },
    })
    await prisma.availabilitySlot.create({
      data: {
        serviceId: pickPaintId,
        date: slotDate,
        startTime: '14:00',
        endTime: '16:00',
        capacityRemaining: 20,
      },
    })

    // Throwing workshop on weekends only
    if (slotDate.getDay() === 6 || slotDate.getDay() === 0) {
      await prisma.availabilitySlot.create({
        data: {
          serviceId: throwingId,
          date: slotDate,
          startTime: '11:00',
          endTime: '13:00',
          capacityRemaining: 8,
        },
      })
    }
  }
  console.log('  ✓ Availability slots created')

  // ─── Default Owner Admin ──────────────────────────────────────────────────
  console.log('👤 Creating default admin account...')
  const passwordHash = await hash('admin123!', 12)
  await prisma.staffUser.upsert({
    where: { email: 'owner@yourpottery.co.uk' },
    update: {},
    create: {
      name: 'Studio Owner',
      email: 'owner@yourpottery.co.uk',
      role: StaffRole.OWNER,
      passwordHash,
    },
  })
  console.log('  ✓ Admin: owner@yourpottery.co.uk / admin123!')

  console.log('\n✅ Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
