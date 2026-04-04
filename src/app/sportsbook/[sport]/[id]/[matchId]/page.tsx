'use client'
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Star, Loader2, ChevronDown, ChevronLeft, Plus } from 'lucide-react'
import BetContainer from '@/components/sportsbook/BetContainer'
import { marketController } from '@/controllers/market/marketController'
import { useBetSlipStore } from '@/store/betSlipStore'
import { useAuthStore } from '@/store/authStore'
import { bettingController } from '@/controllers/betting/bettingController'
import BetSlipForm from '@/components/sportsbook/BetSlipForm'

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
  matchName,
  marketType,
  marketIndex = 0,
  eventId
}: { 
  marketName: string, 
  runners: any[], 
  marketId: string, 
  liveRates: any,
  matchName: string,
  marketType: string,
  marketIndex: number,
  eventId: string
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { selections, clearAll } = useBetSlipStore()
  const addSelection = useBetSlipStore(state => state.addSelection)

  const getRunnerRates = (runnerId: string | number, rIdx: number) => {
    const rateData = liveRates[marketId]
    const runnersData = rateData?.runner || rateData?.runners || []
    const runnerArr = Array.isArray(runnersData) ? runnersData : Object.values(runnersData)
    
    let r = runnerArr.find((item: any) => 
      (item.selectionId && item.selectionId.toString() === runnerId.toString()) || 
      (item.id && item.id.toString() === runnerId.toString())
    )
    if (!r) r = runnerArr[rIdx]

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
    <div className="bg-white rounded-b-[12px] shadow-sm border border-[#f36c21] mt-8 relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header (Gray/Slanted Orange) */}
      <div 
        className="h-10 lg:h-12 flex items-center relative cursor-pointer select-none bg-[#e0e0e0]"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div 
          className="relative h-full flex items-center pl-2 lg:pl-3 bg-[#e8612c] pr-10 lg:pr-12 z-10 transition-all duration-300" 
          style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)' }}
        >
          <div className="flex items-center gap-2 mt-2">
            <span className="text-white text-[18px] lg:text-[20px] font-medium leading-none mb-1">
              {isCollapsed ? '+' : '−'}
            </span>
            <span className="text-white text-[12px] lg:text-[14px] font-bold whitespace-nowrap uppercase tracking-tight">
              {matchName}
            </span>
          </div>
        </div>

        <div className="flex-1 h-full flex items-center justify-end pr-4 gap-3 z-0">
          <Star size={18} className="text-[#ffd700] fill-none stroke-[2px]" />
        </div>
      </div>

      {/* Sub-Header Category */}
      <div className="bg-[#333] flex items-center justify-between px-2 lg:px-3 h-10 border-t border-white/5">
         <div className="bg-[#e8612c] px-3 py-1 flex items-center h-full max-h-[28px] rounded-sm transform -skew-x-12">
            <span className="text-white text-[10px] font-black uppercase tracking-wider transform skew-x-12">{marketName}</span>
         </div>
         <div className="flex gap-1 lg:gap-[68px] mr-1 lg:mr-10 items-center">
            <span className="text-[10px] font-black text-white/80 uppercase tracking-widest w-[58px] lg:w-[124px] text-center">Back</span>
            <span className="text-[10px] font-black text-white/80 uppercase tracking-widest w-[58px] lg:w-[124px] text-center">Lay</span>
         </div>
      </div>

      {!isCollapsed && (
        <div className="overflow-x-auto lg:overflow-visible rounded-b-[11px]">
          <table className="w-full border-collapse">
            <tbody className="divide-y divide-gray-100">
              {runners.map((runner, rIdx) => {
                // Improved ID detection: scan for all common API field names
                const runnerId = runner.selectionId || runner.SelectionId || runner.id || runner.selection_id || runner.selectionid || runner.sid || rIdx
                const { back, lay } = getRunnerRates(runnerId, rIdx)
                const runnerName = runner.name || runner.RunnerName ||`Runner ${rIdx + 1}`

                const rateData = liveRates[marketId]
                
                // Deep suspension check for the specific runner/selection
                const isMarketSuspended = rateData?.status === 'SUSPENDED' || rateData?.Msg?.toLowerCase().includes('suspend') || rateData?.active === 'No' || rateData?.suspended === 'Y'
                
                let isSelectionSuspended = false
                if (rateData?.runners) {
                  const r = rateData.runners.find((p: any) => p.selectionId?.toString() === runnerId?.toString())
                  if (r?.status === 'SUSPENDED') isSelectionSuspended = true
                } else if (rateData?.rates) {
                  // For ODD/Bookmaker types where rates is an array
                  const r = rateData.rates[rIdx]
                  if (r?.selectionStatus === 'SUSPENDED') isSelectionSuspended = true
                }

                const isSuspended = isMarketSuspended || isSelectionSuspended

                const handleAddBet = (odds: string, side: 'back' | 'lay') => {
                  if (isSuspended || !odds || odds === '-' || odds === '0' || odds === '0.00') return;
                  
                  addSelection({
                    id: `${marketId}-${runnerId}-${side}`,
                    matchId: eventId.toString(), // The overall Game/Match ID
                    marketId: marketId.toString(), // The specific pool/market ID
                    eventId: eventId.toString(),   // Essential for API common params
                    selectionId: runnerId.toString(),
                    matchName: matchName,
                    marketName: marketName,
                    selectionName: runnerName,
                    odds: parseFloat(odds),
                    betType: side,
                    marketType: marketType || (marketName.toLowerCase().includes('bookmaker') ? 'BOOKMAKER' : (marketName.toLowerCase().includes('fancy') ? 'FANCY' : 'ODDS')),
                    marketIndex: rIdx,
                    runnersCount: runners.length
                  })
                }

                const isSelectedOnMobile = selections.some(s => s.id.startsWith(`${marketId}-${runnerId}`))

                return (
                  <React.Fragment key={runnerId}>
                    <tr className="hover:bg-gray-50/50 transition-colors group relative">
                      <td className="py-3 px-3 lg:px-4">
                        <span className="text-[13px] lg:text-[14px] font-bold text-gray-900 tracking-tight group-hover:text-[#e8612c] transition-colors uppercase">
                          {runnerName}
                        </span>
                      </td>
                      <td className="p-1 px-2 relative min-w-[200px]">
                          <div className="flex justify-end gap-1 lg:gap-2">
                             <div className="flex gap-1 py-1">
                                <div className="hidden lg:flex gap-1">
                                   <OddsBox val={back.p3} vol={back.v3} type="back" intensity="low" onClick={() => handleAddBet(back.p3, 'back')} />
                                   <OddsBox val={back.p2} vol={back.v2} type="back" intensity="medium" onClick={() => handleAddBet(back.p2, 'back')} />
                                </div>
                                <OddsBox val={back.p1} vol={back.v1} type="back" intensity="high" onClick={() => handleAddBet(back.p1, 'back')} />
                             </div>
                             <div className="flex gap-1 py-1">
                                <OddsBox val={lay.p1} vol={lay.v1} type="lay" intensity="high" onClick={() => handleAddBet(lay.p1, 'lay')} />
                                <div className="hidden lg:flex gap-1">
                                   <OddsBox val={lay.p2} vol={lay.v2} type="lay" intensity="medium" onClick={() => handleAddBet(lay.p2, 'lay')} />
                                   <OddsBox val={lay.p3} vol={lay.v3} type="lay" intensity="low" onClick={() => handleAddBet(lay.p3, 'lay')} />
                                </div>
                             </div>
                          </div>

                          {/* Market Suspended Overlay */}
                          {isSuspended && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center pointer-events-auto">
                              <div className="bg-[#555] px-4 py-1.5 rounded-[4px] shadow-lg transform -skew-x-12 ring-2 ring-white/20">
                                 <span className="text-white text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] transform skew-x-12 block">SUSPENDED</span>
                              </div>
                            </div>
                          )}
                      </td>
                    </tr>

                    {/* Inline Mobile Betslip */}
                    {isSelectedOnMobile && selections[0] && (
                      <tr className="lg:hidden animate-in slide-in-from-top-4 duration-300">
                        <td colSpan={2} className="p-2 pt-0 bg-white">
                          <BetSlipForm 
                            selection={selections[0]} 
                            onClose={clearAll} 
                          />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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
  const { user } = useAuthStore()
  
  const sportId = params.sport as string
  const competitionId = params.id as string
  const matchId = params.matchId as string
  
  const [activeTab, setActiveTab] = useState<'MARKETS' | 'OPEN_BETS'>('MARKETS')
  const [gameData, setGameData] = useState<any>(null)
  const [liveOdds, setLiveOdds] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)
  
  // Open Bets Data
  const { myBets: bets, setMyBets: setGlobalBets } = useBetSlipStore()
  const [betsLoading, setBetsLoading] = useState(false)
  const [unmatchedOpen, setUnmatchedOpen] = useState(true)
  const [matchedOpen, setMatchedOpen] = useState(true)

  const fetchBets = useCallback(async () => {
    if (!user?.loginToken) return
    try {
      setBetsLoading(true)
      const res = await bettingController.getMyBets(user.loginToken)
      if (res && typeof res === 'object' && !res.error) {
        const betArray = Object.values(res).filter(item => typeof item === 'object' && item !== null) as any[]
        setGlobalBets(betArray)
      }
    } catch (err) {
      console.error('Failed to fetch bets:', err)
    } finally {
      setBetsLoading(false)
    }
  }, [user?.loginToken, setGlobalBets])

  useEffect(() => {
    if (activeTab === 'OPEN_BETS') {
      fetchBets()
    }
  }, [activeTab, fetchBets])

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
    ...(gameData.ODDS ? (Array.isArray(gameData.ODDS) ? gameData.ODDS : Object.values(gameData.ODDS)).map((m: any) => ({ ...m, category: 'ODDS' })) : []),
    ...(gameData.BOOKMAKER ? (Array.isArray(gameData.BOOKMAKER) ? gameData.BOOKMAKER : Object.values(gameData.BOOKMAKER)).map((m: any) => ({ ...m, isBookmaker: true, category: 'BOOKMAKER' })) : []),
    ...(gameData.FANCY ? (Array.isArray(gameData.FANCY) ? gameData.FANCY : Object.values(gameData.FANCY)).map((m: any) => ({ ...m, isFancy: true, category: 'FANCY' })) : []),
    ...(gameData.events ? (Array.isArray(gameData.events) ? gameData.events : Object.values(gameData.events)).map((m: any) => ({ ...m, category: m.Type || 'ODDS' })) : [])
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

        <div className="p-0 lg:p-6 space-y-0 lg:space-y-6">
           {/* Mobile Only Tab Navigation */}
           <div className="flex lg:hidden bg-[#1a1a1a] border-b border-white/10 sticky top-12 z-20">
              <button 
                onClick={() => setActiveTab('MARKETS')}
                className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'MARKETS' ? 'text-[#f36c21] border-b-2 border-[#f36c21]' : 'text-white/40'}`}
              >
                Markets
              </button>
              <button 
                onClick={() => setActiveTab('OPEN_BETS')}
                className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'OPEN_BETS' ? 'text-[#f36c21] border-b-2 border-[#f36c21]' : 'text-white/40'}`}
              >
                Open Bets {bets.length > 0 && `(${bets.length})`}
              </button>
           </div>

           {/* Desktop Only Header */}
           <div className="hidden lg:flex items-center justify-between border-b border-[#f36c21]/30 pb-1 mb-4">
              <div className="bg-[#f36c21] px-4 py-1.5 rounded-t-md">
                 <span className="text-white text-[11px] font-black uppercase tracking-widest">Markets</span>
              </div>
           </div>

           <div className="p-3 lg:p-0">
             {activeTab === 'MARKETS' ? (
                allMarkets.length > 0 ? (
                  <div className="space-y-8">
                    {allMarkets.map((m: any, mIdx: number) => {
                      const isBM = m.isBookmaker || m.category === 'BOOKMAKER' || m.name?.toLowerCase().includes('bookmaker');
                      const isFancy = m.category === 'FANCY';
                      
                      let runners = m.runner || m.runners || [];
                      if (!Array.isArray(runners)) runners = Object.values(runners);

                      return (
                        <div key={m.MarketId || m.marketid || m.eid || mIdx}>
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
                            marketType={m.category || 'ODDS'}
                            marketIndex={mIdx}
                            eventId={m.eid || gameData?.Event_Id || gameData?.eid || gameData?.EventId || matchId}
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
                )
             ) : (
                <div className="space-y-4 pt-2">
                  {/* UNMATCHED BETS SECTION */}
                  <div className="rounded-xl overflow-hidden border border-[#f36c21] bg-[#111]">
                    <button 
                      onClick={() => setUnmatchedOpen(!unmatchedOpen)}
                      className="w-full flex items-center justify-between px-4 py-4 bg-[#222] text-white/90 text-[13px] font-bold tracking-tight"
                    >
                      <div className="flex items-center gap-2">
                        <span className={unmatchedOpen ? 'text-[#f36c21]' : ''}>Unmatched Bets</span>
                        {bets.filter(b => !b.Type?.toLowerCase().includes('match') && b.IsMatched !== '1').length > 0 && (
                          <span className="bg-[#f36c21] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                            {bets.filter(b => !b.Type?.toLowerCase().includes('match') && b.IsMatched !== '1').length}
                          </span>
                        )}
                      </div>
                      <div className="bg-[#f36c21] rounded-full p-0.5 w-6 h-6 flex items-center justify-center transition-transform duration-300">
                        <ChevronDown size={16} className={`text-white transition-transform duration-300 ${unmatchedOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </button>
                    
                    {unmatchedOpen && (
                      <div className="px-4 pb-4 space-y-4 bg-[#111] animate-in fade-in slide-in-from-top-2 duration-300 transition-all">
                        {betsLoading ? (
                          <div className="p-12 flex justify-center"><Loader2 size={24} className="text-[#f36c21] animate-spin" /></div>
                        ) : bets.filter(b => !b.Type?.toLowerCase().includes('match') && b.IsMatched !== '1').length > 0 ? (
                          bets.filter(b => !b.Type?.toLowerCase().includes('match') && b.IsMatched !== '1').map((bet, i) => (
                            <div key={i} className="space-y-1.5 border-t border-white/5 pt-3 first:border-0 first:pt-3">
                               <div className="flex flex-col">
                                  <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">{bet.Game}</span>
                                  <span className="text-white text-[13px] font-black uppercase tracking-tight">{bet.Selection} {bet.Side === 'lay' && '(LAY)'}</span>
                               </div>
                               <table className="w-full text-left bg-white rounded-lg overflow-hidden shadow-2xl">
                                  <thead className="bg-gray-50/50">
                                    <tr className="border-b border-gray-100">
                                      <th className="py-2 px-3 text-[9px] font-black text-gray-500 uppercase tracking-widest">Odds</th>
                                      <th className="py-2 px-3 text-[9px] font-black text-gray-500 uppercase tracking-widest text-center">Stake</th>
                                      <th className="py-2 px-3 text-[9px] font-black text-gray-500 uppercase tracking-widest text-right">Profit/Liability</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr className={`text-[#333] ${bet.Side === 'back' ? 'bg-[#a5d9fe]' : 'bg-[#f8d0ce]'}`}>
                                      <td className="py-2.5 px-3 text-[13px] font-black">{bet.Rate}</td>
                                      <td className="py-2.5 px-3 text-[13px] font-black text-center">{bet.Stake}</td>
                                      <td className="py-2.5 px-3 text-[13px] font-black text-right">0</td>
                                    </tr>
                                  </tbody>
                                </table>
                            </div>
                          ))
                        ) : (
                          <div className="p-12 text-center text-white/20 text-[10px] font-black uppercase tracking-widest italic">Zero Unmatched Bets</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* MATCHED BETS SECTION */}
                  <div className="rounded-xl overflow-hidden border border-[#f36c21] bg-[#111]">
                    <button 
                      onClick={() => setMatchedOpen(!matchedOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-[#222] text-white/90 text-[13px] font-bold tracking-tight"
                    >
                      <div className="flex items-center gap-2">
                        <span className={matchedOpen ? 'text-[#f36c21]' : ''}>Matched Bets</span>
                        {bets.filter(b => b.Type?.toLowerCase().includes('match') || b.IsMatched === '1').length > 0 && (
                          <span className="bg-[#f36c21] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                            {bets.filter(b => b.Type?.toLowerCase().includes('match') || b.IsMatched === '1').length}
                          </span>
                        )}
                      </div>
                      <div className="bg-[#f36c21] rounded-full p-0.5 w-6 h-6 flex items-center justify-center transition-transform duration-300">
                        <ChevronDown size={16} className={`text-white transition-transform duration-300 ${matchedOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </button>
                    
                    {matchedOpen && (
                      <div className="px-4 pb-4 space-y-4 bg-[#111] animate-in fade-in slide-in-from-top-2 duration-300 transition-all">
                        {/* Average Odds UI */}
                        <div className="flex items-center gap-2 pb-1 opacity-80 pt-3">
                           <div className="w-3.5 h-3.5 border border-[#f36c21] rounded-sm bg-[#f36c21] flex items-center justify-center">
                              <div className="w-2 h-1 border-l-2 border-b-2 border-white transform -rotate-45 -mt-0.5"></div>
                           </div>
                           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Average Odds</span>
                        </div>

                        {betsLoading ? (
                          <div className="p-12 flex justify-center"><Loader2 size={24} className="text-[#f36c21] animate-spin" /></div>
                        ) : bets.filter(b => b.Type?.toLowerCase().includes('match') || b.IsMatched === '1').length > 0 ? (
                          bets.filter(b => b.Type?.toLowerCase().includes('match') || b.IsMatched === '1').map((bet, i) => {
                             const profit = (parseFloat(bet.Stake) * (parseFloat(bet.Rate) - 1)).toFixed(0);
                             return (
                               <div key={i} className="space-y-1.5 border-t border-white/5 pt-3 first:border-0 first:pt-1">
                                 <div className="flex flex-col">
                                   <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">{bet.Game}</span>
                                   <span className="text-white text-[13px] font-black uppercase tracking-tight">{bet.Selection} {bet.Side === 'lay' && '(LAY)'}</span>
                                 </div>
                                 <table className="w-full text-left bg-white rounded-lg overflow-hidden shadow-2xl">
                                   <thead className="bg-gray-50/50">
                                     <tr className="border-b border-gray-100">
                                       <th className="py-2 px-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">Odds</th>
                                       <th className="py-2 px-3 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Stake</th>
                                       <th className="py-2 px-3 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Profit/Liability</th>
                                     </tr>
                                   </thead>
                                   <tbody>
                                     <tr className={`text-[#333] ${bet.Side === 'back' ? 'bg-[#a5d9fe]' : 'bg-[#f8d0ce]'}`}>
                                       <td className="py-2.5 px-3 text-[13px] font-black">{bet.Rate}</td>
                                       <td className="py-2.5 px-3 text-[13px] font-black text-center">{bet.Stake}</td>
                                       <td className="py-2.5 px-3 text-[13px] font-black text-right">{profit}</td>
                                     </tr>
                                   </tbody>
                                 </table>
                               </div>
                             );
                          })
                        ) : (
                          <div className="p-12 text-center text-white/20 text-[10px] font-black uppercase tracking-widest italic">Zero Matched Bets</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
             )}
           </div>
        </div>
      </div>

      <div className="hidden lg:block w-[320px] xl:w-[360px] sticky top-0 h-screen overflow-y-auto border-l border-white/5 bg-[#1a1a1a]">
        <BetContainer />
      </div>
    </div>
  )
}
