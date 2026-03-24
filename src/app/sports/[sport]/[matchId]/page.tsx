'use client'
import React, { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Star, BarChart2, Loader2 } from 'lucide-react'
import MarketSection from '@/components/sportsbook/MarketSection'
import Scoreboard from '@/components/sportsbook/Scoreboard'
import { useBetSlipStore } from '@/store/betSlipStore'
import { useAuthStore } from '@/store/authStore'
import { bettingController } from '@/controllers/betting/bettingController'

interface Bet {
  Game: string;
  Selection: string;
  Type: string;
  Rate: string;
  Stake: string;
  Date: string;
  Side: 'back' | 'lay';
  IsMatched?: string;
}

function MatchDetailContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { selections } = useBetSlipStore()
  const { user } = useAuthStore()

  const [activeTab, setActiveTab] = useState<'MARKETS' | 'OPEN BETS'>('MARKETS')
  const [unmatchedExpanded, setUnmatchedExpanded] = useState(true)
  const [matchedExpanded, setMatchedExpanded] = useState(true)
  const [bets, setBets] = useState<Bet[]>([])
  const [loading, setLoading] = useState(false)
  const [activeSelection, setActiveSelection] = useState<{
    runner: string,
    price: number,
    type: 'back' | 'lay',
    market?: string
  } | null>(null)

  const sport = params?.sport as string || 'cricket'
  const matchId = params?.matchId as string || 'match1'
  const matchName = 'Mumbai Indians vs Rajasthan Royals'

  useEffect(() => {
    if (activeTab === 'OPEN BETS' && user?.loginToken) {
      fetchBets()
    }
  }, [activeTab, user?.loginToken])

  const fetchBets = async () => {
    try {
      setLoading(true)
      const res = await bettingController.getMyBets(user?.loginToken || '')
      if (res && typeof res === 'object' && !res.error) {
        const betArray = Object.values(res).filter(item => typeof item === 'object' && item !== null) as Bet[]
        setBets(betArray)
      }
    } catch (err) {
      console.error('Failed to fetch bets:', err)
    } finally {
      setLoading(false)
    }
  }

  const matchBets = bets.filter(b => b.Game?.toLowerCase().includes(matchName.toLowerCase()))
  const matchedBets = matchBets.filter((b: Bet) => b.Type?.toLowerCase().includes('match') || b.IsMatched === '1')
  const unmatchedBets = matchBets.filter((b: Bet) => !b.Type?.toLowerCase().includes('match') && b.IsMatched !== '1')

  const renderBetCard = (bet: Bet) => (
    <div key={`${bet.Game}-${bet.Date}`} className="bg-[#1a1a1a] p-3 border-b border-[#333] last:border-0 rounded-lg mb-2">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[12px] font-bold text-white uppercase truncate">{bet.Selection}</span>
        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${bet.Side === 'back' ? 'bg-[#a5d9fe] text-black' : 'bg-[#f8d0ce] text-black'}`}>
          {bet.Side}
        </span>
      </div>
      <div className="flex justify-between items-center text-[11px]">
        <div className="flex flex-col">
          <span className="text-gray-400 font-medium">Rate: <span className="text-white font-bold">{bet.Rate}</span></span>
          <span className="text-gray-500 text-[10px]">{bet.Date}</span>
        </div>
        <div className="text-right">
          <span className="text-gray-400 font-medium">Stake:</span>
          <p className="text-[#e15b24] font-black text-[13px]">₹{bet.Stake}</p>
        </div>
      </div>
    </div>
  )

  // ... (previous runners definitions)

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] font-sans">
      {/* Header - Matching Image 1 */}
      {/* ... (Header component) */}

      {/* Content Area */}
      {activeTab === 'MARKETS' ? (
        <div className="p-1.5 space-y-3">
          {/* ... (Markets content) */}
        </div>
      ) : (
        <div className="p-3 space-y-4 pt-4">
          {/* Unmatched Bets Container */}
          <div className="bg-[#121212] border border-[#e15b24]/60 rounded-[12px] relative overflow-hidden transition-all duration-300">
            <button 
              onClick={() => setUnmatchedExpanded(!unmatchedExpanded)}
              className="w-full flex items-center justify-between p-4 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-white text-[13px] font-bold">Unmatched Bets</span>
                {unmatchedBets.length > 0 && <span className="bg-[#e15b24] text-white text-[10px] px-2 rounded-full">{unmatchedBets.length}</span>}
              </div>
              <div className="bg-[#e15b24] rounded-full p-0.5 transition-transform duration-300" style={{ transform: unmatchedExpanded ? 'rotate(0deg)' : 'rotate(180deg)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m18 15-6-6-6 6"/>
                </svg>
              </div>
            </button>
            
            <div className={`transition-all duration-300 ${unmatchedExpanded ? 'pb-4 px-3 opacity-100 h-auto' : 'h-0 opacity-0 overflow-hidden'}`}>
              {loading ? (
                <div className="py-8 flex justify-center"><Loader2 className="text-[#e15b24] animate-spin" /></div>
              ) : unmatchedBets.length > 0 ? (
                unmatchedBets.map(renderBetCard)
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                   <div className="mb-3">
                    <svg width="48" height="42" viewBox="0 0 24 24" fill="#e15b24">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4m0 4h.01" stroke="#e15b24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-[#e15b24] text-[15px] font-bold">No Unmatched Bets!</p>
                </div>
              )}
            </div>
          </div>

          {/* Matched Bets Container */}
          <div className="bg-[#121212] border border-[#e15b24]/60 rounded-[12px] relative overflow-hidden transition-all duration-300">
            <button 
              onClick={() => setMatchedExpanded(!matchedExpanded)}
              className="w-full flex items-center justify-between p-4 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-white text-[13px] font-bold">Matched Bets</span>
                {matchedBets.length > 0 && <span className="bg-[#e15b24] text-white text-[10px] px-2 rounded-full">{matchedBets.length}</span>}
              </div>
              <div className="bg-[#e15b24] rounded-full p-0.5 transition-transform duration-300" style={{ transform: matchedExpanded ? 'rotate(0deg)' : 'rotate(180deg)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m18 15-6-6-6 6"/>
                </svg>
              </div>
            </button>

            <div className={`transition-all duration-300 ${matchedExpanded ? 'pb-4 px-3 opacity-100 h-auto' : 'h-0 opacity-0 overflow-hidden'}`}>
              {loading ? (
                <div className="py-8 flex justify-center"><Loader2 className="text-[#e15b24] animate-spin" /></div>
              ) : matchedBets.length > 0 ? (
                matchedBets.map(renderBetCard)
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="mb-3">
                    <svg width="48" height="42" viewBox="0 0 24 24" fill="#e15b24">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4m0 4h.01" stroke="#e15b24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-[#e15b24] text-[15px] font-bold">No Matched Bets!</p>
                </div>
              )}
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
