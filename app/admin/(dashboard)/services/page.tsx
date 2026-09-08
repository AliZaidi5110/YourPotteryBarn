'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import { Plus, Edit3, Eye, EyeOff, Loader2, Save, X } from 'lucide-react'

interface Service {
  id: string
  name: string
  description: string
  price: number
  durationMinutes: number
  maxCapacity: number
  category: string
  imageUrl?: string
  active: boolean
}

interface Addon {
  id: string
  name: string
  price: number
  category: string
  active: boolean
}

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<'services' | 'addons'>('services')
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [editingAddon, setEditingAddon] = useState<Addon | null>(null)
  const queryClient = useQueryClient()

  const { data: servicesData } = useQuery({
    queryKey: ['admin-services'],
    queryFn: () => fetch('/api/services').then(r => r.json()),
  })

  const { data: addonsData } = useQuery({
    queryKey: ['admin-addons'],
    queryFn: () => fetch('/api/services/addons').then(r => r.json()),
  })

  const services: Service[] = servicesData?.services ?? servicesData ?? []
  const addons: Addon[] = addonsData ?? []

  const toggleServiceMutation = useMutation({
    mutationFn: (service: Service) =>
      fetch(`/api/services/${service.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !service.active }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-services'] }),
  })

  const toggleAddonMutation = useMutation({
    mutationFn: (addon: Addon) =>
      fetch(`/api/services/addons/${addon.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !addon.active }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-addons'] }),
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-3xl font-bold text-clay">Services & Add-ons</h1>
        <p className="text-clay-light mt-1">Manage workshops, clay sessions, and products/drinks.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-parchment">
        {(['services', 'addons'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all ${activeTab === tab ? 'border-terracotta text-terracotta' : 'border-transparent text-clay-light hover:text-clay'}`}
          >
            {tab === 'services' ? '🏺 Workshops' : '🍵 Products & Drinks'}
          </button>
        ))}
      </div>

      {activeTab === 'services' && (
        <div className="space-y-3">
          {services.map(service => (
            <div key={service.id} className={`bg-warm-white rounded-xl shadow-pottery-sm border border-parchment/50 p-4 flex items-center gap-4 ${!service.active ? 'opacity-60' : ''}`}>
              <div className="w-10 h-10 rounded-xl bg-terracotta/10 flex items-center justify-center text-lg flex-shrink-0">
                {getCategoryIcon(service.category)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-clay">{service.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${service.active ? 'bg-sage/10 text-sage' : 'bg-gray-100 text-gray-500'}`}>
                    {service.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-clay-light text-xs mt-0.5">
                  {formatCurrency(Number(service.price))} · {service.durationMinutes}min · Up to {service.maxCapacity} people · {service.category}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setEditingService(service)}
                  className="p-2 rounded-lg text-clay-light hover:text-terracotta hover:bg-terracotta/10 transition-all"
                  aria-label={`Edit ${service.name}`}
                >
                  <Edit3 size={15} />
                </button>
                <button
                  onClick={() => toggleServiceMutation.mutate(service)}
                  className={`p-2 rounded-lg transition-all ${service.active ? 'text-clay-light hover:text-red-500 hover:bg-red-50' : 'text-clay-light hover:text-sage hover:bg-sage/10'}`}
                  aria-label={service.active ? 'Deactivate service' : 'Activate service'}
                >
                  {service.active ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'addons' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {addons.map(addon => (
            <div key={addon.id} className={`bg-warm-white rounded-xl shadow-pottery-sm border border-parchment/50 p-4 ${!addon.active ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-clay">{addon.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${addon.active ? 'bg-sage/10 text-sage' : 'bg-gray-100 text-gray-500'}`}>
                  {addon.active ? 'On' : 'Off'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-terracotta font-bold">{formatCurrency(Number(addon.price))}</p>
                  <p className="text-clay-light text-xs">{addon.category}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditingAddon(addon)} className="p-1.5 rounded-lg text-clay-light hover:text-terracotta hover:bg-terracotta/10 transition-all">
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => toggleAddonMutation.mutate(addon)}
                    className="p-1.5 rounded-lg text-clay-light hover:text-sage hover:bg-sage/10 transition-all"
                  >
                    {addon.active ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <ServiceEditModal service={editingService} onClose={() => setEditingService(null)} onSave={() => { setEditingService(null); queryClient.invalidateQueries({ queryKey: ['admin-services'] }) }} />
      )}
    </div>
  )
}

function ServiceEditModal({ service, onClose, onSave }: { service: Service; onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState({ ...service })
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    await fetch(`/api/services/${service.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    onSave()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-clay/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-warm-white rounded-2xl shadow-pottery-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-playfair font-bold text-xl text-clay">Edit Service</h2>
          <button onClick={onClose} className="text-clay-light hover:text-clay p-1"><X size={20} /></button>
        </div>
        <div className="space-y-4">
          <FormField label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} />
          <FormField label="Description" value={form.description} onChange={v => setForm({ ...form, description: v })} multiline />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Price (£)" value={String(form.price)} onChange={v => setForm({ ...form, price: parseFloat(v) })} type="number" />
            <FormField label="Duration (mins)" value={String(form.durationMinutes)} onChange={v => setForm({ ...form, durationMinutes: parseInt(v) })} type="number" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Max Capacity" value={String(form.maxCapacity)} onChange={v => setForm({ ...form, maxCapacity: parseInt(v) })} type="number" />
            <div>
              <label className="block text-sm font-medium text-clay mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full border border-parchment rounded-xl px-3 py-2.5 text-clay text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/30"
              >
                {['Paint', 'Clay', 'Throwing', 'Seasonal', 'Music'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-secondary flex-1 py-3">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

function FormField({ label, value, onChange, type = 'text', multiline = false }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; multiline?: boolean
}) {
  const cls = 'w-full border border-parchment rounded-xl px-3 py-2.5 text-clay text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta'
  return (
    <div>
      <label className="block text-sm font-medium text-clay mb-1.5">{label}</label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} className={cls} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} className={cls} />
      }
    </div>
  )
}

function getCategoryIcon(cat: string) {
  const icons: Record<string, string> = { Paint: '🎨', Clay: '🏺', Throwing: '⚡', Seasonal: '🍂', Music: '🎵' }
  return icons[cat] ?? '🏺'
}
