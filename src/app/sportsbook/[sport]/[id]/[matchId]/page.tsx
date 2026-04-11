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
import { useSnackbarStore } from '@/store/snackbarStore'
import { pusherClient } from '@/utils/pusher'

const OddsBox = ({
  val,
  vol,
  type,
  intensity = 'high',
  onClick,
  isSuspended = false,
  className = ""
}: {
  val: string,
  vol: string,
  type: 'back' | 'lay',
  intensity?: 'low' | 'medium' | 'high',
  onClick?: () => void,
  isSuspended?: boolean,
  className?: string
}) => {
  const [blink, setBlink] = useState(false)
  const prevValue = useRef(val)

  useEffect(() => {
    if (!isSuspended && prevValue.current !== val && val !== '0' && val !== '0.00' && val !== '-' && parseFloat(val) > 0) {
      setBlink(true)
      const timer = setTimeout(() => setBlink(false), 300)
      prevValue.current = val
      return () => clearTimeout(timer)
    }
    prevValue.current = val
  }, [val, isSuspended])

  const bgColor = type === 'back'
    ? (intensity === 'high' ? 'bg-[#a5d9fe]' : intensity === 'medium' ? 'bg-[#bce4ff]' : 'bg-[#d1eeff]')
    : (intensity === 'high' ? 'bg-[#f8d0ce]' : intensity === 'medium' ? 'bg-[#fbe3e2]' : 'bg-[#fff0f0]')

  const isEmpty = !val || val === '0' || val === '0.00' || val === '-' || parseFloat(val) === 0
  const isDisabled = isEmpty || isSuspended

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`w-[54px] lg:w-[60px] h-[38px] rounded-[4px] flex flex-col items-center justify-center transition-all shadow-sm border border-transparent ${bgColor} ${isEmpty ? '  cursor-not-allowed' : ''} ${blink ? 'animate-rate-change' : ''} ${!isDisabled ? 'hover:brightness-95 active:scale-95' : 'cursor-not-allowed'} ${className}`}
    >
      <span className={`text-[12px] lg:text-[13px] font-black text-[#2e2e2e] leading-none mb-0.5 tracking-tight`}>{val || '0'}</span>
      <span className="text-[8.5px] lg:text-[9px] text-[#555] font-bold leading-none truncate max-w-full px-0.5">{vol || '0'}</span>
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

  const getRunnerRates = (runnerId: string | number, rIdx: number, specificMarketId?: string, fullMarket?: any) => {
    const primaryId = (specificMarketId || marketId)?.toString()
    const altIds = [primaryId, fullMarket?.eid?.toString(), fullMarket?.ekey?.toString()].filter(Boolean)
    
    // Find the first available rate data among possible IDs
    let rateData = null
    for (const id of altIds) {
      if (liveRates[id as string]) {
        rateData = liveRates[id as string]
        break
      }
    }
    
    let isRunnerSuspended = false

    if (rateData) {
      const hasRunners = rateData.runners || rateData.runner || rateData.rates
      const isFancyOrLine = marketType === 'FANCY' || marketType === 'LINE'

      // For Fancy/Line markets, if prices are missing, check if they are in flat fields
      if (isFancyOrLine && !hasRunners) {
        if (!rateData.no1 && !rateData.no2 && !rateData.rate && rateData.rate !== 0) {
          isRunnerSuspended = true
        }
      }

      if (!hasRunners || isFancyOrLine) {
        // Check both nested runner and flat fields
        const r = (Array.isArray(hasRunners) && hasRunners.length > 0 ? hasRunners[0] : (hasRunners && typeof hasRunners === 'object' ? Object.values(hasRunners)[0] : null)) || rateData;
        
        // Extract prices with more flexibility
        const getVal = (obj: any, keys: string[]) => {
          for (const k of keys) if (obj[k] !== undefined && obj[k] !== '') return obj[k];
          return '';
        }

        // Swapped as per user request (no1 -> YES, no2 -> NO)
        let bp = getVal(r, ['no1', 'no2', 'backPrice1', 'BackPrice1', 'rate']);
        let lp = getVal(r, ['no2', 'no1', 'layPrice1', 'LayPrice1', 'rate']);
        let bs = getVal(r, ['valy', 'valn', 'size']);
        let ls = getVal(r, ['valn', 'valy', 'size']);

        // Check for exchange-style prices if flat ones are missing
        if (!bp && (r.ex?.availableToBack?.[0]?.price || r.back?.[0]?.price)) {
          bp = r.ex?.availableToBack?.[0]?.price || r.back?.[0]?.price;
          bs = r.ex?.availableToBack?.[0]?.size || r.back?.[0]?.size;
        }
        if (!lp && (r.ex?.availableToLay?.[0]?.price || r.lay?.[0]?.price)) {
          lp = r.ex?.availableToLay?.[0]?.price || r.lay?.[0]?.price;
          ls = r.ex?.availableToLay?.[0]?.size || r.lay?.[0]?.size;
        }

        // Apply rounding for LINE/FANCY markets as requested
        const formatP = (v: any) => {
          if (!v || !isFancyOrLine) return v;
          const num = parseFloat(v);
          return isNaN(num) ? v : Math.round(num).toString();
        };

        if (bp || lp) {
          return {
            back: { p1: formatP(bp), v1: bs.toString(), p2: '', v2: '', p3: '', v3: '' },
            lay: { p1: formatP(lp), v1: ls.toString(), p2: '', v2: '', p3: '', v3: '' },
            isRunnerSuspended: isRunnerSuspended
          }
        }
      }
    }

    const runnersData = rateData?.runner || rateData?.runners || rateData?.rates || []
    const runnerArr = Array.isArray(runnersData) ? runnersData : Object.values(runnersData)

    let r = runnerArr.find((item: any) =>
      (item.selectionId && item.selectionId.toString() === runnerId.toString()) ||
      (item.id && item.id.toString() === runnerId.toString()) ||
      (item.team === (rIdx === 0 ? 'A' : (rIdx === 1 ? 'B' : 'C')))
    )
    if (!r) r = runnerArr[rIdx]

    // Check runner-level suspension status
    if (r && (r.selectionStatus === 'SUSPENDED' || r.status === 'SUSPENDED' || r.selectionStatus === '1' || r.status === '1')) {
      isRunnerSuspended = true
    }

    const getPrices = (r: any, type: 'back' | 'lay') => {
      if (!r) return { p1: '', v1: '', p2: '', v2: '', p3: '', v3: '' };
      const exData = type === 'back' ? (r.back || r.availableToBack || r.ex?.availableToBack) : (r.lay || r.availableToLay || r.ex?.availableToLay);

      if (exData) {
        const arr = Array.isArray(exData) ? exData : Object.values(exData);
        return {
          p1: (arr[0]?.rate || arr[0]?.price || '')?.toString(),
          v1: (arr[0]?.size || '')?.toString(),
          p2: (arr[1]?.rate || arr[1]?.price || '')?.toString(),
          v2: (arr[1]?.size || '')?.toString(),
          p3: (arr[2]?.rate || arr[2]?.price || '')?.toString(),
          v3: (arr[2]?.size || '')?.toString(),
        };
      }

      // Logic for flat fields (no1, no2, BackPrice1, etc.)
      if (marketType === 'BOOKMAKER') {
        // Bookmaker: no1 is typically BACK, no2 is Typically LAY
        return {
          p1: (type === 'back' ? (r.no1 ?? r.BackPrice1 ?? r.rate) : (r.no2 ?? r.LayPrice1 ?? r.rate))?.toString() || '',
          v1: (type === 'back' ? (r.valy ?? r.size) : (r.valn ?? r.size))?.toString() || '',
          p2: '', v2: '', p3: '', v3: ''
        };
      }

      // Default/Fancy Logic: no2 is BACK/YES, no1 is LAY/NO
      return {
        p1: (type === 'back' ? (r.no2 ?? r.BackPrice1 ?? r.rate) : (r.no1 ?? r.LayPrice1 ?? r.rate))?.toString() || '',
        v1: (type === 'back' ? (r.valy ?? r.size) : (r.valn ?? r.size))?.toString() || '',
        p2: '', v2: '', p3: '', v3: ''
      };
    };
    return { back: getPrices(r, 'back'), lay: getPrices(r, 'lay'), isRunnerSuspended: isRunnerSuspended }
  }

  const isFancyOrLine = marketType === 'FANCY' || marketType === 'LINE' || marketName.toUpperCase() === 'FANCY' || marketName.toUpperCase() === 'LINE MARKET'
  const isFancyGroup = marketName.toUpperCase() === 'FANCY' || marketName.toUpperCase() === 'LINE MARKET'
  const isMatchOdd = !isFancyOrLine && (
    marketType === 'ODDS' ||
    marketType === 'BOOKMAKER' ||
    marketType === 'EXTRA' ||
    marketName.toUpperCase().includes('MATCH') ||
    marketName.toUpperCase().includes('WINNER') ||
    marketName.toUpperCase().includes('TIE')
  )

  return (
    <div className="bg-white rounded-b-[12px] shadow-sm border border-[#f36c21] mt-8 relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
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
              {marketName}
            </span>
          </div>
        </div>
        <div className="flex-1 h-full flex items-center justify-end pr-4 gap-3 z-0">
          <Star size={18} className="text-[#ffd700] fill-none stroke-[2px]" />
        </div>
      </div>

      <div className="bg-[#333] flex items-center justify-between px-2 lg:px-3 h-10 border-t border-white/5">
        <div className="flex items-center gap-2">
          {isFancyGroup && <span className="text-white/40 ml-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></span>}
        </div>
        <div className="flex mr-1 md:mr-0 items-center justify-end flex-1 gap-1 md:gap-2 h-full">
          {/* BACK / NO Group */}
          <div className={`flex justify-end gap-0.5 md:gap-2 ${(isMatchOdd || isFancyGroup) ? 'w-[110px] md:w-[196px]' : 'w-[54px] md:w-[60px]'}`}>
            {/* Position label at the 3rd cell on desktop/tablet for 3-cell wide markets */}
            {(isMatchOdd || isFancyGroup) && (
              <>
                <div className="hidden md:block w-[60px]" />
                <div className="hidden md:block w-[60px]" />
              </>
            )}
            <div className="w-[54px] md:w-[60px] flex items-center justify-center">
              <span className="text-[10px] font-black text-white uppercase tracking-widest">{isFancyGroup ? 'NO' : 'Back'}</span>
            </div>
          </div>

          {/* LAY / YES Group */}
          <div className={`flex justify-start gap-0.5 md:gap-2 ${(isMatchOdd || isFancyGroup) ? 'w-[110px] md:w-[196px]' : 'w-[54px] md:w-[60px]'}`}>
            {/* Position label at the 1st cell on desktop/tablet for 3-cell wide markets */}
            <div className="w-[54px] md:w-[60px] flex items-center justify-center">
              <span className="text-[10px] font-black text-white uppercase tracking-widest">{isFancyGroup ? 'YES' : 'Lay'}</span>
            </div>
            {(isMatchOdd || isFancyGroup) && (
              <>
                <div className="hidden md:block w-[60px]" />
                <div className="hidden md:block w-[60px]" />
              </>
            )}
          </div>
        </div>
      </div>

      {!isCollapsed && (
        <div className="overflow-x-auto lg:overflow-visible rounded-b-[11px]">
          <table className="w-full border-collapse">
            <tbody className="divide-y divide-gray-100">
              {(Array.isArray(runners) ? runners : Object.values(runners || {})).length > 0 ? (Array.isArray(runners) ? runners : Object.values(runners || {})).map((runner: any, rIdx: number) => {
                const mId = isFancyGroup ? (runner.MarketId || runner.marketid || runner.eid) : marketId
                const runnerId = isFancyGroup ? 0 : (runner.selectionId || runner.SelectionId || runner.id || runner.sid || rIdx)

                const rateData = liveRates[mId]
                const { back, lay, isRunnerSuspended } = getRunnerRates(runnerId, rIdx, mId, runner)
                const runnerName = isFancyGroup ? (runner.name || runner.RunnerName) : (runner.name || runner.RunnerName || (marketType === 'FANCY' ? 'FANCY ODDS' : `Runner ${rIdx + 1}`))

                const isMarketSuspended = rateData?.status === 'SUSPENDED' ||
                  rateData?.suspended === 'Y' ||
                  rateData?.suspended === '1' ||
                  rateData?.active === 'No' ||
                  rateData?.status1 === '1' ||
                  rateData?.ball_run === 'Y' ||
                  rateData?.status1 === '2'

                const isSuspended = isMarketSuspended || !!rateData?.Msg || isRunnerSuspended

                const handleAddBet = (odds: string, side: 'back' | 'lay') => {
                  if (isSuspended || !odds || odds === '-' || odds === '0' || odds === '0.00') return;
                  addSelection({
                    id: `${mId}-${runnerId}-${side}`,
                    matchId: eventId.toString(),
                    marketId: mId.toString(),
                    eventId: eventId.toString(),
                    selectionId: runnerId.toString(),
                    matchName: matchName,
                    marketName: isFancyGroup ? runnerName : marketName,
                    selectionName: isFancyGroup ? (side === 'back' ? 'Yes' : 'No') : runnerName,
                    odds: parseFloat(odds),
                    betType: side,
                    marketType: isFancyGroup ? 'FANCY' : (marketType || 'ODDS'),
                    marketIndex: rIdx,
                    runnersCount: runners.length || 1
                  })
                }
                const isSelectedOnMobile = selections.some(s => s.id.startsWith(`${mId}-${runnerId}`))
                const suspensionMsg = rateData?.ball_run === 'Y' ? 'BALL RUNNING' : (rateData?.Msg || 'SUSPENDED')

                return (
                  <React.Fragment key={mId + '-' + runnerId}>
                    <tr className="hover:bg-gray-50/50 transition-colors group relative border-b border-gray-100 last:border-0">
                      <td className="py-3 px-3 lg:px-4">
                        <div className="flex flex-col">
                          <span className="text-[12px] lg:text-[13px] font-bold text-gray-800 tracking-tight transition-colors uppercase">
                            {runnerName}
                          </span>
                        </div>
                      </td>
                      <td className="p-1 px-2 relative min-w-[200px]">
                        <div className="flex justify-end gap-1 lg:gap-2">
                          <div className="relative">
                            <div className="flex gap-0.5 lg:gap-1 transition-all duration-300">
                              {/* LEFT GROUP (BACK for ODDS, NO for FANCY) */}
                              <div className={`flex items-center gap-0.5 md:gap-2 ${(isMatchOdd || isFancyGroup) ? 'w-[110px] md:w-[196px]' : ''}`}>
                                {(isMatchOdd || isFancyGroup) && (
                                  <>
                                    {isMatchOdd ? (
                                      <>
                                        <OddsBox className="hidden md:flex" val={back.p3} vol={back.v3} type="back" intensity="low" onClick={() => handleAddBet(back.p3, 'back')} isSuspended={isSuspended} />
                                        <OddsBox className="hidden md:flex" val={back.p2} vol={back.v2} type="back" intensity="medium" onClick={() => handleAddBet(back.p2, 'back')} isSuspended={isSuspended} />
                                      </>
                                    ) : (
                                      <>
                                        <div className="hidden md:block w-[60px]" />
                                        <div className="hidden md:block w-[60px]" />
                                      </>
                                    )}
                                  </>
                                )}
                                <OddsBox
                                  val={isFancyGroup ? lay.p1 : back.p1}
                                  vol={isFancyGroup ? lay.v1 : back.v1}
                                  type={isFancyGroup ? 'lay' : 'back'}
                                  intensity="high"
                                  onClick={() => handleAddBet(isFancyGroup ? lay.p1 : back.p1, isFancyGroup ? 'lay' : 'back')}
                                  isSuspended={isSuspended}
                                />
                              </div>

                              {/* RIGHT GROUP (LAY for ODDS, YES for FANCY) */}
                              <div className={`flex items-center gap-0.5 md:gap-2 ${(isMatchOdd || isFancyGroup) ? 'w-[110px] md:w-[196px]' : ''}`}>
                                <OddsBox
                                  val={isFancyGroup ? back.p1 : lay.p1}
                                  vol={isFancyGroup ? back.v1 : lay.v1}
                                  type={isFancyGroup ? 'back' : 'lay'}
                                  intensity="high"
                                  onClick={() => handleAddBet(isFancyGroup ? back.p1 : lay.p1, isFancyGroup ? 'back' : 'lay')}
                                  isSuspended={isSuspended}
                                />
                                {(isMatchOdd || isFancyGroup) && (
                                  <>
                                    {isMatchOdd ? (
                                      <>
                                        <OddsBox className="hidden md:flex" val={lay.p2} vol={lay.v2} type="lay" intensity="medium" onClick={() => handleAddBet(lay.p2, 'lay')} isSuspended={isSuspended} />
                                        <OddsBox className="hidden md:flex" val={lay.p3} vol={lay.v3} type="lay" intensity="low" onClick={() => handleAddBet(lay.p3, 'lay')} isSuspended={isSuspended} />
                                      </>
                                    ) : (
                                      <>
                                        <div className="hidden md:block w-[60px]" />
                                        <div className="hidden md:block w-[60px]" />
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>

                            {isSuspended && (
                              <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                                <div className="absolute inset-0 bg-[#212121] opacity-[0.46]"></div>
                                <div className="relative z-10 bg-[#e0e0e0] px-6 py-[6px] flex items-center justify-center drop-shadow-sm whitespace-nowrap">
                                  <span className="text-[#0d47a1] text-[13px] font-medium uppercase tracking-wide leading-none">
                                    {suspensionMsg}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                    {isSelectedOnMobile && selections[0] && (
                      <tr className="lg:hidden animate-in slide-in-from-top-4 duration-300">
                        <td colSpan={2} className="p-2 pt-0 bg-white">
                          <BetSlipForm selection={selections[0]} onClose={clearAll} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              }) : (
                <tr className="border-b border-gray-100 last:border-0 text-center py-8">
                  <td colSpan={2} className="py-8 text-gray-400 text-[11px] font-bold uppercase tracking-widest">No Active Markets</td>
                </tr>
              )}
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
  const matchId = params.matchId as string
  const [activeTab, setActiveTab] = useState<'MARKETS' | 'OPEN_BETS'>('MARKETS')
  const [gameData, setGameData] = useState<any>(null)
  const [liveOdds, setLiveOdds] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isFav, setIsFav] = useState(false)
  const [favLoading, setFavLoading] = useState(false)
  const showSnackbar = useSnackbarStore(state => state.show)
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
    } catch (err) { console.error('Failed to fetch bets:', err) } finally { setBetsLoading(false) }
  }, [user?.loginToken, setGlobalBets])

  useEffect(() => { if (activeTab === 'OPEN_BETS') fetchBets() }, [activeTab, fetchBets])

  const fetchGameData = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setIsLoading(true)
      let res;
      if (user?.loginToken) res = await marketController.getGameDataLogin(user.loginToken, matchId)
      else res = await marketController.getGameData(matchId)
      if (res && typeof res === 'object' && !res.error) {
        let parsed = typeof res === 'string' ? JSON.parse(res) : res
        if (parsed && parsed["0"]) parsed = parsed["0"];
        setGameData(parsed)
        return parsed
      }
    } catch (err) { } finally { if (isInitial) setIsLoading(false) }
    return null
  }, [matchId, user?.loginToken])

  useEffect(() => { fetchGameData(true) }, [fetchGameData])

  useEffect(() => {
    if (gameData) {
      setIsFav(gameData.IsFavorite === '1' || gameData.isFavorite === 'Yes' || gameData.fav === '1')
    }
  }, [gameData])

  const handleToggleFav = async () => {
    if (!user?.loginToken) {
      showSnackbar('Please login to add favorites', 'error')
      return
    }
    try {
      setFavLoading(true)
      const res = await marketController.toggleFavourite(user.loginToken, matchId)
      if (res && res.error === '0') {
        setIsFav(prev => !prev)
        showSnackbar(res.msg || (isFav ? 'Removed from favorites' : 'Added to favorites'), 'success')
      } else {
        showSnackbar(res?.msg || 'Failed to update favorite', 'error')
      }
    } catch (err) {
      showSnackbar('Something went wrong', 'error')
    } finally {
      setFavLoading(false)
    }
  }

  useEffect(() => {
    if (!matchId) return

    // 🔌 Setup Pusher Real-time Listener
    const channel = pusherClient.subscribe('eventrefersh')

    channel.bind('my-event', (msg: any) => {
      // The developer said msg[0] contains the gid
      const eventGid = msg[0]?.toString()
      if (eventGid === matchId.toString()) {
        fetchGameData() // Trigger a structural refresh
      }
    })

    return () => {
      pusherClient.unsubscribe('eventrefersh')
    }
  }, [matchId, fetchGameData])

  useEffect(() => {
    if (!matchId) return
    let isMounted = true
    let timeoutId: NodeJS.Timeout

    const pollOdds = async () => {
      // Structure refresh is now handled by Pusher
      // But we still need to poll for individual Market Rates (odds) 
      // as Pusher here only notifies about structural changes (reference refresh)

      const dataToUse = gameData
      if (!dataToUse) {
        // If we don't have gameData yet, try to fetch it
        await fetchGameData()
        if (isMounted) timeoutId = setTimeout(pollOdds, 2000)
        return
      }

      const marketsToPoll: any[] = []
      const categories = ['ODDS', 'BOOKMAKER', 'FANCY', 'events', 'EXTRA']

      categories.forEach(cat => {
        const items = dataToUse[cat] || []
        const itemArr = Array.isArray(items) ? items : Object.values(items)
        itemArr.forEach((m: any) => {
          const mid = m.MarketId || m.marketid || m.eid
          if (mid) {
            marketsToPoll.push({
              gid: matchId,
              MarketId: mid.toString(),
              eventid: matchId,
              gkey: m.gkey || '',
              ekey: m.ekey || ''
            })
          }
        })
      })

      if (marketsToPoll.length > 0) {
        const oddsMap: Record<string, any> = {}
        const batchSize = 25

        for (let i = 0; i < marketsToPoll.length; i += batchSize) {
          const batch = marketsToPoll.slice(i, i + batchSize)
          await Promise.all(batch.map(async (m) => {
            if (!isMounted) return
            try {
              let res;
              if (!m.MarketId && m.gkey && m.ekey) {
                res = await marketController.getMultiMarketRate('0', [{ gkey: m.gkey, ekey: m.ekey }])
              } else {
                res = await marketController.getGameRate(m)
              }

              if (res && typeof res === 'object' && !res.error) {
                const mid = m.MarketId, ekey = m.ekey, gid = m.gid;
                let finalData = null;

                // Enhanced recursive function to find market data by ID
                const findData = (obj: any, currentDepth = 0): any => {
                  if (!obj || typeof obj !== 'object' || currentDepth > 5) return null;
                  
                  // 1. Direct match by key
                  if (ekey && obj[ekey]) return obj[ekey];
                  if (mid && obj[mid]) return obj[mid];
                  
                  // 2. Check if the object itself is the market we want
                  const objId = obj.MarketId || obj.marketId || obj.eid || obj.ekey || obj.marketid || obj.id;
                  if (mid && objId?.toString() === mid?.toString()) return obj;
                  if (ekey && objId?.toString() === ekey?.toString()) return obj;

                  // 3. Search children (handle arrays and objects)
                  const keys = Object.keys(obj);
                  for (const k of keys) {
                    let val = obj[k];
                    if (typeof val === 'string' && (val.startsWith('{') || val.startsWith('['))) {
                      try { val = JSON.parse(val) } catch (e) { }
                    }
                    
                    if (typeof val === 'object' && val !== null) {
                      // Check this object
                      const subId = val.MarketId || val.marketId || val.eid || val.ekey || val.marketid || val.id;
                      if (mid && subId?.toString() === mid?.toString()) return val;
                      if (ekey && subId?.toString() === ekey?.toString()) return val;
                      
                      // If it's an array, search its elements
                      if (Array.isArray(val)) {
                        for (const item of val) {
                          let pItem = item;
                          if (typeof item === 'string') try { pItem = JSON.parse(item) } catch (e) { }
                          const itemId = pItem?.MarketId || pItem?.marketId || pItem?.eid || pItem?.ekey || pItem?.id;
                          if (mid && itemId?.toString() === mid?.toString()) return pItem;
                          if (ekey && itemId?.toString() === ekey?.toString()) return pItem;
                          
                          // Recurse into array item if it's an object
                          if (typeof pItem === 'object' && pItem !== null) {
                            const found = findData(pItem, currentDepth + 1);
                            if (found) return found;
                          }
                        }
                      } else {
                        // Recurse
                        const found = findData(val, currentDepth + 1);
                        if (found) return found;
                      }
                    }
                  }
                  return null;
                };

                finalData = findData(res);

                if (finalData) {
                  if (typeof finalData === 'string') try { finalData = JSON.parse(finalData) } catch (e) { }
                  oddsMap[mid] = finalData;
                }
              }
            } catch (e) { }
          }))
        }
        if (isMounted) setLiveOdds(prev => ({ ...prev, ...oddsMap }))
      }

      if (isMounted) timeoutId = setTimeout(pollOdds, 1500)
    }

    pollOdds()
    return () => { isMounted = false; if (timeoutId) clearTimeout(timeoutId) }
  }, [matchId, gameData, fetchGameData])

  const matchName = useMemo(() => {
    if (!gameData) return 'Event Detail'
    return gameData.GameName || gameData.eventName || (gameData.Team1 ? `${gameData.Team1} V ${gameData.Team2}` : 'Live Match')
  }, [gameData])

  const allMarkets = useMemo(() => {
    if (!gameData) return []
    const raw = [
      ...(gameData.ODDS ? (Array.isArray(gameData.ODDS) ? gameData.ODDS : Object.values(gameData.ODDS)).map((m: any) => ({ ...m, category: 'ODDS' })) : []),
      ...(gameData.BOOKMAKER ? (Array.isArray(gameData.BOOKMAKER) ? gameData.BOOKMAKER : Object.values(gameData.BOOKMAKER)).map((m: any) => ({ ...m, category: 'BOOKMAKER' })) : []),
      ...(gameData.FANCY ? (Array.isArray(gameData.FANCY) ? gameData.FANCY : Object.values(gameData.FANCY)).map((m: any) => ({ ...m, category: 'FANCY' })) : []),
      ...(gameData.events ? (Array.isArray(gameData.events) ? gameData.events : Object.values(gameData.events)).map((m: any) => ({ ...m, category: m.Type || 'ODDS' })) : []),
      ...(gameData.EXTRA ? (Array.isArray(gameData.EXTRA) ? gameData.EXTRA : Object.values(gameData.EXTRA)).map((m: any) => ({ ...m, category: 'EXTRA' })) : [])
    ]
    return raw.filter((m, i, self) => {
      if (!m) return false;
      const uid = (m.MarketId || m.marketid || m.eid) + '-' + (m.eid || i);
      return self.findIndex(t => ((t.MarketId || t.marketid || t.eid) + '-' + (t.eid || self.indexOf(t))) === uid) === i;
    })
  }, [gameData]);

  return (
    <div className="flex-1 min-h-screen bg-[#111] flex flex-col lg:flex-row lg:gap-4 lg:bg-transparent">
      <div className="flex-1 flex flex-col min-w-0 bg-[#111] rounded-lg overflow-hidden">
        <div className="bg-[#1a1a1a] border-b border-white/5 px-2 lg:px-4 h-12 flex items-center justify-between relative z-20">
          <div className="flex items-center gap-2 lg:gap-4 overflow-hidden">
            <button onClick={() => router.back()} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all flex-shrink-0"><ChevronLeft size={20} /></button>
            <h1 className="text-white text-[12px] lg:text-[14px] font-black uppercase tracking-wider truncate flex items-center gap-2">
              {matchName}
              <button
                onClick={handleToggleFav}
                disabled={favLoading}
                className={`transition-all ${favLoading ? 'opacity-50 cursor-wait' : 'hover:scale-110 active:scale-95'}`}
              >
                {favLoading ? (
                  <Loader2 size={16} className="text-yellow-500 animate-spin" />
                ) : (
                  <Star
                    size={18}
                    className={`transition-colors ${isFav ? 'text-yellow-500 fill-yellow-500' : 'text-white/40 fill-none'}`}
                  />
                )}
              </button>
            </h1>
          </div>
        </div>
        <div className="p-0 lg:p-6 space-y-0 lg:space-y-6">
          <div className="flex lg:hidden bg-[#1a1a1a] border-b border-white/10 relative z-20">
            <button onClick={() => setActiveTab('MARKETS')} className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'MARKETS' ? 'text-[#f36c21] border-b-2 border-[#f36c21]' : 'text-white/40'}`}>Markets</button>
            <button onClick={() => setActiveTab('OPEN_BETS')} className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'OPEN_BETS' ? 'text-[#f36c21] border-b-2 border-[#f36c21]' : 'text-white/40'}`}>Open Bets {bets.length > 0 && `(${bets.length})`}</button>
          </div>
          <div className="p-3 lg:p-0">
            {activeTab === 'MARKETS' ? (
              <div className="space-y-4">
                {/* 1. ODDS Markets */}
                {allMarkets.filter(m => m.category === 'ODDS').map((m: any, mIdx: number) => {
                  let runners = m.runner || m.runners || [];
                  if (!Array.isArray(runners)) runners = Object.values(runners);
                  return <MarketTable key={m.MarketId || m.eid || mIdx} marketName={m.name || 'Match Odds'} runners={runners} marketId={m.MarketId || m.eid || m.marketid} liveRates={liveOdds} matchName={matchName} marketType="ODDS" marketIndex={mIdx} eventId={m.eid || matchId} />
                })}

                {/* 2. BOOKMAKER Markets */}
                {allMarkets.filter(m => m.category === 'BOOKMAKER').map((m: any, mIdx: number) => {
                  let runners = m.runner || m.runners || [];
                  if (!Array.isArray(runners)) runners = Object.values(runners);
                  return <MarketTable key={m.MarketId || m.eid || mIdx} marketName={m.name || 'Match Winner (Bookmaker)'} runners={runners} marketId={m.MarketId || m.eid || m.marketid} liveRates={liveOdds} matchName={matchName} marketType="BOOKMAKER" marketIndex={mIdx} eventId={m.eid || matchId} />
                })}

                {/* 3. FANCY Group */}
                {allMarkets.filter(m => m.category === 'FANCY').length > 0 && (
                  <MarketTable marketName="FANCY" runners={allMarkets.filter(m => m.category === 'FANCY')} marketId="FANCY_GROUP" liveRates={liveOdds} matchName={matchName} marketType="FANCY" marketIndex={999} eventId={matchId} />
                )}

                {/* 4. LINE Group */}
                {allMarkets.filter(m => m.category === 'LINE').length > 0 && (
                  <MarketTable marketName="LINE MARKET" runners={allMarkets.filter(m => m.category === 'LINE')} marketId="LINE_GROUP" liveRates={liveOdds} matchName={matchName} marketType="LINE" marketIndex={998} eventId={matchId} />
                )}

                {/* 4. EXTRA Markets (e.g. Tied Match) */}
                {allMarkets.filter(m => m.category === 'EXTRA').map((m: any, mIdx: number) => {
                  let runners = m.runner || m.runners || [];
                  if (!Array.isArray(runners)) runners = Object.values(runners);
                  return <MarketTable key={m.MarketId || m.eid || mIdx} marketName={m.name || 'Extra Markets'} runners={runners} marketId={m.MarketId || m.eid || m.marketid} liveRates={liveOdds} matchName={matchName} marketType="EXTRA" marketIndex={mIdx} eventId={m.eid || matchId} />
                })}

                {/* 5. Others */}
                {allMarkets.filter(m => !['ODDS', 'BOOKMAKER', 'FANCY', 'EXTRA'].includes(m.category)).map((m: any, mIdx: number) => {
                  let runners = m.runner || m.runners || [];
                  if (!Array.isArray(runners)) runners = Object.values(runners);
                  return <MarketTable key={m.MarketId || m.eid || mIdx} marketName={m.name || m.category} runners={runners} marketId={m.MarketId || m.eid || m.marketid} liveRates={liveOdds} matchName={matchName} marketType={m.category} marketIndex={mIdx} eventId={m.eid || matchId} />
                })}
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                {[{ title: 'Unmatched Bets', items: bets.filter(b => !b.Type?.toLowerCase().includes('match') && b.IsMatched !== '1'), open: unmatchedOpen, setOpen: setUnmatchedOpen },
                { title: 'Matched Bets', items: bets.filter(b => b.Type?.toLowerCase().includes('match') || b.IsMatched === '1'), open: matchedOpen, setOpen: setMatchedOpen }].map((sec, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-[#f36c21] bg-[#111]">
                    <button onClick={() => sec.setOpen(!sec.open)} className="w-full flex items-center justify-between px-4 py-4 bg-[#222] text-white/90 text-[13px] font-bold tracking-tight">
                      <div className="flex items-center gap-2"><span className={sec.open ? 'text-[#f36c21]' : ''}>{sec.title}</span>{sec.items.length > 0 && <span className="bg-[#f36c21] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{sec.items.length}</span>}</div>
                      <div className="bg-[#f36c21] rounded-full p-0.5 w-6 h-6 flex items-center justify-center transition-transform duration-300"><ChevronDown size={16} className={`text-white transition-transform duration-300 ${sec.open ? 'rotate-180' : ''}`} /></div>
                    </button>
                    {sec.open && (
                      <div className="px-4 pb-4 space-y-4 bg-[#111]">
                        {betsLoading ? <div className="p-12 flex justify-center"><Loader2 size={24} className="text-[#f36c21] animate-spin" /></div> :
                          sec.items.length > 0 ? sec.items.map((bet, idx) => (
                            <div key={idx} className="space-y-1.5 border-t border-white/5 pt-3 first:border-0 first:pt-1">
                              <div className="flex flex-col"><span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">{bet.Game}</span><span className="text-white text-[13px] font-black uppercase tracking-tight">{bet.Selection} {bet.Side === 'lay' && '(LAY)'}</span></div>
                              <table className="w-full text-left bg-white rounded-lg overflow-hidden shadow-2xl">
                                <thead className="bg-gray-50/50"><tr className="border-b border-gray-100"><th className="py-2 px-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">Odds</th><th className="py-2 px-3 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Stake</th><th className="py-2 px-3 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Profit/Liability</th></tr></thead>
                                <tbody><tr className={`text-[#333] ${bet.Side === 'back' ? 'bg-[#a5d9fe]' : 'bg-[#f8d0ce]'}`}><td className="py-2.5 px-3 text-[13px] font-black">{bet.Rate}</td><td className="py-2.5 px-3 text-[13px] font-black text-center">{bet.Stake}</td><td className="py-2.5 px-3 text-[13px] font-black text-right">{(parseFloat(bet.Stake) * (parseFloat(bet.Rate) - 1)).toFixed(0)}</td></tr></tbody>
                              </table>
                            </div>
                          )) : <div className="p-12 text-center text-white/20 text-[11px] font-black uppercase tracking-[0.2em] italic">No {sec.title}</div>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {user && (
        <div className="hidden lg:block w-[480px] sticky top-[80px] max-h-[calc(100vh-100px)] overflow-y-auto self-start shrink-0 lg:border-none lg:rounded-lg lg:overflow-hidden border-l border-white/5 bg-[#111] z-30">
          <BetContainer />
        </div>
      )}
    </div>
  )
}
