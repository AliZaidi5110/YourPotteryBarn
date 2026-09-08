'use client'

import { useState } from 'react'
import { SiteHeader } from '@/components/customer/SiteHeader'
import { SiteFooter } from '@/components/customer/SiteFooter'
import { Gift, CheckCircle, Sparkles, Send, CreditCard, ShieldCheck } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const PRESET_AMOUNTS = [
  { amount: 25, label: 'Pick & Paint for Two', desc: 'Covers two all-ages ceramic painting passes with materials.' },
  { amount: 50, label: 'Clay & Sip Evening', desc: 'Perfect for an adult clay session with complimentary drinks.' },
  { amount: 60, label: 'Beginner Wheel Throwing', desc: 'A full 2-hour pottery wheel workshop with tuition and firing.' },
  { amount: 100, label: 'The Master Experience', desc: 'Generous studio credit for workshops, glazes, and extras.' },
]

export default function GiftCardsPage() {
  const [selectedAmount, setSelectedAmount] = useState<number>(50)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [recipientName, setRecipientName] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [senderName, setSenderName] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [generatedCode, setGeneratedCode] = useState('')

  // Balance checker state
  const [checkCode, setCheckCode] = useState('')
  const [checkResult, setCheckResult] = useState<{ valid: boolean; balance?: number; message?: string } | null>(null)
  const [checking, setChecking] = useState(false)

  const finalAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount

  function handlePurchase(e: React.FormEvent) {
    e.preventDefault()
    if (finalAmount <= 0) return

    // Generate a unique gift card code for immediate demo / checkout
    const code = 'GIFT-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000)
    setGeneratedCode(code)
    setIsSubmitted(true)
  }

  async function handleCheckBalance(e: React.FormEvent) {
    e.preventDefault()
    if (!checkCode.trim()) return

    setChecking(true)
    setCheckResult(null)

    try {
      const res = await fetch('/api/gift-cards/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: checkCode.trim() }),
      })
      const data = await res.json()
      if (data.valid) {
        setCheckResult({ valid: true, balance: Number(data.remainingBalance) })
      } else {
        setCheckResult({ valid: false, message: 'Invalid or expired gift code.' })
      }
    } catch {
      setCheckResult({ valid: false, message: 'Could not connect to balance service.' })
    } finally {
      setChecking(false)
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream">
        {/* Hero Section with Gift Card Presentation Background Image */}
        <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 text-center text-warm-white overflow-hidden flex items-center justify-center">
          {/* Background Gift Card Presentation Image */}
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <img
              src="/images/gift-cards/gift-card-hero.jpg"
              alt="Gift card presentation box at Your Pottery Barn"
              className="w-full h-full object-cover object-center"
            />
            {/* Atmospheric overlay to blend with brand clay palette and ensure pristine text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-clay/95 via-clay/80 to-clay/70" />
          </div>

          <div className="max-w-3xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 bg-warm-white/15 backdrop-blur-md border border-warm-white/30 rounded-full px-4 py-1.5 mb-6 shadow-sm">
              <Sparkles size={14} className="text-amber-300" />
              <span className="text-warm-white text-xs font-semibold uppercase tracking-widest">
                The Perfect Creative Gift
              </span>
            </div>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-warm-white drop-shadow-md">
              Give the Gift of Creativity
            </h1>
            <p className="text-cream/90 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto font-normal drop-shadow-sm">
              Treat someone special to an unforgettable pottery workshop, a relaxed clay session, or ceramic painting at Your Pottery Barn.
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Purchase Form (2 columns) */}
            <div className="lg:col-span-2">
              <div className="bg-warm-white rounded-3xl shadow-pottery p-8 border border-parchment/60">
                {isSubmitted ? (
                  <div className="text-center py-10 space-y-5 animate-fade-in">
                    <div className="w-16 h-16 rounded-full bg-sage/15 text-sage flex items-center justify-center mx-auto text-3xl">
                      <CheckCircle size={36} className="text-sage" />
                    </div>
                    <h2 className="font-playfair text-3xl font-bold text-clay">Gift Card Created!</h2>
                    <p className="text-clay-light max-w-md mx-auto">
                      A digital gift voucher worth <span className="font-semibold text-terracotta">{formatCurrency(finalAmount)}</span> has been prepared for <span className="font-semibold text-clay">{recipientName || 'your recipient'}</span>.
                    </p>

                    <div className="p-6 bg-cream rounded-2xl border border-parchment inline-block my-4">
                      <p className="text-xs uppercase tracking-wider text-clay-light font-semibold mb-1">Redeemable Gift Code</p>
                      <p className="font-mono text-2xl font-bold text-terracotta tracking-wider">{generatedCode}</p>
                      <p className="text-xs text-clay-light mt-2">Can be entered at checkout when booking any workshop.</p>
                    </div>

                    <div>
                      <button
                        onClick={() => {
                          setIsSubmitted(false)
                          setRecipientName('')
                          setRecipientEmail('')
                        }}
                        className="btn-secondary py-3 px-8 text-sm"
                      >
                        Buy Another Card
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handlePurchase} className="space-y-8">
                    {/* Choose Amount */}
                    <div>
                      <h2 className="font-playfair font-semibold text-2xl text-clay mb-2">1. Choose an Amount</h2>
                      <p className="text-clay-light text-sm mb-5">Select a suggested voucher value or enter a custom amount.</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        {PRESET_AMOUNTS.map((preset) => {
                          const isSelected = selectedAmount === preset.amount && !customAmount
                          return (
                            <button
                              key={preset.amount}
                              type="button"
                              onClick={() => {
                                setSelectedAmount(preset.amount)
                                setCustomAmount('')
                              }}
                              className={`p-4 rounded-2xl border text-left transition-all ${
                                isSelected
                                  ? 'bg-terracotta/10 border-terracotta shadow-terracotta/20 ring-2 ring-terracotta/30'
                                  : 'border-parchment hover:border-terracotta/40 bg-cream/40'
                              }`}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-playfair font-bold text-2xl text-clay">{formatCurrency(preset.amount)}</span>
                                {isSelected && <CheckCircle size={18} className="text-terracotta" />}
                              </div>
                              <p className="font-medium text-xs text-terracotta mb-1">{preset.label}</p>
                              <p className="text-xs text-clay-light">{preset.desc}</p>
                            </button>
                          )
                        })}
                      </div>

                      <div className="flex items-center gap-3">
                        <label htmlFor="custom-amount" className="text-xs font-semibold text-clay uppercase tracking-wider">
                          Or custom amount (£):
                        </label>
                        <input
                          id="custom-amount"
                          type="number"
                          min="10"
                          max="1000"
                          placeholder="e.g. 75"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          className="w-32 py-2 px-3 border border-parchment rounded-xl text-sm bg-cream text-clay focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta"
                        />
                      </div>
                    </div>

                    {/* Recipient Details */}
                    <div>
                      <h2 className="font-playfair font-semibold text-2xl text-clay mb-2">2. Personalise Your Gift</h2>
                      <p className="text-clay-light text-sm mb-5">Where should we send the digital gift voucher?</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-medium text-clay mb-1.5">Recipient&apos;s Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Sophie Turner"
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            className="w-full py-3 px-4 border border-parchment rounded-xl text-sm bg-cream text-clay focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-clay mb-1.5">Recipient&apos;s Email *</label>
                          <input
                            type="email"
                            required
                            placeholder="sophie@example.com"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            className="w-full py-3 px-4 border border-parchment rounded-xl text-sm bg-cream text-clay focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-xs font-medium text-clay mb-1.5">Your Name (Sender) *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Alex"
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          className="w-full py-3 px-4 border border-parchment rounded-xl text-sm bg-cream text-clay focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-clay mb-1.5">Personal Gift Message (Optional)</label>
                        <textarea
                          rows={3}
                          placeholder="Happy Birthday! Hope you have a wonderful time making pottery..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full py-3 px-4 border border-parchment rounded-xl text-sm bg-cream text-clay focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn-primary w-full py-4 text-base font-semibold flex items-center justify-center gap-2">
                      <Gift size={18} /> Purchase Gift Voucher for {formatCurrency(finalAmount)}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar / Check Balance (1 column) */}
            <div className="space-y-6">
              {/* Check Balance Card */}
              <div className="bg-warm-white rounded-3xl shadow-pottery p-6 border border-parchment/60">
                <h3 className="font-playfair font-semibold text-xl text-clay mb-2 flex items-center gap-2">
                  <CreditCard size={18} className="text-terracotta" /> Check Card Balance
                </h3>
                <p className="text-clay-light text-xs mb-4">Already have a gift voucher? Enter your 10-character code to see remaining funds.</p>

                <form onSubmit={handleCheckBalance} className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="e.g. GIFT-WINTER-50"
                    value={checkCode}
                    onChange={(e) => setCheckCode(e.target.value)}
                    className="w-full py-2.5 px-3.5 border border-parchment rounded-xl text-sm bg-cream text-clay font-mono uppercase focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                  />
                  <button
                    type="submit"
                    disabled={checking}
                    className="btn-secondary w-full py-2.5 text-xs font-semibold"
                  >
                    {checking ? 'Checking...' : 'Check Balance'}
                  </button>
                </form>

                {checkResult && (
                  <div className={`mt-4 p-3 rounded-xl text-xs font-medium ${checkResult.valid ? 'bg-sage/15 text-sage border border-sage/30' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {checkResult.valid ? (
                      <div>
                        <p className="font-bold text-sm">Remaining Balance: {formatCurrency(checkResult.balance ?? 0)}</p>
                        <p className="text-xs text-sage/80 mt-1">Ready to use at checkout for any workshop booking.</p>
                      </div>
                    ) : (
                      <p>{checkResult.message}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Gift Card FAQ */}
              <div className="bg-warm-white rounded-3xl shadow-pottery p-6 border border-parchment/60 space-y-4 text-xs text-clay-light">
                <h4 className="font-playfair font-semibold text-base text-clay">Gift Card Terms</h4>
                <div className="flex items-start gap-2">
                  <ShieldCheck size={16} className="text-sage shrink-0 mt-0.5" />
                  <p>Valid for 12 months from the date of purchase.</p>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldCheck size={16} className="text-sage shrink-0 mt-0.5" />
                  <p>Can be redeemed online for any pottery class, workshop, or drinks extra.</p>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldCheck size={16} className="text-sage shrink-0 mt-0.5" />
                  <p>Remaining balances are kept on file and can be used across multiple visits.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
