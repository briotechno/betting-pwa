'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import MatchCard from '@/components/sportsbook/MatchCard'
import OddsTable from '@/components/sportsbook/OddsTable'
import { useI18nStore } from '@/store/i18nStore'

// Mock data
const banners = [
  {
    id: 1,
    title: 'Your Game, Your Rules',
    subtitle: 'Bet live with FairBet!',
    bonus: 'GET 10% JOINING BONUS',
    gradient: 'from-[#1a0a00] via-[#3d1500] to-[#0a0520]',
    accent: 'var(--primary)',
  },
  {
    id: 2,
    title: '30+ Sports Available',
    subtitle: 'Biggest market coverage',
    bonus: 'BET ON YOUR FAVORITE SPORT',
    gradient: 'from-[#0a1a00] via-[#152d00] to-[#081500]',
    accent: '#22c55e',
  },
  {
    id: 3,
    title: 'Premium Sportsbook',
    subtitle: 'Best odds guaranteed',
    bonus: 'UP TO ₹25,000 WELCOME BONUS',
    gradient: 'from-[#00051a] via-[#001a3d] to-[#00051a]',
    accent: '#3b82f6',
  },
]

const liveCardGames = [
  { id: 'teenpatti', name: 'Teenpatti', emoji: '🃏' },
  { id: 'hilow', name: 'HI Low', emoji: '🎴' },
  { id: 'andarbahar', name: 'Andar Bahar', emoji: '🃏' },
  { id: 'twocardteen', name: '2 Card Teenpatti', emoji: '🎴' },
  { id: 'amarakbar', name: 'Amar Akbar Anthony', emoji: '🃏' },
  { id: '32card', name: '32 Card Casino', emoji: '🃏' },
]

const liveCasinoGames = [
  { id: 'roulette', name: 'Roulette', emoji: '🎡' },
  { id: 'lightningdice', name: 'Lightning Dice', emoji: '⚡' },
  { id: 'crazytime', name: 'Crazy Time', emoji: '🎪' },
  { id: 'dealnodeal', name: 'Deal No Deal', emoji: '💼' },
  { id: 'moneywheel', name: 'Money Wheel', emoji: '🎡' },
  { id: 'dragontiger', name: 'Dragon Tiger', emoji: '🐉' },
]

const quickSports = [
  { id: 'cricket', label: 'Cricket', emoji: '🏏', count: 15 },
  { id: 'soccer', label: 'Soccer', emoji: '⚽', count: 109 },
  { id: 'tennis', label: 'Tennis', emoji: '🎾', count: 34 },
  { id: 'kabaddi', label: 'Kabaddi', emoji: '🤼', count: 4 },
  { id: 'horseracing', label: 'Horse Racing', emoji: '🏇', count: 8 },
  { id: 'greyhound', label: 'Greyhound', emoji: '🐕', count: 6 },
  { id: 'basketball', label: 'Basketball', emoji: '🏀', count: 12 },
  { id: 'baseball', label: 'Baseball', emoji: '⚾', count: 6 },
]

const featuredMatches = {
  cricket: [
    {
      teamName: 'India vs Australia',
      odds: [
        { back: 1.42, backSize: '1M', lay: 1.43, laySize: '500K' },
        { back: 0, lay: 0 },
        { back: 3.10, backSize: '200K', lay: 3.15, laySize: '100K' },
        { back: 0, lay: 0 },
        { back: 0, lay: 0 },
        { back: 0, lay: 0 }
      ]
    },
    {
      teamName: 'South Africa vs England',
      odds: [
        { back: 1.95, backSize: '500K', lay: 1.98, laySize: '250K' },
        { back: 0, lay: 0 },
        { back: 2.10, backSize: '400K', lay: 2.14, laySize: '200K' },
        { back: 0, lay: 0 },
        { back: 0, lay: 0 },
        { back: 0, lay: 0 }
      ]
    }
  ],
  soccer: [
    {
      teamName: 'Man Utd vs Arsenal',
      odds: [
        { back: 2.40, backSize: '800K', lay: 2.44, laySize: '400K' },
        { back: 3.20, backSize: '100K', lay: 3.30, laySize: '50K' },
        { back: 2.90, backSize: '300K', lay: 2.96, laySize: '150K' },
        { back: 0, lay: 0 },
        { back: 0, lay: 0 },
        { back: 0, lay: 0 }
      ]
    },
    {
      teamName: 'Real Madrid vs Barcelona',
      odds: [
        { back: 2.10, backSize: '2M', lay: 2.15, laySize: '1M' },
        { back: 3.40, backSize: '200K', lay: 3.50, laySize: '100K' },
        { back: 3.20, backSize: '500K', lay: 3.25, laySize: '250K' },
        { back: 0, lay: 0 },
        { back: 0, lay: 0 },
        { back: 0, lay: 0 }
      ]
    }
  ],
  tennis: [
    {
      teamName: 'Djokovic vs Alcaraz',
      odds: [
        { back: 1.75, backSize: '3M', lay: 1.78, laySize: '1.5M' },
        { back: 0, lay: 0 },
        { back: 2.10, backSize: '1M', lay: 2.14, laySize: '500K' },
        { back: 0, lay: 0 },
        { back: 0, lay: 0 },
        { back: 0, lay: 0 }
      ]
    }
  ]
}

export default function HomePage() {
  const [currentBanner, setCurrentBanner] = useState(0)
  const [activeHomeSport, setActiveHomeSport] = useState<'cricket' | 'soccer' | 'tennis'>('cricket')
  const { t } = useI18nStore()
  const bannerTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    bannerTimer.current = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 4000)
    return () => { if (bannerTimer.current) clearInterval(bannerTimer.current) }
  }, [])

  return (
    <div className="max-w-full">
      {/* Hero Banner Carousel */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}
        >
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={`min-w-full relative bg-gradient-to-r ${banner.gradient} overflow-hidden`}
              style={{ minHeight: '220px' }}
            >
              {/* Background decorative elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 opacity-30"
                  style={{
                    background: `radial-gradient(circle, ${banner.accent}40 0%, transparent 70%)`,
                  }}
                />
                <div className="absolute left-1/4 top-1/2 w-32 h-32 rounded-full opacity-10"
                  style={{ background: banner.accent }}
                />
              </div>

              <div className="relative z-10 flex flex-col justify-center h-full px-6 py-8 md:px-12 md:py-12 lg:py-16" style={{ minHeight: '220px' }}>
                <div className="max-w-lg">
                  <p className="text-textSecondary text-sm md:text-base mb-1">{banner.title}</p>
                  <h1 className="text-3xl md:text-5xl font-black mb-3 leading-tight"
                    style={{
                      fontStyle: 'italic',
                      background: `linear-gradient(135deg, #fff 0%, ${banner.accent} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {banner.subtitle}
                  </h1>
                  <div
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold"
                    style={{
                      border: `2px solid ${banner.accent}`,
                      background: `${banner.accent}20`,
                      color: banner.accent,
                    }}
                  >
                    <span style={{ color: '#22c55e' }}>●</span>
                    {banner.bonus}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Prev/Next */}
        <button
          onClick={() => setCurrentBanner((p) => (p - 1 + banners.length) % banners.length)}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => setCurrentBanner((p) => (p + 1) % banners.length)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
        >
          <ChevronRight size={16} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentBanner(idx)}
              className={`banner-dot ${idx === currentBanner ? 'active' : 'inactive'}`}
            />
          ))}
        </div>
      </div>

      {/* Quick Sport Navigation */}
      <div className="px-3 md:px-4 py-3 border-b border-cardBorder bg-headerBg">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {quickSports.map((sport) => (
            <Link
              key={sport.id}
              href={`/sports?sport=${sport.id}`}
              className="px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 bg-surface border border-cardBorder text-textSecondary hover:border-primary hover:text-textPrimary"
            >
              <span>{sport.emoji}</span>
              <span className="uppercase tracking-wider">{sport.label}</span>
              {sport.count && (
                <span className="text-textPrimary text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold bg-primary">
                  {sport.count > 99 ? '99+' : sport.count}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      <div className="p-3 md:p-4 space-y-5">
        {/* Live Games Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Live Cards */}
          <div className="rounded-xl overflow-hidden bg-surface border border-cardBorder">
            <div className="flex items-center justify-between px-4 py-3 border-b border-cardBorder bg-background/40">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🃏</span>
                <span className="text-xs font-black uppercase tracking-widest text-textPrimary">Live Cards</span>
              </div>
              <Link href="/casino?tab=live-cards" className="text-[10px] font-bold px-2 py-0.5 rounded border border-cardBorder hover:border-primary transition-colors text-textSecondary">MORE</Link>
            </div>
            <div className="p-3 grid grid-cols-3 gap-2">
              {liveCardGames.map((game) => (
                <Link
                  key={game.id}
                  href={`/casino/live-cards/${game.id}`}
                  className="flex items-center justify-between px-2.5 py-2 rounded-lg transition-all bg-background border border-cardBorder"
                >
                  <span className="text-[10px] font-bold text-textPrimary truncate flex-1 uppercase tracking-tighter">{game.name}</span>
                  <span className="text-lg flex-shrink-0 ml-1 opacity-80">{game.emoji}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Live Casino */}
          <div className="rounded-xl overflow-hidden bg-surface border border-cardBorder">
            <div className="flex items-center justify-between px-4 py-3 border-b border-cardBorder bg-background/40">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🎰</span>
                <span className="text-xs font-black uppercase tracking-widest text-textPrimary">Live Casino</span>
              </div>
              <Link href="/casino?tab=live" className="text-[10px] font-bold px-2 py-0.5 rounded border border-cardBorder hover:border-primary transition-colors text-textSecondary">MORE</Link>
            </div>
            <div className="p-3 grid grid-cols-3 gap-2">
              {liveCasinoGames.map((game) => (
                <Link
                  key={game.id}
                  href={`/casino/${game.id}`}
                  className="flex items-center justify-between px-2.5 py-2 rounded-lg transition-all"
                  style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}
                >
                  <span className="text-[10px] font-bold text-white truncate flex-1 uppercase tracking-tighter">{game.name}</span>
                  <span className="text-lg flex-shrink-0 ml-1 opacity-80">{game.emoji}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* IN PLAY Matches */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
                <h2 className="text-sm font-black text-textPrimary uppercase tracking-widest">{t('nav.featured_matches') || 'Featured Matches'}</h2>
            
            
            {/* Quick Sport Selector - Convenient Icons + Layout */}
            <div className="flex items-center gap-1.5 bg-background p-1.5 rounded-2xl border border-cardBorder shadow-inner">
              {[
                { id: 'cricket', emoji: '🏏', count: 15 },
                { id: 'soccer', emoji: '⚽', count: 109 },
                { id: 'tennis', emoji: '🎾', count: 34 },
              ].map((sport) => (
                <button
                  key={sport.id}
                  onClick={() => setActiveHomeSport(sport.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative ${
                    activeHomeSport === sport.id 
                      ? 'bg-primary text-textPrimary shadow-[0_4px_12px_rgba(var(--primary-rgb),0.3)] scale-105 z-10' 
                      : 'text-textMuted hover:text-textSecondary hover:bg-surface'
                  }`}
                >
                  <span className="text-sm leading-none">{sport.emoji}</span>
                  <span className="hidden sm:inline">{t(`nav.${sport.id}`)}</span>
                  {activeHomeSport === sport.id && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white animate-ping" />
                  )}
                </button>
              ))}
            </div>

            <Link href="/sports" className="hidden lg:flex items-center gap-1.5 text-xs font-bold transition-all hover:text-textPrimary text-primary">
              <span>View All</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="bg-background rounded-2xl border border-cardBorder overflow-hidden shadow-2xl relative">
            <div className="px-4 py-2 border-b border-cardBorder bg-surface/40 flex items-center justify-between">
              <span className="text-[10px] font-black text-textMuted uppercase tracking-[0.2em]">Match Odds (Winner)</span>
              <div className="flex gap-4">
                <span className="text-[9px] font-black text-backBet uppercase">Back</span>
                <span className="text-[9px] font-black text-layBet uppercase">Lay</span>
              </div>
            </div>
            <OddsTable
              matchId={`featured-${activeHomeSport}`}
              matchName={`${activeHomeSport.toUpperCase()} FEATURED`}
              competition="Featured Matches"
              marketName="Match Odds"
              columns={['1', 'X', '2', '4', '5', '6']}
              rows={featuredMatches[activeHomeSport]}
            />
          </div>
        </div>

        {/* Promotions Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/promotions" className="block relative rounded-xl overflow-hidden group"
            style={{ minHeight: '100px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5, #2563eb)' }}
          >
            <div className="absolute inset-0 flex items-center px-6 py-4">
              <div>
                <p className="text-xs text-purple-200 uppercase tracking-wider font-semibold mb-1">Premium</p>
                <h3 className="text-2xl font-black text-white">Sportsbook</h3>
                <p className="text-xs text-purple-200 mt-1">Best odds in market</p>
              </div>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-6xl opacity-30 group-hover:opacity-50 transition-opacity">🏆</div>
          </Link>

          <Link href="/sports" className="block relative rounded-xl overflow-hidden group"
            style={{ minHeight: '100px', background: 'linear-gradient(135deg, #f97316, #dc2626, #991b1b)' }}
          >
            <div className="absolute inset-0 flex items-center px-6 py-4">
              <div>
                <p className="text-xs text-orange-200 uppercase tracking-wider font-semibold mb-1">Live Betting</p>
                <h3 className="text-2xl font-black text-white">30+ Sports</h3>
                <p className="text-xs text-orange-200 mt-1">Cricket • Football • Tennis</p>
              </div>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-6xl opacity-30 group-hover:opacity-50 transition-opacity">⚡</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
