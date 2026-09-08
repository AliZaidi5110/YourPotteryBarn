import { prisma } from '@/lib/prisma'
import { ServiceGrid } from '@/components/customer/ServiceGrid'
import { SiteHeader } from '@/components/customer/SiteHeader'
import { SiteFooter } from '@/components/customer/SiteFooter'
import { DEFAULT_SERVICES } from '@/lib/mock-data'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pottery Workshops & Classes — Your Pottery Barn',
  description: 'Explore and book our pottery workshops, beginner wheel throwing, Pick & Paint sessions, and seasonal clay craft classes in Hartley, Kent.',
}

export const dynamic = 'force-dynamic'

async function getServices() {
  try {
    const list = await prisma.service.findMany({
      where: { active: true },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    })
    if (list && list.length > 0) return list
    return DEFAULT_SERVICES
  } catch (error) {
    console.warn('Database not reachable, serving studio workshops fallback:', error)
    return DEFAULT_SERVICES
  }
}

export default async function WorkshopsPage() {
  const services = await getServices()
  const serializedServices = JSON.parse(JSON.stringify(services))

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream">
        {/* Page Banner */}
        <section className="bg-clay py-16 px-4 sm:px-6 lg:px-8 text-center text-warm-white relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute -top-12 -right-12 w-96 h-96 rounded-full bg-terracotta blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-96 h-96 rounded-full bg-sage blur-3xl" />
          </div>
          <div className="max-w-3xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 bg-terracotta/25 border border-terracotta/40 rounded-full px-4 py-1.5 mb-6">
              <span className="text-terracotta-light text-xs font-semibold uppercase tracking-widest">
                🏺 Studio Sessions &amp; Workshops
              </span>
            </div>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-warm-white">
              Workshops &amp; Classes
            </h1>
            <p className="text-cream/80 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
              From beginner-friendly Pick &amp; Paint to hands-on wheel throwing and seasonal craft sessions &mdash; select your workshop, pick your date, and book in minutes.
            </p>
          </div>
        </section>

        {/* Workshop Cards Grid */}
        <div className="py-12">
          <ServiceGrid services={serializedServices} />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
