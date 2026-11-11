import { SERVICE_CATALOG } from '../lib/service-details'
import { PrismaClient, BookingStatus, PaymentChannel, PaymentProvider, PaymentStatus, StaffRole } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ─── Services ───────────────────────────────────────────────────────────────
  const services = SERVICE_CATALOG.map(({ id, ...service }) => service)

  console.log('📦 Creating services...')
  const createdServices: Record<string, string> = {}
  for (const service of services) {
    const existing = await prisma.service.findFirst({ where: { name: service.name } })
    const s = existing
      ? await prisma.service.update({ where: { id: existing.id }, data: service })
      : await prisma.service.create({ data: service })
    createdServices[service.name] = s.id
    console.log(`  ✓ ${service.name}`)
  }

  // ─── Add-ons ─────────────────────────────────────────────────────────────────
  const addons = [
    { name: 'English Tea', price: 0, category: 'Drink' },
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
    const existing = await prisma.addon.findFirst({ where: { name: addon.name } })
    if (existing) await prisma.addon.update({ where: { id: existing.id }, data: addon })
    else await prisma.addon.create({ data: addon })
    console.log(`  ✓ ${addon.name}`)
  }

  // ─── Sample Availability Slots (next 4 weeks) ─────────────────────────────
  console.log('📅 Creating availability slots...')
  const pickPaintId = createdServices['Pick & Paint (All Ages)']
  const throwingId = createdServices['Beginners Pottery Throwing Workshop']

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
        capacityRemaining: 30,
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
