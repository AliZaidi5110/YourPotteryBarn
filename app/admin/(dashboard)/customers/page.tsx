'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Search, Users, Star, CreditCard, Plus } from 'lucide-react'

export default function CustomersPage() {
  const [search, setSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [topUpAmount, setTopUpAmount] = useState('')
  const [topUpLoading, setTopUpLoading] = useState(false)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['customers', search],
    queryFn: async () => {
      const res = await fetch(`/api/customers?search=${encodeURIComponent(search)}`)
      return res.json()
    },
  })

  const customers = data?.customers ?? []

  async function handleTopUp(customerId: string) {
    if (!topUpAmount || isNaN(parseFloat(topUpAmount))) return
    setTopUpLoading(true)
    await fetch(`/api/customers/${customerId}/credit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: parseFloat(topUpAmount) }),
    })
    setTopUpAmount('')
    refetch()
    setTopUpLoading(false)
  }

  async function toggleVip(customerId: string, isVip: boolean) {
    await fetch(`/api/customers/${customerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isVip: !isVip }),
    })
    refetch()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-3xl font-bold text-clay">Customers</h1>
        <p className="text-clay-light mt-1">Manage customer records, credit balances, and booking history.</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-clay-light" />
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-10 pr-4 py-3 border border-parchment rounded-xl text-clay text-sm bg-warm-white focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Customer list */}
        <div className="xl:col-span-2 bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-clay-light">Loading customers...</div>
          ) : customers.length === 0 ? (
            <div className="p-8 text-center text-clay-light">
              <Users size={40} className="mx-auto mb-3 opacity-20" />
              <p>No customers found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-cream border-b border-parchment">
                  <tr>
                    {['Customer', 'Email', 'Bookings', 'Total Spend', 'Credit', 'VIP'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-clay-light uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-parchment/50">
                  {customers.map((c: any) => (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCustomer(c)}
                      className={`hover:bg-cream cursor-pointer transition-colors ${selectedCustomer?.id === c.id ? 'bg-terracotta/5' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta font-bold text-xs flex-shrink-0">
                            {c.name.charAt(0)}
                          </div>
                          <span className="font-medium text-clay">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-clay-light">{c.email}</td>
                      <td className="px-4 py-3 text-clay">{c._count?.bookings ?? 0}</td>
                      <td className="px-4 py-3 font-semibold text-clay">{formatCurrency(c._sum?.totalAmount ?? 0)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold ${Number(c.creditBalance) > 0 ? 'text-sage' : 'text-clay-light'}`}>
                          {formatCurrency(Number(c.creditBalance))}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={e => { e.stopPropagation(); toggleVip(c.id, c.isVip) }}
                          className={`text-lg ${c.isVip ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'} transition-colors`}
                          aria-label={c.isVip ? 'Remove VIP status' : 'Mark as VIP'}
                        >
                          ⭐
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Customer detail panel */}
        <div>
          {selectedCustomer ? (
            <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-5 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta font-bold text-xl">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-playfair font-bold text-clay text-lg">{selectedCustomer.name}</h2>
                  <p className="text-clay-light text-sm">{selectedCustomer.email}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-clay-light">Phone</span>
                  <span className="text-clay">{selectedCustomer.phone ?? '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-clay-light">Member since</span>
                  <span className="text-clay">{formatDate(new Date(selectedCustomer.createdAt))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-clay-light">Status</span>
                  <span className={selectedCustomer.isVip ? 'text-yellow-600 font-semibold' : 'text-clay-light'}>
                    {selectedCustomer.isVip ? '⭐ VIP' : 'Standard'}
                  </span>
                </div>
              </div>

              {/* Credit balance */}
              <div className="bg-sage/10 rounded-xl p-4 border border-sage/20">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard size={16} className="text-sage" />
                  <span className="text-sage font-semibold text-sm">Studio Credit</span>
                </div>
                <p className="text-2xl font-bold text-sage">{formatCurrency(Number(selectedCustomer.creditBalance))}</p>
                <div className="mt-3 flex gap-2">
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={e => setTopUpAmount(e.target.value)}
                    placeholder="Amount"
                    min="1"
                    step="0.50"
                    className="flex-1 border border-sage/30 rounded-lg px-3 py-1.5 text-sm text-clay bg-cream focus:outline-none focus:ring-2 focus:ring-sage/30"
                  />
                  <button
                    onClick={() => handleTopUp(selectedCustomer.id)}
                    disabled={topUpLoading}
                    className="bg-sage text-warm-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-sage-dark transition-colors disabled:opacity-50"
                  >
                    <Plus size={14} className="inline" /> Add
                  </button>
                </div>
              </div>

              {/* Recent bookings */}
              {selectedCustomer.bookings?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-clay text-sm mb-2">Recent Bookings</h3>
                  <div className="space-y-2">
                    {selectedCustomer.bookings.slice(0, 5).map((b: any) => (
                      <div key={b.id} className="text-xs bg-cream rounded-lg p-2.5 border border-parchment">
                        <p className="font-medium text-clay">{b.service?.name}</p>
                        <p className="text-clay-light">{b.bookingRef} · {formatCurrency(Number(b.totalAmount))}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-8 text-center text-clay-light">
              <Users size={40} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm">Select a customer to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
