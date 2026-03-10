'use client'
import React, { useState } from 'react'
import { MoreHorizontal, Star, Info, Play, Signal } from 'lucide-react'
import { useBetSlipStore } from '@/store/betSlipStore'

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
    
    addSelection({
      id: `${match.id}-${team.teamName}-${odd.price}-${type}`,
      matchId: match.id,
      matchName: match.title,
      marketName: 'Match Odds',
      selectionName: team.teamName,
      odds: odd.price as number,
      betType: type
    })
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
                      <td className="p-3 py-4 min-w-[200px]">
                        <span className="text-[11px] font-black text-gray-800 uppercase tracking-tight">{team.teamName}</span>
                      </td>
                      
                      <td className="p-0 text-right">
                        <div className="flex items-center justify-end">
                          {/* Back Odds */}
                          {team.back.map((odd, oIdx) => (
                            <button
                              key={`back-${oIdx}`}
                              onClick={() => handleOddsClick(match, team, odd, 'back')}
                              disabled={odd.price === '-'}
                              className={`w-[68px] h-[52px] flex flex-col items-center justify-center border-l border-gray-100/50 transition-all ${
                                odd.price === '-' 
                                  ? 'bg-[#f4f4f4] cursor-not-allowed opacity-40' 
                                  : isSelected(match.id, team.teamName, odd.price as number, 'back')
                                  ? 'bg-[#008de1] text-white shadow-inner'
                                  : oIdx === 2 
                                    ? 'bg-[#a5d5ff] hover:bg-[#8ec7f5] text-black' 
                                    : 'bg-[#d2eaff] hover:bg-[#c0e0ff] text-black/60'
                              }`}
                            >
                              <span className="text-[11px] font-black leading-none">{odd.price}</span>
                              <span className={`text-[9px] font-bold mt-1 ${odd.price === '-' ? 'text-transparent' : isSelected(match.id, team.teamName, odd.price as number, 'back') ? 'text-white/70' : 'text-gray-500'}`}>
                                {odd.size}
                              </span>
                            </button>
                          ))}

                          {/* Lay Odds */}
                          {team.lay.map((odd, oIdx) => (
                            <button
                              key={`lay-${oIdx}`}
                              onClick={() => handleOddsClick(match, team, odd, 'lay')}
                              disabled={odd.price === '-'}
                              className={`w-[68px] h-[52px] flex flex-col items-center justify-center border-l border-gray-100/50 transition-all ${
                                odd.price === '-' 
                                  ? 'bg-[#f4f4f4] cursor-not-allowed opacity-40' 
                                  : isSelected(match.id, team.teamName, odd.price as number, 'lay')
                                  ? 'bg-[#f2708b] text-white shadow-inner'
                                  : oIdx === 0 
                                    ? 'bg-[#faa9ba] hover:bg-[#f5c2cd] text-black' 
                                    : 'bg-[#f9d4db] hover:bg-[#f2b9c5] text-black/60'
                              }`}
                            >
                              <span className="text-[11px] font-black leading-none">{odd.price}</span>
                              <span className={`text-[9px] font-bold mt-1 ${odd.price === '-' ? 'text-transparent' : isSelected(match.id, team.teamName, odd.price as number, 'lay') ? 'text-white/70' : 'text-gray-500'}`}>
                                {odd.size}
                              </span>
                            </button>
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
