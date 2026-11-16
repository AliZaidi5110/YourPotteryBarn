'use client'

import { useId } from 'react'
import type { CheckoutDiscountType } from '@/lib/payments/checkout-totals'

interface Props {
  type: CheckoutDiscountType
  onTypeChange: (type: CheckoutDiscountType) => void
  customAmount: string
  onAmountChange: (value: string) => void
  maxAmount: number
  disabled?: boolean
  error?: string
}

export function CheckoutDiscountControl({ type, onTypeChange, customAmount, onAmountChange, maxAmount, disabled, error }: Props) {
  const id = useId()
  return (
    <fieldset disabled={disabled} className="rounded-2xl border border-parchment bg-warm-white p-4 space-y-3 disabled:opacity-60">
      <legend className="px-1 text-sm font-semibold text-clay">Optional checkout discount</legend>
      <div className="flex flex-wrap gap-3 text-xs text-clay">
        {([
          ['NONE', 'No discount'], ['PERCENT', '5% discount'], ['FIXED', 'Custom amount (£)'],
        ] as const).map(([value, label]) => (
          <label key={value} className="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" name={id} value={value} checked={type === value} onChange={() => onTypeChange(value)} className="accent-terracotta" />
            {label}
          </label>
        ))}
      </div>
      {type === 'FIXED' && (
        <div>
          <label htmlFor={`${id}-amount`} className="block text-xs font-medium text-clay mb-1">Discount amount (£)</label>
          <input id={`${id}-amount`} type="number" inputMode="decimal" min="0" max={maxAmount} step="0.01"
            value={customAmount} onChange={e => onAmountChange(e.target.value)} placeholder="e.g. 10.00"
            aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}
            className="w-full border border-parchment rounded-xl px-3 py-2 text-sm text-clay bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/30" />
        </div>
      )}
      <p className="text-xs text-clay-light">Choose one discount at the owner's discretion. Applied before deposits and payments collected on arrival.</p>
      {error && <p id={`${id}-error`} role="alert" className="text-xs text-red-600">{error}</p>}
    </fieldset>
  )
}
