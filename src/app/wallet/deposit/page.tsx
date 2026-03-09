'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, ChevronRight, Shield, Zap, Clock, CheckCircle,
  CreditCard, Building2, Smartphone, Copy, Info
} from 'lucide-react'

// ─── Constants ───────────────────────────────────────────────────────────────

const QUICK_AMOUNTS = [300, 500, 1000, 2000, 5000, 10000, 25000, 50000]

type MethodId = 'upi' | 'card' | 'netbanking'

interface PaymentMethod {
  id: MethodId
  name: string
  label: string
  icon: React.ReactNode
  badge?: string
  desc: string
  min: number
  max: number
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'upi',
    name: 'UPI',
    label: 'UPI / QR Code',
    icon: <Smartphone size={20} />,
    badge: 'INSTANT',
    desc: 'Pay via any UPI app — GPay, PhonePe, Paytm, BHIM',
    min: 100,
    max: 100000,
  },
  {
    id: 'card',
    name: 'Card',
    label: 'Debit / Credit Card',
    icon: <CreditCard size={20} />,
    badge: 'INSTANT',
    desc: 'All Visa, Mastercard & RuPay cards accepted',
    min: 500,
    max: 200000,
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    label: 'Net Banking',
    icon: <Building2 size={20} />,
    badge: '5-10 mins',
    desc: 'Direct bank transfer from 50+ supported banks',
    min: 500,
    max: 500000,
  },
]

const UPI_APPS = [
  { id: 'gpay',     name: 'Google Pay', color: '#4285F4', logo: '🔵' },
  { id: 'phonepe',  name: 'PhonePe',    color: '#5f259f', logo: '💜' },
  { id: 'paytm',    name: 'Paytm',      color: '#00BAF2', logo: '🔷' },
  { id: 'bhim',     name: 'BHIM UPI',   color: '#1a237e', logo: '🇮🇳' },
  { id: 'other',    name: 'Other UPI',  color: 'var(--primary)', logo: '📱' },
]

const BANKS = [
  { id: 'sbi',        name: 'State Bank of India',  logo: '🏦' },
  { id: 'hdfc',       name: 'HDFC Bank',             logo: '🏛️' },
  { id: 'icici',      name: 'ICICI Bank',            logo: '🏢' },
  { id: 'axis',       name: 'Axis Bank',             logo: '🏬' },
  { id: 'kotak',      name: 'Kotak Mahindra',        logo: '🏦' },
  { id: 'pnb',        name: 'Punjab National Bank',  logo: '🏛️' },
  { id: 'bob',        name: 'Bank of Baroda',        logo: '🏢' },
  { id: 'canara',     name: 'Canara Bank',           logo: '🏦' },
  { id: 'union',      name: 'Union Bank',            logo: '🏬' },
  { id: 'indusind',   name: 'IndusInd Bank',         logo: '🏦' },
  { id: 'yes',        name: 'Yes Bank',              logo: '🏛️' },
  { id: 'idfc',       name: 'IDFC First Bank',       logo: '🏦' },
]

// Shared input style helper
const inputStyle = {
  background: 'var(--header-bg)',
  border: '1px solid var(--card-border)',
  color: 'var(--text-primary)',
}
const focusHandler = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
  e.target.style.borderColor = 'var(--primary)'
}
const blurHandler = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
  e.target.style.borderColor = 'var(--card-border)'
}

// ─── Sub-panels ──────────────────────────────────────────────────────────────

function UpiPanel({ amount }: { amount: string }) {
  const [selectedApp, setSelectedApp] = useState('gpay')
  const [upiId, setUpiId] = useState('')
  const [step, setStep] = useState<'select' | 'qr' | 'id'>('select')
  const upiAddress = 'fairbet@okaxis'

  return (
    <div className="space-y-4">
      {/* App selector */}
      <div>
        <p className="text-xs font-semibold mb-2 text-textSecondary">Select UPI App</p>
        <div className="grid grid-cols-5 gap-2">
          {UPI_APPS.map((app) => (
            <button
              key={app.id}
              onClick={() => setSelectedApp(app.id)}
              className="flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl transition-all"
              style={{
                background:   selectedApp === app.id ? 'rgba(232,97,44,0.15)' : '#111',
                border:       selectedApp === app.id ? '1.5px solid #e8612c' : '1px solid #2a2a2a',
              }}
            >
              <span className="text-xl">{app.logo}</span>
                <span className={`text-[9px] font-medium text-center truncate w-full ${selectedApp === app.id ? 'text-primary' : 'text-textMuted'}`}>
                  {app.name.split(' ')[0]}
                </span>
            </button>
          ))}
        </div>
      </div>

      {/* Pay options */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setStep('qr')}
          className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all"
          style={{
            background: step === 'qr' ? 'rgba(var(--primary-rgb),0.1)' : 'var(--header-bg)',
            border:     step === 'qr' ? '1.5px solid var(--primary)' : '1px solid var(--card-border)',
          }}
        >
          <span className="text-2xl">📷</span>
          <span className="text-xs font-medium" style={{ color: step === 'qr' ? 'var(--primary)' : 'var(--text-secondary)' }}>Scan QR Code</span>
        </button>
        <button
          onClick={() => setStep('id')}
          className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all"
          style={{
            background: step === 'id' ? 'rgba(var(--primary-rgb),0.1)' : 'var(--header-bg)',
            border:     step === 'id' ? '1.5px solid var(--primary)' : '1px solid var(--card-border)',
          }}
        >
          <span className="text-2xl">📝</span>
          <span className="text-xs font-medium" style={{ color: step === 'id' ? 'var(--primary)' : 'var(--text-secondary)' }}>Enter UPI ID</span>
        </button>
      </div>

      {/* QR Panel */}
      {step === 'qr' && (
        <div className="rounded-2xl p-4 text-center space-y-3 bg-headerBg border border-cardBorder">
          {/* Mock QR */}
          <div className="w-44 h-44 mx-auto rounded-xl flex items-center justify-center text-6xl"
            style={{ background: '#fff', padding: '8px' }}>
            <div className="grid grid-cols-3 gap-1 w-full h-full">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="rounded-sm"
                  style={{ background: [0,1,3,5,7,8].includes(i) ? '#000' : '#fff' }} />
              ))}
            </div>
          </div>
          <p className="text-xs text-textSecondary">Scan with any UPI app</p>

          {/* UPI address copyable */}
          <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-background border border-cardBorder">
            <span className="text-xs font-mono font-semibold text-textPrimary">{upiAddress}</span>
            <button
              onClick={() => navigator.clipboard?.writeText(upiAddress)}
              className="transition-colors text-primary"
            >
              <Copy size={13} />
            </button>
          </div>

          {amount && (
            <div className="flex items-center justify-center gap-1 text-xs text-textSecondary">
              Amount: <span className="font-bold text-textPrimary ml-1">₹{Number(amount).toLocaleString()}</span>
            </div>
          )}

          <p className="text-[10px]" style={{ color: '#555' }}>
            After payment, click &quot;I Have Paid&quot; below
          </p>
        </div>
      )}

      {/* UPI ID Panel */}
      {step === 'id' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#aaa' }}>Your UPI ID</label>
            <input
              type="text"
              placeholder="e.g. yourname@okaxis"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl focus:outline-none transition-colors"
              style={inputStyle}
              onFocus={focusHandler}
              onBlur={blurHandler}
            />
          </div>
          <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-background border border-cardBorder">
            <Info size={12} className="mt-0.5 shrink-0 text-primary" />
            <p className="text-[10px] text-textMuted">
              Ensure the UPI ID is linked to your registered mobile/bank. Incorrect ID may result in payment failure.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function CardPanel() {
  const [cardNum, setCardNum] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [name, setName] = useState('')
  const [saveCard, setSaveCard] = useState(false)

  const formatCard = (val: string) =>
    val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

  const formatExpiry = (val: string) => {
    const d = val.replace(/\D/g, '').slice(0, 4)
    return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
  }

  return (
    <div className="space-y-3">
      {/* Card preview */}
      <div
        className="relative rounded-2xl p-5 overflow-hidden bg-gradient-card border border-cardBorder"
        style={{ minHeight: 160 }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #e8612c 0%, transparent 70%)', transform: 'translate(30%,-30%)' }} />
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#555' }}>Card Number</p>
            <p className="text-base font-mono font-bold tracking-widest text-white mt-0.5">
              {cardNum || '•••• •••• •••• ••••'}
            </p>
          </div>
          <div className="w-10 h-7 rounded-md flex items-center justify-center bg-primary">
            <CreditCard size={16} className="text-white" />
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-widest" style={{ color: '#555' }}>Card Holder</p>
            <p className="text-xs font-semibold text-white">{name || 'YOUR NAME'}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-widest" style={{ color: '#555' }}>Expires</p>
            <p className="text-xs font-semibold text-white">{expiry || 'MM/YY'}</p>
          </div>
          <div className="flex gap-1">
            <div className="w-6 h-6 rounded-full opacity-80" style={{ background: '#eb001b' }} />
            <div className="w-6 h-6 rounded-full opacity-60 -ml-3" style={{ background: '#f79e1b' }} />
          </div>
        </div>
      </div>

      {/* Fields */}
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: '#aaa' }}>Card Number</label>
        <input
          type="text" inputMode="numeric" placeholder="1234  5678  9012  3456"
          value={cardNum} onChange={(e) => setCardNum(formatCard(e.target.value))}
          className="w-full px-4 py-2.5 text-sm rounded-xl font-mono focus:outline-none transition-colors"
          style={inputStyle} onFocus={focusHandler} onBlur={blurHandler}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: '#aaa' }}>Expiry Date</label>
          <input
            type="text" inputMode="numeric" placeholder="MM/YY" maxLength={5}
            value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            className="w-full px-4 py-2.5 text-sm rounded-xl focus:outline-none transition-colors"
            style={inputStyle} onFocus={focusHandler} onBlur={blurHandler}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: '#aaa' }}>CVV</label>
          <input
            type="password" inputMode="numeric" placeholder="•••" maxLength={4}
            value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
            className="w-full px-4 py-2.5 text-sm rounded-xl focus:outline-none transition-colors"
            style={inputStyle} onFocus={focusHandler} onBlur={blurHandler}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5 text-textSecondary">Card Holder Name</label>
        <input
          type="text" placeholder="Name as on card"
          value={name} onChange={(e) => setName(e.target.value.toUpperCase())}
          className="w-full px-4 py-2.5 text-sm rounded-xl focus:outline-none transition-colors"
          style={inputStyle} onFocus={focusHandler} onBlur={blurHandler}
        />
      </div>

      <label className="flex items-center gap-2.5 cursor-pointer">
        <div
          onClick={() => setSaveCard(!saveCard)}
          className={`w-8 h-4 rounded-full relative transition-colors cursor-pointer ${saveCard ? 'bg-primary' : 'bg-surfaceLight'}`}
        >
          <span className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform ${saveCard ? 'translate-x-[16px]' : 'translate-x-[2px]'}`} />
        </div>
        <span className="text-xs text-textMuted">Save card for future payments</span>
      </label>

      {/* Security note */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-cardBorder">
        <Shield size={13} className="text-success" />
        <p className="text-[10px] text-textMuted">
          256-bit SSL encryption. Your card info is never stored on our servers.
        </p>
      </div>
    </div>
  )
}

function NetBankingPanel() {
  const [selectedBank, setSelectedBank] = useState('')
  const [showAll, setShowAll] = useState(false)
  const visibleBanks = showAll ? BANKS : BANKS.slice(0, 8)

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-textSecondary">Select Your Bank</p>

      <div className="grid grid-cols-2 gap-2">
        {visibleBanks.map((bank) => (
          <button
            key={bank.id}
            onClick={() => setSelectedBank(bank.id)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-left"
            style={{
              background: selectedBank === bank.id ? 'rgba(var(--primary-rgb),0.12)' : 'var(--background)',
              border:     selectedBank === bank.id ? '1.5px solid var(--primary)' : '1px solid var(--card-border)',
            }}
          >
            <span className="text-xl shrink-0">{bank.logo}</span>
            <span className="text-xs font-medium truncate" style={{ color: selectedBank === bank.id ? 'var(--primary)' : 'var(--text-secondary)' }}>
              {bank.name}
            </span>
            {selectedBank === bank.id && (
              <CheckCircle size={12} className="ml-auto shrink-0 text-primary" />
            )}
          </button>
        ))}
      </div>

      {!showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-2 text-xs rounded-xl transition-colors bg-surface border border-cardBorder text-textMuted"
        >
          View All Banks ({BANKS.length - 8} more)
        </button>
      )}

      {selectedBank && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 border border-success/30">
          <CheckCircle size={13} className="text-success" />
          <p className="text-[11px] font-medium text-success">
            {BANKS.find(b => b.id === selectedBank)?.name} selected. You&apos;ll be redirected to your bank portal.
          </p>
        </div>
      )}

      <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-background border border-cardBorder">
        <Clock size={12} className="mt-0.5 shrink-0 text-warn" />
        <p className="text-[10px] text-textMuted">
          Net banking transfers may take 5–30 minutes to reflect in your wallet. Do not close the browser during payment.
        </p>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DepositPage() {
  const router = useRouter()
  const [amount, setAmount]               = useState('')
  const [activeMethod, setActiveMethod]   = useState<MethodId>('upi')
  const [processing, setProcessing]       = useState(false)
  const [success, setSuccess]             = useState(false)

  const method = PAYMENT_METHODS.find((m) => m.id === activeMethod)!
  const numAmount = Number(amount) || 0
  const isValid = numAmount >= method.min && numAmount <= method.max && amount !== ''

  const handlePay = async () => {
    if (!isValid) return
    setProcessing(true)
    await new Promise((r) => setTimeout(r, 1800))
    setProcessing(false)
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#000' }}>
        <div className="w-full max-w-sm text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(76,175,80,0.15)', border: '2px solid #4caf50' }}>
            <CheckCircle size={36} style={{ color: '#4caf50' }} />
          </div>
          <h2 className="text-2xl font-black text-textPrimary mb-2">Deposit Successful!</h2>
          <p className="text-sm mb-1 text-textSecondary">₹{numAmount.toLocaleString()} added to your wallet</p>
          <p className="text-xs mb-8 text-textMuted">Transaction ID: TXN{Date.now()}</p>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/wallet')}
              className="flex-1 py-3 rounded-xl text-sm font-bold transition-all bg-surface border border-cardBorder text-textSecondary"
            >
              My Wallet
            </button>
            <button
              onClick={() => router.push('/sports')}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-textPrimary transition-all bg-gradient-orange"
            >
              Bet Now 🏏
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 py-3 sticky top-[88px] z-10 bg-background border-b border-cardBorder">
        <button onClick={() => router.back()} className="transition-colors text-textMuted hover:text-textPrimary">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-base font-bold text-textPrimary">Deposit Funds</h1>
          <p className="text-[10px] text-textMuted">Min ₹{method.min.toLocaleString()} · Max ₹{method.max.toLocaleString()}</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(76,175,80,0.1)', border: '1px solid rgba(76,175,80,0.3)' }}>
          <Shield size={11} style={{ color: '#4caf50' }} />
          <span className="text-[10px] font-semibold" style={{ color: '#4caf50' }}>SSL Secure</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-5">
        {/* ── Payment method tabs ── */}
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #1a1a1a' }}>
          {/* Tab headers */}
          <div className="flex" style={{ background: '#0d0d0d' }}>
            {PAYMENT_METHODS.map((pm) => (
              <button
                key={pm.id}
                onClick={() => setActiveMethod(pm.id)}
                className="flex-1 flex flex-col items-center gap-1 py-3 px-1 transition-all relative"
                style={{
                  background:   activeMethod === pm.id ? 'var(--header-bg)' : 'transparent',
                  borderBottom: activeMethod === pm.id ? '2px solid var(--primary)' : '2px solid transparent',
                  color:        activeMethod === pm.id ? 'var(--primary)' : 'var(--text-secondary)',
                }}
              >
                <span>{pm.icon}</span>
                <span className="text-[10px] font-semibold">{pm.name}</span>
                {pm.badge && (
                  <span
                    className="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{
                      background: pm.badge === 'INSTANT' ? 'rgba(76,175,80,0.2)' : 'rgba(255,152,0,0.2)',
                      color:      pm.badge === 'INSTANT' ? '#4caf50' : '#ff9800',
                    }}
                  >
                    {pm.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Method description strip */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-headerBg border-b border-cardBorder">
            <span className="text-primary">{method.icon}</span>
            <span className="text-xs text-textSecondary">{method.desc}</span>
          </div>
        </div>

        {/* ── Amount entry ── */}
        <div className="rounded-2xl p-4 space-y-3" style={{ background: '#111', border: '1px solid #1a1a1a' }}>
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-textPrimary">Enter Amount</p>
            <span className="text-[10px] text-textMuted">
              Min ₹{method.min.toLocaleString()} · Max ₹{method.max.toLocaleString()}
            </span>
          </div>

          {/* Amount input */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-primary">₹</span>
            <input
              type="number"
              inputMode="numeric"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-9 pr-4 py-3 text-xl font-black rounded-xl focus:outline-none transition-colors"
              style={{
                background:  'var(--background)',
                border:      amount && !isValid ? '1.5px solid var(--danger)' : '1px solid var(--card-border)',
                color:       'var(--text-primary)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
              onBlur={(e) => (e.target.style.borderColor = amount && !isValid ? 'var(--danger)' : 'var(--card-border)')}
            />
          </div>

          {/* Validation message */}
          {amount && !isValid && (
            <p className="text-[11px]" style={{ color: '#e53935' }}>
              {numAmount < method.min
                ? `Minimum deposit is ₹${method.min.toLocaleString()}`
                : `Maximum deposit is ₹${method.max.toLocaleString()}`}
            </p>
          )}

          {/* Quick amounts */}
          <div className="flex flex-wrap gap-2">
            {QUICK_AMOUNTS.map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(String(amt))}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={{
                  background: amount === String(amt) ? '#e8612c' : '#1a1a1a',
                  border:     amount === String(amt) ? '1px solid #e8612c' : '1px solid #2a2a2a',
                  color:      amount === String(amt) ? '#fff' : '#888',
                }}
              >
                ₹{amt >= 1000 ? `${amt / 1000}K` : amt}
              </button>
            ))}
          </div>
        </div>

        {/* ── Payment method-specific fields ── */}
        <div className="rounded-2xl p-4" style={{ background: '#111', border: '1px solid #1a1a1a' }}>
          {activeMethod === 'upi'        && <UpiPanel amount={amount} />}
          {activeMethod === 'card'       && <CardPanel />}
          {activeMethod === 'netbanking' && <NetBankingPanel />}
        </div>

        {/* ── Order summary ── */}
        {isValid && (
          <div className="rounded-2xl p-4 space-y-2.5" style={{ background: '#111', border: '1px solid #1a1a1a' }}>
            <p className="text-xs font-semibold text-white mb-1">Order Summary</p>
            {[
              { label: 'Deposit Amount', value: `₹${numAmount.toLocaleString()}` },
              { label: 'Processing Fee', value: 'FREE', green: true },
              { label: 'Payment Method', value: method.label },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between text-xs">
                <span style={{ color: '#666' }}>{row.label}</span>
                <span className={`font-semibold`} style={{ color: row.green ? '#4caf50' : '#aaa' }}>{row.value}</span>
              </div>
            ))}
            <div className="h-px" style={{ background: '#1f1f1f' }} />
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-textPrimary">You&apos;ll Receive</span>
              <span className="text-lg font-black text-primary">₹{numAmount.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* ── Benefits strip ── */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: <Zap size={14} />,    text: 'Instant Credit',   sub: 'UPI & Card' },
            { icon: <Shield size={14} />, text: '100% Secure',      sub: 'SSL Encrypted' },
            { icon: <Clock size={14} />,  text: '24×7 Support',     sub: 'Always Online' },
          ].map((b) => (
            <div key={b.text} className="flex flex-col items-center gap-1 p-3 rounded-xl text-center bg-headerBg border border-cardBorder">
              <span className="text-primary">{b.icon}</span>
              <span className="text-[10px] font-semibold text-textPrimary">{b.text}</span>
              <span className="text-[9px] text-textMuted">{b.sub}</span>
            </div>
          ))}
        </div>

        {/* ── Pay button ── */}
        <button
          onClick={handlePay}
          disabled={!isValid || processing}
          className={`w-full py-4 rounded-2xl text-base font-black text-textPrimary transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${isValid ? 'bg-gradient-orange' : 'bg-surface'}`}
        >
          {processing ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing Payment...
            </>
          ) : (
            <>
              <Shield size={18} />
              {isValid
                ? `PAY ₹${numAmount.toLocaleString()} SECURELY`
                : 'ENTER AMOUNT TO CONTINUE'}
              <ChevronRight size={18} />
            </>
          )}
        </button>

        <p className="text-center text-[10px]" style={{ color: '#444' }}>
          By proceeding you agree to our{' '}
          <span style={{ color: '#666', cursor: 'pointer' }}>Deposit Policy</span>
          {' '}&{' '}
          <span style={{ color: '#666', cursor: 'pointer' }}>Terms of Service</span>
        </p>
      </div>
    </div>
  )
}
