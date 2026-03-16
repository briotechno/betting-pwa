'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MoreHorizontal, Star, Info, Play, Signal } from 'lucide-react'
import { useBetSlipStore } from '@/store/betSlipStore'
import { useAuthStore } from '@/store/authStore'

interface OddValue {
  price: number | '-'
  size: string
}

interface TeamRow {
  teamName: string
  back: OddValue[] // 3 values
  lay: OddValue[]  // 3 values
}

interface Match {
  id: string
  title: string
  startTime: string
  status: 'LIVE' | 'UPCOMING'
  teams: TeamRow[]
}

interface SportsMarketTableProps {
  matches: Match[]
}

export default function SportsMarketTable({ matches }: SportsMarketTableProps) {
  const { addSelection, selections } = useBetSlipStore()
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    matches.reduce((acc, match) => ({ ...acc, [match.id]: true }), {})
  )

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const isSelected = (matchId: string, teamName: string, price: number, type: 'back' | 'lay') => {
    return selections.some(s => s.id === `${matchId}-${teamName}-${price}-${type}`)
  }

  const handleOddsClick = (match: Match, team: TeamRow, odd: OddValue, type: 'back' | 'lay') => {
    if (odd.price === '-') return

    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    // Redirect to detail page with selection info
    const selectionParams = new URLSearchParams({
      selection: team.teamName,
      odds: odd.price.toString(),
      type: type,
      market: 'Match Odds'
    }).toString()

    router.push(`/sports/cricket/${match.id}?${selectionParams}`)
  }

  return (
    <div className="flex flex-col gap-4 p-1">
      {matches.map((match) => (
        <div key={match.id} className="bg-white rounded-md overflow-hidden shadow-sm">
          {/* Match Header */}
          <div className="relative">
            {/* Top row with Badge */}
            <div className="flex items-center px-1 py-0.5">
              <div className={`px-2 py-0.5 text-[8px] font-black uppercase text-white rounded-[2px] ${match.status === 'LIVE' ? 'bg-[#58a049]' : 'bg-[#008de1]'}`}>
                {match.status}
              </div>
            </div>

            {/* Title Strip */}
            <div className="relative flex items-center h-9 bg-[#e8612c] text-white">
              <button
                onClick={() => toggleExpand(match.id)}
                className="w-10 flex items-center justify-center h-full hover:bg-black/5"
              >
                {expanded[match.id] ? (
                  <div className="w-2.5 h-[2px] bg-white" />
                ) : (
                  <div className="w-2.5 h-2.5 border-t-2 border-r-2 border-white rotate-45 ml-[-2px]" />
                )}
              </button>

              <div className="flex flex-col justify-center">
                <span className="text-[11px] font-black leading-tight uppercase tracking-tight">
                  {match.title}
                </span>
                {match.status === 'UPCOMING' && (
                  <span className="text-[9px] opacity-80 font-bold">
                    {match.startTime}
                  </span>
                )}
              </div>

              {/* Decorative Diagonal Cut */}
              <div
                className="absolute left-[calc(100%-12px)] top-0 bottom-0 w-6 bg-[#e8612c]"
                style={{ clipPath: 'polygon(0 0, 0% 100%, 100% 100%)', transform: 'translateX(-100%)' }}
              />
              <div
                className="absolute left-[calc(100%-12px)] top-0 bottom-0 w-8 bg-[#e8612c]"
                style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
              />

              <div className="ml-auto pr-8 flex items-center gap-2">
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[10px] border-l-[#58a049]" />
              </div>
            </div>
          </div>

          {/* Table Body */}
          {expanded[match.id] && (
            <div className="bg-[#f2f2f2]">
              <table className="w-full border-separate border-spacing-0">
                <tbody>
                  {match.teams.map((team, tIdx) => (
                    <tr key={team.teamName} className="bg-white">
                      <td className="p-3 py-3 w-[25%] lg:w-[30%] min-w-[140px] max-w-[140px] border-r border-gray-100">
                        <div className="flex flex-col justify-center min-w-0 w-full overflow-hidden">
                          {team.teamName.includes(' vs ') ? (
                            <>
                              <div className="text-[11px] font-bold text-[#333] uppercase leading-[1.4] truncate w-full">{team.teamName.split(' vs ')[0]}</div>
                              <div className="text-[11px] font-bold text-[#333] uppercase leading-[1.4] truncate w-full">{team.teamName.split(' vs ')[1]}</div>
                            </>
                          ) : (
                            <div className="text-[11px] font-bold text-[#333] uppercase leading-[1.4] truncate w-full">{team.teamName}</div>
                          )}
                        </div>
                      </td>

                      <td className="p-0 text-right">
                        <div className="flex items-center justify-end">
                          {/* We only show 3 market columns: 1, X, 2 */}
                          {[0, 1, 2].map((idx) => (
                            <div key={idx} className="flex items-center justify-center gap-[2px] w-[122px] border-r last:border-r-0 border-gray-100">
                              {/* Back Odds - using first back value for simplicity/alignment if data exists */}
                              <button
                                onClick={() => handleOddsClick(match, team, team.back[idx] || { price: '-', size: '-' }, 'back')}
                                disabled={!team.back[idx] || team.back[idx].price === '-'}
                                className={`w-[60px] h-[40px] rounded-[0.4rem] flex flex-col items-center justify-center transition-all ${!team.back[idx] || team.back[idx].price === '-'
                                    ? 'bg-[#f8f8f8] text-transparent'
                                    : isSelected(match.id, team.teamName, team.back[idx].price as number, 'back')
                                      ? 'bg-[#1a91eb] text-white'
                                      : 'bg-[#a5d9fe] hover:bg-[#8ec7f5] text-black'
                                  }`}
                              >
                                <span className="text-[10px] md:text-[11px] font-black">{team.back[idx]?.price || '-'}</span>
                                {team.back[idx]?.size && team.back[idx].size !== '-' && (
                                  <span className={`text-[7px] md:text-[8px] font-bold ${isSelected(match.id, team.teamName, team.back[idx].price as number, 'back') ? 'text-white/70' : 'text-black'}`}>
                                    {team.back[idx].size}
                                  </span>
                                )}
                              </button>

                              {/* Lay Odds - using first lay value */}
                              <button
                                onClick={() => handleOddsClick(match, team, team.lay[idx] || { price: '-', size: '-' }, 'lay')}
                                disabled={!team.lay[idx] || team.lay[idx].price === '-'}
                                className={`w-[60px] h-[40px] rounded-[0.4rem] flex flex-col items-center justify-center transition-all ${!team.lay[idx] || team.lay[idx].price === '-'
                                    ? 'bg-[#f8f8f8] text-transparent'
                                    : isSelected(match.id, team.teamName, team.lay[idx].price as number, 'lay')
                                      ? 'bg-[#f2708b] text-white'
                                      : 'bg-[#f8d0ce] hover:bg-[#f5c2cd] text-black'
                                  }`}
                              >
                                <span className="text-[10px] md:text-[11px] font-black">{team.lay[idx]?.price || '-'}</span>
                                {team.lay[idx]?.size && team.lay[idx].size !== '-' && (
                                  <span className={`text-[7px] md:text-[8px] font-bold ${isSelected(match.id, team.teamName, team.lay[idx].price as number, 'lay') ? 'text-white/70' : 'text-black'}`}>
                                    {team.lay[idx].size}
                                  </span>
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
