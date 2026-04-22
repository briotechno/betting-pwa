'use client'
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Star, Loader2, ChevronDown, ChevronLeft, Plus, Megaphone, X, Tv, AlertCircle, Info } from 'lucide-react'
import BetContainer from '@/components/sportsbook/BetContainer'
import { marketController } from '@/controllers/market/marketController'
import { useBetSlipStore } from '@/store/betSlipStore'
import { useAuthStore } from '@/store/authStore'
import { bettingController } from '@/controllers/betting/bettingController'
import CashoutButton from '@/components/sportsbook/CashoutButton'
import BetSlipForm from '@/components/sportsbook/BetSlipForm'
import { useSnackbarStore } from '@/store/snackbarStore'
import { pusherClient } from '@/utils/pusher'
import { formatDate } from '@/utils/format'

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
  eventId,
  min,
  max,
  msg,
  onOpenFancyChart,
  onCashout,
  isCashoutLoading,
  payloadEid,
  team1,
  team2
}: {
  marketName: string,
  runners: any[],
  marketId: string,
  liveRates: any,
  matchName: string,
  marketType: string,
  marketIndex: number,
  eventId: string,
  min?: any,
  max?: any,
  msg?: string,
  onOpenFancyChart?: (eid: string, name: string) => void,
  onCashout?: (mId: string, mName: string, runners: any[], mType: string) => void,
  isCashoutLoading?: boolean,
  payloadEid?: string,
  team1?: string,
  team2?: string
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
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

      // Point 2: Fancy Logic - if no1/no2 are missing/zero, it's potentially Ball Running
      if (isFancyOrLine && !hasRunners) {
        const n1 = parseFloat(rateData.no1 || '0')
        const n2 = parseFloat(rateData.no2 || '0')
        if (n1 === 0 && n2 === 0 && !rateData.rate) {
          // We'll handle the "BALL RUNNING" vs "SUSPENDED" message in the UI loop based on priority
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

        // Priority: 1. ex (availableToBack), 2. no2/no1 (fancy fields), 3. backPrice/rate
        let bp = r.ex?.availableToBack?.[0]?.price || r.back?.[0]?.price || getVal(r, ['no2', 'no1', 'backPrice1', 'BackPrice1', 'rate']);
        let lp = r.ex?.availableToLay?.[0]?.price || r.lay?.[0]?.price || getVal(r, ['no1', 'no2', 'layPrice1', 'LayPrice1', 'rate']);
        let bs = r.ex?.availableToBack?.[0]?.size || r.back?.[0]?.size || getVal(r, ['valy', 'valn', 'size']);
        let ls = r.ex?.availableToLay?.[0]?.size || r.lay?.[0]?.size || getVal(r, ['valn', 'valy', 'size']);


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

    // Point 3: Bookmaker selectionStatus check
    if (r) {
      if (marketType === 'BOOKMAKER') {
        const s = (r.selectionStatus || r.selectionstatus || '').toUpperCase()
        if (s !== 'ACTIVE' && s !== 'OPEN') isRunnerSuspended = true
      } else if (r.selectionStatus === 'SUSPENDED' || r.status === 'SUSPENDED' || r.selectionStatus === '1' || r.status === '1') {
        isRunnerSuspended = true
      }
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
          p2: (type === 'back' ? r.BackPrice2 : r.LayPrice2)?.toString() || '',
          v2: (type === 'back' ? r.BackSize2 : r.LaySize2)?.toString() || '',
          p3: (type === 'back' ? r.BackPrice3 : r.LayPrice3)?.toString() || '',
          v3: (type === 'back' ? r.BackSize3 : r.LaySize3)?.toString() || '',
        };
      }

      // Default/Fancy Logic: no1 is typically NO (Smaller), no2 is typically YES (Bigger)
      return {
        p1: (type === 'back' ? (r.no2 ?? r.BackPrice1 ?? r.rate) : (r.no1 ?? r.LayPrice1 ?? r.rate))?.toString() || '',
        v1: (type === 'back' ? (r.valy ?? r.size) : (r.valn ?? r.size))?.toString() || '',
        p2: (type === 'back' ? r.BackPrice2 : r.LayPrice2)?.toString() || '',
        v2: (type === 'back' ? r.BackSize2 : r.LaySize2)?.toString() || '',
        p3: (type === 'back' ? r.BackPrice3 : r.LayPrice3)?.toString() || '',
        v3: (type === 'back' ? r.BackSize3 : r.LaySize3)?.toString() || '',
      };
    };
    return { back: getPrices(r, 'back'), lay: getPrices(r, 'lay'), isRunnerSuspended: isRunnerSuspended }
  }

  const isFancyOrLine = marketType === 'FANCY' || marketType === 'LINE' || marketName.toUpperCase() === 'FANCY' || marketName.toUpperCase() === 'LINE MARKET'
  const isFancyGroup = marketName.toUpperCase() === 'FANCY' || marketName.toUpperCase() === 'LINE MARKET'
  const isSixValueMarket = !isFancyOrLine && (
    marketType === 'ODDS' ||
    marketType === 'BOOKMAKER' ||
    marketType === 'EXTRA' ||
    marketType === 'GOAL' ||
    marketName.toUpperCase().includes('MATCH') ||
    marketName.toUpperCase().includes('WINNER') ||
    marketName.toUpperCase().includes('TIE') ||
    marketName.toUpperCase().includes('GOAL')
  )

  if (!runners || (Array.isArray(runners) ? runners : Object.values(runners)).length === 0) return null;

  return (
    <div className="bg-white rounded-b-[12px] shadow-sm border border-[#f36c21] mt-8 relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div
        className="h-10 lg:h-12 flex items-center relative cursor-pointer select-none bg-[#e0e0e0]"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div
          className="relative h-full flex items-center pl-2 lg:pl-4 bg-[#e8612c] pr-4 lg:pr-6 z-10 transition-all duration-300"
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

        <div className="h-full flex items-center pr-4 z-0 ml-3">
          {/* Cashout Button for ODDS and BOOKMAKER with 2 runners */}
          {/* Premium Cashout Button */}
          {((marketType === 'ODDS' || marketType === 'BOOKMAKER' || marketType === 'EXTRA' || marketType === 'GOAL' || marketType === 'WINNER') && runners.length === 2) && (
            <CashoutButton 
              amount={0} 
              onCashout={() => onCashout?.(payloadEid || marketId, marketName, runners, marketType)}
              isLoading={isCashoutLoading}
              className="origin-right"
            />
          )}
        </div>
      </div>

      <div className="bg-[#333] flex items-center justify-between px-2 lg:px-3 h-10 border-t border-white/5">
        <div className="flex items-center gap-2">
          {isFancyGroup && <span className="text-white/40 ml-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></span>}
          {(min !== undefined && max !== undefined) && (
            <div className="flex items-center gap-1.5 ml-1">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-tight">Min:</span>
              <span className="text-[10px] font-black text-white mr-1.5">{min}</span>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-tight">Max:</span>
              <span className="text-[10px] font-black text-white">{max}</span>
            </div>
          )}
        </div>
        <div className="flex md:mr-0 items-center justify-end flex-1 gap-1 lg:gap-1 h-full">
          {/* BACK / NO Group */}
          <div className={`flex justify-end gap-0.5 md:gap-2 ${(isSixValueMarket || isFancyGroup) ? 'w-[54px] md:w-[196px]' : 'w-[54px] md:w-[60px]'}`}>
            {/* Position label at the 3rd cell on desktop/tablet for 3-cell wide markets */}
            {(isSixValueMarket || isFancyGroup) && (
              <>
                <div className="hidden md:block w-[60px]" />
                <div className="hidden md:block w-[60px]" />
              </>
            )}
            <div className="w-[54px] md:w-[60px] flex items-center justify-center">
              <span className="text-[10px] font-black text-white uppercase tracking-wider">{isFancyGroup ? 'NO' : 'Back'}</span>
            </div>
          </div>

          {/* LAY / YES Group */}
          <div className={`flex justify-start gap-0.5 md:gap-2 ${(isSixValueMarket || isFancyGroup) ? 'w-[54px] md:w-[196px]' : 'w-[54px] md:w-[60px]'}`}>
            {/* Position label at the 1st cell on desktop/tablet for 3-cell wide markets */}
            <div className="w-[54px] md:w-[60px] flex items-center justify-center">
              <span className="text-[10px] font-black text-white uppercase tracking-wider">{isFancyGroup ? 'YES' : 'Lay'}</span>
            </div>
            {(isSixValueMarket || isFancyGroup) && (
              <>
                <div className="hidden md:block w-[60px]" />
                <div className="hidden md:block w-[60px]" />
              </>
            )}
          </div>
        </div>
      </div>

      {(!isCollapsed && (Array.isArray(runners) ? runners : Object.values(runners || {})).length > 0) && (
        <div className="overflow-x-auto lg:overflow-visible rounded-b-[11px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <table className="w-full border-collapse table-fixed">
            <colgroup>
              <col />
              <col className="w-[115px] md:w-[410px]" />
            </colgroup>
            <tbody>
              {(Array.isArray(runners) ? runners : Object.values(runners || {})).map((runner: any, rIdx: number) => {
                const mId = isFancyGroup ? ((runner.MarketId?.toString().startsWith('1.') || runner.marketid?.toString().startsWith('1.')) ? (runner.MarketId || runner.marketid) : (runner.eid || runner.MarketId || runner.marketid)) : marketId
                const runnerId = isFancyGroup ? 0 : (runner.selectionId || runner.SelectionId || runner.id || runner.sid || rIdx)

                const rateData = liveRates[mId]
                const { back, lay, isRunnerSuspended } = getRunnerRates(runnerId, rIdx, mId, runner)
                const runnerName = isFancyGroup 
                  ? (runner.name || runner.RunnerName) 
                  : (runner.name || runner.RunnerName || runner.SelectionName || (rIdx === 0 && team1 ? team1 : (rIdx === 1 && team2 ? team2 : `Runner ${rIdx + 1}`)))
                const isFancy = marketType === 'FANCY' || isFancyGroup
                const isLine = marketType === 'LINE'
                const isBookmaker = marketType === 'BOOKMAKER'

                const rowMin = (isFancyGroup || isLine) ? (runner.min || runner.Min) : min
                const rowMax = (isFancyGroup || isLine) ? (runner.max || runner.Max) : max
                const rowMaxMkt = (isFancyGroup || isLine) ? (runner.maxMkt || runner.MaxMkt) : null
                const rowMsg = (isFancyGroup || isLine) ? (runner.Msg || runner.msg) : msg

                let isMarketSuspended = false
                let suspensionMsg = 'SUSPENDED'

                if (isLine) {
                  // Point 1: Line Market Logic
                  isMarketSuspended = rateData?.status === 'SUSPENDED'
                } else if (isFancy) {
                  // Point 2: Fancy Market Logic
                  // Priority 1: Suspended field
                  if (rateData?.suspended === 'Y' || rateData?.suspended === '1' || rateData?.status === 'SUSPENDED') {
                    isMarketSuspended = true
                    suspensionMsg = 'SUSPENDED'
                  }
                  // Priority 2: no1 and no2 zero check
                  else {
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
                  // Point 3: Bookmaker Logic
                  isMarketSuspended = rateData?.suspended === 'Y' || rateData?.ball_run === 'Y' || rateData?.status === 'SUSPENDED'
                } else {
                  // Default ODDS/Other
                  isMarketSuspended = rateData?.status === 'SUSPENDED' || rateData?.suspended === 'Y' || rateData?.active === 'No'
                }

                const isSuspended = isMarketSuspended || isRunnerSuspended || (!!rateData?.Msg && rateData?.Msg !== '')

                const handleAddBet = (odds: string, side: 'back' | 'lay') => {
                  if (isSuspended || !odds || odds === '-' || odds === '0' || odds === '0.00') return;
                  addSelection({
                    id: `${mId}-${runnerId}-${side}`,
                    min: rowMin ? parseFloat(rowMin) : undefined,
                    max: rowMax ? parseFloat(rowMax) : undefined,
                    matchId: eventId.toString(),
                    marketId: payloadEid || (isFancyGroup ? (runner.eid || mId.toString()) : mId.toString()),
                    eventId: eventId.toString(),
                    selectionId: runnerId.toString(),
                    matchName: matchName,
                    marketName: isFancyGroup ? runnerName : marketName,
                    selectionName: isFancyGroup ? (side === 'back' ? 'Yes' : 'No') : runnerName,
                    odds: parseFloat(odds),
                    betType: side,
                    marketType: (marketName.toUpperCase() === 'LINE MARKET' || marketType === 'LINE' || (isFancyGroup && marketName.toLowerCase().includes('line'))) ? 'LINE' : (isFancyGroup ? 'FANCY' : (marketType || 'ODDS')),
                    marketIndex: rIdx,
                    runnersCount: (Array.isArray(runners) ? runners.length : Object.keys(runners || {}).length),
                    noVal: parseFloat(lay.v1 || '100'),
                    yesVal: parseFloat(back.v1 || '100')
                  })
                }
                const isSelectedOnMobile = selections.some(s => s.id.startsWith(`${mId}-${runnerId}`))
                suspensionMsg = (isMarketSuspended && suspensionMsg === 'BALL RUNNING') ? 'BALL RUNNING' : (rateData?.Msg || suspensionMsg)

                const chartVal = (runner.Chart !== undefined && runner.Chart !== null) ? parseFloat(runner.Chart) :
                  (runner.Chart1 !== undefined && runner.Chart1 !== null) ? parseFloat(runner.Chart1) :
                    (runner.Chart2 !== undefined && runner.Chart2 !== null) ? parseFloat(runner.Chart2) : null
                const hasChart = chartVal !== null && !isNaN(chartVal) && chartVal !== 0

                return (
                  <React.Fragment key={mId + '-' + runnerId}>
                    <tr className="hover:bg-gray-50/50 transition-colors group relative border-b border-black/30">
                      <td className="py-3 px-3 lg:px-4">
                        <div className="flex flex-col w-full">
                          <div className="flex items-center justify-between w-full">
                            <span className="text-[11px] lg:text-[13px] font-bold text-gray-800 tracking-tight transition-colors uppercase line-clamp-2 leading-tight pr-1">
                              {runnerName}
                            </span>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              {(isFancy || isLine) && hasChart && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenFancyChart?.(mId.toString(), runnerName);
                                  }}
                                  className="flex-shrink-0 hover:scale-110 active:scale-95 transition-transform"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900">
                                    <path d="M8 3v18M16 3v18M8 7h8M8 12h8M8 17h8" />
                                  </svg>
                                </button>
                              )}
                              {(isFancy || isLine) && (
                                <div className="relative group/tooltip">
                                  <div className="bg-black text-white rounded-full w-4 h-4 flex items-center justify-center cursor-help hover:bg-[#f36c21] transition-colors">
                                    <Info size={11} strokeWidth={3} />
                                  </div>
                                  <div className="absolute bottom-full right-0 mb-2 hidden group-hover/tooltip:block z-[100] min-w-[140px] pointer-events-none">
                                    <div className="bg-[#222] text-white text-[10px] font-bold p-2.5 rounded-lg shadow-2xl border border-white/10 flex flex-col gap-1.5 backdrop-blur-sm">
                                      <div className="flex justify-between gap-4">
                                        <span className="text-gray-400 uppercase tracking-tighter">Min Bet:</span>
                                        <span className="text-[#f36c21]">{rowMin || 0}</span>
                                      </div>
                                      <div className="flex justify-between gap-4">
                                        <span className="text-gray-400 uppercase tracking-tighter">Max Bet:</span>
                                        <span className="text-[#f36c21]">{rowMax || 0}</span>
                                      </div>
                                      {rowMaxMkt && (
                                        <div className="flex justify-between gap-4 border-t border-white/10 pt-1.5">
                                          <span className="text-gray-400 uppercase tracking-tighter">Max Mkt:</span>
                                          <span className="text-[#f36c21]">{rowMaxMkt}</span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="w-2.5 h-2.5 bg-[#222] border-r border-b border-white/10 rotate-45 -mt-1.5 ml-auto mr-1.5" />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          {hasChart && (
                            <span className={`text-[11px] font-bold leading-none mt-1 ${chartVal! < 0 ? 'text-red-500' : 'text-green-600'}`}>
                              {chartVal! < 0 ? chartVal!.toFixed(0) : `(${chartVal!.toFixed(2)})`}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-1 px-2 relative">
                        <div className="flex justify-end gap-1 lg:gap-2">
                          <div className="relative">
                            <div className="flex gap-1 lg:gap-1 transition-all duration-300">
                              {/* LEFT GROUP (BACK for ODDS, NO for FANCY) */}
                              <div className={`flex items-center justify-end gap-0.5 md:gap-2 ${(isSixValueMarket || isFancyGroup) ? 'w-fit md:w-[196px]' : ''}`}>
                                {(isSixValueMarket || isFancyGroup) && (
                                  <>
                                    {isSixValueMarket ? (
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
                                  val={(isFancyGroup && marketType === 'FANCY') ? lay.p1 : back.p1}
                                  vol={(isFancyGroup && marketType === 'FANCY') ? lay.v1 : back.v1}
                                  type={(isFancyGroup && marketType === 'FANCY') ? 'lay' : 'back'}
                                  intensity="high"
                                  onClick={() => handleAddBet((isFancyGroup && marketType === 'FANCY') ? lay.p1 : back.p1, (isFancyGroup && marketType === 'FANCY') ? 'lay' : 'back')}
                                  isSuspended={isSuspended}
                                />
                              </div>

                              {/* RIGHT GROUP (LAY for ODDS, YES for FANCY) */}
                              <div className={`flex items-center justify-start gap-0.5 md:gap-2 ${(isSixValueMarket || isFancyGroup) ? 'w-fit md:w-[196px]' : ''}`}>
                                <OddsBox
                                  val={(isFancyGroup && marketType === 'FANCY') ? back.p1 : lay.p1}
                                  vol={(isFancyGroup && marketType === 'FANCY') ? back.v1 : lay.v1}
                                  type={(isFancyGroup && marketType === 'FANCY') ? 'back' : 'lay'}
                                  intensity="high"
                                  onClick={() => handleAddBet((isFancyGroup && marketType === 'FANCY') ? back.p1 : lay.p1, (isFancyGroup && marketType === 'FANCY') ? 'back' : 'lay')}
                                  isSuspended={isSuspended}
                                />
                                {(isSixValueMarket || isFancyGroup) && (
                                  <>
                                    {isSixValueMarket ? (
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
                                <div className="relative z-10 bg-[#e0e0e0] w-[110px] lg:w-[150px] py-[6px] flex items-center justify-center drop-shadow-sm whitespace-nowrap max-w-[95%]">
                                  <span className="text-[#0d47a1] text-[11px] lg:text-[13px] font-black uppercase tracking-wide leading-none truncate">
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
                      <tr
                        ref={betslipRowRef}
                        className="lg:hidden animate-in slide-in-from-top-4 duration-300"
                      >
                        <td colSpan={2} className="p-2 pt-0 bg-white border-b border-black/30">
                          <BetSlipForm selection={selections[0]} onClose={clearAll} />
                        </td>
                      </tr>
                    )}
                    {isFancy && rowMsg && (
                      <tr key={mId + '-' + runnerId + '-msg'} className="bg-[#1a1a1a] border-t-2 border-[#f36c21]">
                        <td colSpan={2} className="px-3 lg:px-4 py-1.5 border-0">
                          <div className="flex items-center gap-3 overflow-hidden h-5 w-full">
                            <Megaphone size={12} className="text-[#f36c21] flex-shrink-0" />
                            <div className="relative flex-1 min-w-0 overflow-hidden pointer-events-none">
                              <div className="whitespace-nowrap animate-ticker">
                                <span className="text-[10px] lg:text-[11px] font-black text-white uppercase tracking-wider">
                                  {rowMsg}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
            {/* Unified Table Message at the bottom */}
            {(() => {
              const allMsgs = [
                msg,
                ...(Array.isArray(runners) ? runners : Object.values(runners || {}))
                  .map((r: any) => r.Msg || r.msg)
              ].filter(m => m && m !== '')
              const uniqueMsg = Array.from(new Set(allMsgs)).join(' | ')

              if (!uniqueMsg || isFancyGroup) return null;

              return (
                <tfoot>
                  <tr className="bg-[#111] border-t border-white/5">
                    <td colSpan={2} className="py-1 px-3 lg:px-4">
                      <div className="flex items-center gap-3 overflow-hidden h-6 w-full">
                        <Megaphone size={12} className="text-[#f36c21] flex-shrink-0" />
                        <div className="relative flex-1 min-w-0 overflow-hidden pointer-events-none">
                          <div className="whitespace-nowrap animate-ticker">
                            <span className="text-[10px] lg:text-[11px] font-black text-white uppercase tracking-wider">
                              {uniqueMsg}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              )
            })()}
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
  const [unmatchedOpen, setUnmatchedOpen] = useState(true)
  const [matchedOpen, setMatchedOpen] = useState(true)

  // Fancy Chart State
  const [fancyChartOpen, setFancyChartOpen] = useState(false)
  const [fancyChartLoading, setFancyChartLoading] = useState(false)
  const [fancyChartData, setFancyChartData] = useState<any>(null)
  const [fancyChartTitle, setFancyChartTitle] = useState('')
  const [scoreboardHtml, setScoreboardHtml] = useState<string | null>(null)
  const [cashoutLoading, setCashoutLoading] = useState<string | null>(null)
  const [betsLoading, setBetsLoading] = useState(false)

  const filteredBets = useMemo(() => {
    if (!matchId) return bets;
    return bets.filter((b: any) => 
      b.gid === matchId || 
      b.matchId === matchId || 
      b.eventId === matchId ||
      b.eventId === matchId.toString()
    )
  }, [bets, matchId])

  const groupBetsByMarket = (betsToGroup: any[]) => {
    const groups: Record<string, any[]> = {}
    betsToGroup.forEach((bet) => {
      const marketName = bet.Game_Type || 'Odds'
      const key = `${bet.Game} ${marketName}`
      if (!groups[key]) groups[key] = []
      groups[key].push(bet)
    })
    return groups
  }

  const calculateBetProfit = (bet: any) => {
    const odds = parseFloat(bet.Rate) || 0
    const stake = parseFloat(bet.Stake) || 0
    const mType = (bet.Game_Type || '').toUpperCase()
    const isBack = bet.Side === 'back'

    let value = 0
    if (mType.includes('BOOKMAKER')) {
      value = (odds * stake) / 100
    } else if (mType.includes('FANCY') || mType.includes('LINE')) {
      value = isBack ? (odds * stake / 100) : stake
    } else {
      value = (odds - 1) * stake
    }
    return Math.floor(value).toLocaleString()
  }

  const groupedChartData = useMemo(() => {
    if (!fancyChartData || typeof fancyChartData !== 'object' || fancyChartData.error) return [];
    
    // API returns numeric keys as strings
    const keys = Object.keys(fancyChartData)
      .filter(k => !isNaN(parseInt(k)))
      .sort((a, b) => parseInt(a) - parseInt(b));
      
    if (keys.length === 0) return [];

    const result = [];
    let startKey = keys[0];
    let currentValue = fancyChartData[startKey];

    for (let i = 1; i < keys.length; i++) {
      const key = keys[i];
      const val = fancyChartData[key];

      if (val !== currentValue) {
        const endKey = keys[i - 1];
        result.push({
          run: startKey === endKey ? startKey : `${startKey} - ${endKey}`,
          position: currentValue
        });
        startKey = key;
        currentValue = val;
      }
    }

    const lastKey = keys[keys.length - 1];
    result.push({
      run: startKey === lastKey ? startKey : `${startKey} - ${lastKey}`,
      position: currentValue
    });

    return result;
  }, [fancyChartData]);

  const { addSelection, setStake, clearAll } = useBetSlipStore()

  const handleCashout = async (mId: string, mName: string, runners: any[], mType: string) => {
    if (!user?.loginToken) {
      showSnackbar('Please login to cashout', 'error')
      return
    }

    const eventId = mId || gameData?.Event_Id || gameData?.eventid || matchId;
    setCashoutLoading(mId)
    try {
      const res = await bettingController.cashout(user.loginToken, eventId)
      const cashout = Array.isArray(res) ? res[0] : res

      if (cashout && cashout.Amount > 0) {
        // Map Team "A" -> 0, Team "B" -> 1
        const teamIdx = cashout.Team === 'B' ? 1 : 0
        const runner = runners[teamIdx]
        if (!runner) throw new Error('Runner not found')

        const selectionId = runner.selectionId || runner.id || runner.SelectionId || `${mId}-${teamIdx}`
        const bSide = cashout.Type === 'L' ? 'lay' : 'back'

        clearAll()
        addSelection({
          id: `${mId}-${selectionId}-${bSide}`,
          matchId: matchId,
          eventId: eventId,
          marketId: mId,
          selectionId: selectionId.toString(),
          matchName: matchName,
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

  // TV State
  const [tvVisible, setTvVisible] = useState(false)
  const [tvHtml, setTvHtml] = useState<string | null>(null)
  const [tvLoading, setTvLoading] = useState(false)

  const toggleTv = async () => {
    if (!tvVisible && !tvHtml) {
      const eventId = gameData?.Event_Id || gameData?.eventid || matchId;
      if (!user?.loginToken) {
        showSnackbar('Please login to watch TV', 'error')
        return
      }
      setTvLoading(true)
      try {
        const res = await marketController.getOpenTv(user.loginToken, eventId)
        if (res.error === '0' && res.data) {
          setTvHtml(res.data)
          setTvVisible(true)
        } else {
          showSnackbar(res.msg || 'TV not available for this event', 'info')
        }
      } catch (err) {
        showSnackbar('Failed to load TV', 'error')
      } finally {
        setTvLoading(false)
      }
    } else {
      setTvVisible(!tvVisible)
    }
  }

  const openFancyChart = async (eid: string, name: string) => {
    if (!user?.loginToken) {
      showSnackbar('Please login to view chart', 'error')
      return
    }
    setFancyChartTitle(name)
    setFancyChartOpen(true)
    setFancyChartLoading(true)
    setFancyChartData(null)
    try {
      const res = await bettingController.getFancyChart(user.loginToken, eid)
      setFancyChartData(res)
    } catch (err) {
      console.error('Failed to fetch fancy chart:', err)
      setFancyChartData({ error: '1', msg: 'Failed to load chart data' })
    } finally {
      setFancyChartLoading(false)
    }
  }

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
      // Extract the eid from the first event in gameData (typically Match Odds)
      const eidToUse = gameData?.events?.['0']?.eid ||
        gameData?.events?.[0]?.eid ||
        gameData?.eventId ||
        matchId;

      const res = await marketController.toggleFavourite(user.loginToken, eidToUse)
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
    if (!pusherClient) return
    const channel = pusherClient.subscribe('eventrefersh')

    channel.bind('my-event', (msg: any) => {
      // The developer said msg[0] contains the gid
      const eventGid = msg[0]?.toString()
      if (eventGid === matchId.toString()) {
        fetchGameData() // Trigger a structural refresh
      }
    })

    return () => {
      pusherClient?.unsubscribe('eventrefersh')
    }
  }, [matchId, fetchGameData])

  // 🔄 Listen for manual bet placement success to refresh data immediately
  useEffect(() => {
    const handleBetPlaced = (e: any) => {
      if (e.detail?.matchId?.toString() === matchId?.toString()) {
        fetchGameData()
      }
    }
    window.addEventListener('bet-placed', handleBetPlaced)
    return () => window.removeEventListener('bet-placed', handleBetPlaced)
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
          const isSpecial = ['LINE', 'FANCY', 'BOOKMAKER', 'EXTRA', 'GOAL'].includes(m.category) || (m.Type || '').toUpperCase() === 'FANCY' || (m.name || '').toLowerCase().includes('line');
          const mid = (m.MarketId?.toString().startsWith('1.') || m.marketid?.toString().startsWith('1.'))
            ? (m.MarketId || m.marketid)
            : (isSpecial ? (m.eid || m.MarketId || m.marketid) : (m.MarketId || m.marketid || m.eid))
          if (mid) {
            marketsToPoll.push({
              gid: matchId,
              MarketId: mid.toString(),
              eventid: dataToUse.Event_Id || dataToUse.eventid || matchId,
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
                const mid = m.MarketId;
                
                // Robust extraction of scoreboard HTML
                // Check multiple possible keys: "2" (3rd), "1" (2nd), "3" (4th)
                // Check both at root and within the market-specific object
                const lookupKeys = ["2", "1", "3", 2, 1, 3];
                let foundHtml = "";
                
                for (const k of lookupKeys) {
                  const val = res[k as any] || (mid && res[mid] && res[mid][k as any]);
                  if (val && typeof val === 'string' && (val.includes('<div') || val.includes('<style'))) {
                    foundHtml = val;
                    break;
                  }
                }
                
                if (foundHtml && isMounted) {
                  setScoreboardHtml(foundHtml);
                }

                const ekey = m.ekey, gid = m.gid;
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

  const gameTime = useMemo(() => {
    if (!gameData) return null
    const timeKeys = ['DateTime', 'dateTime', 'Datetime', 'staredtime', 'StartTime']
    let str = ''
    for (const k of timeKeys) {
      if (gameData[k]) { str = gameData[k]; break; }
    }
    return str ? formatDate(str) : null
  }, [gameData])

  const allMarkets = useMemo(() => {
    if (!gameData) return []
    const raw = [
      ...(gameData.ODDS ? (Array.isArray(gameData.ODDS) ? gameData.ODDS : Object.values(gameData.ODDS))
        .filter((m: any) => m && m.active !== 'No')
        .map((m: any) => ({ ...m, category: 'ODDS' })) : []),
      ...(gameData.BOOKMAKER ? (Array.isArray(gameData.BOOKMAKER) ? gameData.BOOKMAKER : Object.values(gameData.BOOKMAKER))
        .filter((m: any) => m && m.active !== 'No')
        .map((m: any) => ({ ...m, category: 'BOOKMAKER' })) : []),
      ...(gameData.FANCY ? (Array.isArray(gameData.FANCY) ? gameData.FANCY : Object.values(gameData.FANCY))
        .filter((m: any) => m && m.active !== 'No')
        .map((m: any) => ({ ...m, category: (m.name || m.MarketName || '').toLowerCase().includes('line') ? 'LINE' : 'FANCY' })) : []),
      ...(gameData.events ? (Array.isArray(gameData.events) ? gameData.events : Object.values(gameData.events))
        .filter((m: any) => m && m.active !== 'No')
        .map((m: any) => ({ ...m, category: (m.Type || 'ODDS').toUpperCase() === 'FANCY' && (m.name || m.MarketName || '').toLowerCase().includes('line') ? 'LINE' : (m.Type || 'ODDS') })) : []),
      ...(gameData.LINE ? (Array.isArray(gameData.LINE) ? gameData.LINE : Object.values(gameData.LINE))
        .filter((m: any) => m && m.active !== 'No')
        .map((m: any) => ({ ...m, category: 'LINE' })) : []),
      ...(gameData.EXTRA ? (Array.isArray(gameData.EXTRA) ? gameData.EXTRA : Object.values(gameData.EXTRA))
        .filter((m: any) => m && m.active !== 'No')
        .map((m: any) => ({ ...m, category: 'EXTRA' })) : [])
    ]
    return raw.filter((m, i, self) => {
      if (!m) return false;
      const isSpecial = m.category === 'LINE' || m.category === 'FANCY' || m.category === 'BOOKMAKER' || m.category === 'EXTRA' || m.category === 'GOAL';
      const bestId = (m.MarketId?.toString().startsWith('1.') || m.marketid?.toString().startsWith('1.'))
        ? (m.MarketId || m.marketid)
        : (isSpecial ? (m.eid || m.MarketId || m.marketid) : (m.MarketId || m.marketid || m.eid));
      const uid = bestId + '-' + (m.eid || i);
      return self.findIndex(t => {
        const tIsSpecial = t.category === 'LINE' || t.category === 'FANCY' || t.category === 'BOOKMAKER' || t.category === 'EXTRA' || t.category === 'GOAL';
        const tBestId = (t.MarketId?.toString().startsWith('1.') || t.marketid?.toString().startsWith('1.'))
          ? (t.MarketId || t.marketid)
          : (tIsSpecial ? (t.eid || t.MarketId || t.marketid) : (t.MarketId || t.marketid || t.eid));
        return (tBestId + '-' + (t.eid || self.indexOf(t))) === uid;
      }) === i;
    })
  }, [gameData]);

  return (
    <div className="flex-1 min-h-screen bg-[#111] flex flex-col lg:flex-row lg:gap-4 lg:bg-transparent">
      <div className="flex-1 flex flex-col min-w-0 bg-[#111] rounded-lg overflow-hidden">
        <div className="bg-[#1a1a1a] border-b border-white/5 px-2 lg:px-4 h-12 flex items-center justify-between relative z-20">
          <div className="flex items-center gap-2 lg:gap-4 overflow-hidden flex-1 min-w-0">
            <button onClick={() => router.back()} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all flex-shrink-0"><ChevronLeft size={20} /></button>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-2 min-w-0">
                <h1 className="text-white text-[12px] lg:text-[14px] font-black uppercase tracking-wider truncate">
                  {matchName}
                </h1>
                <button
                  onClick={handleToggleFav}
                  disabled={favLoading}
                  className={`flex-shrink-0 transition-all ${favLoading ? 'opacity-50 cursor-wait' : 'hover:scale-110 active:scale-95'}`}
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
                <button
                  onClick={toggleTv}
                  disabled={tvLoading}
                  className={`ml-2 flex-shrink-0 transition-all ${tvLoading ? 'opacity-50 cursor-wait' : 'hover:scale-110 active:scale-95'}`}
                  title="Toggle Live TV"
                >
                  {tvLoading ? (
                    <Loader2 size={16} className="text-[#f36c21] animate-spin" />
                  ) : (
                    <Tv
                      size={18}
                      className={`transition-colors ${tvVisible ? 'text-[#f36c21]' : 'text-white/40'}`}
                    />
                  )}
                </button>
              </div>
              {gameTime && (
                <span className="text-[10px] text-[#f36c21] font-bold uppercase tracking-wider leading-none mt-0.5 truncate">
                  {gameTime}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="p-0 lg:px-6 lg:pb-6 lg:pt-2 space-y-0">
          <div className="flex lg:hidden bg-[#1a1a1a] border-b border-white/10 h-10 px-4 gap-4 relative z-20 justify-start">
            <button
              onClick={() => setActiveTab('MARKETS')}
              className="h-full relative group flex items-center"
            >
              <span className={`text-[13px] font-black uppercase tracking-tight h-full flex items-center transition-all border-b-2 ${activeTab === 'MARKETS'
                ? 'text-[#f36c21] border-[#f36c21]'
                : 'text-white/60 border-transparent hover:text-white'
                }`}>
                MARKETS
              </span>
            </button>
            {user && (
              <button
                onClick={() => setActiveTab('OPEN_BETS')}
                className="h-full relative group flex items-center"
              >
                <span className={`text-[13px] font-black uppercase tracking-tight h-full flex items-center transition-all border-b-2 ${activeTab === 'OPEN_BETS'
                  ? 'text-[#f36c21] border-[#f36c21]'
                  : 'text-white/60 border-transparent hover:text-white'
                  }`}>
                  OPEN BETS {filteredBets.length > 0 && <span className="ml-1 text-[10px] opacity-80">({filteredBets.length})</span>}
                </span>
              </button>
            )}
          </div>
          <div className="p-3 lg:p-0">
            {activeTab === 'MARKETS' ? (
              <div className="space-y-4">
                {(() => {
                  const gameEventId = gameData?.Event_Id || gameData?.eventid || matchId;
                  const t1 = gameData?.Team1 || '';
                  const t2 = gameData?.Team2 || '';
                  return (
                    <>
                      {/* TV HTML (Mobile Only) */}
                      {tvVisible && tvHtml && (
                        <div className="block lg:hidden w-full mb-6 bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10 aspect-video relative group">
                          <iframe
                            srcDoc={tvHtml}
                            className="w-full h-full border-0"
                            allowFullScreen
                            sandbox="allow-scripts allow-same-origin allow-forms"
                          />
                          <button 
                            onClick={() => setTvVisible(false)}
                            className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 shadow-xl border border-white/10"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      )}

                      {/* Scoreboard HTML */}
                      {scoreboardHtml && (
                        <div
                          className="w-full mb-4 overflow-hidden rounded-xl shadow-lg border border-white/10"
                          dangerouslySetInnerHTML={{ __html: scoreboardHtml }}
                        />
                      )}

                      {/* 1. ODDS Markets */}
                      {allMarkets.filter(m => m.category === 'ODDS').map((m: any, mIdx: number) => {
                        let runners = m.runner || m.runners || [];
                        if (!Array.isArray(runners)) runners = Object.values(runners);
                        return <MarketTable key={m.MarketId || m.eid || mIdx} marketName={m.name || 'Match Odds'} runners={runners} marketId={m.MarketId || m.eid || m.marketid} payloadEid={m.eid} liveRates={liveOdds} matchName={matchName} marketType="ODDS" marketIndex={mIdx} eventId={gameEventId} team1={t1} team2={t2} min={m.min} max={m.max} msg={m.Msg} onOpenFancyChart={openFancyChart} onCashout={handleCashout} isCashoutLoading={cashoutLoading === (m.MarketId || m.eid || m.marketid)} />
                      })}

                      {/* 2. BOOKMAKER Markets */}
                      {allMarkets.filter(m => m.category === 'BOOKMAKER').map((m: any, mIdx: number) => {
                        let runners = m.runner || m.runners || [];
                        if (!Array.isArray(runners)) runners = Object.values(runners);
                        const mId = (m.MarketId?.toString().startsWith('1.') || m.marketid?.toString().startsWith('1.')) ? (m.MarketId || m.marketid) : (m.eid || m.MarketId || m.marketid);
                        return <MarketTable key={mId || mIdx} marketName={m.name || 'Match Winner (Bookmaker)'} runners={runners} marketId={mId} payloadEid={m.eid} liveRates={liveOdds} matchName={matchName} marketType="BOOKMAKER" marketIndex={mIdx} eventId={gameEventId} team1={t1} team2={t2} min={m.min} max={m.max} msg={m.Msg} onOpenFancyChart={openFancyChart} onCashout={handleCashout} isCashoutLoading={cashoutLoading === (m.MarketId || m.eid || m.marketid)} />
                      })}

                      {/* 3. LINE Group */}
                      {allMarkets.filter(m => m.category === 'LINE').length > 0 && (
                        <MarketTable marketName="LINE MARKET" runners={allMarkets.filter(m => m.category === 'LINE')} marketId="LINE_GROUP" liveRates={liveOdds} matchName={matchName} marketType="LINE" marketIndex={998} eventId={gameEventId} team1={t1} team2={t2} onOpenFancyChart={openFancyChart} />
                      )}

                      {/* 4. FANCY Group */}
                      {allMarkets.filter(m => m.category === 'FANCY').length > 0 && (
                        <MarketTable marketName="FANCY" runners={allMarkets.filter(m => m.category === 'FANCY')} marketId="FANCY_GROUP" liveRates={liveOdds} matchName={matchName} marketType="FANCY" marketIndex={999} eventId={gameEventId} team1={t1} team2={t2} onOpenFancyChart={openFancyChart} />
                      )}

                      {/* 4. EXTRA Markets (e.g. Tied Match) */}
                      {allMarkets.filter(m => m.category === 'EXTRA').map((m: any, mIdx: number) => {
                        let runners = m.runner || m.runners || [];
                        if (!Array.isArray(runners)) runners = Object.values(runners);
                        const mId = (m.MarketId?.toString().startsWith('1.') || m.marketid?.toString().startsWith('1.')) ? (m.MarketId || m.marketid) : (m.eid || m.MarketId || m.marketid);
                        return <MarketTable key={mId || mIdx} marketName={m.name || 'Extra Markets'} runners={runners} marketId={mId} payloadEid={m.eid} liveRates={liveOdds} matchName={matchName} marketType="EXTRA" marketIndex={mIdx} eventId={gameEventId} team1={t1} team2={t2} min={m.min} max={m.max} msg={m.Msg} onOpenFancyChart={openFancyChart} onCashout={handleCashout} isCashoutLoading={cashoutLoading === mId} />
                      })}

                      {/* 5. GOAL Markets (e.g. Over/Under Goals) */}
                      {allMarkets.filter(m => m.category === 'GOAL').map((m: any, mIdx: number) => {
                        let runners = m.runner || m.runners || [];
                        if (!Array.isArray(runners)) runners = Object.values(runners);
                        const mId = (m.MarketId?.toString().startsWith('1.') || m.marketid?.toString().startsWith('1.')) ? (m.MarketId || m.marketid) : (m.eid || m.MarketId || m.marketid);
                        return <MarketTable key={mId || mIdx} marketName={m.name || 'Goal Markets'} runners={runners} marketId={mId} payloadEid={m.eid} liveRates={liveOdds} matchName={matchName} marketType="GOAL" marketIndex={mIdx} eventId={gameEventId} team1={t1} team2={t2} min={m.min} max={m.max} msg={m.Msg} onOpenFancyChart={openFancyChart} onCashout={handleCashout} isCashoutLoading={cashoutLoading === mId} />
                      })}

                      {/* 6. Others */}
                      {allMarkets.filter(m => !['ODDS', 'BOOKMAKER', 'FANCY', 'EXTRA', 'GOAL'].includes(m.category)).map((m: any, mIdx: number) => {
                        let runners = m.runner || m.runners || [];
                        if (!Array.isArray(runners)) runners = Object.values(runners);
                        const isLineOrFancy = m.category === 'LINE' || m.category === 'FANCY';
                        const mId = (m.MarketId?.toString().startsWith('1.') || m.marketid?.toString().startsWith('1.')) ? (m.MarketId || m.marketid) : (isLineOrFancy ? (m.eid || m.MarketId || m.marketid) : (m.MarketId || m.marketid || m.eid));
                        return <MarketTable key={mId || mIdx} marketName={m.name || m.category} runners={runners} marketId={mId} payloadEid={m.eid} liveRates={liveOdds} matchName={matchName} marketType={m.category} marketIndex={mIdx} eventId={gameEventId} team1={t1} team2={t2} min={m.min} max={m.max} msg={m.Msg} onOpenFancyChart={openFancyChart} onCashout={handleCashout} isCashoutLoading={cashoutLoading === mId} />
                      })}
                    </>
                  )
                })()}
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                {[{ title: 'Unmatched Bets', items: filteredBets.filter(b => !b.Type?.toLowerCase().includes('match') && b.IsMatched !== '1'), open: unmatchedOpen, setOpen: setUnmatchedOpen },
                { title: 'Matched Bets', items: filteredBets.filter(b => b.Type?.toLowerCase().includes('match') || b.IsMatched === '1'), open: matchedOpen, setOpen: setMatchedOpen }].map((sec, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-[#f36c21] bg-[#111]">
                    <button onClick={() => sec.setOpen(!sec.open)} className="w-full flex items-center justify-between px-4 py-4 bg-[#222] text-white/90 text-[13px] font-bold tracking-tight">
                      <div className="flex items-center gap-2"><span className={sec.open ? 'text-[#f36c21]' : ''}>{sec.title}</span>{sec.items.length > 0 && <span className="bg-[#f36c21] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{sec.items.length}</span>}</div>
                      <div className="bg-[#f36c21] rounded-full p-0.5 w-6 h-6 flex items-center justify-center transition-transform duration-300"><ChevronDown size={16} className={`text-white transition-transform duration-300 ${sec.open ? 'rotate-180' : ''}`} /></div>
                    </button>
                    {sec.open && (
                      <div className="px-2 pb-2 space-y-4 bg-[#111] animate-in fade-in slide-in-from-top-2 duration-300">
                        {betsLoading ? (
                          <div className="p-12 flex justify-center"><Loader2 size={24} className="text-[#f36c21] animate-spin" /></div>
                        ) : sec.items.length > 0 ? (
                          Object.entries(groupBetsByMarket(sec.items)).map(([groupKey, betsInGroup], gIdx) => (
                            <div key={gIdx} className="overflow-hidden rounded-[4px] shadow-xl border border-white/5">
                              <table className="w-full text-left bg-white">
                                <thead className="bg-white">
                                  <tr className="border-b border-gray-100">
                                    <th className="py-2 px-3 text-[11px] font-bold text-gray-500 w-[40%]">{groupKey}</th>
                                    <th className="py-2 px-3 text-[11px] font-bold text-gray-500 text-center uppercase">Runs</th>
                                    <th className="py-2 px-3 text-[11px] font-bold text-gray-500 text-center uppercase">Stake</th>
                                    <th className="py-2 px-3 text-[11px] font-bold text-gray-500 text-right uppercase">Profit/Liability</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {betsInGroup.map((bet, bIdx) => (
                                    <tr key={bIdx} className={`${bet.Side === 'back' ? 'bg-[#a5d9fe]' : 'bg-[#f8d0ce]'} text-[#333]`}>
                                      <td className="py-2.5 px-3 text-[13px] font-black">
                                        <div className="flex flex-col">
                                          <span>{bet.Selection} {bet.Side === 'lay' && '(LAY)'}</span>
                                          {bet.Game_Type && <span className="text-[10px] font-bold text-gray-600 uppercase mt-0.5">{bet.Game_Type}</span>}
                                        </div>
                                      </td>
                                      <td className="py-2.5 px-3 text-[13px] font-black text-center">{bet.Rate}</td>
                                      <td className="py-2.5 px-3 text-[13px] font-black text-center">{bet.Stake}</td>
                                      <td className="py-2.5 px-3 text-[13px] font-black text-right">
                                        {sec.title === 'Unmatched Bets' ? '0' : calculateBetProfit(bet)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ))
                        ) : (
                          <div className="p-12 text-center text-white/20 text-[11px] font-black uppercase tracking-[0.2em] italic">
                            No {sec.title}
                          </div>
                        )}
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
        <div className="hidden lg:flex flex-col w-[480px] sticky top-0 max-h-screen self-start shrink-0 lg:border-none lg:rounded-lg border-l border-white/5 bg-[#111] z-30 overflow-hidden">
          {/* Desktop TV */}
          {tvVisible && tvHtml && (
            <div className="w-full bg-black overflow-hidden shadow-2xl border-b border-white/10 aspect-video relative group flex-shrink-0">
              <iframe
                srcDoc={tvHtml}
                className="w-full h-full border-0"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
              <button 
                onClick={() => setTvVisible(false)}
                className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 shadow-xl border border-white/10"
              >
                <X size={18} />
              </button>
            </div>
          )}
          <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
            <BetContainer matchId={matchId} />
          </div>
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
              ) : fancyChartData?.error === '1' ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <AlertCircle size={32} className="text-red-500 mb-2 opacity-20" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{fancyChartData.msg || 'Failed to load chart'}</p>
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
