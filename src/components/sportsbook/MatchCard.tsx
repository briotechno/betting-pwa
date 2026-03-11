'use client'
import React from 'react'
import Link from 'next/link'
import { Clock, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Badge from '@/components/ui/Badge'
import { useBetSlipStore, BetSelection } from '@/store/betSlipStore'
import { useAuthStore } from '@/store/authStore'

interface OddsButton {
  back: number
  lay: number
  backSize?: string
  laySize?: string
}

interface MatchCardProps {
  id: string
  teamA: string
  teamB: string
  competition: string
  sport: string
  startTime: string
  isLive?: boolean
  odds?: {
    matchOdds?: { back: number; lay: number }
    teamA?: OddsButton
    teamB?: OddsButton
    draw?: OddsButton
  }
}

export default function MatchCard({ id, teamA, teamB, competition, sport, startTime, isLive, odds }: MatchCardProps) {
  const { addSelection, selections } = useBetSlipStore()
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  const handleOddsClick = (
    selectionName: string,
    oddsValue: number,
    betType: 'back' | 'lay',
    marketName: string
  ) => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }
    const betId = `${id}-${selectionName}-${betType}`
    addSelection({
      id: betId,
      matchId: id,
      matchName: `${teamA} vs ${teamB}`,
      marketName,
      selectionName,
      odds: oddsValue,
      betType,
    })
  }

  const isSelected = (selectionName: string, betType: 'back' | 'lay') => {
    const betId = `${id}-${selectionName}-${betType}`
    return selections.some((s) => s.id === betId)
  }

  return (
    <div className="bg-card border border-cardBorder rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-200">
      {/* Match Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-surface/50 border-b border-cardBorder/50">
        <div className="flex items-center gap-2">
          {isLive ? (
            <Badge variant="live" size="xs">LIVE</Badge>
          ) : (
            <div className="flex items-center gap-1 text-textMuted">
              <Clock size={10} />
              <span className="text-[10px]">{startTime}</span>
            </div>
          )}
          <span className="text-[10px] text-textMuted truncate max-w-[120px] md:max-w-none">{competition}</span>
        </div>
        <Link href={`/sports/${sport}/${id}`} className="text-textMuted hover:text-primary">
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* Teams + Odds */}
      <Link href={`/sports/${sport}/${id}`} className="block">
        <div className="p-3">
          {/* Header row for odds labels */}
          <div className="flex items-center mb-2">
            <div className="flex-1" />
            <div className="flex gap-1 w-36 lg:w-48">
              <div className="flex-1 text-center text-[9px] text-backBet font-medium">1</div>
              <div className="flex-1 text-center text-[9px] text-backBet font-medium">X</div>
              <div className="flex-1 text-center text-[9px] text-backBet font-medium">2</div>
            </div>
          </div>

          {/* Team rows */}
          {[
            { name: teamA, oddsKey: 'teamA' as const },
            { name: 'Draw', oddsKey: 'draw' as const },
            { name: teamB, oddsKey: 'teamB' as const },
          ].map((row) => {
            const rowOdds = odds?.[row.oddsKey]
            return (
              <div key={row.name} className="flex items-center gap-2 mb-1.5">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-textPrimary font-bold truncate tracking-tight">{row.name}</p>
                </div>
                <div className="flex gap-1 w-36 lg:w-48">
                  {/* Back */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      if (rowOdds?.back) handleOddsClick(row.name, rowOdds.back, 'back', 'Match Odds')
                    }}
                    className={`flex-1 py-2 rounded-lg text-center text-xs font-black transition-all active:scale-95 ${
                      rowOdds?.back
                        ? isSelected(row.name, 'back')
                          ? 'bg-backBetDark ring-2 ring-primary text-gray-900 shadow-lg'
                          : 'bg-backBet hover:bg-backBetDark text-gray-900 cursor-pointer'
                        : 'bg-surface/30 text-transparent cursor-default'
                    }`}
                  >
                    {rowOdds?.back || '-'}
                  </button>
                  {/* Lay */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      if (rowOdds?.lay) handleOddsClick(row.name, rowOdds.lay, 'lay', 'Match Odds')
                    }}
                    className={`flex-1 py-2 rounded-lg text-center text-xs font-black transition-all active:scale-95 ${
                      rowOdds?.lay
                        ? isSelected(row.name, 'lay')
                          ? 'bg-layBetDark ring-2 ring-red-500 text-gray-900 shadow-lg'
                          : 'bg-layBet hover:bg-layBetDark text-gray-900 cursor-pointer'
                        : 'bg-surface/30 text-transparent cursor-default'
                    }`}
                  >
                    {rowOdds?.lay || '-'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </Link>
    </div>
  )
}
