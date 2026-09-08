'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ShoppingBag, User } from 'lucide-react'
import { useSession } from 'next-auth/react'

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 bg-warm-white/95 backdrop-blur-md shadow-sm border-b border-parchment/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-white border border-parchment/80 shadow-sm overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <img
                src="/images/logo/logo.png"
                alt="Your Pottery Barn Logo"
                className="w-full h-full object-contain p-0.5"
              />
            </div>
            <div>
              <span className="font-playfair font-bold text-clay text-lg sm:text-xl leading-tight block">
                Your Pottery Barn
              </span>
              <span className="text-[10px] text-terracotta uppercase tracking-wider font-semibold block -mt-0.5">
                Arts &amp; Crafts Studio
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Main navigation">
            <Link href="/workshops" className="text-clay-light hover:text-terracotta font-medium text-sm transition-colors">
              Workshops
            </Link>
            <Link href="/celebrations" className="text-clay-light hover:text-terracotta font-medium text-sm transition-colors">
              Celebrations
            </Link>
            <Link href="/gallery" className="text-clay-light hover:text-terracotta font-medium text-sm transition-colors">
              Gallery
            </Link>
            <Link href="/about" className="text-clay-light hover:text-terracotta font-medium text-sm transition-colors">
              About
            </Link>
            <Link href="/gift-cards" className="text-clay-light hover:text-terracotta font-medium text-sm transition-colors">
              Gift Cards
            </Link>
            {session ? (
              <Link href="/account" className="flex items-center gap-2 text-sm font-medium text-clay hover:text-terracotta transition-colors">
                <User size={16} />
                My Bookings
              </Link>
            ) : (
              <Link href="/login" className="text-sm font-medium text-clay-light hover:text-terracotta transition-colors">
                Sign In
              </Link>
            )}
            <Link
              href="/workshops"
              className="btn-primary text-sm px-5 py-2.5 shadow-sm hover:shadow"
            >
              Book Now
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-clay hover:bg-parchment transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-parchment animate-fade-in">
            <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
              {[
                { href: '/workshops', label: 'Workshops & Classes' },
                { href: '/celebrations', label: 'Celebrations & Parties' },
                { href: '/gallery', label: 'Photo Gallery' },
                { href: '/about', label: 'About Us' },
                { href: '/gift-cards', label: 'Gift Cards' },
                session
                  ? { href: '/account', label: 'My Bookings' }
                  : { href: '/login', label: 'Sign In' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="px-3 py-2.5 rounded-lg text-clay font-medium hover:bg-parchment transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/workshops"
                className="btn-primary text-center mt-2"
                onClick={() => setMenuOpen(false)}
              >
                Book a Workshop
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
