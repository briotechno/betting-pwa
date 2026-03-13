'use client'
import React, { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Star, BarChart2 } from 'lucide-react'
import MarketSection from '@/components/sportsbook/MarketSection'
import Scoreboard from '@/components/sportsbook/Scoreboard'
import { useBetSlipStore } from '@/store/betSlipStore'
import { useAuthStore } from '@/store/authStore'

function MatchDetailContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { selections } = useBetSlipStore()

  const [activeTab, setActiveTab] = useState<'MARKETS' | 'OPEN BETS'>('MARKETS')
  const [unmatchedExpanded, setUnmatchedExpanded] = useState(true)
  const [matchedExpanded, setMatchedExpanded] = useState(true)
  const [activeSelection, setActiveSelection] = useState<{
    runner: string,
    price: number,
    type: 'back' | 'lay',
    market?: string
  } | null>(null)

  const sport = params?.sport as string || 'cricket'
  const matchId = params?.matchId as string || 'match1'
  const matchName = 'Mumbai Indians vs Rajasthan Royals'

  // Handle initial selection from URL
  useEffect(() => {
    const selection = searchParams.get('selection')
    const odds = searchParams.get('odds')
    const type = searchParams.get('type') as 'back' | 'lay'
    const market = searchParams.get('market')

    if (selection && odds && type) {
      setActiveSelection({
        runner: selection,
        price: parseFloat(odds),
        type: type,
        market: market || undefined
      })

      // Clear params to avoid re-opening on manual refresh if user dismissed it
      const newUrl = window.location.pathname
      window.history.replaceState({ ...window.history.state, path: newUrl }, '', newUrl)
    }
  }, [searchParams])

  // Mock runners data
  const bookmakerRunners = [
    {
      name: 'Mumbai Indians',
      back: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: 350, size: '-' }],
      lay: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: '-', size: '-' }]
    },
    {
      name: 'Rajasthan Royals',
      back: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: 1000, size: '-' }],
      lay: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: '-', size: '-' }]
    },
    {
      name: 'Chennai Super Kings',
      back: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: 750, size: '-' }],
      lay: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: '-', size: '-' }]
    },
    {
      name: 'Sunrisers Hyderabad',
      back: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: 830, size: '-' }],
      lay: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: '-', size: '-' }]
    },
    {
      name: 'Royal Challengers Begaluru',
      back: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: 600, size: '-' }],
      lay: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: '-', size: '-' }]
    },
    {
      name: 'Kolkata Knight Riders',
      back: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: 1000, size: '-' }],
      lay: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: '-', size: '-' }]
    },
    {
      name: 'Delhi Capitals',
      back: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: 1000, size: '-' }],
      lay: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: '-', size: '-' }]
    },
    {
      name: 'Lucknow Super Giants',
      back: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: 1000, size: '-' }],
      lay: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: '-', size: '-' }]
    },
    {
      name: 'Gujarat Titans',
      back: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: 1000, size: '-' }],
      lay: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: '-', size: '-' }]
    },
    {
      name: 'Punjab Kings',
      back: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: 1000, size: '-' }],
      lay: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: '-', size: '-' }]
    },
  ] as any[]

  const winnerRunners = [
    {
      name: 'Mumbai Indians',
      back: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: 4.90, size: '41,514' }],
      lay: [{ price: 5, size: '77,326' }, { price: '-', size: '-' }, { price: '-', size: '-' }]
    },
    {
      name: 'Royal Challengers Bengaluru',
      back: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: 7.20, size: '256' }],
      lay: [{ price: 7.60, size: '5,948' }, { price: '-', size: '-' }, { price: '-', size: '-' }]
    },
    {
      name: 'Sunrisers Hyderabad',
      back: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: 9.80, size: '425' }],
      lay: [{ price: 10.50, size: '7,137' }, { price: '-', size: '-' }, { price: '-', size: '-' }]
    },
    {
      name: 'Chennai Super Kings',
      back: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: 8.20, size: '8,962' }],
      lay: [{ price: 8.40, size: '45,346' }, { price: '-', size: '-' }, { price: '-', size: '-' }]
    },
    {
      name: 'Delhi Capitals',
      back: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: 10.50, size: '344' }],
      lay: [{ price: 11.50, size: '802' }, { price: '-', size: '-' }, { price: '-', size: '-' }]
    },
    {
      name: 'Gujarat Titans',
      back: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: 12, size: '652' }],
      lay: [{ price: 13.50, size: '12,641' }, { price: '-', size: '-' }, { price: '-', size: '-' }]
    },
    {
      name: 'Punjab Kings',
      back: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: 11.50, size: '434' }],
      lay: [{ price: 12.50, size: '34,121' }, { price: '-', size: '-' }, { price: '-', size: '-' }]
    },
    {
      name: 'Kolkata Knight Riders',
      back: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: 14.50, size: '4,501' }],
      lay: [{ price: 15, size: '180' }, { price: '-', size: '-' }, { price: '-', size: '-' }]
    },
    {
      name: 'Rajasthan Royals',
      back: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: 15.50, size: '3,463' }],
      lay: [{ price: 17, size: '417' }, { price: '-', size: '-' }, { price: '-', size: '-' }]
    },
    {
      name: 'Lucknow Super Giants',
      back: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: 14, size: '1,097' }],
      lay: [{ price: 17.50, size: '334' }, { price: '-', size: '-' }, { price: '-', size: '-' }]
    },
  ] as any[]

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] font-sans">
      {/* Header - Matching Image 1 */}
      <div className="sticky top-0 z-[20] bg-[#1a1a1a] shadow-lg">
        <div className="flex items-center h-[56px] px-4">
          <button onClick={() => router.back()} className="mr-4">
            <ArrowLeft size={22} color="#e15b24" />
          </button>
          <h1 className="flex-1 text-[17px] font-bold text-white truncate">{matchName}</h1>
          <button className="p-1">
            <Star size={24} className="text-[#ffb400]" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-white/5 h-12">
          <button
            onClick={() => setActiveTab('MARKETS')}
            className={`flex-1 flex flex-col items-center justify-center text-[13px] font-bold transition-all relative ${activeTab === 'MARKETS' ? 'text-[#e15b24]' : 'text-gray-400'}`}
          >
            MARKETS
            {activeTab === 'MARKETS' && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#e15b24]" />}
          </button>
          <button
            onClick={() => setActiveTab('OPEN BETS')}
            className={`flex-1 flex flex-col items-center justify-center text-[13px] font-bold transition-all relative ${activeTab === 'OPEN BETS' ? 'text-[#e15b24]' : 'text-gray-400'}`}
          >
            OPEN BETS
            {activeTab === 'OPEN BETS' && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#e15b24]" />}
          </button>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'MARKETS' ? (
        <div className="p-1.5 space-y-3">
          {/* Scoreboard block - Hidden on Mobile */}
          <div className="hidden md:block">
            <Scoreboard />
          </div>

          {/* First Table Container - White background wrapper */}
          <div className="bg-white rounded-b-[16px] overflow-hidden shadow-sm mb-4">
            <div className="bg-[#e2e2e2] px-3 py-2.5 text-[12px] font-bold text-[#333]">
              Bookmaker (0% Commission & Instant Bet)
            </div>
            <div className="p-0">
              <MarketSection
                title="MATCH WINNER (BOOKMAKER)"
                runners={bookmakerRunners}
                matchName={matchName}
                activeSelection={activeSelection}
                setActiveSelection={setActiveSelection}
              />
            </div>
          </div>

          <MarketSection
            title="WINNER"
            runners={winnerRunners}
            matchName={matchName}
            activeSelection={activeSelection}
            setActiveSelection={setActiveSelection}
          />
        </div>
      ) : (
        <div className="p-3 space-y-4 pt-4">
          {/* Unmatched Bets Container */}
          <div className="bg-[#121212] border border-[#e15b24]/60 rounded-[12px] relative overflow-hidden transition-all duration-300">
            <button 
              onClick={() => setUnmatchedExpanded(!unmatchedExpanded)}
              className="w-full flex items-center justify-between p-4 cursor-pointer"
            >
              <span className="text-white text-[13px] font-bold">Unmatched Bets</span>
              <div className="bg-[#e15b24] rounded-full p-0.5 transition-transform duration-300" style={{ transform: unmatchedExpanded ? 'rotate(0deg)' : 'rotate(180deg)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m18 15-6-6-6 6"/>
                </svg>
              </div>
            </button>
            
            <div className={`flex flex-col items-center justify-center transition-all duration-300 ${unmatchedExpanded ? 'pb-8 opacity-100 h-auto' : 'h-0 opacity-0 overflow-hidden'}`}>
              <div className="mb-3">
                <svg width="48" height="42" viewBox="0 0 24 24" fill="#e15b24">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4m0 4h.01" stroke="#e15b24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-[#e15b24] text-[15px] font-bold">No Unmatched Bets!</p>
            </div>
          </div>

          {/* Matched Bets Container */}
          <div className="bg-[#121212] border border-[#e15b24]/60 rounded-[12px] relative overflow-hidden transition-all duration-300">
            <button 
              onClick={() => setMatchedExpanded(!matchedExpanded)}
              className="w-full flex items-center justify-between p-4 cursor-pointer"
            >
              <span className="text-white text-[13px] font-bold">Matched Bets</span>
              <div className="bg-[#e15b24] rounded-full p-0.5 transition-transform duration-300" style={{ transform: matchedExpanded ? 'rotate(0deg)' : 'rotate(180deg)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m18 15-6-6-6 6"/>
                </svg>
              </div>
            </button>

            <div className={`flex flex-col items-center justify-center transition-all duration-300 ${matchedExpanded ? 'pb-8 opacity-100 h-auto' : 'h-0 opacity-0 overflow-hidden'}`}>
              <div className="mb-3">
                <svg width="48" height="42" viewBox="0 0 24 24" fill="#e15b24">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4m0 4h.01" stroke="#e15b24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-[#e15b24] text-[15px] font-bold">No Matched Bets!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function MatchDetailPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-gray-400 font-black uppercase text-xs tracking-widest">Loading Match Data...</div>}>
      <MatchDetailContent />
    </Suspense>
  )
}
