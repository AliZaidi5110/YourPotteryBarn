import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Gift, MapPin } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="bg-cream" aria-label="Welcome to Your Pottery Barn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <p className="flex items-center gap-2 text-clay-light text-xs sm:text-sm tracking-widest uppercase mb-6"><MapPin size={16} aria-hidden="true" /> Hartley, Kent</p>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl text-clay leading-[1.12] mb-6">A place to create, connect and belong.</h1>
          <p className="text-clay-light text-base sm:text-lg leading-relaxed mb-4 max-w-lg">Welcome to Your Pottery Barn, our family-run pottery studio nestled in the beautiful Kent countryside in Hartley.</p>
          <p className="text-clay mb-8">You don&apos;t have to be artistic. You just have to be you.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/workshops" className="btn-primary inline-flex items-center gap-2">Find a session <ArrowRight size={17} aria-hidden="true" /></Link>
            <Link href="/gift-cards" className="btn-secondary inline-flex items-center gap-2"><Gift size={17} aria-hidden="true" /> Gift cards</Link>
          </div>
          <p className="text-sm text-clay-light mt-7">Pottery painting, wheel throwing and time together.</p>
        </div>
        <figure>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-parchment">
            <Image src="/images/gallery/gallery-5.avif" alt="The familiar Your Pottery Barn barn and leaf logo on our reception counter" fill preload sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
          <figcaption className="mt-3 text-sm text-clay-light">A warm welcome at our barn in Hartley.</figcaption>
        </figure>
      </div>
    </section>
  )
}
