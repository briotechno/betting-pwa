'use client'
import React from 'react'
import { Signal, Play } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useBetSlipStore } from '@/store/betSlipStore'
import { useAuthStore } from '@/store/authStore'

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
      <div className="overflow-x-auto lg:overflow-visible">
        <table className="w-full text-xs border-separate border-spacing-y-1">
          <tbody>
            {rows.map((row) => {
              const teams = row.teamName.includes(' vs ') ? row.teamName.split(' vs ') : [row.teamName]
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

                  <td className="py-1.5 px-3 min-w-[140px]">
                    <div className="flex flex-col">
                      {teams.map((team, tIdx) => (
                        <span key={tIdx} className="text-[11px] font-bold text-[#333] uppercase leading-tight truncate max-w-[150px]">{team}</span>
                      ))}
                    </div>
                  </td>
                  
                  {/* Status Icons - Hidden for upcoming */}
                  {!row.startTime && (
                    <td className="py-1.5 px-0 w-[40px]">
                      <div className="flex items-center gap-1.5 text-[#28a745]">
                        <Play size={10} fill="currentColor" />
                        <Signal size={12} className="opacity-80" />
                      </div>
                    </td>
                  )}

                  <td className="py-1 px-1">
                    <div className="flex items-center justify-end gap-1 px-1">
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
                              w-[70px] md:w-[92px] lg:w-[100px] h-[38px] md:h-[42px] rounded-md flex flex-col items-center justify-center transition-all
                              ${!isMobileCell ? 'hidden lg:flex' : 'flex'}
                              ${isLay 
                                ? (!odd.lay ? 'bg-[#f5f5f5] text-[#ccc]' : isSelected(row.teamName, odd.lay, 'lay') ? 'bg-[#f8d7da] text-[#721c24]' : 'bg-[#f8d7da] hover:bg-[#f5c6cb] text-[#333]') 
                                : (!odd.back ? 'bg-[#f5f5f5] text-[#ccc]' : isSelected(row.teamName, odd.back, 'back') ? 'bg-[#b6daff] text-[#004085]' : 'bg-[#b6daff] hover:bg-[#a5d1ff] text-[#333]')
                              }
                            `}
                          >
                            <span className="text-[12px] font-bold leading-none">{(isLay ? odd.lay : odd.back) || '-'}</span>
                            {(isLay ? odd.laySize : odd.backSize) && (
                              <span className="text-[8px] font-medium opacity-70 mt-0.5">
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
