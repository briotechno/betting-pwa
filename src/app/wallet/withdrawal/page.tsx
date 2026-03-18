'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

const WITHDRAWAL_RULES = [
  "Casino Withdrawal Limit: You can withdraw up to 10 times the total amount you've deposited. If your withdrawal request exceeds this limit, the extra amount may be held or cancelled by the company.",
  "Casino Winning Limit: You can win up to 50 times your bet amount in any casino game round. If your winnings exceed this, only up to 50 times your bet will be credited to your account.",
  "The bonus amount can be used to place bets across the platform and the winnings can be withdrawn.",
  "A player can use bonus amount to place bets and play games on fairplay.",
  "If the withdrawals are pending from the bank, it may take upto 72 banking hours for your transaction to clear.",
  "If a user only deposits and attempts to withdraw the money without placing a single bet, 100% of the amount will be withheld due to suspicious activity. If this is repeated, no withdrawal will be given to the user.",
]

export default function WithdrawalPage() {
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const [bannerError, setBannerError] = useState(false)

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
        <h1 className="text-[15px] font-bold text-white">Choose Withdrawal Method</h1>
      </div>

      {/* ── Page Body ── */}
      <div className="max-w-[760px] mx-auto px-4 py-4 space-y-4">

        {/* ── Promotional Banner ── */}
        <div className="w-full overflow-hidden" style={{ borderRadius: '4px' }}>
          {!bannerError ? (
            <img
              src="/withdrawal-banner.png"
              alt="24*7 Free Instant Withdrawals Guaranteed – Join FairPlay Book"
              className="w-full object-cover"
              style={{ display: 'block', maxHeight: '160px' }}
              onError={() => setBannerError(true)}
            />
          ) : (
            /* Fallback inline banner */
            <div
              className="w-full flex items-center gap-4 px-5 py-4"
              style={{
                background: 'linear-gradient(135deg, #c0390a 0%, #e8612c 50%, #b94000 100%)',
                borderRadius: '4px',
                minHeight: '100px',
              }}
            >
              <div className="text-5xl select-none">🃏</div>
              <div className="flex-1">
                <p className="font-black text-white uppercase leading-tight" style={{ fontSize: '18px' }}>
                  24*7 FREE INSTANT WITHDRAWALS
                </p>
                <p className="font-black text-white uppercase leading-tight" style={{ fontSize: '18px' }}>
                  GUARANTEED
                </p>
                <div
                  className="flex items-center gap-2 mt-2 px-3 py-1"
                  style={{
                    background: '#1b5e20',
                    borderRadius: '4px',
                    display: 'inline-flex',
                    width: 'fit-content',
                  }}
                >
                  <span className="text-white text-sm font-bold">📱 JOIN FAIRPLAY BOOK!</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Withdrawal Method Selector ── */}
        <div
          className="p-4"
          style={{ background: '#111111', border: '1px solid #2e2e2e', borderRadius: '4px' }}
        >
          {/* Bank Transfer card – selected/active state */}
          <div className="flex items-start gap-3">
            <div
              className="flex flex-col items-center justify-center gap-2 p-3 cursor-pointer"
              style={{
                background: '#ffffff',
                border: '2px solid #e8612c',
                borderRadius: '4px',
                minWidth: '92px',
                minHeight: '86px',
              }}
            >
              {/* Bank icon square */}
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  background: '#000000',
                  borderRadius: '2px',
                }}
              />
              <span
                style={{
                  color: '#222',
                  fontSize: '11px',
                  fontWeight: '700',
                  textAlign: 'center',
                  lineHeight: '1.2',
                }}
              >
                Bank Transfers
              </span>
            </div>
          </div>
        </div>

        {/* ── Orange Divider ── */}
        <div style={{ height: '2px', background: '#e8612c', borderRadius: '1px', margin: '2px 0' }} />

        {/* ── Available to Withdraw ── */}
        <div
          className="flex items-center gap-2 px-3 py-2"
          style={{
            background: '#111111',
            border: '1px solid #2e2e2e',
            borderRadius: '4px',
            display: 'inline-flex',
          }}
        >
          {/* Wallet emoji */}
          <span style={{ fontSize: '18px', lineHeight: 1 }}>👛</span>
          <span style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff' }}>
            Available to Withdraw :{' '}
            <span style={{ color: '#e8612c', fontWeight: '800' }}>₹ 0</span>
          </span>
        </div>

        {/* ── Withdrawal Rules ── */}
        <ul style={{ padding: 0, margin: 0, listStyle: 'none' }} className="space-y-1.5">
          {WITHDRAWAL_RULES.map((rule, idx) => (
            <li
              key={idx}
              style={{
                display: 'flex',
                gap: '7px',
                fontSize: '12px',
                color: '#cccccc',
                lineHeight: '1.55',
              }}
            >
              <span style={{ flexShrink: 0, marginTop: '1px', color: '#cccccc' }}>•</span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>

        {/* ── Bank Details Row ── */}
        <div className="flex items-center gap-4 pt-1">
          <span style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff' }}>Bank Details</span>
          <button
            className="flex items-center gap-2 font-bold text-white"
            style={{
              background: '#e8612c',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 14px',
              fontSize: '13px',
              cursor: 'pointer',
              fontWeight: '700',
              letterSpacing: '0.5px',
            }}
          >
            ADD NEW
            <span
              className="flex items-center justify-center rounded-full"
              style={{
                width: '18px',
                height: '18px',
                background: 'rgba(255,255,255,0.25)',
                fontSize: '14px',
                lineHeight: 1,
                fontWeight: '900',
              }}
            >
              +
            </span>
          </button>
        </div>

        {/* ── Upload Amount Section ── */}
        <div className="space-y-3 pt-1">
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff' }}>Upload Amount</h3>

          <div
            className="space-y-3"
            style={{
              background: '#111111',
              border: '1px solid #2e2e2e',
              borderRadius: '4px',
              padding: '20px 16px',
            }}
          >
            {/* Amount label + input */}
            <div className="space-y-1.5">
              <label style={{ fontSize: '13px', color: '#ffffff', fontWeight: '600', display: 'block' }}>
                Amount<span style={{ color: '#e8612c' }}>*</span>
              </label>
              <input
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full focus:outline-none"
                style={{
                  background: '#ffffff',
                  border: '1px solid #cccccc',
                  borderRadius: '2px',
                  padding: '9px 12px',
                  fontSize: '14px',
                  color: '#333333',
                  display: 'block',
                }}
              />
            </div>

            {/* Submit button */}
            <button
              className="w-full font-bold text-white uppercase tracking-widest"
              style={{
                background: '#e8612c',
                border: 'none',
                borderRadius: '2px',
                padding: '12px',
                fontSize: '13px',
                cursor: 'pointer',
                letterSpacing: '1.5px',
              }}
            >
              SUBMIT
            </button>
          </div>
        </div>
      </div>

      {/* ── Floating WhatsApp Button ── */}
      <div className="fixed bottom-[90px] xl:bottom-10 left-4 z-50">
        <a
          href="https://wa.me/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center active:scale-95 transition-transform"
          style={{
            width: '54px',
            height: '54px',
            background: '#25d366',
            borderRadius: '50%',
            boxShadow: '0 4px 12px rgba(37,211,102,0.4)',
          }}
        >
          <svg viewBox="0 0 24 24" fill="white" style={{ width: '34px', height: '34px' }}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
        </a>
      </div>
    </div>
  )
}
