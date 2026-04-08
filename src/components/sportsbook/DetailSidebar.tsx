'use client'
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronRight, Star, Home, Trophy, Activity, History } from 'lucide-react'

const sports = [
  { id: 'cricket', label: 'Cricket', emoji: '🏏' },
  { id: 'soccer', label: 'Soccer', emoji: '⚽' },
  { id: 'tennis', label: 'Tennis', emoji: '🎾' },
  { id: 'kabaddi', label: 'Kabaddi', emoji: '🤼' },
  { id: 'horse-racing', label: 'Horse Racing', emoji: '🏇' },
  { id: 'greyhound', label: 'Greyhound', emoji: '🐕' },
]

export default function DetailSidebar() {
  const router = useRouter()

  return (
    <div className="hidden lg:flex flex-col w-[240px] shrink-0 border-r border-cardBorder bg-surface relative z-10">
      <div className="p-4 space-y-6">
        {/* Navigation Section */}
        <div className="space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all text-textSecondary hover:text-white group">
            <Home size={16} className="group-hover:text-primary transition-colors" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Home</span>
          </Link>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-primary/5 text-primary border border-primary/20">
            <Trophy size={16} />
            <span className="text-[11px] font-bold uppercase tracking-widest">Sports</span>
          </div>
          <Link href="/my-bets" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all text-textSecondary hover:text-white group">
            <History size={16} className="group-hover:text-primary transition-colors" />
            <span className="text-[11px] font-bold uppercase tracking-widest">My Bets</span>
          </Link>
        </div>

        {/* Favorites Section */}
        <div className="pt-4 border-t border-cardBorder/50">
          <div className="flex items-center justify-between px-3 mb-3">
             <span className="text-[10px] font-black text-textMuted uppercase tracking-widest">Favorites</span>
             <Star size={12} className="text-textMuted" />
          </div>
          <div className="space-y-1">
             <div className="flex items-center gap-3 px-3 py-2 text-[11px] text-textSecondary font-bold hover:text-white transition-all cursor-pointer">
                <span className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                <span>ICC T20 World Cup</span>
             </div>
             <div className="flex items-center gap-3 px-3 py-2 text-[11px] text-textSecondary font-bold hover:text-white transition-all cursor-pointer">
                <span className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                <span>Premier League</span>
             </div>
          </div>
        </div>

        {/* Sports List */}
        <div className="pt-4 border-t border-cardBorder/50">
          <div className="px-3 mb-3">
             <span className="text-[10px] font-black text-textMuted uppercase tracking-widest">All Sports</span>
          </div>
          <div className="space-y-0.5">
            {sports.map((sport) => (
              <button
                key={sport.id}
                onClick={() => router.push(`/sports?sport=${sport.id}`)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all text-textSecondary hover:text-white group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg group-hover:scale-110 transition-transform">{sport.emoji}</span>
                  <span className="text-[11px] font-bold uppercase tracking-widest">{sport.label}</span>
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-1" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
