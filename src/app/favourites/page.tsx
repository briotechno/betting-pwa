'use client'
import React from 'react'
import { Heart, Search, Filter, Trophy, Star, ChevronRight } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'

export default function FavouritesPage() {
  const matches = [
    { id: 1, sport: 'Cricket', league: 'Indian Premier League (IPL)', teams: ['RR', 'CSK'], time: 'LIVE', market: 'Match Odds', odd1: '1.92', odd2: '1.92' },
    { id: 2, sport: 'Soccer', league: 'Premier League', teams: ['MUN', 'ARS'], time: 'Today 21:00', market: 'Match Odds', odd1: '2.45', odd2: '3.10' },
  ]

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Heart size={24} className="text-primary" fill="currentColor" />
          <h1 className="text-xl font-bold text-white uppercase tracking-tight">Your Favourites</h1>
        </div>
        <div className="flex gap-2">
            <button className="p-2 bg-card border border-cardBorder rounded-lg text-textMuted hover:text-white transition-colors">
                <Search size={18} />
            </button>
            <button className="p-2 bg-card border border-cardBorder rounded-lg text-textMuted hover:text-white transition-colors">
                <Filter size={18} />
            </button>
        </div>
      </div>

       <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {['All Markets', 'Cricket', 'Soccer', 'Tennis'].map((tab, idx) => (
          <button
            key={tab}
            className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-colors border ${
              idx === 0 
              ? 'bg-primary/10 border-primary/50 text-primary' 
              : 'bg-card border-cardBorder text-textMuted hover:text-white hover:border-textMuted'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {matches.map((match) => (
            <div key={match.id} className="bg-card border border-cardBorder rounded-2xl p-4 hover:border-primary/20 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-primary font-black uppercase tracking-widest">{match.sport}</span>
                            <span className="w-1 h-1 rounded-full bg-[#333]" />
                            <span className="text-[10px] text-textMuted font-black uppercase tracking-widest truncate max-w-[150px]">{match.league}</span>
                        </div>
                        {match.time === 'LIVE' ? (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">LIVE</span>
                            </div>
                        ) : (
                            <span className="text-[9px] text-[#444] font-black tracking-widest uppercase">{match.time}</span>
                        )}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-white">{match.teams[0]}</span>
                                <span className="text-[10px] text-[#444] font-black">vs</span>
                                <span className="text-sm font-black text-white">{match.teams[1]}</span>
                            </div>
                            <span className="text-[10px] text-textMuted font-bold uppercase tracking-tighter">{match.market}</span>
                        </div>
                        <button className="p-2 text-primary">
                            <Star fill="currentColor" size={20} />
                        </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                        <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 flex flex-col items-center justify-center hover:bg-primary/10 transition-colors">
                            <span className="text-[9px] text-textMuted font-black uppercase tracking-widest mb-1">{match.teams[0]}</span>
                            <span className="text-lg font-black text-primary">{match.odd1}</span>
                        </div>
                        <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 flex flex-col items-center justify-center hover:bg-primary/10 transition-colors">
                            <span className="text-[9px] text-textMuted font-black uppercase tracking-widest mb-1">{match.teams[1]}</span>
                            <span className="text-lg font-black text-primary">{match.odd2}</span>
                        </div>
                  </div>
            </div>
        ))}
        {matches.length === 0 && (
             <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-4">
                <Trophy size={32} className="text-[#222]" />
                </div>
                <h3 className="text-lg font-semibold text-textPrimary mb-2">No Favourites Yet</h3>
                <p className="text-sm text-textMuted mb-6">Star your favorite markets to quickly find them here.</p>
                <Link href="/sports" className="bg-primary hover:bg-primaryHover text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                Explore Markets
                </Link>
          </div>
        )}
      </div>

    </div>
  )
}
