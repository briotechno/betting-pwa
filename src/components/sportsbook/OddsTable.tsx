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
                    <td className="py-1.5 px-1.5 w-[70px] sm:w-[80px] border-r border-gray-100">
                      <div className="flex flex-col text-[8.5px] sm:text-[9px] font-bold text-[#e15b24] leading-tight items-center text-center">
                        <span className="whitespace-nowrap">{row.startTime.split(' ')[0]}</span>
                        <span className="whitespace-nowrap">{row.startTime.split(' ').slice(1).join(' ')}</span>
                      </div>
                    </td>
                  )}

                  <td className={`py-1.5 px-2 ${row.startTime ? 'min-w-[100px] max-w-[100px]' : 'min-w-[130px] max-w-[130px]'} sm:min-w-[140px] sm:max-w-[180px] lg:max-w-[250px]`}>
                    <div className="flex flex-col justify-center min-w-0 w-full overflow-hidden">
                      {row.teamName.includes(' vs ') ? (
                        <>
                          <div className={`font-bold text-[#333] leading-[1.4] truncate w-full ${row.startTime ? 'text-[10px]' : 'text-[11px]'}`}>{toTitleCase(row.teamName.split(' vs ')[0])}</div>
                          <div className={`font-bold text-[#333] leading-[1.4] truncate w-full ${row.startTime ? 'text-[10px]' : 'text-[11px]'}`}>{toTitleCase(row.teamName.split(' vs ')[1])}</div>
                        </>
                      ) : (
                        <div className={`font-bold text-[#333] leading-[1.4] truncate w-full ${row.startTime ? 'text-[10px]' : 'text-[11px]'}`}>{toTitleCase(row.teamName)}</div>
                      )}
                    </div>
                  </td>

                  {/* Status Icons - Hidden for upcoming */}
                  {!row.startTime && (
                    <td className="py-1.5 px-2 w-[40px] lg:w-auto lg:px-20 transition-all">
                      <div className="flex items-center justify-center lg:justify-around gap-2 text-[#28a745]">
                        <Play size={12} fill="currentColor" className="lg:scale-125" />
                        <i className="v-icon notranslate mdi mdi-access-point theme--light opacity-80" style={{ fontSize: '14px' }}></i>
                      </div>
                    </td>
                  )}


                  <td className="py-1 pr-2 lg:w-[388px]">

                    <div className="flex items-center justify-end gap-1">
                      {[0, 1, 2].map((runnerIdx) => {
                        const odd = row.odds[runnerIdx] || { back: 0, lay: 0, backSize: '', laySize: '' }
                        return (
                          <React.Fragment key={runnerIdx}>
                            {/* Back Box - Always visible */}
                            <button
                              onClick={() => handleClick(row.teamName, odd.back, 'back')}
                              disabled={!odd.back}
                              className={`w-[60px] h-[40px] rounded-[0.4rem] flex flex-col items-center justify-center transition-all ${!odd.back
                                  ? 'bg-[#f5f5f5] text-[#ccc]'
                                  : isSelected(row.teamName, odd.back, 'back')
                                    ? 'bg-[#1a91eb] text-white'
                                    : 'bg-[#a5d9fe] hover:bg-[#a5d1ff] text-black shadow-sm'
                                }`}
                            >
                              <span className="text-[12px] font-bold leading-none">{odd.back || '-'}</span>
                              {odd.backSize && <span className="text-[8px] font-bold mt-0.5">{odd.backSize}</span>}
                            </button>

                            {/* Lay Box - Desktop Only */}
                            <button
                              onClick={() => handleClick(row.teamName, odd.lay, 'lay')}
                              disabled={!odd.lay}
                              className={`hidden lg:flex w-[60px] h-[40px] rounded-[0.4rem] flex-col items-center justify-center transition-all ${!odd.lay
                                  ? 'bg-[#f5f5f5] text-[#ccc]'
                                  : isSelected(row.teamName, odd.lay, 'lay')
                                    ? 'bg-[#f2708b] text-white'
                                    : 'bg-[#f8d0ce] hover:bg-[#f5c6cb] text-black shadow-sm'
                                }`}
                            >
                              <span className="text-[12px] font-bold leading-none">{odd.lay || '-'}</span>
                              {odd.laySize && <span className="text-[8px] font-bold mt-0.5">{odd.laySize}</span>}
                            </button>
                          </React.Fragment>
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
