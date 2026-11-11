import { Hand, Leaf, CalendarDays } from 'lucide-react'
import { studioFeatures } from '@/lib/studio-content'

export function WhyChooseUsSection() {
  const icons = [Hand, Leaf, CalendarDays]
  return (
    <section className="py-16 lg:py-20 bg-warm-white" aria-label="Your visit">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-10">
        {studioFeatures.map((feature, i) => {
          const Icon = icons[i]
          return <article key={feature.title}><Icon size={28} strokeWidth={1.5} className="text-clay mb-5" aria-hidden="true" /><h2 className="font-playfair text-2xl text-clay mb-4">{feature.title}</h2><p className="text-sm text-clay-light leading-relaxed">{feature.description}</p></article>
        })}
      </div>
    </section>
  )
}
