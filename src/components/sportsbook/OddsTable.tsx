'use client'
import React from 'react'
import { useBetSlipStore } from '@/store/betSlipStore'

interface OddsEntry {
  back: number
  backSize?: string
  lay: number
  laySize?: string
}

interface OddsTableRow {
  teamName: string
  odds: OddsEntry[]
}

interface OddsTableProps {
  matchId: string
  matchName: string
  competition: string
  marketName: string
  columns: string[]
  rows: OddsTableRow[]
}

export default function OddsTable({ matchId, matchName, competition, marketName, columns, rows }: OddsTableProps) {
  const { addSelection, selections } = useBetSlipStore()

  const isSelected = (teamName: string, oddsValue: number, betType: 'back' | 'lay') => {
    const id = `${matchId}-${teamName}-${oddsValue}-${betType}`
    return selections.some((s) => s.id === id)
  }

  const handleClick = (teamName: string, oddsValue: number, betType: 'back' | 'lay') => {
    if (!oddsValue) return
    const id = `${matchId}-${teamName}-${oddsValue}-${betType}`
    addSelection({
      id,
      matchId,
      matchName,
      marketName,
      selectionName: teamName,
      odds: oddsValue,
      betType,
    })
  }

  return (
    <div className="overflow-x-auto bg-white">
      <table className="w-full text-xs border-collapse">
        <tbody>
          {rows.map((row) => {
            const teams = row.teamName.includes(' vs ') ? row.teamName.split(' vs ') : [row.teamName]
            return (
              <tr key={row.teamName} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                <td className="py-3 px-4 w-1/3 min-w-[180px]">
                  <div className="flex flex-col">
                    {teams.map((team, tIdx) => (
                      <span key={tIdx} className="text-[11px] font-bold text-gray-800 leading-tight">{team}</span>
                    ))}
                  </div>
                </td>
                
                {/* Stats Icons */}
                <td className="py-3 px-2">
                  <div className="flex items-center gap-4 text-[#28a745]">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                    <div className="w-4 h-4 flex items-center justify-center opacity-60">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>
                    </div>
                  </div>
                </td>

                <td className="py-1 px-0">
                  <div className="flex items-center justify-end">
                    {row.odds.map((odd, idx) => (
                      <div key={idx} className={`flex items-center justify-center gap-[2px] w-[122px] ${idx > 0 ? 'border-l border-gray-100' : ''}`}>
                        {/* Back */}
                        <button
                          onClick={() => handleClick(row.teamName, odd.back, 'back')}
                          disabled={!odd.back}
                          className={`w-[58px] h-9 rounded flex flex-col items-center justify-center transition-all ${
                            !odd.back 
                              ? 'bg-[#f4f4f4] text-transparent' 
                              : isSelected(row.teamName, odd.back, 'back')
                              ? 'bg-[#1a91eb] text-white scale-[0.98]'
                              : 'bg-[#a5d5ff] hover:bg-[#8ec7f5] text-black'
                          }`}
                        >
                          <span className="text-[11px] font-black">{odd.back || '-'}</span>
                          {odd.backSize && <span className={`text-[8px] font-bold ${isSelected(row.teamName, odd.back, 'back') ? 'text-white/70' : 'text-gray-500'}`}>{odd.backSize}</span>}
                        </button>

                        {/* Lay */}
                        <button
                          onClick={() => handleClick(row.teamName, odd.lay, 'lay')}
                          disabled={!odd.lay}
                          className={`w-[58px] h-9 rounded flex flex-col items-center justify-center transition-all ${
                            !odd.lay 
                              ? 'bg-[#f4f4f4] text-transparent opacity-40' 
                              : isSelected(row.teamName, odd.lay, 'lay')
                              ? 'bg-[#ff94c2] text-white scale-[0.98]'
                              : 'bg-[#f2f2f2] hover:bg-[#e8e8e8] text-black'
                          }`}
                        >
                          <span className="text-[11px] font-black">{odd.lay || '-'}</span>
                          {odd.laySize && <span className={`text-[8px] font-bold ${isSelected(row.teamName, odd.lay, 'lay') ? 'text-white/70' : 'text-gray-500'}`}>{odd.laySize}</span>}
                        </button>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
