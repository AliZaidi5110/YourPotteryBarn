const { test } = require('node:test')
const assert = require('node:assert/strict')
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: { module: 'CommonJS', moduleResolution: 'node' },
})
const { calculateCheckoutTotals, equalSplitAmounts, customDiscountError, savedDiscountType } = require('../lib/payments/checkout-totals.ts')
const { getStudioStore, saveBookingOrderCheckout } = require('../lib/studio-ops/data.ts')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')

function loadRoute(file, dependencies) {
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8')
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
  const routeModule = { exports: {} }
  vm.runInNewContext(compiled, {
    exports: routeModule.exports, module: routeModule, console,
    require: name => {
      if (name in dependencies) return dependencies[name]
      if (name === 'next/server') return { NextResponse: { json: (body, init) => Response.json(body, init) } }
      if (name === '@/lib/auth') return { authOptions: {} }
      if (name === '@/lib/payments/checkout-totals') return { calculateCheckoutTotals }
      if (name === '@/lib/service-details') return require('../lib/service-details.ts')
      return require(name)
    },
  })
  return routeModule.exports
}

test('discount is off by default and preserves the deposit', () => {
  const totals = calculateCheckoutTotals(100, 25)
  assert.equal(totals.discountAmount, 0)
  assert.equal(totals.totalAmount, 100)
  assert.equal(totals.balanceDue, 75)
})

test('5% applies to the whole order before deposits and arrival payments', () => {
  const totals = calculateCheckoutTotals(100, 25 + 20, true)
  assert.equal(totals.discountAmount, 5)
  assert.equal(totals.totalAmount, 95)
  assert.equal(totals.depositDeducted, 45)
  assert.equal(totals.balanceDue, 50)
})

test('no deposit charges the discounted total; turning the option off restores the original balance', () => {
  assert.equal(calculateCheckoutTotals(100, 0, true).balanceDue, 95)
  assert.equal(calculateCheckoutTotals(100, 25, false).balanceDue, 75)
})

test('fully covered orders have zero due and retain overpayment separately', () => {
  const totals = calculateCheckoutTotals(100, 100, true)
  assert.equal(totals.balanceDue, 0)
  assert.equal(totals.depositDeducted, 95)
  assert.equal(totals.creditSurplus, 5)
})

test('rounding and equal splits preserve exact pennies', () => {
  const totals = calculateCheckoutTotals(19.99, 5, true)
  assert.equal(totals.discountAmount, 1)
  assert.equal(totals.balanceDue, 13.99)
  assert.deepEqual(equalSplitAmounts(totals.balanceDue, 3), ['4.67', '4.66', '4.66'])
  assert.equal(calculateCheckoutTotals(0.30, 0.10, true).balanceDue, 0.18)
})

test('invalid monetary values are rejected', () => {
  for (const value of [-1, NaN, Infinity]) {
    assert.throws(() => calculateCheckoutTotals(value, 0, true))
    assert.throws(() => calculateCheckoutTotals(100, value, true))
  }
})

test('custom amount reduces the full order before deposit and arrival payments', () => {
  const totals = calculateCheckoutTotals(100, 45, false, 12.50)
  assert.equal(totals.discountType, 'FIXED')
  assert.equal(totals.discountPercent, 0)
  assert.equal(totals.discountAmount, 12.50)
  assert.equal(totals.totalAmount, 87.50)
  assert.equal(totals.balanceDue, 42.50)
  assert.equal(calculateCheckoutTotals(100, 0, false, 100).balanceDue, 0)
  assert.equal(calculateCheckoutTotals(100, 95, false, 20).creditSurplus, 15)
})

test('invalid custom amounts and stacking with 5% are rejected', () => {
  for (const value of [-1, NaN, Infinity, 0.001, 100.01]) {
    assert.throws(() => calculateCheckoutTotals(100, 0, false, value))
  }
  assert.throws(() => calculateCheckoutTotals(100, 0, true, 5))
  assert.equal(calculateCheckoutTotals(19.99, 0, false, 0.29).totalAmount, 19.70)
  assert.equal(calculateCheckoutTotals(100, 0, false, 0).discountType, 'FIXED')
})

test('discount input validation and reopening preserve the selected option', () => {
  for (const value of ['', '-1', 'NaN', '1.234', '101']) assert.ok(customDiscountError(value, 100))
  for (const value of ['0', '12.50', '.50', '100']) assert.equal(customDiscountError(value, 100), '')
  assert.equal(savedDiscountType('FIXED', 5), 'FIXED')
  assert.equal(savedDiscountType('PERCENT', 5), 'PERCENT')
  assert.equal(savedDiscountType(undefined, 5), 'PERCENT')
  assert.equal(savedDiscountType('NONE', 0), 'NONE')
})

test('checkout stores the discounted receipt and leaves collected deposits intact', () => {
  const store = getStudioStore()
  const booking = {
    id: 'test-discount', sessionId: 'test-checkout', amountPaid: 25,
    status: 'CONFIRMED',
  }
  store.bookingsBySession['test-checkout'] = [booking]
  const items = [{ itemId: 'test-item', name: 'Pottery', category: 'Mugs', quantity: 2, unitPrice: 50, totalPrice: 100 }]
  const saved = saveBookingOrderCheckout('test-checkout', booking.id, {
    potteryItems: items, applyDiscount: true, paymentMethod: 'CASH',
  })
  assert.equal(saved.orderGrossTotal, 100)
  assert.equal(saved.orderDiscountPercent, 5)
  assert.equal(saved.orderDiscountAmount, 5)
  assert.equal(saved.orderTotal, 95)
  assert.equal(saved.orderDepositDeducted, 25)
  assert.equal(saved.orderBalanceDue, 70)
  assert.equal(saved.amountPaid, 25)
  assert.equal(saved.status, 'PAID')
  assert.equal(saved.orderCompleted, true)
  delete store.bookingsBySession['test-checkout']
})

test('studio checkout requires staff and rejects invalid discount values', async () => {
  let staff = false
  const { POST } = loadRoute('app/api/admin/checkout-order/route.ts', {
    'next-auth': { getServerSession: async () => staff ? { user: { isStaff: true } } : null },
    '@/lib/prisma': { prisma: {} },
    '@/lib/studio-ops/data': require('../lib/studio-ops/data.ts'),
  })
  assert.equal((await POST({ json: async () => ({}) })).status, 401)
  staff = true
  assert.equal((await POST({ json: async () => ({
    sessionId: 's', bookingId: 'b', potteryItems: [{ itemId: 'inv-1', quantity: 1 }], applyDiscount: '5',
  }) })).status, 400)
})

test('studio API calculates prices and deposit on the server and saves the discounted receipt', async () => {
  const store = getStudioStore()
  store.bookingsBySession['api-checkout'] = [{ id: 'api-booking', amountPaid: 10, status: 'CONFIRMED' }]
  const { POST } = loadRoute('app/api/admin/checkout-order/route.ts', {
    'next-auth': { getServerSession: async () => ({ user: { isStaff: true } }) },
    '@/lib/prisma': { prisma: {} },
    '@/lib/studio-ops/data': require('../lib/studio-ops/data.ts'),
  })
  const request = { json: async () => ({
    sessionId: 'api-checkout', bookingId: 'api-booking', paymentMethod: 'CASH', applyDiscount: true,
    potteryItems: [{ itemId: 'inv-1', quantity: 2, unitPrice: 0, totalPrice: 0 }],
    grossTotal: 1, depositDeducted: 1000, balanceDue: 0,
  }) }
  try {
    const response = await POST(request)
    assert.equal(response.status, 200)
    const data = await response.json()
    assert.equal(data.totals.grossTotal, 30)
    assert.equal(data.totals.discountAmount, 1.5)
    assert.equal(data.totals.balanceDue, 18.5)
    assert.equal(data.booking.orderTotal, 28.5)
    assert.equal((await POST(request)).status, 409)
  } finally {
    delete store.bookingsBySession['api-checkout']
  }
})

test('database adjustment retains arrival payments and never compounds a saved discount', async () => {
  let booking = { id: 'db-booking', totalAmount: 100, amountPaid: 45, checkoutDiscountAmount: 0, status: 'CONFIRMED' }
  let deletedPending = 0
  const tx = {
    booking: {
      findUnique: async () => ({ ...booking }),
      update: async ({ data }) => (booking = { ...booking, ...data }),
    },
    splitPayment: { deleteMany: async ({ where }) => { assert.equal(where.status, 'PENDING'); deletedPending++ } },
  }
  const { POST } = loadRoute('app/api/admin/checkout-adjustment/route.ts', {
    'next-auth': { getServerSession: async () => ({ user: { isStaff: true } }) },
    '@/lib/prisma': { prisma: { $transaction: async work => work(tx) } },
  })
  const request = applyDiscount => ({ json: async () => ({ bookingId: booking.id, applyDiscount }) })
  for (let i = 0; i < 2; i++) {
    const response = await POST(request(true))
    assert.equal(response.status, 200)
    const data = await response.json()
    assert.equal(data.booking.totalAmount, 95)
    assert.equal(data.booking.amountPaid, 45)
    assert.equal(data.booking.checkoutDiscountAmount, 5)
    assert.equal(data.totals.balanceDue, 50)
  }
  assert.equal(deletedPending, 1)
  const response = await POST(request(false))
  assert.equal((await response.json()).totals.balanceDue, 55)
  assert.equal(booking.checkoutDiscountAmount, 0)
})

test('custom discount API saves its type, is repeatable, and switches cleanly to 5% or none', async () => {
  let booking = { id: 'db-custom', totalAmount: 100, amountPaid: 45, checkoutDiscountAmount: 0, checkoutDiscountType: 'NONE', status: 'CONFIRMED' }
  const tx = {
    booking: {
      findUnique: async () => ({ ...booking }),
      update: async ({ data }) => (booking = { ...booking, ...data }),
    },
    splitPayment: { deleteMany: async () => {} },
  }
  const { POST } = loadRoute('app/api/admin/checkout-adjustment/route.ts', {
    'next-auth': { getServerSession: async () => ({ user: { isStaff: true } }) },
    '@/lib/prisma': { prisma: { $transaction: async work => work(tx) } },
  })
  const request = data => ({ json: async () => ({ bookingId: booking.id, applyDiscount: false, ...data }) })
  for (let i = 0; i < 2; i++) {
    const response = await POST(request({ customDiscountAmount: 12.50 }))
    assert.equal(response.status, 200)
    const data = await response.json()
    assert.equal(data.booking.totalAmount, 87.50)
    assert.equal(data.booking.checkoutDiscountType, 'FIXED')
    assert.equal(data.booking.amountPaid, 45)
    assert.equal(data.totals.balanceDue, 42.50)
  }
  assert.equal((await POST(request({ customDiscountAmount: 101 }))).status, 400)
  assert.equal(booking.totalAmount, 87.50)
  assert.equal((await POST(request({ applyDiscount: true, customDiscountAmount: 5 }))).status, 400)
  const percent = await (await POST(request({ applyDiscount: true }))).json()
  assert.equal(percent.booking.totalAmount, 95)
  assert.equal(percent.booking.checkoutDiscountType, 'PERCENT')
  const none = await (await POST(request({}))).json()
  assert.equal(none.booking.totalAmount, 100)
  assert.equal(none.booking.checkoutDiscountType, 'NONE')
})

test('studio custom discount validates against server prices and persists on the receipt', async () => {
  const store = getStudioStore()
  store.bookingsBySession['custom-session'] = [{ id: 'custom-booking', amountPaid: 10, status: 'CONFIRMED' }]
  const { POST } = loadRoute('app/api/admin/checkout-order/route.ts', {
    'next-auth': { getServerSession: async () => ({ user: { isStaff: true } }) },
    '@/lib/prisma': { prisma: {} },
    '@/lib/studio-ops/data': require('../lib/studio-ops/data.ts'),
  })
  const request = amount => ({ json: async () => ({
    sessionId: 'custom-session', bookingId: 'custom-booking', paymentMethod: 'CASH',
    customDiscountAmount: amount, potteryItems: [{ itemId: 'inv-1', quantity: 2 }],
  }) })
  try {
    for (const amount of [-1, 30.01, 0.001]) assert.equal((await POST(request(amount))).status, 400)
    assert.equal(store.bookingsBySession['custom-session'][0].orderCompleted, undefined)
    const response = await POST(request(7.25))
    assert.equal(response.status, 200)
    const data = await response.json()
    assert.equal(data.booking.orderDiscountType, 'FIXED')
    assert.equal(data.booking.orderDiscountPercent, 0)
    assert.equal(data.booking.orderDiscountAmount, 7.25)
    assert.equal(data.booking.orderTotal, 22.75)
    assert.equal(data.booking.orderBalanceDue, 12.75)
  } finally {
    delete store.bookingsBySession['custom-session']
  }
})
