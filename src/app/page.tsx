'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronRight, ChevronLeft, Signal, History } from 'lucide-react'
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
      teamName: 'Warriors vs Titans',
      startTime: 'Wed, 18/03 04:30 PM',
      odds: [
        { back: 1.61, backSize: '2', lay: 1.63, laySize: '1' },
        { back: 0, lay: 0 },
        { back: 0, lay: 0 },
        { back: 0, lay: 0 },
        { back: 1.61, backSize: '2', lay: 1.63, laySize: '1' },
        { back: 0, lay: 0 }
      ]
    },
    {
      teamName: 'Konark Suryas vs Southern Super Stars',
      startTime: 'Tomorrow At 7:30 PM',
      odds: [
        { back: 1.69, backSize: '2', lay: 1.71, laySize: '1' },
        { back: 0, lay: 0 },
        { back: 0, lay: 0 },
        { back: 0, lay: 0 },
        { back: 1.7, backSize: '2', lay: 1.72, laySize: '1' },
        { back: 0, lay: 0 }
      ]
    }
  ],
  soccer: [
    {
      teamName: 'PSG vs Bayern',
      startTime: 'Sun, 15/03 11:45 PM',
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
      teamName: 'Nadal vs Medvedev',
      startTime: 'Mon, 16/03 02:00 PM',
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
              className="min-w-full relative block h-[100px] md:h-auto md:aspect-[3/1] lg:aspect-[3.5/1] overflow-hidden"
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


      <div className="p-2 md:p-4 space-y-4">
        {/* INPLAY Section Header */}
        <div className="flex items-center gap-2 px-1 mb-2">
          <div className="w-6 h-6 rounded-full bg-[#e8612c] flex items-center justify-center shadow-[0_0_8px_rgba(232,97,44,0.4)]">
            <Signal size={12} className="text-white" />
          </div>
          <h2 className="text-[15px] font-black text-white uppercase tracking-tight italic">INPLAY</h2>
        </div>

        {/* LIVE SPORTS SECTIONS */}
        {(['cricket', 'soccer', 'tennis'] as const).map((sportId) => {
          const sportData = quickSports.find(s => s.id === sportId)
          const matches = featuredMatches[sportId]
          if (!matches || matches.length === 0) return null

          return (
            <div key={sportId} className="space-y-0 overflow-hidden shadow-2xl lg:shadow-none bg-white lg:bg-transparent rounded-b-[16px] border border-white/5 lg:border-none">
              {/* Header Block - Orange/Black Split Style */}
              <div className="flex items-center h-10 lg:h-12 overflow-hidden rounded-t-[4px]">
                <div className="bg-[#e8612c] flex items-center px-4 gap-2 flex-1 h-full">
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0">
                    <span className="text-[14px]">{sportData?.emoji}</span>
                  </div>
                  <span className="text-[13px] font-black text-white uppercase tracking-wider">{sportId}</span>
                </div>

                {/* Labels 1 X 2 with dark background - Responsive */}
                <div className="flex items-center h-full bg-[#222]">
                  <div className="flex items-center justify-end pr-0.5">
                    {/* Desktop 6 columns labels */}
                    <div className="hidden lg:flex">
                      <div className="w-[100px] flex justify-center"><span className="text-[10px] font-black text-white">1</span></div>
                      <div className="w-[100px] flex justify-center border-l lg:border-none border-white/10"><span className="text-[10px] font-black text-white">L</span></div>
                      <div className="w-[100px] flex justify-center border-l lg:border-none border-white/10"><span className="text-[10px] font-black text-white">X</span></div>
                    </div>
                    {/* Mobile 3 columns labels */}
                    <div className="flex lg:hidden">
                      <div className="w-[70px] md:w-[92px] flex justify-center">
                        <span className="text-[11px] font-black text-white">1</span>
                      </div>
                      <div className="w-[70px] md:w-[92px] flex justify-center border-l border-white/10">
                        <span className="text-[11px] font-black text-white">X</span>
                      </div>
                      <div className="w-[70px] md:w-[92px] flex justify-center border-l border-white/10">
                        <span className="text-[11px] font-black text-white">2</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <OddsTable
                matchId={`featured-${sportId}`}
                matchName={`${sportId.toUpperCase()} FEATURED`}
                competition="Featured Matches"
                marketName="Match Odds"
                columns={['1', 'X', '2']}
                rows={matches}
              />
            </div>
          )
        })}


        {/* Live Games Section - Redesigned to Neon Style */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Live Cards */}
          <div className="bg-[#111] p-3 rounded-[16px] border border-white/5 shadow-inner">
            <div className="flex items-center justify-between lg:justify-center relative px-2 mb-4 lg:mb-6">
              <h3 className="text-[17px] lg:text-[20px] font-black italic text-white leading-none">
                Live <span className="text-[#e8612c]">Cards</span>
              </h3>
              <Link href="/live-cards" className="text-[10px] text-[#e8612c] font-black uppercase tracking-wider absolute right-2">More ...</Link>
            </div>
            <div className="grid grid-cols-3 gap-3 px-1">
              {[
                { name: 'Teenpatti', iconPath: 'teenpatti.ec813d1.png' },
                { name: 'Hi Low', iconPath: 'hi-lo.3d33723.png' },
                { name: 'Andar Bahar', iconPath: 'andar-bahar.86115b2.png' },
                { name: '2 Card Teenpatti', iconPath: '2-card-teenpatti.cc8e4f2.png' },
                { name: 'Amar Akbar Anthony', iconPath: 'amar-akbar.366de2b.png' },
                { name: '32 Card Casino', iconPath: '32-card-casino.1f23beb.png' },
              ].map((game, idx) => {
                const isPurple = idx % 2 === 0
                const glowClass = isPurple
                  ? 'shadow-[0_0_12px_rgba(111,66,251,0.3)] border-[#6f42fb]'
                  : 'shadow-[0_0_12px_rgba(232,97,44,0.3)] border-[#e8612c]'
                return (
                  <Link
                    key={game.name}
                    href={`/live-cards/${game.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`flex items-center justify-between px-2 lg:px-4 py-1 rounded-[14px] lg:rounded-full bg-[#0d0d0d] border-[1.5px] ${glowClass} transition-transform active:scale-95 h-11 lg:h-12`}
                  >
                    <span className="text-[8px] md:text-[10px] lg:text-[12px] font-black text-white uppercase tracking-tighter truncate pr-1">{game.name}</span>
                    <img src={`/casino-icons/${game.iconPath}`} alt={game.name} className="w-5 h-5 md:w-7 md:h-7 lg:w-8 lg:h-8 object-contain shrink-0" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Live Casino */}
          <div className="bg-[#111] p-3 rounded-[16px] border border-white/5 shadow-inner">
            <div className="flex items-center justify-between lg:justify-center relative px-2 mb-4 lg:mb-6">
              <h3 className="text-[17px] lg:text-[20px] font-black italic text-white leading-none">
                Live <span className="text-[#e8612c]">Casino</span>
              </h3>
              <Link href="/markets/live-casino" className="text-[10px] text-[#e8612c] font-black uppercase tracking-wider absolute right-2">More ...</Link>
            </div>
            <div className="grid grid-cols-3 gap-3 px-1">
              {[
                { name: 'Roulette', iconPath: 'roulette.d32562e.png' },
                { name: 'Lightning Dice', iconPath: 'lightning-dice.d78d3a8.png' },
                { name: 'Crazy Time', iconPath: 'crazy-time.48d7437.png' },
                { name: 'Deal No Deal', iconPath: 'deal-no-deal.b41caae.png' },
                { name: 'Money Wheel', iconPath: 'money-wheel.6da4f96.png' },
                { name: 'Dragon Tiger', iconPath: 'dragon-tiger.23aaed5.png' },
              ].map((game, idx) => {
                const isPurple = idx % 2 === 0
                const glowClass = isPurple
                  ? 'shadow-[0_0_12px_rgba(111,66,251,0.3)] border-[#6f42fb]'
                  : 'shadow-[0_0_12px_rgba(232,97,44,0.3)] border-[#e8612c]'
                return (
                  <Link
                    key={game.name}
                    href={`/markets/live-casino/${game.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`flex items-center justify-between px-2 lg:px-4 py-1 rounded-[14px] lg:rounded-full bg-[#0d0d0d] border-[1.5px] ${glowClass} transition-transform active:scale-95 h-11 lg:h-12`}
                  >
                    <span className="text-[8px] md:text-[10px] lg:text-[12px] font-black text-white uppercase tracking-tighter truncate pr-1">{game.name}</span>
                    <img src={`/casino-icons/${game.iconPath}`} alt={game.name} className="w-5 h-5 md:w-7 md:h-7 lg:w-8 lg:h-8 object-contain shrink-0" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Premium GIF Banner */}
        <div className="w-full   overflow-hidden shadow-lg border border-white/5 bg-[#111]">
          <Link href="/sports?sport=premium" className="block relative  ">
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
            <div className="w-6 h-6 rounded-full bg-[#e8612c] flex items-center justify-center shadow-[0_0_8px_rgba(232,97,44,0.4)]">
              <History size={12} className="text-white" strokeWidth={3} />
            </div>
            <h2 className="text-[15px] font-black text-white uppercase tracking-tight italic">UPCOMING</h2>
          </div>

          <div className="space-y-6">
            {(['cricket', 'soccer', 'tennis'] as const).map((sportId) => {
              const sportData = quickSports.find(s => s.id === sportId)
              const matches = upcomingMatches[sportId as keyof typeof upcomingMatches]
              if (!matches || matches.length === 0) return null

              return (
                <div key={`upcoming-${sportId}`} className="space-y-0 overflow-hidden shadow-2xl lg:shadow-none bg-white lg:bg-transparent rounded-b-[16px] border border-white/5 lg:border-none">
                  {/* Header Block - Orange/Black Split Style */}
                  <div className="flex items-center h-10 lg:h-12 overflow-hidden rounded-t-[4px]">
                    <div className="bg-[#e8612c] flex items-center px-4 gap-2 flex-1 h-full">
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0">
                        <span className="text-[14px]">{sportData?.emoji}</span>
                      </div>
                      <span className="text-[13px] font-black text-white uppercase tracking-wider">{sportId}</span>
                    </div>

                    {/* Labels 1 X 2 with dark background - Responsive */}
                    <div className="flex items-center h-full bg-[#222]">
                      <div className="flex items-center justify-end pr-0.5">
                        {/* Desktop 6 columns labels */}
                        <div className="hidden lg:flex">
                          <div className="w-[100px] flex justify-center"><span className="text-[10px] font-black text-white">1</span></div>
                          <div className="w-[100px] flex justify-center border-l lg:border-none border-white/10"><span className="text-[10px] font-black text-white">L</span></div>
                          <div className="w-[100px] flex justify-center border-l lg:border-none border-white/10"><span className="text-[10px] font-black text-white">X</span></div>
                        </div>
                        {/* Mobile 3 columns labels */}
                        <div className="flex lg:hidden">
                          <div className="w-[70px] md:w-[92px] flex justify-center">
                            <span className="text-[11px] font-black text-white">1</span>
                          </div>
                          <div className="w-[70px] md:w-[92px] flex justify-center border-l border-white/10">
                            <span className="text-[11px] font-black text-white">X</span>
                          </div>
                          <div className="w-[70px] md:w-[92px] flex justify-center border-l border-white/10">
                            <span className="text-[11px] font-black text-white">2</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <OddsTable
                    matchId={`upcoming-${sportId}`}
                    matchName={`${sportId.toUpperCase()} UPCOMING`}
                    competition="Upcoming Matches"
                    marketName="Match Odds"
                    columns={['1', 'X', '2']}
                    rows={matches}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Live Games Promo Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          <Link href="/casino?tab=live-cards" className="block relative overflow-hidden shadow-lg border border-white/5">
            <img
              src="/live-cards-banner2.dc9c351.gif"
              alt="Live Cards"
              className="w-full h-full object-cover"
            />
          </Link>

          <Link href="/casino?tab=live" className="block relative overflow-hidden shadow-lg border border-white/5">
            <img
              src="/live-casino-banner2.2033ef6.gif"
              alt="Live Casino"
              className="w-full h-full object-cover"
            />
          </Link>
        </div>

        {/* DOWNLOAD THE APP SECTION */}
        <div className="bg-[#e15b24] mt-4     flex flex-col items-center text-center overflow-hidden relative">
          <img src="./download-app-banner.png" alt="" />
        </div>
      </div>
    </div>
  )
}
