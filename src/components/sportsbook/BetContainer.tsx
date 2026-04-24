'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Loader2, X, Plus, Minus } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { bettingController } from '@/controllers/betting/bettingController'
import { useBetSlipStore, BetSelection, Bet } from '@/store/betSlipStore'
import { useSnackbarStore } from '@/store/snackbarStore'
import { toTitleCase, formatTime12h } from '@/utils/format'
import BetConfirmationModal from './BetConfirmationModal'

export default function BetContainer({ matchId, sportType, hideBetslipOnMobile }: { matchId?: string, sportType?: string, hideBetslipOnMobile?: boolean }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'BETSLIP' | 'OPEN_BETS'>('OPEN_BETS')
  const [loading, setLoading] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile) {
      setActiveTab('OPEN_BETS')
    }
  }, [isMobile])

  const { user } = useAuthStore()
  const {
    selections,
    stakes,
    myBets: bets,
    setMyBets: setBets,
    setStake,
    updateOdds,
    removeSelection,
    clearAll,
    confirmBeforePlace,
    toggleConfirmBeforePlace,
    quickStakes,
    fetchQuickStakes
  } = useBetSlipStore()
  const snackbar = useSnackbarStore()
  // Requirement: Hide for unlogged users
  if (!user) return null

  // Fetch quick stakes on mount
  useEffect(() => {
    if (user?.loginToken) {
      fetchQuickStakes(user.loginToken)
    }
  }, [user?.loginToken])

  useEffect(() => {
    if (activeTab === 'OPEN_BETS' && user?.loginToken) {
      fetchBets()
    }
  }, [activeTab, user?.loginToken])

  // Automatically switch to BETSLIP tab when a selection is added
  useEffect(() => {
    if (selections.length > 0) {
      setActiveTab('BETSLIP')
    }
  }, [selections])

  const fetchBets = async () => {
    try {
      setLoading(true)
      const res = await bettingController.getMyBets(user?.loginToken || '')
      if (res && typeof res === 'object' && !res.error) {
        const betArray = Object.values(res).filter(item => typeof item === 'object' && item !== null) as any[]
        setBets(betArray)
      }
    } catch (err) {
      console.error('Failed to fetch bets:', err)
    } finally {
      setLoading(false)
    }
  }

  const placeBets = async () => {
    if (selections.length === 0) return
    if (!user || !user.loginToken) {
      snackbar.show("Please login to place a bet", "error")
      setActiveTab('BETSLIP')
      return
    }

    setLoading(true)
    const selection = selections[0]
    const stake = stakes[selection.id]

    if (!stake || stake <= 0) {
      snackbar.show("Please enter a valid stake amount", "warning")
      setLoading(false)
      return
    }

    if (confirmBeforePlace) {
      setLoading(false)
      setIsConfirmModalOpen(true)
      return
    }

    await handleExecutePlacement()
  }

  const handleExecutePlacement = async () => {
    const selection = selections[0]
    const stake = stakes[selection.id]
    setLoading(true)
    setIsConfirmModalOpen(false)

    try {
      let res;
      const common = {
        LoginToken: user?.loginToken || '',
        Eid: selection.marketId,
        Amount: stake,
        Rate: selection.odds,
        IP: '127.0.0.1'
      }

      const mType = selection.marketType?.toUpperCase() || 'ODDS'
      const isWinner = selection.marketName.toLowerCase().includes('winner') && mType !== 'WINNETSET'
      const runnersCount = selection.runnersCount || 2
      const teamMap: Record<number, 'A' | 'B' | 'C'> = { 0: 'A', 1: 'B', 2: 'C' }
      const teamLetter = teamMap[selection.marketIndex] || 'A'

      // Default mapping: Back -> B, Lay -> L
      // For Fancy/Line: Yes (Back) -> L, No (Lay) -> B (per developer request)
      const isFancyMarket = mType === 'FANCY' || mType === 'LINE'
      const betTypeChar = isFancyMarket
        ? (selection.betType === 'back' ? 'L' : 'B')
        : (selection.betType === 'back' ? 'B' : 'L')

      if (isWinner) {
        res = await bettingController.placeWinnerBet({
          ...common,
          SelectionId: selection.selectionId,
          Type: betTypeChar
        })
      } else {
        switch (mType) {
          case 'BOOKMAKER':
            res = await bettingController.placeBookmakerBet({
              ...common,
              Eid: selection.marketId,
              Team: teamLetter,
              Type: betTypeChar
            })
            break

          case 'FANCY':
            res = await bettingController.placeFancyBet({
              ...common,
              Eid: selection.marketId,
              No: selection.noVal || 100,
              Yes: selection.yesVal || 100,
              Rate: selection.odds, // The actual rate clicked (e.g. 294)
              Type: betTypeChar
            })
            break

          case 'LINE':
            res = await bettingController.placeLineBet({
              ...common,
              Eid: selection.marketId,
              Amount: common.Amount.toString(),
              Rate: common.Rate.toString(),
              Type: betTypeChar
            })
            break

          case 'EXTRA':
            res = await bettingController.placeExtraBet({
              ...common,
              Eid: selection.marketId,
              Team: teamLetter,
              Type: betTypeChar
            })
            break

          case 'GOAL':
          case 'GOALS':
          case 'WINNETSET':
            res = await bettingController.placeGoalBet({
              ...common,
              Eid: selection.marketId,
              Team: teamLetter,
              Type: betTypeChar
            })
            break

          default: // ODDS
            if (runnersCount === 3) {
              res = await bettingController.place3TeamOddBet({
                ...common,
                Team: teamLetter as 'A' | 'B' | 'C',
                Type: betTypeChar
              })
            } else {
              res = await bettingController.place2TeamOddBet({
                ...common,
                Team: teamLetter as 'A' | 'B',
                Type: betTypeChar
              })
            }
            break
        }
      }

      if (res && (res.status === 'Success' || res.status === 200 || res.success || res.error === '0')) {
        snackbar.show(`Bet placed successfully @ ${selection.odds} of ${stake}!`, "success")
        clearAll()
        fetchBets() // Refresh open bets
        if (matchId) {
          setActiveTab('OPEN_BETS')
          // 📢 Signal to refresh match data (exposure)
          window.dispatchEvent(new CustomEvent('bet-placed', { detail: { matchId } }))
        }
      } else {
        snackbar.show(res?.msg || res?.message || res?.description || "Failed to place bet", "error")
      }
    } catch (err) {
      console.error(err)
      snackbar.show("An error occurred while placing bet", "error")
    } finally {
      setLoading(false)
    }
  }

  const groupBetsByGame = (bets: Bet[]) => {
    const groups: Record<string, Bet[]> = {}
    bets.forEach((bet) => {
      const gameName = bet.Game || 'Unknown Game'
      if (!groups[gameName]) groups[gameName] = []
      groups[gameName].push(bet)
    })
    return groups
  }

  const calculateBetProfit = (bet: Bet) => {
    const odds = parseFloat(bet.Rate) || 0
    const stake = parseFloat(bet.Stake) || 0
    const mType = (bet.Game_Type || '').toUpperCase()
    const isBack = bet.Side === 'back'

    let value = 0
    if (mType.includes('BOOKMAKER')) {
      value = (odds * stake) / 100
    } else if (mType.includes('FANCY') || mType.includes('LINE')) {
      value = isBack ? (odds * stake / 100) : stake
    } else {
      value = (odds - 1) * stake
    }
    return Math.floor(value).toLocaleString()
  }

  const filteredBets = matchId
    ? bets.filter((b: Bet) =>
      b.gid === matchId ||
      b.matchId === matchId ||
      b.eventId === matchId ||
      b.eventId === matchId.toString()
    )
    : (sportType
      ? bets.filter((b: Bet) => b.Type?.toLowerCase() === sportType.toLowerCase())
      : bets)

  return (
    <div className="w-full bg-[#121212] border-l border-[#333] lg:border-none min-h-screen lg:min-h-0 relative self-start">
      {/* Tabs */}
      {!isMobile && (
        <div className="flex border-b border-[#333] relative z-[60] bg-[#121212]">
          <button
            onClick={() => setActiveTab('BETSLIP')}
            className={`flex-1 py-3 text-[12px] font-black tracking-wider transition-all ${activeTab === 'BETSLIP' ? 'text-[#e8612c] border-b-2 border-[#e8612c]' : 'text-gray-500 hover:text-gray-200'
              }`}
          >
            BETSLIP {selections.length > 0 && `(${selections.length})`}
          </button>
          <button
            onClick={() => setActiveTab('OPEN_BETS')}
            className={`flex-1 py-3 text-[12px] font-black tracking-wider transition-all ${activeTab === 'OPEN_BETS' ? 'text-[#e8612c] border-b-2 border-[#e8612c]' : 'text-gray-500 hover:text-gray-200'
              }`}
          >
            OPEN BETS
          </button>
        </div>
      )}

      <div className={isMobile ? "p-0" : "p-2"}>
        {(activeTab === 'BETSLIP' && !isMobile) ? (
          selections.length > 0 ? (
            <div className="space-y-4">
              {selections.map((sel) => {
                return (
                  <div key={sel.id} className="relative bg-white rounded-[2px] p-4 border border-[#a5d9fe] shadow-sm animate-in fade-in slide-in-from-right duration-300 overflow-hidden">
                    {/* Bet Placing Loading Overlay */}
                    {loading && (
                      <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center animate-in fade-in duration-200">
                        <Loader2 className="animate-spin text-[#f36c21]" size={30} />
                        <span className="text-[13px] font-bold text-gray-800 mt-2 uppercase tracking-tighter">Placing Bet...</span>
                      </div>
                    )}

                    <div className={loading ? 'opacity-20 blur-[1px]' : ''}>
                      <div className="mb-3">
                        <div className="text-[13px] font-bold text-gray-800 leading-tight">{sel.matchName}</div>
                        <div className="text-[13px] font-bold text-gray-800 leading-tight">{sel.selectionName}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {/* Odds Input with Floating Label */}
                        <div className="relative">
                          <label className="absolute -top-[9px] left-2.5 px-1 bg-white text-[10px] font-bold text-gray-400 z-10">Odds</label>
                          <div className="flex items-center border border-gray-300 rounded-[2px] overflow-hidden h-[42px]">
                            <button
                              onClick={() => updateOdds(sel.id, -1)}
                              className="w-10 h-full flex items-center justify-center text-gray-400 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                            >
                              <Minus size={14} strokeWidth={3} />
                            </button>
                            <input
                              type="text"
                              readOnly
                              value={sel.odds}
                              className="w-full text-center text-[15px] font-bold text-gray-800 bg-transparent outline-none"
                            />
                            <button
                              onClick={() => updateOdds(sel.id, 1)}
                              className="w-10 h-full flex items-center justify-center text-gray-400 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                            >
                              <Plus size={14} strokeWidth={3} />
                            </button>
                          </div>
                        </div>

                        {/* Stake Input with Orange Border */}
                        <div className="relative">
                          <label className="absolute -top-[9px] left-2.5 px-1 bg-white text-[10px] font-bold text-[#f36c21] z-10">Stake</label>
                          <div className="h-[42px]">
                            <input
                              type="number"
                              value={stakes[sel.id] || ''}
                              onChange={(e) => setStake(sel.id, parseFloat(e.target.value) || 0)}
                              placeholder="0"
                              className="w-full h-full border border-[#f36c21] rounded-[2px] text-[15px] font-bold text-gray-800 outline-none px-3"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[11px] text-gray-600 font-bold">or Choose You Stake Size</span>
                        <button
                          onClick={() => router.push('/settings')}
                          className="text-[11px] font-black text-[#f36c21] uppercase hover:underline"
                        >
                          Edit Stakes
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {quickStakes.map(s => (
                          <button
                            key={s}
                            onClick={() => setStake(sel.id, (stakes[sel.id] || 0) + s)}
                            className="bg-[#f36c21] text-white py-2.5 rounded-[2px] text-[13px] font-black hover:brightness-110 active:scale-95 transition-all"
                          >
                            +{s.toLocaleString()}
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <button
                          onClick={() => removeSelection(sel.id)}
                          className="py-2.5 text-[13px] font-black text-gray-500 border border-black rounded-[2px] hover:bg-gray-50 transition-colors uppercase"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={placeBets}
                          disabled={loading || !stakes[sel.id]}
                          className={`flex flex-col items-center justify-center py-1.5 rounded-[2px] text-[13px] font-black uppercase shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${stakes[sel.id] ? 'bg-[#f36c21] text-white' : 'bg-[#e0e0e0] text-gray-400'
                            }`}
                        >
                          {loading ? (
                            <Loader2 size={16} className="animate-spin mx-auto" />
                          ) : (
                            <>
                              <span className="text-[13px] font-black uppercase">Place Bet</span>
                              {stakes[sel.id] > 0 && (() => {
                                const mType = sel.marketType?.toUpperCase() || 'ODDS';
                                const isBack = sel.betType === 'back';
                                const odds = sel.odds;
                                const stake = stakes[sel.id];
                                let value = 0;

                                if (mType === 'BOOKMAKER') {
                                  value = (odds * stake) / 100;
                                } else if (mType === 'FANCY' || mType === 'LINE') {
                                  value = isBack ? (odds * stake / 100) : stake;
                                } else {
                                  value = (odds - 1) * stake;
                                }

                                return (
                                  <span className="text-[10px] font-bold opacity-90 uppercase mt-0.5">
                                    {isBack ? 'Profit' : 'Liability'}: {Math.floor(value).toLocaleString()}
                                  </span>
                                );
                              })()}
                            </>
                          )}
                        </button>
                      </div>

                      {/* Footer Info */}
                      <div className="flex items-center gap-2">
                        <div className="bg-[#f36c21] rounded-full w-5 h-5 flex items-center justify-center text-white flex-shrink-0">
                          <span className="text-[11px] font-black italic leading-none">i</span>
                        </div>

                        <p className="text-[11px] font-black text-[#f36c21] leading-none">
                          Min Bet: {sel.min || 100} Max Bet: {sel.max || 25000}
                        </p>
                      </div>

                      {/* Footer Toggle */}
                      <div className="flex items-center justify-between py-2 border-t border-gray-100">
                        <span className="text-[13px] text-gray-600 font-bold">Confirm bets before placing</span>
                        <button
                          onClick={toggleConfirmBeforePlace}
                          className={`w-[44px] h-[24px] rounded-full transition-colors relative flex items-center px-[3px] ${confirmBeforePlace ? 'bg-[#f36c21]' : 'bg-[#e0e0e0]'}`}
                        >
                          <div className={`w-[18px] h-[18px] bg-white rounded-full transition-transform ${confirmBeforePlace ? 'translate-x-5' : ''} shadow-sm`} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-8 bg-white/5 rounded-[4px] text-center border border-white/5 mt-4">
              <div className="w-12 h-12 bg-[#f36c21]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#f36c21]/20">
                <Plus className="text-[#f36c21]" size={20} />
              </div>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                Your betslip is empty.<br />Select some odds to start!
              </p>
            </div>
          )
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
            {filteredBets.length > 0 ? (
              Object.entries(groupBetsByGame(filteredBets)).map(([gameName, gameBets]) => (
                <div key={gameName} className="mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  {/* Game Name as requested: "top of that data" */}
                  <div className="bg-[#444] px-2 py-1.5 border-l-4 border-[#f36c21] mb-0.5 flex items-center justify-between">
                    <span className="text-white text-[11px] font-black uppercase tracking-wider">{gameName}</span>
                    <span className="text-[#f36c21] text-[9px] font-black uppercase tracking-[0.2em]">{gameBets[0]?.Type || ''}</span>
                  </div>

                  <div className="overflow-hidden rounded-sm">
                    <table className="w-full text-left border-collapse table-fixed">
                      <thead>
                        <tr className="bg-[#e0e0e0] border-b border-gray-300">
                          <th className="py-2 px-1 text-[10px] font-black text-gray-600 uppercase tracking-tighter w-[22%]">Market</th>
                          <th className="py-2 px-1 text-[10px] font-black text-gray-600 uppercase tracking-tighter w-[28%]">Selection</th>
                          <th className="py-2 px-1 text-[10px] font-black text-gray-600 uppercase tracking-tighter text-center w-[12%]">Rate</th>
                          <th className="py-2 px-1 text-[10px] font-black text-gray-600 uppercase tracking-tighter text-center w-[12%]">Stake</th>
                          <th className="py-2 px-1 text-[10px] font-black text-gray-600 uppercase tracking-tighter text-center w-[26%]">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gameBets.map((bet, bIdx) => {
                          const isBack = bet.Side?.toLowerCase() === 'back';
                          return (
                            <tr
                              key={bIdx}
                              className={`${isBack ? 'bg-[#a5d9fe]' : 'bg-[#f8d0ce]'} border-b border-black/5 last:border-0`}
                            >
                              <td className="py-3 px-1 text-[10px] font-bold text-[#111] leading-tight break-words uppercase">
                                {bet.Game_Type || 'ODDS'}
                              </td>
                              <td className="py-3 px-1 text-[10px] font-bold text-[#111] leading-tight break-words uppercase">
                                {bet.Selection}
                              </td>
                              <td className="py-3 px-1 text-[10px] font-bold text-[#111] text-center">
                                {bet.Rate}
                              </td>
                              <td className="py-3 px-1 text-[10px] font-bold text-[#111] text-center">
                                {bet.Stake}
                              </td>
                              <td className="py-3 px-1 text-[9px] font-bold text-[#111] text-center leading-none">
                                {formatTime12h(bet.Date)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black italic">No open bets found</p>
              </div>
            )}
          </div>
        )}
      </div>
      <HiddenModals
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleExecutePlacement}
        selection={selections[0] ? { ...selections[0], stake: stakes[selections[0].id] } : null}
      />
    </div>
  )
}

function HiddenModals({
  isOpen,
  onClose,
  onConfirm,
  selection
}: {
  isOpen: boolean,
  onClose: () => void,
  onConfirm: () => void,
  selection: any
}) {
  if (!selection) return null
  return (
    <BetConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      selectionName={selection.selectionName}
      odds={selection.odds}
      stake={selection.stake || 0}
      betType={selection.betType}
      marketType={selection.marketType}
    />
  )
}

