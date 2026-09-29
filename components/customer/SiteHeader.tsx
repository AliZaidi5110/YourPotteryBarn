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

            {/* Social links */}
            <div className="flex items-center gap-1 pl-2 border-l border-parchment">
              <a
                href="https://www.instagram.com/your.potterybarn/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-clay-light hover:text-terracotta p-1.5 rounded-full hover:bg-parchment/60 transition-colors"
                aria-label="Follow Your Pottery Barn on Instagram"
                title="Instagram (@your.potterybarn)"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=100090796065925"
                target="_blank"
                rel="noopener noreferrer"
                className="text-clay-light hover:text-terracotta p-1.5 rounded-full hover:bg-parchment/60 transition-colors"
                aria-label="Follow Your Pottery Barn on Facebook"
                title="Facebook (Your Pottery Barn)"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
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

              {/* Mobile Social Links */}
              <div className="flex items-center justify-center gap-5 pt-3 mt-2 border-t border-parchment/80 text-xs">
                <a
                  href="https://www.instagram.com/your.potterybarn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-clay-light hover:text-terracotta flex items-center gap-1.5 font-semibold"
                >
                  <svg className="w-4 h-4 text-terracotta" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Instagram</span>
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=100090796065925"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-clay-light hover:text-terracotta flex items-center gap-1.5 font-semibold"
                >
                  <svg className="w-4 h-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </a>
                <a
                  href="http://google.com/maps/place/Your+Pottery+Barn+HARTLEY/@51.3651727,0.3189965,17z/data=!3m1!4b1!4m6!3m5!1s0x47d8b5189ab051bf:0xfa84a8198d12bb9!8m2!3d51.3651727!4d0.3189965!16s%2Fg%2F11kpcxdhn0?entry=ttu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-clay-light hover:text-terracotta flex items-center gap-1 font-semibold"
                >
                  <span>📍 Maps</span>
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
