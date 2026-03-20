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



    </div>
  )
}
