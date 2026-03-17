'use client'
import React from 'react'
import { Play } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useBetSlipStore } from '@/store/betSlipStore'
import { useAuthStore } from '@/store/authStore'
import { toTitleCase } from '@/utils/format'


interface OddsEntry {
  back: number
  backSize?: string
  lay: number
  laySize?: string
}

interface OddsTableRow {
  teamName: string
  odds: OddsEntry[]
  startTime?: string // Added for upcoming matches
}

interface OddsTableProps {
  matchId: string
  matchName: string
  competition: string
  marketName: string
  columns: string[]
  rows: OddsTableRow[]
  isUpcoming?: boolean
}

export default function OddsTable({ matchId, matchName, competition, marketName, columns, rows, isUpcoming }: OddsTableProps) {
  const { addSelection, selections } = useBetSlipStore()
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  const isSelected = (teamName: string, oddsValue: number, betType: 'back' | 'lay') => {
    const id = `${matchId}-${teamName}-${oddsValue}-${betType}`
    return selections.some((s) => s.id === id)
  }

  const handleClick = (teamName: string, oddsValue: number, betType: 'back' | 'lay') => {
    if (!oddsValue) return

    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    // Redirect to detail page with selection info
    const selectionParams = new URLSearchParams({
      selection: teamName,
      odds: oddsValue.toString(),
      type: betType,
      market: marketName
    }).toString()

    router.push(`/sports/cricket/${matchId}?${selectionParams}`)
  }

  return (
    <div className="bg-[#eee]">
      <div className="overflow-x-auto lg:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <table className="w-full text-xs border-separate border-spacing-y-1">
          <tbody>
            {rows.map((row) => {
              return (
                <tr key={row.teamName} className="bg-white hover:bg-gray-50/50 transition-colors">
                  {/* Optional Start Time Column */}
                  {row.startTime && (
                    <td className="py-1.5 px-3 w-[80px] border-r border-gray-100">
                      <div className="flex flex-col text-[9px] font-bold text-[#e15b24] leading-tight items-center text-center">
                        <span className="whitespace-nowrap">{row.startTime.split(' ')[0]}</span>
                        <span className="whitespace-nowrap">{row.startTime.split(' ').slice(1).join(' ')}</span>
                      </div>
                    </td>
                  )}

                  <td className="py-1.5 px-3 min-w-[140px] max-w-[140px] sm:max-w-[180px] lg:max-w-[250px]">
                    <div className="flex flex-col justify-center min-w-0 w-full overflow-hidden">
                      {row.teamName.includes(' vs ') ? (
                        <>
                          <div className="text-[11px] font-bold text-[#333] leading-[1.4] truncate w-full">{toTitleCase(row.teamName.split(' vs ')[0])}</div>
                          <div className="text-[11px] font-bold text-[#333] leading-[1.4] truncate w-full">{toTitleCase(row.teamName.split(' vs ')[1])}</div>
                        </>
                      ) : (
                        <div className="text-[11px] font-bold text-[#333] leading-[1.4] truncate w-full">{toTitleCase(row.teamName)}</div>
                      )}

                    </div>
                  </td>

                  {/* Status Icons - Hidden for upcoming */}
                  {!row.startTime && (
                    <td className="py-1.5 px-0 w-[40px]">
                      <div className="flex items-center gap-1.5 text-[#28a745]">
                        <Play size={10} fill="currentColor" />
                        <i className="v-icon notranslate mdi mdi-access-point theme--light opacity-80" style={{ fontSize: '12px' }}></i>
                      </div>
                    </td>
                  )}

                  <td className="py-1 pr-2">
                    <div className="flex items-center justify-end gap-1">
                      {row.odds.slice(0, 6).map((odd, idx) => {
                        const isLay = idx % 2 !== 0
                        // On mobile (hidden by lg:flex), we only show 3 cells. 
                        // So we alternate if we're showing all 6, but if we're only showing the first 3...
                        // Actually, the structure usually is: [1 Back, 1 Lay, X Back, X Lay, 2 Back, 2 Lay]
                        // On mobile we only want the Back cells (0, 2, 4) or just 0, 1, 2 depending on how data is structure.
                        // Based on the image, mobile shows 3 cells. Usually these are the Back odds.

                        // Let's assume on mobile we show index 0, 2, 4 (Backs)
                        // And on desktop we show all 6.

                        const isMobileCell = idx === 0 || idx === 2 || idx === 4

                        return (
                          <button
                            key={idx}
                            onClick={() => handleClick(row.teamName, isLay ? odd.lay : odd.back, isLay ? 'lay' : 'back')}
                            disabled={isLay ? !odd.lay : !odd.back}
                            className={`
                              w-[60px] h-[40px] rounded-[0.4rem] flex flex-col items-center justify-center transition-all
                              ${idx === 4 ? 'flex lg:hidden' : (idx > 2 ? 'hidden' : (!isMobileCell ? 'hidden lg:flex' : 'flex'))}
                              ${isLay
                                ? (!odd.lay ? 'bg-[#f5f5f5] text-[#ccc]' : isSelected(row.teamName, odd.lay, 'lay') ? 'bg-[#f2708b] text-white' : 'bg-[#f8d0ce] hover:bg-[#f5c6cb] text-black')
                                : (!odd.back ? 'bg-[#f5f5f5] text-[#ccc]' : isSelected(row.teamName, odd.back, 'back') ? 'bg-[#1a91eb] text-white' : 'bg-[#a5d9fe] hover:bg-[#a5d1ff] text-black')
                              }
                            `}
                          >
                            <span className="text-[12px] font-bold leading-none">{(isLay ? odd.lay : odd.back) || '-'}</span>
                            {(isLay ? odd.laySize : odd.backSize) && (
                              <span className="text-[8px] font-bold mt-0.5">
                                {isLay ? odd.laySize : odd.backSize}
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
