'use client'
import React, { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Star, Share2, Info, Clock, BarChart2 } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import MarketSection from '@/components/sportsbook/MarketSection'
import Scoreboard from '@/components/sportsbook/Scoreboard'
import BetSlip from '@/components/sportsbook/BetSlip'
import { useBetSlipStore } from '@/store/betSlipStore'
import { useAuthStore } from '@/store/authStore'

function MatchDetailContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated } = useAuthStore()
  const { addSelection, selections, openSlip } = useBetSlipStore()
  
  const sport = params?.sport as string || 'cricket'
  const matchId = params?.matchId as string || 'match1'

  // Mock runners data
  const matchOddsRunners = [
    { 
      name: 'Silvertoan Panthers', 
      back: [
        { price: 1.35, size: '2k' }, { price: 1.36, size: '4k' }, { price: 1.37, size: '5,948' }
      ], 
      lay: [
        { price: 1.38, size: '5,948' }, { price: 1.39, size: '1k' }, { price: 1.40, size: '3k' }
      ] 
    },
    { 
      name: 'Bhawani Lions', 
      back: [
        { price: 3.00, size: '500' }, { price: 3.02, size: '800' }, { price: 3.05, size: '5,948' }
      ], 
      lay: [
        { price: 3.70, size: '5,948' }, { price: 3.75, size: '200' }, { price: 3.80, size: '1k' }
      ] 
    },
  ] as any[]

  const tieRunners = [
    { 
      name: 'Yes', 
      back: [
        { price: 11, size: '100' }, { price: 12, size: '200' }, { price: 13, size: '5,948' }
      ], 
      lay: [
        { price: 14, size: '5,948' }, { price: 15, size: '100' }, { price: 16, size: '50' }
      ] 
    },
    { 
      name: 'No', 
      back: [
        { price: 1.05, size: '10k' }, { price: 1.06, size: '5k' }, { price: 1.08, size: '5,948' }
      ], 
      lay: [
        { price: 1.10, size: '5,948' }, { price: 1.12, size: '1k' }, { price: 1.15, size: '2k' }
      ] 
    },
  ] as any[]

  const fancyMarkets = [
    { 
      title: '1st Innings Over 5 - Bhawani Lions Total',
      runners: [
        { 
          name: 'Over 10.5', 
          back: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: '-', size: '-' }], 
          lay: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: '-', size: '-' }], 
          suspended: true 
        },
        { 
          name: 'Under 10.5', 
          back: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: '-', size: '-' }], 
          lay: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: '-', size: '-' }], 
          suspended: true 
        },
      ] as any[]
    },
    { 
      title: '1st Innings Over 5 - Bhawani Lions Total',
      runners: [
        { 
          name: 'Over 7.5', 
          back: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: '-', size: '-' }], 
          lay: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: '-', size: '-' }], 
          suspended: true 
        },
        { 
          name: 'Under 7.5', 
          back: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: '-', size: '-' }], 
          lay: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: '-', size: '-' }], 
          suspended: true 
        },
      ] as any[]
    }
  ]

  // Auto-open betslip if params present
  useEffect(() => {
    const selection = searchParams.get('selection')
    const odds = searchParams.get('odds')
    const type = searchParams.get('type') as 'back' | 'lay'
    const market = searchParams.get('market') || 'Match Odds'

    if (selection && odds && type) {
      addSelection({
        id: `${matchId}-${selection}-${odds}-${type}`,
        matchId,
        matchName: 'Silvertoan Panthers vs Bhawani Lions',
        marketName: market,
        selectionName: selection,
        odds: parseFloat(odds),
        betType: type
      })
      openSlip()
      
      // Clear params to avoid double adding on refresh
      const newUrl = window.location.pathname
      window.history.replaceState({ ...window.history.state, path: newUrl }, '', newUrl)
    }
  }, [searchParams, matchId, addSelection, openSlip])

  const handleOddsClick = (runner: string, price: number, type: 'back' | 'lay', market: string = 'Match Odds') => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    addSelection({
      id: `${matchId}-${runner}-${price}-${type}`,
      matchId,
      matchName: 'Silvertoan Panthers vs Bhawani Lions',
      marketName: market,
      selectionName: runner,
      odds: price,
      betType: type
    })
    openSlip()
  }

  const isSelected = (runner: string, price: number, type: 'back' | 'lay') => {
    return selections.some(s => s.id === `${matchId}-${runner}-${price}-${type}`)
  }

  return (
    <div className="flex h-full min-h-screen bg-background">
      {/* Main Content Area */}
      <div className="flex-1 min-w-0 transition-all">
         {/* Top Bar Navigation (Responsive) */}
         <div className="sticky top-[120px] lg:top-[120px] z-[15] bg-surface/80 backdrop-blur-md border-b border-cardBorder">
            <div className="flex items-center gap-3 px-4 py-3">
               <button onClick={() => router.back()} className="text-[#e8612c] hover:bg-[#e8612c]/5 p-2 rounded-full transition-colors">
                  <ArrowLeft size={18} />
               </button>
               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] font-black bg-[#e8612c] text-white px-1.5 py-0.5 rounded-sm uppercase italic">LIVE</span>
                     <span className="text-[10px] text-textSecondary font-bold uppercase tracking-widest truncate">Cricket / Major League Cricket / Silvertoan vs Bhawani</span>
                  </div>
                  <h1 className="text-sm font-black text-white uppercase tracking-tight truncate">Silvertoan Panthers vs Bhawani Lions</h1>
               </div>
               <div className="flex items-center gap-1">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-textSecondary hover:text-[#e8612c] text-[10px] font-black uppercase transition-all">
                     <Share2 size={14} />
                     <span className="hidden sm:inline">Share</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-textSecondary hover:text-yellow-500 text-[10px] font-black uppercase transition-all">
                     <Star size={14} />
                     <span className="hidden sm:inline">Watchlist</span>
                  </button>
               </div>
            </div>
         </div>

         {/* Content Scroll Area */}
         <div className="p-1 lg:p-4 space-y-4 pb-24 lg:pb-8">
            {/* Scoreboard block - matching image 1 */}
            <Scoreboard />

            {/* Betting Markets - matching image 2 styling */}
            <div className="space-y-4">
               <MarketSection 
                 title="Winner (Incl. Super Over)" 
                 runners={matchOddsRunners} 
                 onOddsClick={(r, p, t) => handleOddsClick(r, p, t, 'Winner')}
                 isSelected={isSelected}
               />

               <MarketSection 
                 title="Will there be a tie" 
                 runners={tieRunners} 
                 onOddsClick={(r, p, t) => handleOddsClick(r, p, t, 'Tie Market')}
                 isSelected={isSelected}
               />

               {fancyMarkets.map((market, idx) => (
                 <MarketSection 
                   key={idx}
                   title={market.title} 
                   runners={market.runners} 
                   onOddsClick={(r, p, t) => handleOddsClick(r, p, t, market.title)}
                   isSelected={isSelected}
                 />
               ))}
            </div>
         </div>
      </div>

      {/* Right column - Integrated BetSlip */}
      <div className="hidden lg:block w-[380px] shrink-0 border-l border-cardBorder bg-surface/30">
         <div className="sticky top-[120px] h-[calc(100vh-120px)] overflow-hidden">
            <BetSlip inline={true} />
         </div>
      </div>

      {/* Mobile BetSlip is handled globally in layout by the BetSlip component's fixed/absolute positioning */}
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
