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
    image: '/banner1.png',
    link: '/promotions',
  },
  {
    id: 2,
    image: '/banner2.png',
    link: '/profile/refer',
  },
  {
    id: 3,
    image: '/banner3.png',
    link: '/sports/cricket',
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

const upcomingMatches = {
  cricket: [
    {
      teamName: 'IPL: Mumbai Indians vs CSK',
      odds: [
        { back: 1.85, backSize: '500K', lay: 1.88, laySize: '200K' },
        { back: 0, lay: 0 },
        { back: 2.10, backSize: '300K', lay: 2.15, laySize: '150K' },
        { back: 0, lay: 0 },
        { back: 0, lay: 0 },
        { back: 0, lay: 0 }
      ]
    }
  ],
  soccer: [
    {
      teamName: 'Champions League: PSG vs Bayern',
      odds: [
        { back: 2.60, backSize: '1M', lay: 2.66, laySize: '500K' },
        { back: 3.40, backSize: '200K', lay: 3.50, laySize: '100K' },
        { back: 2.80, backSize: '400K', lay: 2.86, laySize: '200K' },
        { back: 0, lay: 0 },
        { back: 0, lay: 0 },
        { back: 0, lay: 0 }
      ]
    }
  ],
  tennis: [
    {
      teamName: 'Wimbledon: Nadal vs Medvedev',
      odds: [
        { back: 1.90, backSize: '2M', lay: 1.94, laySize: '1M' },
        { back: 0, lay: 0 },
        { back: 2.05, backSize: '800K', lay: 2.10, laySize: '400K' },
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
      <div className="relative overflow-hidden bg-[#0a0a0a]">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}
        >
          {banners.map((banner) => (
            <Link
              key={banner.id}
              href={banner.link}
              className="min-w-full relative block aspect-[2/1] md:aspect-[3/1] lg:aspect-[3.5/1] overflow-hidden"
            >
              <img
                src={banner.image}
                alt="Promotion"
                className="w-full h-full object-cover object-center"
              />
            </Link>
          ))}
        </div>
      </div>


      <div className="p-3 md:p-4 space-y-6">
        {/* LIVE SPORTS SECTIONS */}
        {(['cricket', 'soccer', 'tennis'] as const).map((sportId) => {
          const sportData = quickSports.find(s => s.id === sportId)
          const matches = featuredMatches[sportId]
          if (!matches || matches.length === 0) return null

          return (
            <div key={sportId} className="space-y-0 rounded-xl overflow-hidden shadow-xl border border-white/5 bg-white">
              {/* Header Block - Fairplay Style */}
              <div className="bg-[#1a1a1a] flex items-center h-10 lg:h-12">
                {/* Sport Label Block with Diagonal cut */}
                <div className="bg-[#e8612c] h-full flex items-center px-4 gap-2 pr-8 relative"
                  style={{ clipPath: 'polygon(0 0, 92% 0, 100% 100%, 0% 100%)' }}
                >
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-xs">{sportData?.emoji}</span>
                  </div>
                  <span className="text-[12px] font-black text-white uppercase tracking-wider">{sportId}</span>
                </div>

                {/* Gray Spacer / Stats area */}
                <div className="flex-1 h-full flex items-center bg-[#222]" />

                {/* Labels 1 X 2 */}
                <div className="bg-[#111] h-full flex items-center pr-0 gap-0">
                  <div className="flex w-[92px] md:w-[122px] justify-center">
                    <span className="text-[10px] font-black text-[#888] uppercase tracking-widest">1</span>
                  </div>
                  <div className="flex w-[92px] md:w-[122px] justify-center border-l border-white/5">
                    <span className="text-[10px] font-black text-[#888] uppercase tracking-widest">X</span>
                  </div>
                  <div className="flex w-[92px] md:w-[122px] justify-center border-l border-white/5">
                    <span className="text-[10px] font-black text-[#888] uppercase tracking-widest">2</span>
                  </div>
                </div>
              </div>

              <OddsTable
                matchId={`featured-${sportId}`}
                matchName={`${sportId.toUpperCase()} FEATURED`}
                competition="Featured Matches"
                marketName="Match Odds"
                columns={['1', 'X', '2', '4', '5', '6']}
                rows={matches}
              />
            </div>
          )
        })}

        {/* Live Games Grid - Refined */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Live Cards */}
          <div className="rounded-xl overflow-hidden bg-[#111] border border-white/5">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#0d0d0d] border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-lg">🃏</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Live Cards</span>
              </div>
              <Link href="/casino?tab=live-cards" className="text-[9px] font-black px-2 py-0.5 rounded border border-white/10 hover:border-[#e8612c] transition-colors text-[#666] uppercase">MORE</Link>
            </div>
            <div className="p-2.5 grid grid-cols-3 gap-2">
              {liveCardGames.map((game) => (
                <Link
                  key={game.id}
                  href={`/casino/live-cards/${game.id}`}
                  className="flex items-center justify-between px-2.5 py-2.5 rounded-lg transition-all bg-[#0a0a0a] border border-white/5 hover:border-[#e8612c30] group"
                >
                  <span className="text-[9px] font-black text-[#888] group-hover:text-white truncate flex-1 uppercase tracking-tighter">{game.name}</span>
                  <span className="text-lg flex-shrink-0 ml-1 opacity-60 group-hover:opacity-100 transition-opacity">{game.emoji}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Live Casino */}
          <div className="rounded-xl overflow-hidden bg-[#111] border border-white/5">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#0d0d0d] border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎰</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Live Casino</span>
              </div>
              <Link href="/casino?tab=live" className="text-[9px] font-black px-2 py-0.5 rounded border border-white/10 hover:border-[#e8612c] transition-colors text-[#666] uppercase">MORE</Link>
            </div>
            <div className="p-2.5 grid grid-cols-3 gap-2">
              {liveCasinoGames.map((game) => (
                <Link
                  key={game.id}
                  href={`/casino/${game.id}`}
                  className="flex items-center justify-between px-2.5 py-2.5 rounded-lg transition-all bg-[#0a0a0a] border border-white/5 hover:border-[#e8612c30] group"
                >
                  <span className="text-[9px] font-black text-[#888] group-hover:text-white truncate flex-1 uppercase tracking-tighter">{game.name}</span>
                  <span className="text-lg flex-shrink-0 ml-1 opacity-60 group-hover:opacity-100 transition-opacity">{game.emoji}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Premium GIF Banner */}
        <div className="w-full rounded-xl overflow-hidden shadow-lg border border-white/5 bg-[#111]">
          <Link href="/sports?sport=premium" className="block relative aspect-[21/9] md:aspect-[5/1]">
            <img
              src="/premium.9849a83.gif"
              alt="Premium Sport"
              className="w-full h-full object-cover object-center"
            />
          </Link>
        </div>

        {/* UPCOMING EVENTS SECTIONS */}
        <div className="mt-8 mb-4">
          <div className="flex items-center gap-2 mb-4 px-1">
            <div className="h-6 w-1 bg-[#e8612c] rounded-full shadow-[0_0_8px_#e8612c]" />
            <h2 className="text-lg font-black text-white uppercase tracking-widest italic">Upcoming Events</h2>
          </div>
          
          <div className="space-y-6">
            {(['cricket', 'soccer', 'tennis'] as const).map((sportId) => {
              const sportData = quickSports.find(s => s.id === sportId)
              const matches = upcomingMatches[sportId as keyof typeof upcomingMatches]
              if (!matches || matches.length === 0) return null

              return (
                <div key={`upcoming-${sportId}`} className="space-y-0 rounded-xl overflow-hidden shadow-2xl border border-white/5 bg-white transition-all hover:border-[#e8612c30]">
                  {/* Header Block - Fairplay Style (Modified for Upcoming) */}
                  <div className="bg-[#1a1a1a] flex items-center h-10 lg:h-12 border-b border-gray-100">
                    <div className="bg-[#444] h-full flex items-center px-4 gap-2 pr-8 relative" 
                      style={{ clipPath: 'polygon(0 0, 92% 0, 100% 100%, 0% 100%)' }}
                    >
                      <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                        <span className="text-xs">{sportData?.emoji}</span>
                      </div>
                      <span className="text-[12px] font-black text-white uppercase tracking-wider">{sportId}</span>
                    </div>

                    <div className="flex-1 h-full flex items-center bg-[#222] px-4">
                      <span className="text-[10px] font-black text-[#666] uppercase tracking-[0.2em]">Next Matches</span>
                    </div>

                    <div className="bg-[#111] h-full flex items-center pr-0 gap-0">
                      <div className="flex w-[92px] md:w-[122px] justify-center">
                        <span className="text-[10px] font-black text-[#555] uppercase tracking-widest">1</span>
                      </div>
                      <div className="flex w-[92px] md:w-[122px] justify-center border-l border-white/5">
                        <span className="text-[10px] font-black text-[#555] uppercase tracking-widest">X</span>
                      </div>
                      <div className="flex w-[92px] md:w-[122px] justify-center border-l border-white/5">
                        <span className="text-[10px] font-black text-[#555] uppercase tracking-widest">2</span>
                      </div>
                    </div>
                  </div>

                  <OddsTable
                    matchId={`upcoming-${sportId}`}
                    matchName={`${sportId.toUpperCase()} UPCOMING`}
                    competition="Upcoming Matches"
                    marketName="Match Odds"
                    columns={['1', 'X', '2', '4', '5', '6']}
                    rows={matches}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Live Games Promo Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/casino?tab=live-cards" className="block relative rounded-xl overflow-hidden shadow-lg border border-white/5">
            <img 
              src="/live-cards-banner2.dc9c351.gif" 
              alt="Live Cards" 
              className="w-full h-full object-cover"
            />
          </Link>

          <Link href="/casino?tab=live" className="block relative rounded-xl overflow-hidden shadow-lg border border-white/5">
            <img 
              src="/live-casino-banner2.2033ef6.gif" 
              alt="Live Casino" 
              className="w-full h-full object-cover"
            />
          </Link>
        </div>
      </div>
    </div>
  )
}
