'use client'
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Star, Loader2, ChevronDown, ChevronUp, ChevronLeft } from 'lucide-react'
import { toTitleCase } from '@/utils/format'
import BetContainer from '@/components/sportsbook/BetContainer'
import { marketController } from '@/controllers/market/marketController'
import { useBetSlipStore } from '@/store/betSlipStore'

const OddsBox = ({ 
  val, 
  vol, 
  type, 
  intensity = 'high', 
  onClick 
}: { 
  val: string, 
  vol: string, 
  type: 'back' | 'lay', 
  intensity?: 'low' | 'medium' | 'high',
  onClick?: () => void
}) => {
  const [blink, setBlink] = useState(false)
  const prevValue = useRef(val)

  useEffect(() => {
    if (prevValue.current !== val && val !== '0' && val !== '0.00' && val !== '-' && parseFloat(val) > 0) {
      setBlink(true)
      const timer = setTimeout(() => setBlink(false), 300)
      prevValue.current = val
      return () => clearTimeout(timer)
    }
    prevValue.current = val
  }, [val])

  const bgColor = type === 'back'
    ? (intensity === 'high' ? 'bg-[#a5d9fe]' : intensity === 'medium' ? 'bg-[#bce4ff]' : 'bg-[#d1eeff]')
    : (intensity === 'high' ? 'bg-[#f8d0ce]' : intensity === 'medium' ? 'bg-[#fbe3e2]' : 'bg-[#fff0f0]')

  const isEmpty = !val || val === '0' || val === '0.00' || val === '-' || parseFloat(val) === 0

  return (
    <button 
      onClick={onClick}
      disabled={isEmpty}
      className={`w-[58px] lg:w-[60px] h-[38px] rounded-[4px] flex flex-col items-center justify-center transition-all shadow-sm border border-transparent ${isEmpty ? 'bg-[#f2f2f2] opacity-60 cursor-not-allowed' : bgColor} ${blink ? 'animate-rate-change' : ''} hover:brightness-95 active:scale-95`}
    >
      <span className={`text-[12px] lg:text-[13px] font-black ${isEmpty ? 'text-[#aaa]' : 'text-[#2e2e2e]'} leading-none mb-0.5 tracking-tight`}>{val || '-'}</span>
      {!isEmpty && <span className="text-[8.5px] lg:text-[9px] text-[#555] font-bold leading-none">{vol || ''}</span>}
    </button>
  )
}

const MarketTable = ({ 
  marketName, 
  runners, 
  marketId, 
  liveRates, 
  matchName 
}: { 
  marketName: string, 
  runners: any[], 
  marketId: string, 
  liveRates: any,
  matchName: string
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const addSelection = useBetSlipStore(state => state.addSelection)

  const getRunnerRates = (runnerId: string | number) => {
    const rateData = liveRates[marketId]
    const runnersData = rateData?.runner || rateData?.runners || []
    const runnerArr = Array.isArray(runnersData) ? runnersData : Object.values(runnersData)
    
    let r = runnerArr.find((item: any) => item.selectionId === runnerId || item.id === runnerId)
    if (!r && typeof runnerId === 'number') r = runnerArr[runnerId]

    const getPrices = (r: any, type: 'back'|'lay') => {
      if (!r) return { p1: '', v1: '', p2: '', v2: '', p3: '', v3: '' };
      const data = type === 'back' ? (r.back || r.availableToBack || r.ex?.availableToBack) : (r.lay || r.availableToLay || r.ex?.availableToLay);
      const arr = Array.isArray(data) ? data : Object.values(data || {});
      
      return {
        p1: (arr[0]?.rate || arr[0]?.price || (type === 'back' ? r.lastPriceTraded : '') || '')?.toString(),
        v1: arr[0]?.size || '',
        p2: (arr[1]?.rate || arr[1]?.price || '')?.toString(),
        v2: arr[1]?.size || '',
        p3: (arr[2]?.rate || arr[2]?.price || '')?.toString(),
        v3: arr[2]?.size || '',
      };
    };

    const back = getPrices(r, 'back')
    const lay = getPrices(r, 'lay')

    return { back, lay }
  }

  return (
    <div className="bg-white rounded-t-lg rounded-b-lg shadow-lg border border-[#f36c21]/10 overflow-hidden mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div 
        className="h-10 lg:h-11 flex items-center justify-between cursor-pointer select-none bg-[#f36c21]"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center h-full px-4">
           <span className="text-white text-[12px] lg:text-[13px] font-black uppercase tracking-wider">{marketName}</span>
           <div className="ml-4 opacity-70">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
           </div>
        </div>
        <div className="flex items-center gap-4 px-4">
           <div className="hidden lg:flex gap-16 mr-8 text-[10px] font-black uppercase tracking-widest text-white/80">
              <span className="w-[124px] text-center">Back</span>
              <span className="w-[124px] text-center">Lay</span>
           </div>
           {isCollapsed ? <ChevronDown className="text-white" size={18} /> : <ChevronUp className="text-white" size={18} />}
        </div>
      </div>

      {!isCollapsed && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f9f9f9] border-b border-gray-100">
                <th className="py-2 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Runners</th>
                <th className="py-2 px-4 text-center lg:text-right hidden lg:table-cell"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {runners.map((runner, rIdx) => {
                const { back, lay } = getRunnerRates(runner.selectionId || runner.id || rIdx)
                const runnerName = runner.name || runner.RunnerName || `Runner ${rIdx + 1}`
                
                const handleAddBet = (odds: string, side: 'back' | 'lay') => {
                  if (!odds || odds === '-') return;
                  addSelection({
                    id: `${marketId}-${runner.selectionId || rIdx}-${side}`,
                    matchId: marketId,
                    matchName: matchName,
                    marketName: marketName,
                    selectionName: runnerName,
                    odds: parseFloat(odds),
                    betType: side
                  })
                }

                return (
                  <tr key={runner.selectionId || rIdx} className="hover:bg-gray-50 transition-colors group">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-[13px] lg:text-[14px] font-bold text-[#333] tracking-tight group-hover:text-[#f36c21] transition-colors">{runnerName}</span>
                      </div>
                    </td>
                    <td className="py-1 px-4">
                        <div className="flex justify-end gap-1 lg:gap-2">
                           <div className="flex gap-1">
                              <div className="hidden lg:flex gap-1">
                                 <OddsBox val={back.p3} vol={back.v3} type="back" intensity="low" onClick={() => handleAddBet(back.p3, 'back')} />
                                 <OddsBox val={back.p2} vol={back.v2} type="back" intensity="medium" onClick={() => handleAddBet(back.p2, 'back')} />
                              </div>
                              <OddsBox val={back.p1} vol={back.v1} type="back" intensity="high" onClick={() => handleAddBet(back.p1, 'back')} />
                           </div>
                           <div className="flex gap-1">
                              <OddsBox val={lay.p1} vol={lay.v1} type="lay" intensity="high" onClick={() => handleAddBet(lay.p1, 'lay')} />
                              <div className="hidden lg:flex gap-1">
                                 <OddsBox val={lay.p2} vol={lay.v2} type="lay" intensity="medium" onClick={() => handleAddBet(lay.p2, 'lay')} />
                                 <OddsBox val={lay.p3} vol={lay.v3} type="lay" intensity="low" onClick={() => handleAddBet(lay.p3, 'lay')} />
                              </div>
                           </div>
                        </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function GameDetailPage() {
  const params = useParams()
  const router = useRouter()
  
  const sportId = params.sport as string
  const competitionId = params.id as string
  const matchId = params.matchId as string

  const [gameData, setGameData] = useState<any>(null)
  const [liveOdds, setLiveOdds] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)

  // 1. Fetch Game Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await marketController.getGameData(matchId)
        if (res && typeof res === 'object' && !res.error) {
          let parsed = typeof res === 'string' ? JSON.parse(res) : res
          // Handle numerical wrapper if present (e.g., {"0": {...}})
          if (parsed && parsed["0"]) parsed = parsed["0"];
          setGameData(parsed)
        }
      } catch (err) {
        console.error("Failed to fetch game data", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [matchId])

  // 2. Poll Rates
  useEffect(() => {
    if (!gameData) return
    let isMounted = true
    let timeoutId: NodeJS.Timeout

    const poll = async () => {
      const marketsToPoll: any[] = []
      
      // Collect ODDS, BM, FANCY markets
      const categories = ['ODDS', 'BOOKMAKER', 'FANCY']
      categories.forEach(cat => {
        const items = gameData[cat] || []
        const itemArr = Array.isArray(items) ? items : Object.values(items)
        itemArr.forEach((m: any) => {
          const mid = m.MarketId || m.marketid
          if (mid) {
            marketsToPoll.push({ gid: matchId, MarketId: mid.toString(), eventid: matchId })
          }
        })
      })

      // Also collect from "events" key if any
      const events = gameData.events || []
      const eventArr = Array.isArray(events) ? events : Object.values(events)
      eventArr.forEach((m: any) => {
        const mid = m.MarketId || m.marketid
        if (mid && !marketsToPoll.find(mp => mp.MarketId === mid.toString())) {
          marketsToPoll.push({ gid: matchId, MarketId: mid.toString(), eventid: matchId })
        }
      })

      if (marketsToPoll.length > 0) {
        const oddsMap: Record<string, any> = {}
        for (const m of marketsToPoll) {
          if (!isMounted) break
          try {
            const res = await marketController.getGameRate(m)
            if (res && typeof res === 'object' && !res.error) {
              if (res[m.MarketId]) {
                oddsMap[m.MarketId] = typeof res[m.MarketId] === 'string' ? JSON.parse(res[m.MarketId]) : res[m.MarketId]
              }
              // Check nested wrappers
              Object.keys(res).forEach(k => {
                if (res[k] && typeof res[k] === 'object' && res[k][m.MarketId]) {
                   oddsMap[m.MarketId] = typeof res[k][m.MarketId] === 'string' ? JSON.parse(res[k][m.MarketId]) : res[k][m.MarketId]
                }
              })
            }
          } catch (e) { console.error(e) }
        }
        if (isMounted) setLiveOdds(prev => ({ ...prev, ...oddsMap }))
      }

      if (isMounted) timeoutId = setTimeout(poll, 2000)
    }

    poll()
    return () => { isMounted = false; if (timeoutId) clearTimeout(timeoutId) }
  }, [gameData, matchId])

  const matchName = useMemo(() => {
     if (!gameData) return 'Event Detail'
     return gameData.GameName || gameData.eventName || gameData.Team1 ? `${gameData.Team1} V ${gameData.Team2}` : 'Live Match'
  }, [gameData])

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh] bg-[#111]">
        <div className="flex flex-col items-center gap-4">
           <Loader2 className="w-10 h-10 text-[#f36c21] animate-spin" />
           <p className="text-white/40 text-[11px] font-black uppercase tracking-widest animate-pulse">Synchronizing Live Markets...</p>
        </div>
      </div>
    )
  }

  const allMarkets = gameData ? [
    ...(gameData.ODDS ? (Array.isArray(gameData.ODDS) ? gameData.ODDS : Object.values(gameData.ODDS)) : []),
    ...(gameData.BOOKMAKER ? (Array.isArray(gameData.BOOKMAKER) ? gameData.BOOKMAKER : Object.values(gameData.BOOKMAKER)).map((m: any) => ({ ...m, isBookmaker: true })) : []),
    ...(gameData.FANCY ? (Array.isArray(gameData.FANCY) ? gameData.FANCY : Object.values(gameData.FANCY)).map((m: any) => ({ ...m, isFancy: true })) : []),
    ...(gameData.events ? (Array.isArray(gameData.events) ? gameData.events : Object.values(gameData.events)) : [])
  ].filter((m, i, self) => m && self.findIndex(t => (t.MarketId || t.marketid) === (m.MarketId || m.marketid)) === i) : [];

  return (
    <div className="flex-1 min-h-screen bg-[#111] flex flex-col lg:flex-row">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="bg-[#1a1a1a] border-b border-white/5 px-2 lg:px-4 h-12 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2 lg:gap-4 overflow-hidden">
            <button 
              onClick={() => router.back()}
              className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all flex-shrink-0"
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-white text-[12px] lg:text-[14px] font-black uppercase tracking-wider truncate flex items-center gap-2">
              {matchName}
              <Star size={16} className="text-yellow-500 fill-yellow-500 flex-shrink-0" />
            </h1>
          </div>
        </div>

        <div className="p-3 lg:p-6 space-y-6">
           <div className="flex items-center justify-between border-b border-[#f36c21]/30 pb-1 mb-4">
              <div className="bg-[#f36c21] px-4 py-1.5 rounded-t-md">
                 <span className="text-white text-[11px] font-black uppercase tracking-widest">Markets</span>
              </div>
           </div>

           {allMarkets.length > 0 ? (
             <div className="space-y-8">
               {/* Group by category if needed, but here we just list them robustly */}
               {allMarkets.map((m: any) => {
                 const isBM = m.isBookmaker || m.Type === 'BOOKMAKER' || m.name?.toLowerCase().includes('bookmaker');
                 const isFancy = m.isFancy || m.Type === 'FANCY';
                 
                 let runners = m.runner || m.runners || [];
                 if (!Array.isArray(runners)) runners = Object.values(runners);

                 return (
                   <div key={m.MarketId || m.marketid || m.eid}>
                     {(isBM || isFancy) && (
                       <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-1">
                         {isBM ? 'Bookmaker (0% Commission & Instant Bet)' : 'Fancy Markets'}
                       </p>
                     )}
                     <MarketTable 
                       marketName={m.name || (isBM ? 'Match Winner (Bookmaker)' : 'Match Odds')} 
                       runners={runners} 
                       marketId={m.MarketId || m.marketid || m.eid} 
                       liveRates={liveOdds}
                       matchName={matchName}
                     />
                   </div>
                 );
               })}
             </div>
           ) : (
             <div className="py-24 text-center bg-white/5 rounded-[32px] border border-white/5 mx-4 flex flex-col items-center">
               <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/10"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
               </div>
               <p className="text-white/20 text-[12px] font-black uppercase tracking-[0.3em] italic">No Available Markets for this Session</p>
             </div>
           )}
        </div>
      </div>

      <div className="hidden lg:block w-[320px] xl:w-[360px] sticky top-0 h-screen overflow-y-auto border-l border-white/5 bg-[#1a1a1a]">
        <BetContainer />
      </div>
    </div>
  )
}
