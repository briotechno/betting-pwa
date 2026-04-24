'use client'
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Star, Loader2, ChevronDown, ChevronUp, Info, Megaphone, X, AlertCircle, Clock, Play } from 'lucide-react'
import { toTitleCase, formatTime12h } from '@/utils/format'
import BetContainer from '@/components/sportsbook/BetContainer'
import { marketController } from '@/controllers/market/marketController'
import { useBetSlipStore } from '@/store/betSlipStore'
import BetSlipForm from '@/components/sportsbook/BetSlipForm'
import { useAuthStore } from '@/store/authStore'
import { useSnackbarStore } from '@/store/snackbarStore'
import { bettingController } from '@/controllers/betting/bettingController'
import CashoutButton from '@/components/sportsbook/CashoutButton'

const sportsList = [
  { id: 'Cricket', name: 'Cricket', count: 14, icon: '/sports-icons/cricket.13c45ec.png' },
  { id: 'Football', name: 'Football', count: 29, icon: '/sports-icons/soccer.edef26e.png' },
  { id: 'Tennis', name: 'Tennis', count: 41, icon: '/sports-icons/tennis.61acaee.png' },
]

const OddsBox = ({ val, vol, type, intensity = 'high', onClick }: { val: string, vol: string, type: 'back' | 'lay', intensity?: 'low' | 'medium' | 'high', onClick?: () => void }) => {
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
      className={`w-[58px] lg:w-[60px] h-[38px] rounded-[4px] flex flex-col items-center justify-center transition-all shadow-sm border border-transparent ${isEmpty ? 'bg-[#f2f2f2] opacity-60' : bgColor} ${blink ? 'animate-rate-change' : ''} hover:brightness-95 active:scale-95`}
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
  isUpcoming,
  startTime,
  isWinnerType,
  matchId,
  matchName,
  eventId,
  isFavourite = false,
  min,
  max,
  msg,
  onCashout,
  isCashoutLoading,
  onOpenFancyChart,
  marketType
}: {
  marketName: string,
  runners: any[],
  marketId: string,
  liveRates: any,
  isUpcoming: boolean,
  startTime: string,
  isWinnerType?: boolean,
  matchId: string,
  matchName: string,
  eventId: string,
  isFavourite?: boolean,
  min?: string | number,
  max?: string | number,
  msg?: string,
  onCashout?: (mId: string, mName: string, runners: any[], mType: string) => void,
  isCashoutLoading?: boolean,
  onOpenFancyChart?: (marketId: string, runnerName: string) => void,
  marketType?: string
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [favourite, setFavourite] = useState(isFavourite)
  const [favLoading, setFavLoading] = useState(false)
  const { user } = useAuthStore()
  const router = useRouter()
  const params = useParams()

  const handleToggleFav = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user?.loginToken) {
      router.push('/auth/login')
      return
    }

    try {
      setFavLoading(true)
      const res = await marketController.toggleFavourite(user.loginToken, eventId)
      if (res && res.error === '0') {
        const nextFav = !favourite;
        setFavourite(nextFav)
        useSnackbarStore.getState().show(
          nextFav ? 'Added to Favorites' : 'Removed from Favorites',
          'success'
        )
      } else {
        useSnackbarStore.getState().show(res?.message || 'Failed to update favorites', 'error')
      }
    } catch (err) {
      console.error('Fav toggle error:', err)
      useSnackbarStore.getState().show('Failed to update favorites', 'error')
    } finally {
      setFavLoading(false)
    }
  }
  const { selections, clearAll } = useBetSlipStore()
  const addSelection = useBetSlipStore(state => state.addSelection)
  const betslipRowRef = useRef<HTMLTableRowElement | null>(null)

  // Mobile-only: auto-scroll the betslip form into view when it opens
  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth >= 1024) return
    if (selections.length === 0 || !betslipRowRef.current) return

    const el = betslipRowRef.current
    const rect = el.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const HEADER_OFFSET = 60 // fixed header height approx

    // Only scroll if the element bottom is below the visible area
    if (rect.bottom > viewportHeight) {
      const scrollAmount = rect.bottom - viewportHeight + 16 // 16px breathing room
      window.scrollBy({ top: scrollAmount, behavior: 'smooth' })
    } else if (rect.top < HEADER_OFFSET) {
      // Edge case: element is above the header after scroll
      window.scrollBy({ top: rect.top - HEADER_OFFSET - 8, behavior: 'smooth' })
    }
  }, [selections])

  // Auto-expand if selection exists for this market on mobile
  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth >= 1024) return
    const hasSelectionOnMobile = runners.some((r, idx) => {
      const rId = r.selectionId || r.SelectionId || r.id || r.sid || idx
      return selections.some(s => s.id.startsWith(`${marketId}-${rId}`))
    })
    if (hasSelectionOnMobile && isCollapsed) {
      setIsCollapsed(false)
    }
  }, [selections, runners, marketId, isCollapsed])

  const getRunnerRates = (runnerId: string | number, rIdx: number) => {
    const rateData = liveRates[marketId]
    const runnersData = rateData?.runner || rateData?.runners || []
    const runnerArr = Array.isArray(runnersData) ? runnersData : Object.values(runnersData)

    // Find runner by id or selectionId or index
    let r = runnerArr.find((item: any) =>
      (item.selectionId && item.selectionId.toString() === runnerId.toString()) ||
      (item.id && item.id.toString() === runnerId.toString())
    )
    if (!r) r = runnerArr[rIdx]

    const getPrices = (r: any, type: 'back' | 'lay') => {
      if (!r) return { p1: '', v1: '', p2: '', v2: '', p3: '', v3: '' };
      const data = type === 'back' ? (r.back || r.availableToBack || r.ex?.availableToBack) : (r.lay || r.availableToLay || r.ex?.availableToLay);

      if (data) {
        const arr = Array.isArray(data) ? data : Object.values(data || {});
        return {
          p1: (arr[0]?.rate || arr[0]?.price || (type === 'back' ? r.lastPriceTraded : '') || '')?.toString(),
          v1: arr[0]?.size || '',
          p2: (arr[1]?.rate || arr[1]?.price || '')?.toString(),
          v2: arr[1]?.size || '',
          p3: (arr[2]?.rate || arr[2]?.price || '')?.toString(),
          v3: arr[2]?.size || '',
        };
      }

      // Logic for flat fields (no1, no2, BackPrice1, etc.)
      const isBookmaker = marketName.toLowerCase().includes('bookmaker')
      if (isBookmaker) {
        // Bookmaker: no1 is BACK, no2 is LAY
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

    const back = getPrices(r, 'back')
    const lay = getPrices(r, 'lay')

    return { back, lay }
  }

  const navigateToGame = () => {
    router.push(`/sportsbook/${params.sport}/${params.id}/${matchId}`)
  }

  return (
    <div className="bg-white rounded-b-[12px] shadow-sm border border-[#f36c21] mt-8 mb-4 relative">
      {/* Live Badge */}
      <div className={`absolute -top-[11px] left-2 ${isUpcoming ? 'bg-[#1a9ebf] border-[#147a93]' : 'bg-[#28a745] border-[#238a3a]'} text-white text-[9px] font-black px-2 py-[2px] rounded-[4px] italic leading-tight uppercase z-30 shadow-md border flex items-center gap-1`}>
        {isUpcoming ? (
          <>
            <Clock size={10} className="text-white" strokeWidth={3} />
            UPCOMING
          </>
        ) : (
          <>
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            LIVE
          </>
        )}
      </div>

      {/* Match Header (Gray) */}
      <div className="min-h-[40px] lg:min-h-[48px] h-auto flex items-center relative cursor-pointer select-none bg-[#e0e0e0]">
        {/* Left Side Slanted */}
        <div
          onClick={navigateToGame}
          className="relative flex items-center pl-4 lg:pl-6 bg-[#e8612c] pr-8 lg:pr-14 z-10 transition-all duration-300 py-1.5 self-stretch"
          style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)' }}
        >
          <div className="flex items-center gap-2 max-w-[240px] lg:max-w-none flex-1">
            <span onClick={(e) => { e.stopPropagation(); setIsCollapsed(!isCollapsed); }} className="text-white text-[16px] lg:text-[20px] font-medium leading-none mb-1 hover:scale-110 transition-transform flex-shrink-0">
              {isCollapsed ? '+' : '−'}
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-white text-[11px] lg:text-[14px] font-bold whitespace-normal line-clamp-2 leading-[1.2] uppercase tracking-tight">
                {matchName}
              </span>
              <span className="text-white/70 text-[9px] font-bold uppercase tracking-wider mt-0.5">
                {formatTime12h(startTime)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side Icons / Cashout */}
        <div className="flex-1 flex items-center justify-end pr-3 gap-3 z-20 ml-3">
          {/* Cashout Button for eligible markets */}
          {((marketName.toUpperCase().includes('MATCH ODDS') ||
            marketName.toUpperCase().includes('BOOKMAKER') ||
            marketName.toUpperCase().includes('TIED MATCH') ||
            marketName.toUpperCase().includes('GOAL') ||
            marketType?.toUpperCase() === 'WINNETSET') && runners.length === 2) && (
              <CashoutButton
                amount={0}
                onCashout={() => {
                  let mType = 'ODDS';
                  if (marketName.toUpperCase().includes('BOOKMAKER')) mType = 'BOOKMAKER';
                  else if (marketName.toUpperCase().includes('TIED MATCH')) mType = 'EXTRA';
                  else if (marketName.toUpperCase().includes('GOAL')) mType = 'GOAL';
                  else if (marketName.toUpperCase().includes('WINNER')) mType = 'WINNER';
                  else if (marketType?.toUpperCase() === 'WINNETSET') mType = 'WINNETSET';
                  onCashout?.(eventId, marketName, runners, mType);
                }}
                isLoading={isCashoutLoading}
                className="scale-90"
              />
            )}

          <div
            className="w-4 h-4 hidden md:flex items-center justify-center relative group/inplay cursor-pointer"
            onClick={(e) => { e.stopPropagation(); setIsCollapsed(!isCollapsed); }}
          >
            {isUpcoming ? (
              <Clock size={16} className="text-[#28a745]" />
            ) : (
              <Play size={16} className="text-[#28a745] fill-current" />
            )}
            <div className="absolute bottom-full right-0 mb-2 hidden group-hover/inplay:block z-[100] whitespace-nowrap bg-black text-white text-[10px] font-black px-2 py-1 rounded shadow-lg uppercase tracking-wider">
              {isUpcoming ? 'Upcoming' : 'In Play'}
            </div>
          </div>
          <Star
            size={18}
            className={`hidden md:block text-[#ffd700] cursor-pointer transition-all hover:scale-110 active:scale-95 ${favourite ? 'fill-[#ffd700]' : 'fill-none'} ${favLoading ? 'opacity-50' : ''} stroke-[2px]`}
            onClick={(e) => {
              e.stopPropagation();
              if (!favLoading) handleToggleFav(e);
            }}
          />
        </div>
      </div>

      {/* Market Category Sub-Header */}
      <div className="bg-[#333] flex items-center justify-between px-2 lg:px-3 h-10 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="bg-[#e8612c] px-3 py-1 flex items-center h-full max-h-[28px] rounded-sm transform -skew-x-12">
            <span className="text-white text-[10px] font-black uppercase tracking-wider transform skew-x-12">{marketName}</span>
          </div>
        </div>
        <div className="flex items-center justify-end flex-1 gap-1 h-full">
          {/* BACK Group Label */}
          <div className="flex justify-end gap-0.5 md:gap-2 w-[58px] md:w-[196px]">
            <div className="hidden md:block w-[60px]" />
            <div className="hidden md:block w-[60px]" />
            <div className="w-[58px] md:w-[60px] flex items-center justify-center">
              <span className="text-[10px] font-black text-white uppercase tracking-wider">Back</span>
            </div>
          </div>
          {/* LAY Group Label */}
          <div className="flex justify-start gap-0.5 md:gap-2 w-[58px] md:w-[196px]">
            <div className="w-[58px] md:w-[60px] flex items-center justify-center">
              <span className="text-[10px] font-black text-white uppercase tracking-wider">Lay</span>
            </div>
            <div className="hidden md:block w-[60px]" />
            <div className="hidden md:block w-[60px]" />
          </div>
        </div>
      </div>

      {/* Table Body */}
      {!isCollapsed && (
        <div className="overflow-x-auto lg:overflow-visible rounded-b-[11px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <table className="w-full border-collapse table-fixed">
            <colgroup>
              <col />
              <col className="w-[120px] md:w-[410px]" />
            </colgroup>
            <tbody>
              {runners.map((runner, rIdx) => {
                // Improved ID detection: scan for all common API field names
                const runnerId = runner.selectionId || runner.SelectionId || runner.id || runner.selection_id || runner.selectionid || runner.sid || rIdx
                const { back, lay } = getRunnerRates(runnerId, rIdx)
                const runnerName = runner.name || runner.RunnerName || `Runner ${rIdx + 1}`

                const rateData = liveRates[marketId]

                const isFancy = marketName.toLowerCase().includes('fancy') || marketName.toLowerCase().includes('line')
                const isBookmaker = marketName.toLowerCase().includes('bookmaker')

                let isMarketSuspended = false
                let suspensionMsg = 'SUSPENDED'

                if (isFancy) {
                  if (rateData?.suspended === 'Y' || rateData?.suspended === '1' || rateData?.status === 'SUSPENDED') {
                    isMarketSuspended = true
                    suspensionMsg = 'SUSPENDED'
                  } else {
                    const n1 = parseFloat(rateData?.no1 || '0')
                    const n2 = parseFloat(rateData?.no2 || '0')
                    if (n1 === 0 && n2 === 0 && (rateData?.no1 !== undefined || rateData?.no2 !== undefined)) {
                      isMarketSuspended = true
                      suspensionMsg = 'BALL RUNNING'
                    } else if (rateData?.ball_run === 'Y' || rateData?.status1 === '1' || rateData?.status1 === '2') {
                      isMarketSuspended = true
                      suspensionMsg = 'BALL RUNNING'
                    }
                  }
                } else if (isBookmaker) {
                  isMarketSuspended = rateData?.suspended === 'Y' || rateData?.ball_run === 'Y' || rateData?.status === 'SUSPENDED'
                } else {
                  isMarketSuspended = rateData?.status === 'SUSPENDED' || rateData?.Msg?.toLowerCase().includes('suspend') || rateData?.active === 'No' || rateData?.suspended === 'Y'
                }

                let isSelectionSuspended = false
                if (rateData?.runners) {
                  const r = rateData.runners.find((p: any) => p.selectionId?.toString() === runnerId?.toString())
                  if (r?.status === 'SUSPENDED') isSelectionSuspended = true
                } else if (rateData?.rates) {
                  const r = rateData.rates[rIdx]
                  if (r?.selectionStatus === 'SUSPENDED') isSelectionSuspended = true
                }

                const isSuspended = isMarketSuspended || isSelectionSuspended || !!rateData?.Msg
                const displayMsg = (isMarketSuspended && suspensionMsg === 'BALL RUNNING') ? 'BALL RUNNING' : (rateData?.Msg || suspensionMsg)

                const handleAddBet = (odds: string, side: 'back' | 'lay') => {
                  // Redirect to detail page instead of adding to betslip
                  navigateToGame();
                }

                const isSelectedOnMobile = selections.some(s => s.id.startsWith(`${marketId}-${runnerId}`))

                return (
                  <React.Fragment key={runnerId}>
                    <tr className="hover:bg-gray-50/50 transition-colors group relative border-b border-black/30">
                      <td className="py-3 px-3 lg:px-4">
                        <div className="flex flex-col w-full">
                          <div className="flex items-center justify-between w-full">
                            <span className="text-[11px] lg:text-[14px] font-bold text-[#333] tracking-tight group-hover:text-[#e8612c] transition-colors uppercase whitespace-normal line-clamp-2 leading-tight pr-2">
                              {runnerName}
                            </span>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              {(isFancy || marketName.toLowerCase().includes('line')) && runner.Chart !== null && runner.Chart !== undefined && runner.Chart !== '0' && runner.Chart !== '' && (
                                <button
                                  className="flex-shrink-0 hover:scale-110 active:scale-95 transition-transform"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenFancyChart?.(marketId.toString(), runnerName);
                                  }}
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900">
                                    <path d="M8 3v18M16 3v18M8 7h8M8 12h8M8 17h8" />
                                  </svg>
                                </button>
                              )}
                              {isFancy && (
                                <div className="relative group/tooltip">
                                  <div className="bg-black text-white rounded-full w-4 h-4 flex items-center justify-center cursor-help hover:bg-[#e8612c] transition-colors">
                                    <Info size={11} strokeWidth={3} />
                                  </div>
                                  <div className={`absolute ${rIdx === 0 ? 'top-full mt-2' : 'bottom-full mb-2'} right-0 hidden group-hover/tooltip:block z-[100] min-w-[140px] pointer-events-none`}>
                                    <div className="bg-[#222] text-white text-[10px] font-bold p-2.5 rounded-lg shadow-2xl border border-white/10 flex flex-col gap-1.5 backdrop-blur-sm">
                                      <div className="flex justify-between gap-4">
                                        <span className="text-gray-400 uppercase tracking-tighter">Min Bet:</span>
                                        <span className="text-[#e8612c]">{runner.min || runner.Min || 0}</span>
                                      </div>
                                      <div className="flex justify-between gap-4">
                                        <span className="text-gray-400 uppercase tracking-tighter">Max Bet:</span>
                                        <span className="text-[#e8612c]">{runner.max || runner.Max || 0}</span>
                                      </div>
                                      {(runner.maxMkt || runner.MaxMkt) && (
                                        <div className="flex justify-between gap-4 border-t border-white/10 pt-1.5">
                                          <span className="text-gray-400 uppercase tracking-tighter">Max Mkt:</span>
                                          <span className="text-[#e8612c]">{runner.maxMkt || runner.MaxMkt}</span>
                                        </div>
                                      )}
                                    </div>
                                    <div className={`w-2.5 h-2.5 bg-[#222] border-white/10 rotate-45 ml-auto mr-1.5 ${rIdx === 0 ? 'border-l border-t -mb-1.5 absolute -top-1.5 right-1.5' : 'border-r border-b -mt-1.5'}`} />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          {runner.Chart !== null && runner.Chart !== undefined && (
                            <span className="text-[10px] font-bold text-[#f26522] mt-0.5 animate-in fade-in slide-in-from-left-1 duration-300">
                              {runner.Chart || '0'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-1 px-2 relative">
                        <div className="flex justify-end gap-1 lg:gap-1">
                          <div className="relative">
                            <div className="flex items-center justify-end gap-1 h-full">
                              {/* LEFT GROUP (BACK) */}
                              <div className="flex items-center justify-end gap-1 md:gap-2 w-fit md:w-[196px]">
                                <div className="hidden md:flex gap-1">
                                  <OddsBox val={back.p3} vol={back.v3} type="back" intensity="low" onClick={() => handleAddBet(back.p3, 'back')} />
                                  <OddsBox val={back.p2} vol={back.v2} type="back" intensity="medium" onClick={() => handleAddBet(back.p2, 'back')} />
                                </div>
                                <OddsBox val={back.p1} vol={back.v1} type="back" intensity="high" onClick={() => handleAddBet(back.p1, 'back')} />
                              </div>

                              {/* RIGHT GROUP (LAY) */}
                              <div className="flex items-center justify-start gap-1 md:gap-2 w-fit md:w-[196px]">
                                <OddsBox val={lay.p1} vol={lay.v1} type="lay" intensity="high" onClick={() => handleAddBet(lay.p1, 'lay')} />
                                <div className="hidden md:flex gap-1">
                                  <OddsBox val={lay.p2} vol={lay.v2} type="lay" intensity="medium" onClick={() => handleAddBet(lay.p2, 'lay')} />
                                  <OddsBox val={lay.p3} vol={lay.v3} type="lay" intensity="low" onClick={() => handleAddBet(lay.p3, 'lay')} />
                                </div>
                              </div>
                            </div>

                            {/* Standardized Suspension Overlay */}
                            {isSuspended && (
                              <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                                <div className="absolute inset-0 bg-[#212121] opacity-[0.46]"></div>
                                <div className="relative z-10 bg-[#e0e0e0] w-[110px] lg:w-[128px] py-[6px] flex items-center justify-center drop-shadow-sm whitespace-nowrap">
                                  <span className="text-[#0d47a1] text-[11px] lg:text-[13px] font-black uppercase tracking-wide leading-none truncate">
                                    {displayMsg}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                    {isSelectedOnMobile && selections[0] && (
                      <tr
                        ref={betslipRowRef}
                        className="lg:hidden animate-in slide-in-from-top-4 duration-300"
                      >
                        <td colSpan={2} className="p-2 pt-0 bg-white border-b border-black/30">
                          <BetSlipForm selection={selections[0]} onClose={clearAll} />
                        </td>
                      </tr>
                    )}
                    {isFancy && (runner.Msg || runner.msg || msg) && (
                      <tr key={runnerId + '-msg'} className="bg-[#1a1a1a] border-t-2 border-[#f36c21]">
                        <td colSpan={2} className="px-3 lg:px-4 py-1.5 border-0">
                          <div className="flex items-center gap-3 overflow-hidden h-5 w-full">
                            <Megaphone size={12} className="text-[#f36c21] flex-shrink-0" />
                            <div className="relative flex-1 min-w-0 overflow-hidden pointer-events-none">
                              <div className="whitespace-nowrap animate-ticker">
                                <span className="text-[10px] lg:text-[11px] font-black text-white uppercase tracking-wider">
                                  {runner.Msg || runner.msg || msg}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}

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

export default function CompetitionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const [activeSubTab, setActiveSubTab] = useState('LIVE & UPCOMING')

  const subTabs = ['LIVE & UPCOMING', 'RESULTS']

  const activeSportId = (params.sport as string || 'Cricket').replace('Soccer', 'Football')
  const competitionId = params.id as string

  const [games, setGames] = useState<any[]>([])
  const [gameDetails, setGameDetails] = useState<Record<string, any>>({})
  const [liveOdds, setLiveOdds] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)

  // Fancy Chart State
  const [fancyChartOpen, setFancyChartOpen] = useState(false)
  const [fancyChartLoading, setFancyChartLoading] = useState(false)
  const [fancyChartData, setFancyChartData] = useState<any>(null)
  const [fancyChartTitle, setFancyChartTitle] = useState('')

  const onOpenFancyChart = async (marketId: string, name: string) => {
    if (!user?.loginToken) {
      showSnackbar('Please login to view chart', 'error')
      return
    }
    setFancyChartTitle(name)
    setFancyChartOpen(true)
    setFancyChartLoading(true)
    setFancyChartData(null)
    try {
      const res = await bettingController.getFancyChart(user.loginToken, marketId)
      setFancyChartData(res)
    } catch (err) {
      console.error('Failed to fetch fancy chart:', err)
      setFancyChartData({ error: '1', msg: 'Failed to load chart data' })
    } finally {
      setFancyChartLoading(false)
    }
  }

  const groupedChartData = useMemo(() => {
    if (!fancyChartData || !Array.isArray(fancyChartData)) return [];
    const items: any[] = [];
    fancyChartData.forEach((item: any) => {
      const run = item.run || item.Run || item.rate || item.Rate;
      const position = item.position || item.Position || item.chart || item.Chart || item.chart1 || item.Chart1;
      if (run !== undefined && position !== undefined) {
        items.push({ run, position });
      }
    });
    return items;
  }, [fancyChartData]);

  // 1. Fetch Competition Games initially
  useEffect(() => {
    let isMounted = true;
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const gameRes = await marketController.getCompetitionGames(competitionId);
        if (isMounted) {
          let matchData: any[] = [];
          if (gameRes && typeof gameRes === 'object' && !gameRes.error) {
            matchData = Object.values(gameRes).filter(v => typeof v === 'object' && v !== null && (v.MarketId || v.marketid || v.Event_Id || v.gid));
          } else if (Array.isArray(gameRes)) {
            matchData = gameRes;
          }
          setGames(matchData.sort((a, b) => {
            const parseDate = (str: string) => {
              if (!str || str === 'Live') return new Date(0);
              let d = new Date(str.includes('T') ? str : str.replace(' ', 'T'));
              if (isNaN(d.getTime())) {
                const parts = str.split(/[-/ :]/);
                if (parts.length >= 3) {
                  d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]), parseInt(parts[3] || '0'), parseInt(parts[4] || '0'), parseInt(parts[5] || '0'));
                }
              }
              return d;
            };
            return parseDate(a.DateTime || a.startTime).getTime() - parseDate(b.DateTime || b.startTime).getTime();
          }));
        }
      } catch (e) {
        console.error("Error fetching competition games:", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchInitialData();
    return () => { isMounted = false; };
  }, [competitionId]);

  // 2. Fetch Detailed Data (/gamedata) for each game
  const fetchAllGameData = useCallback(async () => {
    if (games.length === 0) return null;
    const dataMap: Record<string, any> = {};

    for (const game of games) {
      const gid = game.gid || game.Event_Id;
      try {
        let res;
        if (user?.loginToken) {
          res = await marketController.getGameDataLogin(user.loginToken, gid);
        } else {
          res = await marketController.getGameData(gid);
        }

        if (res && !res.error) {
          const parsedRes = typeof res === 'string' ? JSON.parse(res) : res;
          dataMap[gid] = parsedRes;
        }
      } catch (e) {
        console.error(`Error fetching gamedata for ${gid}:`, e);
      }
    }

    if (Object.keys(dataMap).length > 0) {
      setGameDetails(prev => ({ ...prev, ...dataMap }));
      return dataMap;
    }
    return null;
  }, [games, user?.loginToken]);

  useEffect(() => {
    fetchAllGameData();
  }, [fetchAllGameData]);

  // 3. Poll Live Rates & Game Data
  useEffect(() => {
    if (games.length === 0) return;
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const poll = async () => {
      try {
        const freshDetails = await fetchAllGameData();
        if (!isMounted) return;

        const currentDetails = freshDetails || gameDetails;
        const marketsToPoll: { gid: string, MarketId: string, eventid: string }[] = [];

        games.forEach(g => {
          const gid = g.gid || g.Event_Id;
          const details = currentDetails[gid];
          if (details) {
            const oddsData = details.ODDS || [];
            const oddsMarkets = Array.isArray(oddsData) ? oddsData : Object.values(oddsData);
            oddsMarkets.forEach((m: any) => {
              if (m.MarketId || m.marketid) marketsToPoll.push({
                gid: gid.toString(),
                MarketId: m.MarketId || m.marketid,
                eventid: g.Event_Id || gid.toString()
              });
            });
            const bmData = details.BOOKMAKER || [];
            const bmMarkets = Array.isArray(bmData) ? bmData : Object.values(bmData);
            bmMarkets.forEach((m: any) => {
              if (m.MarketId || m.marketid) marketsToPoll.push({
                gid: gid.toString(),
                MarketId: m.MarketId || m.marketid,
                eventid: g.Event_Id || gid.toString()
              });
            });
          }
          const baseMarketId = g.MarketId || g.marketid;
          if (baseMarketId && !marketsToPoll.find(m => m.MarketId === baseMarketId)) {
            marketsToPoll.push({
              gid: gid.toString(),
              MarketId: baseMarketId,
              eventid: g.Event_Id || gid.toString()
            });
          }
        });

        if (marketsToPoll.length > 0) {
          const oddsMap: Record<string, any> = {};
          for (const m of marketsToPoll) {
            if (!isMounted) break;
            try {
              const res = await marketController.getGameRate(m);
              if (res && typeof res === 'object' && !res.error) {
                if (res[m.MarketId]) {
                  const data = typeof res[m.MarketId] === 'string' ? JSON.parse(res[m.MarketId]) : res[m.MarketId];
                  oddsMap[m.MarketId] = data;
                }
                Object.keys(res).forEach(key => {
                  const val = res[key];
                  if (val && typeof val === 'object' && val[m.MarketId]) {
                    const nestedData = typeof val[m.MarketId] === 'string' ? JSON.parse(val[m.MarketId]) : val[m.MarketId];
                    oddsMap[m.MarketId] = nestedData;
                  }
                });
              }
            } catch (e) {
              console.error(`Error polling gamerate:`, e);
            }
          }
          if (isMounted) setLiveOdds(prev => ({ ...prev, ...oddsMap }));
        }
      } catch (e) {
        console.error("Polling Error:", e)
      }
      if (isMounted) timeoutId = setTimeout(poll, 2000);
    };

    poll();
    return () => { isMounted = false; if (timeoutId) clearTimeout(timeoutId); };
  }, [games, fetchAllGameData]);

  const [cashoutLoading, setCashoutLoading] = useState<string | null>(null)
  const showSnackbar = useSnackbarStore(state => state.show)
  const { addSelection, setStake, clearAll } = useBetSlipStore()

  const handleCashout = async (mId: string, mName: string, runners: any[], mType: string) => {
    if (!user?.loginToken) {
      showSnackbar('Please login to cashout', 'error')
      return
    }

    // In CompetitionDetailPage, matchId is actually the gid or eventId
    // We need the eventId for the cashout API
    const targetEventId = runners[0]?.eid || mId;
    setCashoutLoading(mId)
    try {
      const res = await bettingController.cashout(user.loginToken, targetEventId)
      const cashout = Array.isArray(res) ? res[0] : res

      if (cashout && cashout.Amount > 0) {
        const teamIdx = cashout.Team === 'B' ? 1 : 0
        const runner = runners[teamIdx]
        if (!runner) throw new Error('Runner not found')

        const selectionId = runner.selectionId || runner.id || runner.SelectionId || teamIdx
        const bSide = cashout.Type === 'L' ? 'lay' : 'back'

        clearAll()
        addSelection({
          id: `${mId}-${selectionId}-${bSide}`,
          matchId: targetEventId,
          eventId: targetEventId,
          marketId: mId,
          selectionId: selectionId.toString(),
          matchName: 'Cashout Match', // Fallback
          marketName: mName,
          selectionName: runner.name || runner.Name || (teamIdx === 0 ? 'Team A' : 'Team B'),
          odds: parseFloat(cashout.Rate),
          betType: bSide,
          marketType: mType,
          marketIndex: teamIdx,
          runnersCount: runners.length
        })

        setStake(`${mId}-${selectionId}-${bSide}`, parseFloat(cashout.Amount))
        showSnackbar(`Cashout ready: Guaranteed ${cashout.Chart1 || cashout.Chart2 || ''}`, 'success')
      } else {
        showSnackbar('No cashout available right now', 'info')
      }
    } catch (err) {
      console.error('Cashout failed:', err)
      showSnackbar('Failed to fetch cashout', 'error')
    } finally {
      setCashoutLoading(null)
    }
  }

  const matchSections = useMemo(() => {
    return games.map((g) => {
      const gid = g.gid || g.Event_Id;
      let details = gameDetails[gid];
      if (details && details["0"]) details = details["0"];

      let isUpcoming = false;
      const now = new Date();
      if (g.DateTime) {
        const parseDate = (str: string) => {
          if (!str || str === 'Live') return new Date(0);
          let d = new Date(str.includes('T') ? str : str.replace(' ', 'T'));
          if (isNaN(d.getTime())) {
            const parts = str.split(/[-/ :]/);
            if (parts.length >= 3) {
              d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]), parseInt(parts[3] || '0'), parseInt(parts[4] || '0'), parseInt(parts[5] || '0'));
            }
          }
          return d;
        };
        const startTimeDate = parseDate(g.DateTime);
        if (startTimeDate.getTime() > now.getTime()) {
          isUpcoming = true;
        }
      }

      const sections: any[] = [];
      if (details) {
        const allMarkets: any[] = [];
        ['ODDS', 'BOOKMAKER', 'FANCY'].forEach(cat => {
          const mData = details[cat] || [];
          const mArr = Array.isArray(mData) ? mData : Object.values(mData);
          mArr.forEach((m: any) => { if (m) allMarkets.push({ ...m, category: cat }); });
        });
        const eventsData = details.events || [];
        const eventsArr = Array.isArray(eventsData) ? eventsData : Object.values(eventsData);
        eventsArr.forEach((m: any) => {
          if (m && !allMarkets.find(am => (am.MarketId || am.marketid) === (m.MarketId || m.marketid))) {
            allMarkets.push({ ...m, category: m.Type || 'ODDS' });
          }
        });

        if (allMarkets.length > 0) {
          const m = allMarkets[0];
          let runners = m.runner || m.runners || [];
          if (!Array.isArray(runners)) runners = Object.values(runners);

          const eventIdToUse = m.eid || g.Event_Id || gid.toString();
          const isSpecial = m.category === 'FANCY' || m.category === 'LINE' || m.category === 'BOOKMAKER' || (m.name || m.MarketName || '').toLowerCase().includes('line');
          const bestId = isSpecial ? (m.eid || m.MarketId || m.marketid) : (m.MarketId || m.marketid || m.eid);

          sections.push({
            id: bestId,
            marketName: m.name || m.MarketName || m.marketname || g.Game_Type || 'Match Odds',
            runners,
            marketId: bestId,
            isUpcoming,
            startTime: g.DateTime,
            isWinnerType: g.Game_Type === 'Winner' || m.name === 'Winner',
            matchId: gid,
            matchName: details.Team1 && details.Team2 ? `${details.Team1} V ${details.Team2}` : (g.Game_name || `${g.Team1} V ${g.Team2}`),
            eventId: eventIdToUse,
            isFavourite: details.IsFavorite === '1' || details.isFavorite === 'Yes' || details.fav === '1',
            min: m.min,
            max: m.max,
            msg: m.Msg || m.msg,
            marketType: m.category
          });
        }
      }

      if (sections.length === 0) {
        // Fallback if no details yet
        sections.push({
          id: g.MarketId || g.marketid || 'no-id',
          marketName: g.Game_Type || 'Match Odds',
          runners: [{ name: g.Team1 || 'Team A', selectionId: 0 }, { name: g.Team2 || 'Team B', selectionId: 1 }],
          marketId: g.MarketId || g.marketid || 'no-id',
          isUpcoming,
          startTime: g.DateTime,
          matchId: gid,
          matchName: g.Game_name || `${g.Team1} V ${g.Team2}`,
          eventId: g.Event_Id || gid.toString(),
          isFavourite: g.IsFavorite === '1' || g.isFavorite === 'Yes' || g.fav === '1',
          marketType: g.Game_Type || 'ODDS'
        });
      }
      return { gid, name: g.Game_name || `${g.Team1} V ${g.Team2}`, sections };
    });
  }, [games, gameDetails]);

  return (
    <div className="flex min-h-screen bg-[#111] lg:gap-4 lg:bg-transparent">
      <div className="flex-1 pb-32 bg-[#111] rounded-lg overflow-hidden">
        <div className="md:hidden bg-[#111] px-2 pt-2">
          <div className="flex items-stretch justify-center h-[72px] mx-[-8px]">
            {sportsList.map((sport) => (
              <button
                key={sport.id}
                onClick={() => router.push('/sportsbook/' + sport.id)}
                className={`flex-1 flex flex-col items-center justify-center py-2 px-1 relative ${activeSportId === sport.id ? 'after:content-[""] after:absolute after:bottom-0 after:left-1/4 after:right-1/4 after:h-[2px] after:bg-[#f36c21]' : ''}`}
              >
                <img src={sport.icon} alt={sport.name} className="w-8 h-8 object-contain mb-1" />
                <span className={`text-[10px] font-black uppercase tracking-tight ${activeSportId === sport.id ? 'text-white' : 'text-gray-500'}`}>{sport.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center bg-[#1a1a1a] border-b border-white/5 h-10 px-4 gap-8 md:gap-12 box-border relative z-20">
          {subTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className="h-full relative group flex items-center"
            >
              <span className={`text-[13px] font-black uppercase tracking-tight h-full flex items-center transition-colors border-b-2 ${activeSubTab === tab
                ? 'text-[#f36c21] border-[#f36c21]'
                : 'text-gray-400 border-transparent hover:text-white'
                }`}>
                {tab}
              </span>
            </button>
          ))}
        </div>

        <div className="p-3 lg:p-4 space-y-6">
          {activeSubTab === 'RESULTS' ? (
            <div className="text-center py-20 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4"><Loader2 size={32} className="text-[#f36c21]/20" /></div>
              <span className="text-gray-500 font-black uppercase text-[11px] tracking-widest">No Results Data Available Yet</span>
            </div>
          ) : (
            <>
              {isLoading && games.length === 0 ? (
                <div className="py-24 flex flex-col items-center justify-center gap-4">
                  <div className="relative">
                    <Loader2 size={48} className="animate-spin text-[#f36c21]" />
                    <div className="absolute inset-0 blur-xl bg-[#f36c21]/20 animate-pulse rounded-full" />
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#f36c21]">Syncing Global Markets...</p>
                </div>
              ) : matchSections.length > 0 ? (
                matchSections.map((group) => (
                  <div key={group.gid} className="space-y-4">
                    {group.sections.map((section: any) => (
                      <MarketTable
                        key={section.id}
                        {...section}
                        liveRates={liveOdds}
                        onCashout={handleCashout}
                        isCashoutLoading={cashoutLoading === section.id}
                        onOpenFancyChart={onOpenFancyChart}
                        marketType={section.marketType}
                      />
                    ))}
                  </div>
                ))
              ) : (
                <div className="text-center py-20 text-gray-600 font-black uppercase text-[11px] tracking-widest">No Active Markets Found In This Competition</div>
              )}
            </>
          )}
        </div>
      </div>

      {user && (
        <div className="hidden lg:block lg:w-[480px] sticky top-0 max-h-screen overflow-y-auto self-start shrink-0 lg:border-none lg:rounded-lg lg:overflow-hidden border-l border-white/5 bg-[#111] z-30">
          <BetContainer sportType={params.sport as string} />
        </div>
      )}
      {/* Fancy Chart Modal */}
      {fancyChartOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setFancyChartOpen(false)} />
          <div className="relative z-10 bg-[#1a1a1a] rounded-xl border border-white/10 w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#111]">
              <h3 className="text-[13px] font-black text-white uppercase tracking-tight truncate pr-4">
                Chart: {fancyChartTitle}
              </h3>
              <button onClick={() => setFancyChartOpen(false)} className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <X size={16} />
              </button>
            </div>
            <div className="p-6">
              {fancyChartLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-10 h-10 border-4 border-[#f36c21]/20 border-t-[#f36c21] rounded-full animate-spin mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Fetching Ladder Data...</p>
                </div>
              ) : (fancyChartData?.error === '1' || !Array.isArray(fancyChartData)) ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <AlertCircle size={32} className="text-red-500 mb-2 opacity-20" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{fancyChartData?.msg || 'Failed to load chart'}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="max-h-[400px] overflow-auto rounded-xl border border-white/5 bg-black/20 custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-[#111] sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-3 text-[10px] font-black uppercase text-gray-400 tracking-wider border-b border-white/5">Run</th>
                          <th className="px-4 py-3 text-[10px] font-black uppercase text-gray-400 tracking-wider text-right border-b border-white/5">Position</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {groupedChartData.map((row, idx) => {
                          const pos = parseFloat(row.position);
                          return (
                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                              <td className="px-4 py-2.5 text-[12px] font-bold text-white/90">{row.run}</td>
                              <td className={`px-4 py-2.5 text-[12px] font-black text-right ${pos >= 0 ? 'text-[#4caf50]' : 'text-[#f44336]'}`}>
                                {pos > 0 ? `+${row.position}` : row.position}
                              </td>
                            </tr>
                          );
                        })}
                        {groupedChartData.length === 0 && (
                          <tr>
                            <td colSpan={2} className="px-4 py-12 text-center text-[10px] font-black uppercase tracking-widest text-white/20 italic">
                              No Ladder Data Available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <button onClick={() => setFancyChartOpen(false)} className="w-full py-3 bg-[#f36c21] hover:bg-[#ff7a45] text-white font-black uppercase tracking-widest text-[11px] rounded-lg transition-all active:scale-[0.98] shadow-lg shadow-[#f36c21]/20">
                    Close Chart
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


