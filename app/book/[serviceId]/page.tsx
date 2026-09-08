import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/customer/SiteHeader'
import { BookingFlow } from '@/components/customer/BookingFlow'
import { formatCurrency } from '@/lib/utils'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ serviceId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { serviceId } = await params
  try {
    const service = await prisma.service.findUnique({ where: { id: serviceId } })
    if (!service) return { title: 'Not Found' }
    return {
      title: `Book ${service.name}`,
      description: `Book your place at ${service.name} — ${formatCurrency(Number(service.price))} per person. ${service.description.slice(0, 100)}...`,
    }
  } catch {
    return { title: 'Book Service' }
  }
}

import { DEFAULT_SERVICES, DEFAULT_ADDONS, getDefaultSlots } from '@/lib/mock-data'

async function getServiceWithSlots(serviceId: string) {
  try {
    const [service, slots, addons] = await Promise.all([
      prisma.service.findUnique({ where: { id: serviceId, active: true } }),
      prisma.availabilitySlot.findMany({
        where: {
          serviceId,
          date: { gte: new Date() },
          isBlackout: false,
          capacityRemaining: { gt: 0 },
        },
        orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
      }),
      prisma.addon.findMany({ where: { active: true }, orderBy: { category: 'asc' } }),
    ])
    if (service) {
      return {
        service,
        slots: slots.length > 0 ? slots : getDefaultSlots(serviceId),
        addons: addons.length > 0 ? addons : DEFAULT_ADDONS,
      }
    }
  } catch (err) {
    console.warn('Error querying service slots from DB, checking mock catalog:', err)
  }

  // Fallback to mock service
  const mockService = DEFAULT_SERVICES.find(s => s.id === serviceId) ?? DEFAULT_SERVICES[0]
  return {
    service: mockService,
    slots: getDefaultSlots(mockService.id),
    addons: DEFAULT_ADDONS,
  }
}

export default async function BookServicePage({ params }: Props) {
  const { serviceId } = await params
  const { service, slots, addons } = await getServiceWithSlots(serviceId)

  if (!service) notFound()

  // Serialize to plain JSON objects for Next.js Client Component boundary:
  const serializedService = JSON.parse(JSON.stringify(service))
  const serializedSlots = JSON.parse(JSON.stringify(slots))
  const serializedAddons = JSON.parse(JSON.stringify(addons))

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream py-8 px-4 sm:px-6 lg:px-8">
        <BookingFlow service={serializedService} slots={serializedSlots} addons={serializedAddons} />
      </main>
    </>
  )
}
