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
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr>
            <th className="text-left py-2 px-3 text-textMuted font-medium w-40" />
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`text-center py-2 px-1 text-[10px] font-semibold ${
                  idx % 2 === 0 ? 'text-backBet' : 'text-layBet'
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.teamName} className="border-t border-cardBorder/50 hover:bg-surface/30 transition-colors">
              <td className="py-2 px-3 text-textPrimary font-medium whitespace-nowrap">{row.teamName}</td>
              {row.odds.map((odd, idx) => (
                <React.Fragment key={idx}>
                  {/* Back cell */}
                  <td className="py-1 px-0.5">
                    <button
                      onClick={() => handleClick(row.teamName, odd.back, 'back')}
                      disabled={!odd.back}
                      className={`w-full min-w-[44px] py-1.5 rounded text-center transition-all active:scale-95 ${
                        !odd.back
                          ? 'bg-surface text-transparent cursor-default'
                          : isSelected(row.teamName, odd.back, 'back')
                          ? 'bg-backBetDark ring-1 ring-primary text-background'
                          : 'bg-backBet hover:bg-backBetDark text-background cursor-pointer'
                      }`}
                    >
                      {odd.back ? (
                        <>
                          <div className="font-bold text-[11px]">{odd.back}</div>
                          {odd.backSize && <div className="text-[8px] opacity-70">{odd.backSize}</div>}
                        </>
                      ) : (
                        <div className="text-[11px]">-</div>
                      )}
                    </button>
                  </td>
                  {/* Lay cell */}
                  <td className="py-1 px-0.5">
                    <button
                      onClick={() => handleClick(row.teamName, odd.lay, 'lay')}
                      disabled={!odd.lay}
                      className={`w-full min-w-[44px] py-1.5 rounded text-center transition-all active:scale-95 ${
                        !odd.lay
                          ? 'bg-surface text-transparent cursor-default'
                          : isSelected(row.teamName, odd.lay, 'lay')
                          ? 'bg-layBetDark ring-1 ring-danger text-background'
                          : 'bg-layBet hover:bg-layBetDark text-background cursor-pointer'
                      }`}
                    >
                      {odd.lay ? (
                        <>
                          <div className="font-bold text-[11px]">{odd.lay}</div>
                          {odd.laySize && <div className="text-[8px] opacity-70">{odd.laySize}</div>}
                        </>
                      ) : (
                        <div className="text-[11px]">-</div>
                      )}
                    </button>
                  </td>
                </React.Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
