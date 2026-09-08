'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  LayoutDashboard, Calendar, ShoppingBag, CreditCard, Users,
  Settings, BarChart3, UserCog, LogOut, ChevronLeft, ChevronRight, Menu
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard',    exact: true },
  { href: '/admin/bookings',  icon: Calendar,       label: 'Bookings' },
  { href: '/admin/checkout',  icon: ShoppingBag,    label: 'Checkout',     badge: 'POS' },
  { href: '/admin/payments',  icon: CreditCard,     label: 'Payments' },
  { href: '/admin/customers', icon: Users,          label: 'Customers' },
  { href: '/admin/services',  icon: Settings,       label: 'Services & Add-ons' },
  { href: '/admin/reports',   icon: BarChart3,      label: 'Reports' },
  { href: '/admin/staff',     icon: UserCog,        label: 'Staff & Roles', ownerOnly: true },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [collapsed, setCollapsed] = useState(false)
  const role = (session?.user as any)?.role

  return (
    <aside className={cn(
      'flex flex-col bg-clay h-screen sticky top-0 transition-all duration-300 shadow-pottery-xl',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Logo */}
      <div className="p-4 border-b border-clay-light/30 flex items-center justify-between">
        {!collapsed ? (
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white p-0.5 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
              <img
                src="/images/logo/logo.png"
                alt="Your Pottery Barn Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="font-playfair text-warm-white text-sm font-semibold leading-tight">Your Pottery Barn</p>
              <p className="text-cream/40 text-[10px] uppercase tracking-wider">Admin Portal</p>
            </div>
          </Link>
        ) : (
          <div className="w-7 h-7 rounded-full bg-white p-0.5 overflow-hidden flex items-center justify-center shrink-0 mx-auto shadow-sm">
            <img
              src="/images/logo/logo.png"
              alt="Your Pottery Barn Logo"
              className="w-full h-full object-contain"
            />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-cream/50 hover:text-warm-white transition-colors p-1.5 rounded-lg hover:bg-clay-light/20 ml-auto"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto" aria-label="Admin navigation">
        {NAV_ITEMS.filter(item => !item.ownerOnly || role === 'owner').map(item => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative',
                isActive
                  ? 'bg-terracotta text-warm-white shadow-terracotta'
                  : 'text-cream/70 hover:bg-clay-light/20 hover:text-warm-white'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" aria-hidden="true" />
              {!collapsed && (
                <>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-xs font-bold bg-terracotta/30 text-terracotta-light rounded-full px-2 py-0.5">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {/* Tooltip when collapsed */}
              {collapsed && (
                <div className="absolute left-14 bg-clay text-warm-white text-xs px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-pottery">
                  {item.label}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-clay-light/30">
        {!collapsed && session?.user && (
          <div className="px-3 py-2 mb-2">
            <p className="text-warm-white text-sm font-medium truncate">{session.user.name}</p>
            <p className="text-cream/40 text-xs capitalize">{role}</p>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-cream/70 hover:bg-red-500/20 hover:text-red-300 transition-all',
          )}
        >
          <LogOut size={18} aria-hidden="true" />
          {!collapsed && <span>Sign Out</span>}
        </button>
        {!collapsed && (
          <Link href="/" className="flex items-center gap-3 w-full px-3 py-2 mt-1 text-xs text-cream/40 hover:text-cream/70 transition-colors">
            ← View customer site
          </Link>
        )}
      </div>
    </aside>
  )
}
