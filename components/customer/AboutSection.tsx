import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { welcome } from '@/lib/studio-content'

export function AboutSection() {
  return (
    <section id="about" className="py-16 lg:py-24 bg-warm-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <img src="/images/gallery/gallery-7.avif" alt="Two smiling visitors beside the kitchen counter at Your Pottery Barn" className="w-full aspect-[4/3] object-cover rounded-2xl" loading="lazy" />
        <div>
          <p className="text-clay-light text-sm uppercase tracking-widest mb-3">Welcome to our barn</p>
          <h2 className="font-playfair text-3xl sm:text-4xl text-clay mb-6">Make yourself at home.</h2>
          <div className="space-y-4 text-clay-light leading-relaxed">{welcome.slice(1).map(p => <p key={p}>{p}</p>)}</div>
          <Link href="/about" className="inline-flex items-center gap-2 text-clay font-semibold mt-7">Our story <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  )
}
