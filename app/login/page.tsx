'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SiteHeader } from '@/components/customer/SiteHeader'
import { SiteFooter } from '@/components/customer/SiteFooter'
import Link from 'next/link'
import { Mail, Lock, ArrowRight, Sparkles, Shield } from 'lucide-react'

function CustomerLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/account'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Quick customer demo sign-in
    setTimeout(() => {
      router.push(callbackUrl)
    }, 600)
  }

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <div className="bg-warm-white rounded-3xl shadow-pottery p-8 border border-parchment/60">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-white p-1 flex items-center justify-center mx-auto mb-3 shadow-md border border-parchment">
            <img
              src="/images/logo/logo.png"
              alt="Your Pottery Barn Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="font-playfair text-3xl font-bold text-clay">Customer Sign In</h1>
          <p className="text-clay-light text-sm mt-1">Access your booked workshops and gift cards</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-clay mb-1.5 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-clay-light" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-parchment rounded-xl text-sm bg-cream text-clay focus:outline-none focus:ring-2 focus:ring-terracotta/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-clay mb-1.5 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-clay-light" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-parchment rounded-xl text-sm bg-cream text-clay focus:outline-none focus:ring-2 focus:ring-terracotta/30"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2 mt-6"
          >
            {loading ? 'Signing In...' : 'Sign In to Account'} <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-parchment/80 text-center space-y-3">
          <p className="text-xs text-clay-light">
            Looking for staff operations?{' '}
            <Link href="/admin/login" className="text-terracotta font-semibold hover:underline">
              Staff & Admin Portal &rarr;
            </Link>
          </p>
          <p className="text-xs text-clay-light">
            Don&apos;t have an account? You can book workshops directly as a guest!{' '}
            <Link href="/workshops" className="text-terracotta underline">
              Browse Workshops
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream">
        <Suspense fallback={<div className="text-center py-20 text-clay">Loading...</div>}>
          <CustomerLoginForm />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  )
}
