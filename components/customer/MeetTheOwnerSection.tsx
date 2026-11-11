import Link from 'next/link'
import { heart } from '@/lib/studio-content'

export function MeetTheOwnerSection() {
  return (
    <section id="meet-the-owner" className="py-16 lg:py-24 bg-cream border-y border-parchment">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <figure className="lg:col-span-5">
          <img src="/images/about/our-family.jpg" alt="The couple behind Your Pottery Barn, photographed together at an awards event" className="w-full max-w-md mx-auto rounded-2xl aspect-[3/4] object-cover object-top" loading="lazy" />
          <figcaption className="text-sm text-clay-light mt-3 text-center">The family behind Your Pottery Barn.</figcaption>
        </figure>
        <div className="lg:col-span-7">
          <h2 className="font-playfair text-3xl sm:text-4xl text-clay mb-6">The Heart Behind Our Barn</h2>
          <div className="space-y-4 text-clay-light leading-relaxed">{heart.map(p => <p key={p}>{p}</p>)}</div>
          <Link href="/workshops" className="btn-primary inline-block mt-8">Come and create with us</Link>
        </div>
      </div>
    </section>
  )
}
