'use client'
import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Copy, Check } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

type MethodId = 'whatsapp' | 'paytm' | 'gpay'

interface PaymentMethod {
  id: MethodId
  label: string
  icon: React.ReactNode
}

// ── Payment Methods ────────────────────────────────────────────────────────────

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'whatsapp',
    label: 'WHATSAPP DEPOSIT',
    icon: (
      <svg viewBox="0 0 24 24" fill="#25d366" style={{ width: 34, height: 34 }}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
      </svg>
    ),
  },
  {
    id: 'paytm',
    label: 'PAYTM',
    icon: (
      <div
        style={{
          width: 40,
          height: 40,
          background: '#002970',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: '#00baf2', fontWeight: 900, fontSize: '12px' }}>Pay</span>
        <span style={{ color: '#fff', fontWeight: 900, fontSize: '10px' }}>tm</span>
      </div>
    ),
  },
  {
    id: 'gpay',
    label: 'GPAY',
    icon: (
      <div
        style={{
          width: 40,
          height: 40,
          background: '#fff',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #e0e0e0',
          fontSize: '22px',
        }}
      >
        🔵
      </div>
    ),
  },
]

const PAYMENT_DETAILS: Record<MethodId, { name: string; number: string; min: number; max: number }> = {
  whatsapp: { name: 'FairPlay WhatsApp', number: '+91 9000000000', min: 100, max: 100000000000 },
  paytm:    { name: 'Pawan Sharma paytm', number: '00000000@pty',  min: 100, max: 100000000000 },
  gpay:     { name: 'FairPlay GPay',      number: '00000000@gpay', min: 100, max: 100000000000 },
}

const QUICK_AMOUNTS = [500, 1000, 5000, 10000, 50000, 100000]

// ── QR Code (Mock SVG) ────────────────────────────────────────────────────────

function QRCode() {
  const cells = [
    1,1,1,1,1,1,1, 0, 1,0,1,0,1, 0, 1,1,1,1,1,1,1,
    1,0,0,0,0,0,1, 0, 0,1,0,1,0, 0, 1,0,0,0,0,0,1,
    1,0,1,1,1,0,1, 0, 1,1,0,0,1, 0, 1,0,1,1,1,0,1,
    1,0,1,1,1,0,1, 0, 0,0,1,0,0, 0, 1,0,1,1,1,0,1,
    1,0,1,1,1,0,1, 0, 1,0,1,1,0, 0, 1,0,1,1,1,0,1,
    1,0,0,0,0,0,1, 0, 0,1,0,0,1, 0, 1,0,0,0,0,0,1,
    1,1,1,1,1,1,1, 0, 1,0,1,0,1, 0, 1,1,1,1,1,1,1,
    0,0,0,0,0,0,0, 0, 0,1,0,1,0, 0, 0,0,0,0,0,0,0,
    1,0,1,1,0,1,1, 0, 1,1,0,0,1, 1, 0,1,0,1,1,0,1,
    0,1,0,0,1,0,0, 0, 0,0,1,0,0, 1, 0,0,1,0,0,1,0,
    1,1,0,1,1,0,1, 0, 1,0,1,1,0, 0, 1,0,0,1,1,0,1,
    0,0,1,0,0,1,0, 0, 0,1,0,0,1, 1, 0,1,0,0,0,1,0,
    1,0,1,1,0,1,1, 0, 1,1,0,0,1, 0, 1,0,1,1,0,0,1,
    0,0,0,0,0,0,0, 0, 0,0,1,0,0, 1, 0,0,1,0,1,0,0,
    1,1,1,1,1,1,1, 0, 1,0,1,1,0, 0, 1,1,0,1,1,0,1,
    1,0,0,0,0,0,1, 0, 0,1,0,0,1, 1, 0,0,0,0,0,0,1,
    1,0,1,1,1,0,1, 0, 1,1,0,0,1, 0, 1,0,1,1,0,0,1,
    1,0,1,1,1,0,1, 0, 0,0,1,0,0, 1, 0,1,0,0,1,1,0,
    1,0,1,1,1,0,1, 0, 1,0,1,1,0, 0, 1,0,0,1,0,0,1,
    1,0,0,0,0,0,1, 0, 0,1,0,0,1, 1, 0,0,1,0,0,1,0,
    1,1,1,1,1,1,1, 0, 1,1,0,0,1, 0, 1,1,0,0,1,0,1,
  ]

  return (
    <div
      style={{
        background: '#fff',
        padding: '10px',
        borderRadius: '4px',
        display: 'inline-block',
        lineHeight: 0,
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(21, 7px)', gap: '1px' }}>
        {cells.map((c, i) => (
          <div
            key={i}
            style={{ width: '7px', height: '7px', background: c ? '#000' : '#fff' }}
          />
        ))}
      </div>
    </div>
  )
}

// ── CopyButton ────────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', color: copied ? '#e8612c' : '#aaa' }}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function DepositPage() {
  const router = useRouter()
  const [activeMethod, setActiveMethod] = useState<MethodId>('paytm')
  const [utr, setUtr]                   = useState('')
  const [amount, setAmount]             = useState('200000')
  const [fileName, setFileName]         = useState('')
  const [agreed, setAgreed]            = useState(false)
  const [submitted, setSubmitted]       = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const details = PAYMENT_DETAILS[activeMethod]

  // Validation
  const utrError  = submitted && !utr.trim()
  const fileError = submitted && !fileName
  const termError = submitted && !agreed

  const handleSubmit = () => {
    setSubmitted(true)
    if (!utr.trim() || !fileName || !agreed) return
    alert('Deposit submitted successfully!')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setFileName(file ? file.name : '')
  }

  return (
    <div
      className="min-h-screen pb-24"
      style={{ background: '#181818', color: '#fff', fontFamily: 'Inter, sans-serif' }}
    >
      {/* ── Sub Header ── */}
      <div
        className="flex items-center px-3 py-3 sticky top-0 z-20"
        style={{ background: '#222222' }}
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1"
          style={{ color: '#e8612c', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <ChevronLeft size={22} strokeWidth={3} />
        </button>
        <h1 className="text-[15px] font-bold text-white">Choose Deposit Method</h1>
      </div>

      {/* ── Page Body ── */}
      <div className="max-w-[900px] mx-auto px-4 py-5 space-y-5">

        {/* ── Payment Method Tabs ── */}
        <div className="flex justify-center gap-2 flex-wrap">
          {PAYMENT_METHODS.map((pm) => (
            <button
              key={pm.id}
              onClick={() => setActiveMethod(pm.id)}
              className="flex flex-col items-center gap-1.5 px-4 py-3 transition-all"
              style={{
                background:   activeMethod === pm.id ? '#111111' : '#1a1a1a',
                border:       activeMethod === pm.id ? '2px solid #e8612c' : '2px solid #2e2e2e',
                borderRadius: '4px',
                minWidth:     '110px',
                cursor:       'pointer',
              }}
            >
              {pm.icon}
              <span
                style={{
                  fontSize:   '10px',
                  fontWeight: '700',
                  color:      activeMethod === pm.id ? '#e8612c' : '#aaa',
                  textAlign:  'center',
                  letterSpacing: '0.5px',
                }}
              >
                {pm.label}
              </span>
            </button>
          ))}
        </div>

        {/* ── Two-Column Panel ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* ── LEFT: Account Details + QR ── */}
          <div
            className="space-y-3 p-4"
            style={{ background: '#111111', border: '1px solid #2e2e2e', borderRadius: '4px' }}
          >
            {/* Name */}
            <div className="flex items-center justify-between">
              <div>
                <span style={{ color: '#aaa', fontSize: '12px' }}>Name : </span>
                <span style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>{details.name}</span>
              </div>
              <CopyButton text={details.name} />
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: '#2e2e2e' }} />

            {/* Number */}
            <div className="flex items-center justify-between">
              <div>
                <span style={{ color: '#aaa', fontSize: '12px' }}>Number : </span>
                <span style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>{details.number}</span>
              </div>
              <CopyButton text={details.number} />
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: '#2e2e2e' }} />

            {/* Min */}
            <div>
              <span style={{ color: '#aaa', fontSize: '12px' }}>Min Amount : </span>
              <span style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>{details.min.toLocaleString()}</span>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: '#2e2e2e' }} />

            {/* Max */}
            <div>
              <span style={{ color: '#aaa', fontSize: '12px' }}>Max Amount : </span>
              <span style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>{details.max.toLocaleString()}</span>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: '#2e2e2e' }} />

            {/* QR Code */}
            <div className="flex justify-center pt-2 pb-1">
              <QRCode />
            </div>

            {/* UPI to Bank link */}
            <div className="text-center pt-1">
              <p
                style={{
                  color:      '#e8612c',
                  fontSize:   '12px',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  lineHeight: '1.5',
                  letterSpacing: '0.3px',
                }}
              >
                HOW TO TRANSFER UPI TO BANK<br />
                <a
                  href="https://www.upitobank.xyz"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#e8612c', textDecoration: 'underline' }}
                >
                  CLICK HERE WWW.UPITOBANK.XYZ
                </a>
              </p>
            </div>

            {/* WhatsApp support button */}
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center gap-1 py-3 w-full"
              style={{
                background:    '#e8612c',
                border:        'none',
                borderRadius:  '4px',
                cursor:        'pointer',
                textDecoration: 'none',
              }}
            >
              <span style={{ color: '#fff', fontSize: '11px', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                FOR PAYMENT RELATED ISSUES CLICK HERE
              </span>
              <svg viewBox="0 0 24 24" fill="white" style={{ width: '22px', height: '22px' }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
            </a>
          </div>

          {/* ── RIGHT: Deposit Form ── */}
          <div
            className="space-y-4 p-4"
            style={{ background: '#111111', border: '1px solid #2e2e2e', borderRadius: '4px' }}
          >
            {/* Method heading */}
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {activeMethod.toUpperCase()}
            </h2>

            {/* UTR Field */}
            <div className="space-y-1">
              <label style={{ fontSize: '13px', color: '#fff', fontWeight: '600', display: 'block' }}>
                Unique Transaction Reference <span style={{ color: '#e8612c' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="6 to 12 Digit UTR Number"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                className="w-full focus:outline-none"
                style={{
                  background:   '#fff',
                  border:       `1px solid ${utrError ? '#e53935' : '#cccccc'}`,
                  borderRadius: '2px',
                  padding:      '9px 12px',
                  fontSize:     '13px',
                  color:        '#333',
                  display:      'block',
                }}
              />
              {utrError && (
                <p style={{ color: '#e8612c', fontSize: '12px', fontWeight: '600' }}>
                  Please enter your UTR ID
                </p>
              )}
            </div>

            {/* File Upload */}
            <div className="space-y-1">
              <label style={{ fontSize: '13px', color: '#fff', fontWeight: '600', display: 'block' }}>
                Upload Your Payment Proof{' '}
                <span style={{ color: '#e8612c', fontSize: '11px', fontWeight: '700' }}>[Required]</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="font-bold text-white"
                  style={{
                    background:   '#333',
                    border:       '1px solid #555',
                    borderRadius: '2px',
                    padding:      '7px 12px',
                    fontSize:     '12px',
                    cursor:       'pointer',
                    whiteSpace:   'nowrap',
                  }}
                >
                  Choose file
                </button>
                <span style={{ fontSize: '12px', color: '#aaa' }}>
                  {fileName || 'No file chosen'}
                </span>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>
              {fileError && (
                <p style={{ color: '#e8612c', fontSize: '12px', fontWeight: '600' }}>
                  Please Upload Payment Proof.
                </p>
              )}
            </div>

            {/* Amount Field */}
            <div className="space-y-1">
              <label style={{ fontSize: '13px', color: '#fff', fontWeight: '600', display: 'block' }}>
                Amount <span style={{ color: '#e8612c' }}>*</span>
              </label>
              <input
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full focus:outline-none"
                style={{
                  background:   '#f5f5f5',
                  border:       '1px solid #cccccc',
                  borderRadius: '2px',
                  padding:      '9px 12px',
                  fontSize:     '13px',
                  color:        '#333',
                  display:      'block',
                }}
              />
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {QUICK_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount((prev) => String((Number(prev) || 0) + amt))}
                  className="font-bold text-white transition-all active:scale-95"
                  style={{
                    background:   '#000',
                    border:       '1px solid #333',
                    borderRadius: '2px',
                    padding:      '8px 4px',
                    fontSize:     '12px',
                    cursor:       'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#e8612c')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#333')}
                >
                  +{amt >= 1000 ? `${(amt / 1000).toLocaleString()},000` : amt}
                </button>
              ))}
            </div>

            {/* Terms checkbox */}
            <div className="space-y-1">
              <label className="flex items-start gap-2 cursor-pointer" style={{ fontSize: '12px', color: '#ccc' }}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  style={{
                    width:        '15px',
                    height:       '15px',
                    marginTop:    '2px',
                    accentColor:  '#e8612c',
                    flexShrink:   0,
                    cursor:       'pointer',
                  }}
                />
                <span>
                  I have read and agree with the{' '}
                  <strong style={{ color: '#fff' }}>terms of payment and withdrawal policy.</strong>
                </span>
              </label>
              {termError && (
                <p style={{ color: '#e8612c', fontSize: '12px', fontWeight: '600' }}>
                  Please check terms and condition
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full font-bold text-white uppercase tracking-widest transition-all active:scale-95"
              style={{
                background:    '#e8612c',
                border:        'none',
                borderRadius:  '2px',
                padding:       '13px',
                fontSize:      '14px',
                cursor:        'pointer',
                letterSpacing: '1.5px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#d4521f')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#e8612c')}
            >
              SUBMIT
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
