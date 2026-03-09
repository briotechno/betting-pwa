'use client'
import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Star, Share2, Clock } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import OddsTable from '@/components/sportsbook/OddsTable'
import { useBetSlipStore } from '@/store/betSlipStore'
import { Info } from 'lucide-react'

const marketTabs = ['Match Odds', 'Bookmaker', 'Fancy', 'Line Market']

const matchOddsRows = [
  {
    teamName: 'India',
    odds: [
      { back: 1.42, backSize: '1on', lay: 1.43, laySize: '1on' },
      { back: 1.44, backSize: '8.89492', lay: 1.45, laySize: '1on' },
      { back: 1.46, backSize: '5.27702', lay: 1.47, laySize: '46.248' },
    ],
  },
  {
    teamName: 'The Draw',
    odds: [{ back: 0, lay: 0 }, { back: 0, lay: 0 }, { back: 0, lay: 0 }],
  },
  {
    teamName: 'Australia',
    odds: [
      { back: 3.10, backSize: '10,769', lay: 3.15, laySize: '1,40,500' },
      { back: 3.20, backSize: '2,34,023', lay: 3.25, laySize: '87,698' },
      { back: 3.30, backSize: '3,14,014', lay: 3.35, laySize: '1,42,902' },
    ],
  },
]

const fancyMarkets = [
  { runner: '1st Wicket Partnership Runs', back: 12, lay: 13 },
  { runner: '1st Over Runs', back: 6, lay: 7 },
  { runner: 'Total Sixes', back: 11, lay: 12 },
  { runner: 'Total Fours', back: 22, lay: 23 },
  { runner: 'India Total Runs', back: 165, lay: 168 },
  { runner: 'Australia Total Runs', back: 152, lay: 155 },
]

export default function MatchDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [activeMarket, setActiveMarket] = useState('Match Odds')
  const { selections, stakes, setStake, removeSelection } = useBetSlipStore()
  const [confirmBets, setConfirmBets] = useState(false)

  const QUICK_STAKES = [100, 300, 1000, 5000, 10000, 25000]

  const matchId = params?.matchId as string || 'match1'

  const activeSelection = selections[selections.length - 1]
  const currentStake = activeSelection ? (stakes[activeSelection.id] || 0) : 0

  return (
    <div className="flex h-full min-h-screen">
      {/* Main content */}
      <div className="flex-1 min-w-0 overflow-y-auto lg:max-w-[calc(100%-288px)]">
        {/* Match Header */}
        <div className="sticky top-0 z-20 bg-background border-b border-cardBorder">
          <div className="flex items-center gap-3 px-4 py-3">
            <button onClick={() => router.back()} className="text-textMuted hover:text-textPrimary">
              <ArrowLeft size={18} />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Badge variant="live" size="xs">LIVE</Badge>
                <span className="text-xs text-textMuted truncate">ICC Men&apos;s T20 World Cup</span>
              </div>
              <h2 className="text-sm font-bold text-textPrimary">India vs Australia</h2>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-textMuted hover:text-warn"><Star size={16} /></button>
              <button className="text-textMuted hover:text-primary"><Share2 size={16} /></button>
            </div>
          </div>

          {/* Match Score Card */}
          <div className="px-4 pb-3">
            <div className="bg-card rounded-xl border border-cardBorder p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-center flex-1">
                  <p className="text-lg font-black text-primary">🇮🇳 India</p>
                  <p className="text-2xl font-black text-textPrimary">186/5</p>
                  <p className="text-xs text-textMuted">20 Overs</p>
                </div>
                <div className="text-center px-4">
                  <p className="text-xs text-textMuted">VS</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock size={10} className="text-textMuted" />
                    <span className="text-[10px] text-textMuted">Live</span>
                  </div>
                </div>
                <div className="text-center flex-1">
                  <p className="text-lg font-black text-textPrimary">🇦🇺 Australia</p>
                  <p className="text-2xl font-black text-textPrimary">142/7</p>
                  <p className="text-xs text-textMuted">18.2 Overs</p>
                </div>
              </div>
              <div className="border-t border-cardBorder pt-2 text-center">
                <p className="text-xs text-success font-medium">India needs 45 runs off 10 balls (RRR: 27.0)</p>
              </div>
            </div>
          </div>

          {/* Market Tabs */}
          <div className="flex overflow-x-auto no-scrollbar border-t border-cardBorder">
            {marketTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveMarket(tab)}
                className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeMarket === tab
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-textSecondary hover:text-textPrimary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Market Content */}
        <div className="p-3">
          {activeMarket === 'Match Odds' && (
            <div className="bg-card rounded-xl border border-cardBorder overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-surface border-b border-cardBorder">
                <span className="text-sm font-semibold text-textPrimary">Match Odds</span>
                <Badge variant="live" size="xs">LIVE</Badge>
              </div>
              <OddsTable
                matchId={matchId}
                matchName="India vs Australia"
                competition="ICC Men&apos;s T20 World Cup"
                marketName="Match Odds"
                columns={['1', '2', '3', '4', '5', '6']}
                rows={matchOddsRows}
              />
            </div>
          )}

          {activeMarket === 'Fancy' && (
            <div className="bg-card rounded-xl border border-cardBorder overflow-hidden">
              <div className="px-4 py-2.5 bg-surface border-b border-cardBorder">
                <span className="text-sm font-semibold text-textPrimary">Fancy Markets</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-cardBorder bg-background">
                      <th className="text-left py-2 px-3 text-textMuted font-medium">Runner</th>
                      <th className="text-center py-2 px-2 text-layBet font-semibold w-20">No (Lay)</th>
                      <th className="text-center py-2 px-2 text-backBet font-semibold w-20">Yes (Back)</th>
                      <th className="text-left py-2 px-3 text-textMuted font-medium">Min/Max</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fancyMarkets.map((fm) => (
                      <tr key={fm.runner} className="border-t border-cardBorder/50 hover:bg-surface/30">
                        <td className="py-2 px-3 text-textSecondary">{fm.runner}</td>
                        <td className="py-1 px-1.5">
                          <button className="w-full py-1.5 bg-layBet hover:bg-layBetDark text-gray-900 font-bold rounded text-xs transition-all active:scale-95">
                            {fm.lay}
                          </button>
                        </td>
                        <td className="py-1 px-1.5">
                          <button className="w-full py-1.5 bg-backBet hover:bg-backBetDark text-gray-900 font-bold rounded text-xs transition-all active:scale-95">
                            {fm.back}
                          </button>
                        </td>
                        <td className="py-2 px-3 text-[10px] text-textMuted whitespace-nowrap">100 / 25,000</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeMarket === 'Bookmaker' && (
            <div className="bg-card rounded-xl border border-cardBorder overflow-hidden">
              <div className="px-4 py-2.5 bg-surface border-b border-cardBorder">
                <span className="text-sm font-semibold text-textPrimary">Bookmaker</span>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-cardBorder bg-background">
                    <th className="text-left py-2 px-3 text-textMuted font-medium">Runner</th>
                    <th className="text-center py-2 px-2 text-backBet font-semibold w-20">Back</th>
                    <th className="text-center py-2 px-2 text-layBet font-semibold w-20">Lay</th>
                  </tr>
                </thead>
                <tbody>
                  {[{ name: 'India', back: 0, lay: 0 }, { name: 'Australia', back: 0, lay: 0 }].map((row) => (
                    <tr key={row.name} className="border-t border-cardBorder/50">
                      <td className="py-2 px-3 text-textPrimary font-medium">{row.name}</td>
                      <td className="py-1 px-1.5">
                        <div className="text-center py-1.5 bg-surface text-textMuted rounded text-xs">-</div>
                      </td>
                      <td className="py-1 px-1.5">
                        <div className="text-center py-1.5 bg-surface text-textMuted rounded text-xs">-</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Right - Bet Slip */}
      <div className="hidden lg:block w-72 shrink-0 border-l border-cardBorder bg-surface sticky top-[88px] h-[calc(100vh-88px)] overflow-y-auto">
        {/* Bet Slip header tabs */}
        <div className="flex border-b border-cardBorder">
          {(['BETSLIP', 'OPEN BETS'] as const).map((tab) => (
            <button
              key={tab}
              className="flex-1 py-2.5 text-xs font-semibold text-primary border-b-2 border-primary bg-primary/10"
            >
              {tab}
            </button>
          ))}
        </div>

        {activeSelection ? (
          <div className="p-3">
            <div className="bg-card rounded-xl border border-cardBorder overflow-hidden">
              <div className="px-3 py-2.5 border-b border-cardBorder">
                <p className="text-xs font-bold text-textPrimary">{activeSelection.matchName}</p>
                <p className="text-[10px] text-textSecondary">{activeSelection.selectionName}</p>
              </div>
              <div className="p-3 space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[9px] text-textMuted uppercase tracking-wide">Odds</label>
                    <div className="flex items-center border border-cardBorder rounded mt-1">
                      <button className="px-2 py-1.5 text-textSecondary text-sm">—</button>
                      <input value={activeSelection.odds} readOnly className="flex-1 text-center text-xs font-bold bg-transparent py-1.5 text-textPrimary min-w-0" />
                      <button className="px-2 py-1.5 text-textSecondary text-sm">+</button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] text-textMuted uppercase tracking-wide">Stake</label>
                    <input
                      type="number"
                      value={currentStake || ''}
                      onChange={(e) => setStake(activeSelection.id, parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full mt-1 border border-primary rounded px-2 py-1.5 text-xs font-bold text-textPrimary bg-background focus:outline-none text-center"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1">
                  {QUICK_STAKES.map((qs) => (
                    <button
                      key={qs}
                      onClick={() => setStake(activeSelection.id, qs)}
                      className="py-1.5 bg-primary/20 hover:bg-primary text-textPrimary hover:text-white text-[10px] font-semibold rounded border border-primary/30 hover:border-primary transition-all active:scale-95"
                    >
                      +{qs >= 1000 ? `${qs / 1000}K` : qs}
                    </button>
                  ))}
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => removeSelection(activeSelection.id)}
                    className="flex-1 py-1.5 text-xs bg-surface border border-cardBorder rounded font-semibold text-textSecondary hover:text-textPrimary"
                  >
                    CANCEL
                  </button>
                  <button
                    disabled={currentStake === 0}
                    className="flex-1 py-1.5 text-xs bg-primary rounded text-white font-semibold disabled:opacity-50 hover:bg-primaryHover transition-colors"
                  >
                    PLACE BET
                  </button>
                </div>

                <div className="flex items-start gap-1">
                  <Info size={10} className="text-warn mt-0.5 flex-shrink-0" />
                  <p className="text-[9px] text-textMuted">Min Bet: 100 Max Bet: 200000 Max Winning: 5000000</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-textMuted">Confirm bets before placing</span>
                  <button
                    onClick={() => setConfirmBets(!confirmBets)}
                    className={`w-8 h-4 rounded-full relative transition-colors ${confirmBets ? 'bg-primary' : 'bg-cardBorder'}`}
                  >
                    <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${confirmBets ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="text-4xl mb-3">🏏</div>
            <p className="text-sm text-textMuted">Click on odds to place a bet</p>
          </div>
        )}
      </div>

      {/* Mobile bet slip button */}
      {activeSelection && (
        <div className="lg:hidden fixed bottom-14 left-0 right-0 z-30 px-4 pb-2">
          <button className="w-full bg-primary text-white font-bold py-3 rounded-2xl shadow-2xl flex items-center justify-between px-4">
            <span className="text-sm">{activeSelection.selectionName}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">{activeSelection.odds}</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Place Bet</span>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}
