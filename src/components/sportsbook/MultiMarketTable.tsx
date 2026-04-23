'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Star, Info, Megaphone } from 'lucide-react'
import { useRouter } from 'next/navigation'
import CashoutButton from './CashoutButton'

interface Runner {
  RunnerName: string
  SelectionId: string
  SortPriority: string
  Chart?: string
  back?: { price?: number; rate?: number; size?: string }[]
  lay?: { price?: number; rate?: number; size?: string }[]
  [key: string]: any
}

interface MultiMarketTableProps {
  sportName: string
  competitionName: string
  marketName: string
  runners: Runner[]
  rateData: any // Raw live data from rate API
  isFavourite?: boolean
  onToggleFavourite?: () => void
  onRowClick?: (runner: Runner) => void
  onCashout?: (mId: string, mName: string, runners: any[], mType: string) => void
  isCashoutLoading?: boolean
}

const OddsBox = ({ val, vol, type, intensity = 'high', onClick, isSuspended = false, className = "" }: any) => {
  const bgColor = type === 'back'
    ? (intensity === 'high' ? 'bg-[#a5d9fe]' : intensity === 'medium' ? 'bg-[#bce4ff]' : 'bg-[#d1eeff]')
    : (intensity === 'high' ? 'bg-[#f8d0ce]' : intensity === 'medium' ? 'bg-[#fbe3e2]' : 'bg-[#fff0f0]')

  const isEmpty = !val || val === '0' || val === '0.00' || val === '-' || parseFloat(val) === 0
  const isDisabled = isEmpty || isSuspended

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`w-[54px] lg:w-[62px] h-[38px] rounded-[4px] flex flex-col items-center justify-center transition-all shadow-sm border border-transparent ${bgColor} ${isEmpty ? 'opacity-40 cursor-not-allowed' : ''} ${!isDisabled ? 'hover:brightness-95 active:scale-95' : 'cursor-not-allowed'} ${className}`}
    >
      <span className="text-[12px] lg:text-[13px] font-black text-[#2e2e2e] leading-none mb-0.5 tracking-tight">{val || '-'}</span>
      <span className="text-[8.5px] lg:text-[9px] text-[#555] font-bold leading-none truncate max-w-full px-0.5">{vol || '0'}</span>
    </button>
  )
}

export default function MultiMarketTable({
  sportName,
  competitionName,
  marketName,
  runners,
  rateData,
  isFavourite,
  onToggleFavourite,
  onRowClick,
  onCashout,
  isCashoutLoading
}: MultiMarketTableProps) {

  // PORTED getRunnerRates logic from Match Detail Page
  const getRunnerRatesForFavorites = (runnerId: any, rIdx: number, runner: any) => {
    if (!rateData) return { back: { p1: '', v1: '', p2: '', v2: '', p3: '', v3: '' }, lay: { p1: '', v1: '', p2: '', v2: '', p3: '', v3: '' }, isRunnerSuspended: false }

    let isRunnerSuspended = false
    const runnersData = rateData.runner || rateData.runners || rateData.rates || []
    const runnerArr = Array.isArray(runnersData) ? runnersData : Object.values(runnersData)

    let r = runnerArr.find((item: any) =>
      (item.selectionId?.toString() === runnerId?.toString()) ||
      (item.SelectionId?.toString() === runnerId?.toString()) ||
      (item.id?.toString() === runnerId?.toString())
    )
    if (!r) r = runnerArr[rIdx]

    if (r && (r.selectionStatus === 'SUSPENDED' || r.status === 'SUSPENDED' || r.selectionStatus === '1' || r.status === '1')) {
      isRunnerSuspended = true
    }

    const parsePrices = (r: any, type: 'back' | 'lay') => {
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

      // Corrected: no1 is typically NO (Smaller), no2 is typically YES (Bigger)
      const p = (type === 'back' ? (r.no2 ?? r.BackPrice1 ?? r.rate) : (r.no1 ?? r.LayPrice1 ?? r.rate))?.toString() || ''
      const v = (type === 'back' ? (r.valy ?? r.size) : (r.valn ?? r.size))?.toString() || ''
      return { p1: p, v1: v, p2: '', v2: '', p3: '', v3: '' }
    }

    return { back: parsePrices(r, 'back'), lay: parsePrices(r, 'lay'), isRunnerSuspended }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] mb-6 relative overflow-hidden">
      {/* Compact Minimal Header (Matches User Image) */}
      <div className="bg-[#e8612c] flex items-center justify-between px-2 lg:px-4 h-10 border-b border-black/30">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-white text-[11px] font-black uppercase tracking-tight truncate">{sportName}: {competitionName}</span>
            {((marketName.toUpperCase() === 'MATCH ODDS' || marketName.toUpperCase() === 'BOOKMAKER') && runners.length === 2) && (
              <CashoutButton
                amount={0}
                onCashout={() => onCashout?.('0', marketName, runners, marketName.toUpperCase().includes('BOOKMAKER') ? 'BOOKMAKER' : 'ODDS')}
                isLoading={isCashoutLoading}
                className="scale-75"
              />
            )}
          </div>
          <span className="text-white/60 text-[9px] font-bold uppercase tracking-widest leading-none mt-0.5">{marketName}</span>
        </div>
        <div className="flex items-center">
          <Star
            size={18}
            className={`transition-colors cursor-pointer ${isFavourite ? 'text-yellow-500 fill-yellow-500' : 'text-white fill-none'}`}
            strokeWidth={2.5}
            onClick={onToggleFavourite}
          />
        </div>
      </div>

      {/* Runners List - No Column Headers */}
      <div className="overflow-hidden lg:overflow-visible text-gray-800">
        <table className="w-full border-collapse table-fixed">
          <tbody className="divide-y divide-black/30">
            {runners
              .sort((a, b) => parseInt(a.SortPriority || '0') - parseInt(b.SortPriority || '0'))
              .map((runner, idx) => {
                const { back, lay, isRunnerSuspended } = getRunnerRatesForFavorites(runner.SelectionId || runner.selectionId, idx, runner)

                const isFancy = marketName.toUpperCase() === 'FANCY' || marketName.toUpperCase() === 'LINE MARKET'
                const isBookmaker = marketName.toUpperCase() === 'BOOKMAKER'

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
                  isMarketSuspended = rateData?.status === 'SUSPENDED' || rateData?.suspended === 'Y' || rateData?.active === 'No'
                }

                const isSuspended = isMarketSuspended || isRunnerSuspended || !!rateData?.Msg
                const displayMsg = (isMarketSuspended && suspensionMsg === 'BALL RUNNING') ? 'BALL RUNNING' : (rateData?.Msg || suspensionMsg)

                return (
                  <React.Fragment key={runner.SelectionId || idx}>
                    <tr className="hover:bg-gray-50/50 transition-colors group relative border-b border-black/30 last:border-0">
                      <td className="py-3 px-3 lg:px-5 w-full overflow-hidden" onClick={() => onRowClick && onRowClick(runner)}>
                        <div className="flex items-center justify-between w-full cursor-pointer">
                          <span className="text-[13px] font-bold tracking-tight uppercase truncate pr-2">
                            {runner.RunnerName || 'Runner'}
                          </span>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {isFancy && (
                              <div className="relative group/tooltip">
                                <div
                                  className="bg-black text-white rounded-full w-4 h-4 flex items-center justify-center cursor-help hover:bg-[#e8612c] transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Info size={11} strokeWidth={3} />
                                </div>
                                <div className="absolute bottom-full right-0 mb-2 hidden group-hover/tooltip:block z-[100] min-w-[140px] pointer-events-none">
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
                                  <div className="w-2.5 h-2.5 bg-[#222] border-r border-b border-white/10 rotate-45 -mt-1.5 ml-auto mr-1.5" />
                                </div>
                              </div>
                            )}
                            {isFancy && runner.Chart !== null && runner.Chart !== undefined && runner.Chart !== '0' && runner.Chart !== '' && (
                              <div className="flex-shrink-0">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900">
                                  <path d="M8 3v18M16 3v18M8 7h8M8 12h8M8 17h8" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-1 px-2 relative w-[130px] md:w-[410px] shrink-0">
                        <div className="flex justify-end gap-1 lg:gap-2 pr-2">
                          <div className="relative">
                            <div className="flex gap-1 lg:gap-2">
                              <div className="flex items-center justify-end gap-1 md:gap-2 w-fit md:w-[196px]">
                                <OddsBox className="hidden md:flex" val={back.p3} vol={back.v3} type="back" intensity="low" isSuspended={isSuspended} />
                                <OddsBox className="hidden md:flex" val={back.p2} vol={back.v2} type="back" intensity="medium" isSuspended={isSuspended} />
                                <OddsBox val={back.p1 || runner.Chart} vol={back.v1} type="back" intensity="high" isSuspended={isSuspended} />
                              </div>
                              <div className="flex items-center justify-start gap-1 md:gap-2 w-fit md:w-[196px]">
                                <OddsBox val={lay.p1} vol={lay.v1} type="lay" intensity="high" isSuspended={isSuspended} />
                                <OddsBox className="hidden md:flex" val={lay.p2} vol={lay.v2} type="lay" intensity="medium" isSuspended={isSuspended} />
                                <OddsBox className="hidden md:flex" val={lay.p3} vol={lay.v3} type="lay" intensity="low" isSuspended={isSuspended} />
                              </div>
                            </div>

                            {isSuspended && (
                              <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                                <div className="absolute inset-0 bg-[#212121] opacity-[0.46]"></div>
                                <div className="relative z-10 bg-[#e0e0e0] w-[110px] lg:w-[128px] py-[6px] flex items-center justify-center drop-shadow-sm">
                                  <span className="text-[#0d47a1] text-[12px] lg:text-[13px] font-black uppercase tracking-wide leading-none">
                                    {displayMsg}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                    {isFancy && (runner.Msg || runner.msg) && (
                      <tr key={(runner.SelectionId || idx) + '-msg'} className="bg-[#1a1a1a] border-t-2 border-[#f36c21]">
                        <td colSpan={2} className="px-4 lg:px-5 py-1.5 border-0">
                          <div className="flex items-center gap-3 overflow-hidden h-5 w-full">
                            <Megaphone size={12} className="text-[#f36c21] flex-shrink-0" />
                            <div className="relative flex-1 min-w-0 overflow-hidden pointer-events-none">
                              <div className="whitespace-nowrap animate-ticker">
                                <span className="text-[10px] lg:text-[11px] font-black text-white uppercase tracking-wider">
                                  {runner.Msg || runner.msg}
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
        </table>
      </div>
    </div>
  )
}
