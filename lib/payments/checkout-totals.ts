/** Apply the optional discount before deducting deposits or arrival payments. */
export type CheckoutDiscountType = 'NONE' | 'PERCENT' | 'FIXED'

export function savedDiscountType(type: string | undefined, amount = 0): CheckoutDiscountType {
  if (type === 'FIXED' || type === 'PERCENT') return type
  return amount > 0 ? 'PERCENT' : 'NONE'
}

export function customDiscountError(value: string, grossTotal: number): string {
  if (!/^(?:\d+|\d*\.\d{1,2})$/.test(value) || !Number.isFinite(Number(value))) {
    return 'Enter a discount amount in pounds with up to two decimal places.'
  }
  if (Math.round(Number(value) * 100) > Math.round(grossTotal * 100)) {
    return 'The discount cannot exceed the order total.'
  }
  return ''
}

export function calculateCheckoutTotals(grossTotal: number, amountPaid: number, applyDiscount = false, customDiscountAmount?: number) {
  if (!Number.isFinite(grossTotal) || grossTotal < 0 || !Number.isFinite(amountPaid) || amountPaid < 0) {
    throw new Error('Checkout amounts must be finite, non-negative numbers')
  }

  const grossPence = Math.round(grossTotal * 100)
  const paidPence = Math.round(amountPaid * 100)
  if (customDiscountAmount !== undefined) {
    if (applyDiscount) throw new Error('Choose either the 5% discount or a custom amount.')
    if (!Number.isFinite(customDiscountAmount) || customDiscountAmount < 0 ||
        Math.abs(customDiscountAmount * 100 - Math.round(customDiscountAmount * 100)) > 0.000001) {
      throw new Error('Enter a valid discount amount with up to two decimal places.')
    }
    if (Math.round(customDiscountAmount * 100) > grossPence) throw new Error('The discount cannot exceed the order total.')
  }
  const discountPence = customDiscountAmount !== undefined ? Math.round(customDiscountAmount * 100)
    : applyDiscount ? Math.round(grossPence * 5 / 100) : 0
  const totalPence = grossPence - discountPence

  return {
    grossTotal: grossPence / 100,
    discountPercent: applyDiscount ? 5 : 0,
    discountType: (customDiscountAmount !== undefined ? 'FIXED' : applyDiscount ? 'PERCENT' : 'NONE') as CheckoutDiscountType,
    discountAmount: discountPence / 100,
    totalAmount: totalPence / 100,
    depositDeducted: Math.min(paidPence, totalPence) / 100,
    balanceDue: Math.max(0, totalPence - paidPence) / 100,
    creditSurplus: Math.max(0, paidPence - totalPence) / 100,
  }
}

export function equalSplitAmounts(amount: number, count: number): string[] {
  if (count < 1) return []
  const pence = Math.round(amount * 100)
  const share = Math.floor(pence / count)
  return Array.from({ length: count }, (_, i) => ((share + (i < pence % count ? 1 : 0)) / 100).toFixed(2))
}
