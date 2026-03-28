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
  id?: string // Match/Market ID
  teamName: string
  odds: OddsEntry[]
  startTime?: string
  status?: string // 'OPEN', 'SUSPENDED', etc.
}

interface OddsTableProps {
  matchId?: string
  matchName: string
  competition: string
  marketName: string
  columns: string[]
  rows: OddsTableRow[]
  isUpcoming?: boolean
  sport?: string
}

// Format "DD-MM-YYYY HH:MM:SS" into "Sun, DD/MM HH:MM AM/PM"
function formatUpcomingTime(raw: string): { datePart: string; timePart: string } {
  if (!raw) return { datePart: '', timePart: '' }

  let d: Date | null = null
  // Try standard parse first
  const isoAttempt = raw.includes('T') ? raw : raw.replace(' ', 'T')
  d = new Date(isoAttempt)

  // Fallback for DD-MM-YYYY formats
  if (!d || isNaN(d.getTime())) {
    const parts = raw.split(/[-/ :]/)
    if (parts.length >= 3) {
      const day = parseInt(parts[0], 10)
      const month = parseInt(parts[1], 10) - 1
      const year = parseInt(parts[2], 10)
      const hour = parseInt(parts[3] || '0', 10)
      const minute = parseInt(parts[4] || '0', 10)
      const second = parseInt(parts[5] || '0', 10)
      d = new Date(year, month, day, hour, minute, second)
    }
  }

  if (!d || isNaN(d.getTime())) return { datePart: raw, timePart: '' }

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dayName = days[d.getDay()]
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  let hours = d.getHours()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  const mins = String(d.getMinutes()).padStart(2, '0')

  return {
    datePart: `${dayName}, ${dd}/${mm}`,
    timePart: `${String(hours).padStart(2, '0')}:${mins} ${ampm}`
  }
}

function RateButton({
  value,
  size,
  colorClass,
  selectedColorClass,
  isSelected,
  isRowInactive,
  isUpcoming,
  onClick
}: {
  value: number,
  size?: string,
  colorClass: string,
  selectedColorClass: string,
  isSelected: boolean,
  isRowInactive?: boolean,
  isUpcoming?: boolean,
  onClick: () => void
}) {
  const [blink, setBlink] = React.useState(false)
  const prevValue = React.useRef(value)

  React.useEffect(() => {
    if (prevValue.current !== value && value !== 0) {
      setBlink(true)
      const timer = setTimeout(() => setBlink(false), 300)
      prevValue.current = value
      return () => clearTimeout(timer)
    }
    prevValue.current = value
  }, [value])

  const isEmpty = !value || value === 0
  const disabled = isEmpty || isRowInactive || isUpcoming

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-[62px] h-[42px] rounded-[0.25rem] flex flex-col items-center justify-center transition-all border border-transparent ${isEmpty
          ? 'bg-[#e0e0e0] text-[#999]'
          : isUpcoming
            ? `${colorClass} text-black/60 opacity-60 cursor-not-allowed`
            : isSelected
              ? `${selectedColorClass} text-white`
              : `${colorClass} text-black`
        } ${isRowInactive && !isUpcoming ? 'opacity-40 grayscale pointer-events-none' : ''} ${blink && !isUpcoming ? 'animate-rate-change' : ''
        }`}
    >
      <span className="text-[13px] font-bold leading-none">{value || '-'}</span>
      {size && <span className="text-[9px] font-medium leading-none mt-1 text-gray-700">{size}</span>}
    </button>
  )
}

export default function OddsTable({ matchId, matchName, competition, marketName, columns, rows, isUpcoming, sport }: OddsTableProps) {
  const { addSelection, selections } = useBetSlipStore()
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  const isSelected = (rowId: string | undefined, teamName: string, oddsValue: number, betType: 'back' | 'lay') => {
    const id = `${rowId || matchId}-${teamName}-${oddsValue}-${betType}`
    return selections.some((s) => s.id === id)
  }

  const handleClick = (rowId: string | undefined, teamName: string, oddsValue: number, betType: 'back' | 'lay') => {
    if (!oddsValue || isUpcoming) return

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

    const targetId = rowId || matchId
    const targetSport = sport || 'cricket'
    router.push(`/sports/${targetSport}/${targetId}?${selectionParams}`)
  }

  return (
    <div className="bg-[#eee]">
      <div className="overflow-x-auto lg:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <table className="w-full text-xs border-separate border-spacing-y-1">
          <tbody>
            {rows.map((row) => {
              // Use friendly formatting for upcoming matches
              const displayTime = isUpcoming && row.startTime
                ? formatUpcomingTime(row.startTime)
                : null

              return (
                <tr
                  key={row.teamName}
                  className={`bg-white transition-colors border-b border-gray-100 ${row.status === 'SUSPENDED' || row.status === 'CLOSED' ? 'relative bg-[#777] text-white' : ''
                    }`}
                >
                  {/* Start Time Column for upcoming */}
                  {isUpcoming && row.startTime && displayTime && (
                    <td className="py-2 px-1.5 w-[70px] sm:w-[80px] border-r border-gray-100">
                      <div className="flex flex-col text-[8.5px] sm:text-[9px] font-bold text-[#e15b24] leading-tight items-center text-center">
                        <span className="whitespace-nowrap">{displayTime.datePart}</span>
                        <span className="whitespace-nowrap">{displayTime.timePart}</span>
                      </div>
                    </td>
                  )}

                  {/* Start Time Column for inplay (raw) */}
                  {!isUpcoming && row.startTime && (
                    <td className="py-2 px-1.5 w-[70px] sm:w-[80px] border-r border-gray-100">
                      <div className="flex flex-col text-[8.5px] sm:text-[9px] font-bold text-[#e15b24] leading-tight items-center text-center">
                        <span className="whitespace-nowrap">{row.startTime.split(' ')[0]}</span>
                        <span className="whitespace-nowrap">{row.startTime.split(' ').slice(1).join(' ')}</span>
                      </div>
                    </td>
                  )}

                  <td className={`py-2 px-3 ${row.startTime ? 'min-w-[100px] max-w-[100px]' : 'min-w-[130px] max-w-[130px]'} sm:min-w-[140px] sm:max-w-[180px] lg:max-w-[250px]`}>
                    <div className="flex flex-col justify-center min-w-0 w-full overflow-hidden">
                      {row.teamName.includes(' vs ') ? (
                        <>
                          <div className={`font-bold leading-[1.4] truncate w-full ${row.status === 'SUSPENDED' ? 'text-white' : 'text-[#333]'} ${row.startTime ? 'text-[10px]' : 'text-[11px]'}`}>{toTitleCase(row.teamName.split(' vs ')[0])}</div>
                          <div className={`font-bold leading-[1.4] truncate w-full ${row.status === 'SUSPENDED' ? 'text-white' : 'text-[#333]'} ${row.startTime ? 'text-[10px]' : 'text-[11px]'}`}>{toTitleCase(row.teamName.split(' vs ')[1])}</div>
                        </>
                      ) : (
                        <div className={`font-bold leading-[1.4] truncate w-full ${row.status === 'SUSPENDED' ? 'text-white' : 'text-[#333]'} ${row.startTime ? 'text-[10px]' : 'text-[11px]'}`}>{toTitleCase(row.teamName)}</div>
                      )}
                    </div>
                  </td>

                  {/* Status Icons - Hidden for upcoming */}
                  {!row.startTime && !isUpcoming && (
                    <td className="py-2 px-2 w-[40px] lg:w-auto lg:px-20 transition-all">
                      <div className="flex items-center justify-center lg:justify-around gap-2">
                        <Play size={10} fill={row.status === 'SUSPENDED' ? 'white' : '#28a745'} className={row.status === 'SUSPENDED' ? 'text-white' : 'text-[#28a745]'} />
                        {row.status === 'SUSPENDED' ? (
                          <i className="v-icon notranslate mdi mdi-lock theme--light text-white" style={{ fontSize: '14px' }}></i>
                        ) : (
                          <i className="v-icon notranslate mdi mdi-access-point theme--light text-[#28a745] opacity-80" style={{ fontSize: '14px' }}></i>
                        )}
                      </div>
                    </td>
                  )}


                  <td className="py-1 pr-2 lg:w-[410px]">

                    <div className="flex items-center justify-end gap-1.5">
                      {[0, 1, 2].map((runnerIdx) => {
                        const odd = row.odds[runnerIdx] || { back: 0, lay: 0, backSize: '', laySize: '' }
                        const isInactive = row.status === 'SUSPENDED' || row.status === 'CLOSED'
                        return (
                          <React.Fragment key={runnerIdx}>
                            {/* Back Box */}
                            <RateButton
                              value={odd.back}
                              size={odd.backSize}
                              colorClass="bg-[#a5d9fe] hover:bg-[#8ec7f5]"
                              selectedColorClass="bg-[#1a91eb]"
                              isSelected={isSelected(row.id, row.teamName, odd.back, 'back')}
                              isRowInactive={isInactive}
                              isUpcoming={isUpcoming}
                              onClick={() => handleClick(row.id, row.teamName, odd.back, 'back')}
                            />

                            {/* Lay Box */}
                            <div className="hidden lg:block">
                              <RateButton
                                value={odd.lay}
                                size={odd.laySize}
                                colorClass="bg-[#f8d0ce] hover:bg-[#f5c2cd]"
                                selectedColorClass="bg-[#f2708b]"
                                isSelected={isSelected(row.id, row.teamName, odd.lay, 'lay')}
                                isRowInactive={isInactive}
                                isUpcoming={isUpcoming}
                                onClick={() => handleClick(row.id, row.teamName, odd.lay, 'lay')}
                              />
                            </div>
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
