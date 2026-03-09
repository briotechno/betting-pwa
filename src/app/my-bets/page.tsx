'use client'
import React from 'react'
import { ClipboardList, Trophy } from 'lucide-react'
import Link from 'next/link'

export default function MyBetsPage() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center gap-3 mb-6">
        <ClipboardList size={24} className="text-primary" />
        <h1 className="text-xl font-bold text-textPrimary">My Bets</h1>
      </div>

      <div className="flex gap-3 mb-5 overflow-x-auto no-scrollbar">
        {['Open Bets', 'Settled Bets', 'Profit & Loss'].map((tab, idx) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              idx === 0 ? 'bg-primary text-white' : 'bg-surface border border-cardBorder text-textSecondary hover:text-textPrimary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-4">
          <Trophy size={32} className="text-textMuted" />
        </div>
        <h3 className="text-lg font-semibold text-textPrimary mb-2">No Open Bets</h3>
        <p className="text-sm text-textMuted mb-6">You haven&apos;t placed any bets yet.</p>
        <Link href="/sports" className="bg-primary hover:bg-primaryHover text-white font-semibold px-6 py-3 rounded-xl transition-colors">
          Start Betting
        </Link>
      </div>
    </div>
  )
}
