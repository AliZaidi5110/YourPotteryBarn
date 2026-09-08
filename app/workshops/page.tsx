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
        {/* Page Banner with Workshops & Classes Background Image */}
        <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 text-center text-warm-white overflow-hidden flex items-center justify-center">
          {/* Background Workshops & Classes Image */}
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <img
              src="/images/workshops/workshops-classes-hero.jpg"
              alt="Pottery workshops and classes at Your Pottery Barn"
              className="w-full h-full object-cover object-center"
            />
            {/* Atmospheric overlay to blend with brand clay palette and ensure pristine text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-clay/95 via-clay/80 to-clay/70" />
          </div>

          <div className="max-w-3xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 bg-warm-white/15 backdrop-blur-md border border-warm-white/30 rounded-full px-4 py-1.5 mb-6 shadow-sm">
              <span className="text-warm-white text-xs font-semibold uppercase tracking-widest">
                🏺 Studio Sessions &amp; Workshops
              </span>
            </div>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-warm-white drop-shadow-md">
              Workshops &amp; Classes
            </h1>
            <p className="text-cream/90 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto font-normal drop-shadow-sm">
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
