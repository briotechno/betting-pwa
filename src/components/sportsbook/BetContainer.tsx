'use client'
import React, { useState, useEffect } from 'react'
import { ChevronDown, Loader2, X, Plus, Minus } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { bettingController } from '@/controllers/betting/bettingController'
import { useBetSlipStore, BetSelection, Bet } from '@/store/betSlipStore'
import { useSnackbarStore } from '@/store/snackbarStore'
import { toTitleCase } from '@/utils/format'

export default function BetContainer() {
  const [activeTab, setActiveTab] = useState<'BETSLIP' | 'OPEN_BETS'>('BETSLIP')
  const [unmatchedOpen, setUnmatchedOpen] = useState(true)
  const [matchedOpen, setMatchedOpen] = useState(true)
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const { user } = useAuthStore()
  const {
    selections,
    stakes,
    myBets: bets,
    setMyBets: setBets,
    setStake,
    removeSelection,
    clearAll,
    confirmBeforePlace,
    toggleConfirmBeforePlace
  } = useBetSlipStore()
  const snackbar = useSnackbarStore()

  // Requirement: Hide for unlogged users
  if (!user) return null

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
  }, [selections.length])

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

  const quickStakes = [100, 500, 1000, 5000, 10000, 25000]

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

    // Professional Bet Delay Countdown (3 seconds)
    let currentCountdown = 3;
    setCountdown(currentCountdown);
    const timer = setInterval(() => {
      currentCountdown--;
      setCountdown(currentCountdown);
      if (currentCountdown <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    // Wait for the countdown
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      let res;
      // Normalizing the API parameters: 
      // - Eid is the event/match identifier
      // - selectionId is the specific choice (e.g. runner)
      const common = {
        LoginToken: user.loginToken,
        Eid: selection.eventId, // The identifier from the match/game
        Amount: stake,
        Rate: selection.odds,
        IP: '127.0.0.1'
      }

      const mType = selection.marketType?.toUpperCase() || 'ODDS'
      const isWinner = selection.marketName.toLowerCase().includes('winner')
      const runnersCount = selection.runnersCount || 2

      if (isWinner) {
        res = await bettingController.placeWinnerBet({
          ...common,
          SelectionId: selection.selectionId,
          Type: selection.betType === 'back' ? 'B' : 'L'
        })
      } else {
        switch (mType) {
          case 'BOOKMAKER':
            res = await bettingController.placeBookmakerBet({
              ...common,
              SelectionId: selection.selectionId,
              Type: selection.betType === 'back' ? 'B' : 'L'
            })
            break

          case 'FANCY':
            res = await bettingController.placeFancyBet({
              ...common,
              No: selection.betType === 'lay' ? selection.odds : 0,
              Yes: selection.betType === 'back' ? selection.odds : 0,
              Type: selection.betType === 'back' ? 'B' : 'L'
            })
            break

          case 'LINE':
            res = await bettingController.placeLineBet({
              ...common,
              SelectionId: selection.selectionId,
              Type: selection.betType === 'back' ? 'B' : 'L'
            })
            break

          case 'EXTRA':
          case 'GOAL':
            res = await bettingController.placeExtraBet({
              ...common,
              SelectionId: selection.selectionId,
              Type: selection.betType === 'back' ? 'B' : 'L'
            })
            break

          default: // ODDS
            const teamMap: Record<number, 'A' | 'B' | 'C'> = { 0: 'A', 1: 'B', 2: 'C' }
            const teamLetter = teamMap[selection.marketIndex] || 'A'
            const betTypeChar = selection.betType === 'back' ? 'B' : 'L'

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
        snackbar.show("Bet placed successfully!", "success")
        clearAll()
        fetchBets() // Refresh open bets
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

  const matchedBets = bets.filter((b: Bet) => b.Type?.toLowerCase().includes('match') || b.IsMatched === '1')
  const unmatchedBets = bets.filter((b: Bet) => !b.Type?.toLowerCase().includes('match') && b.IsMatched !== '1')

  return (
    <div className="w-full bg-[#121212] border-l border-[#333] min-h-screen sticky top-0 self-start">
      {/* Tabs */}
      <div className="flex border-b border-[#333] sticky top-0 z-[60] bg-[#121212]">
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

      <div className="p-2">
        {activeTab === 'BETSLIP' ? (
          selections.length > 0 ? (
            <div className="space-y-4">
              {selections.map((sel) => {
                return (
                  <div key={sel.id} className="relative bg-white rounded-[2px] p-4 border border-[#a5d9fe] shadow-sm animate-in fade-in slide-in-from-right duration-300 overflow-hidden">
                    {/* Bet Placing Loading Overlay */}
                    {loading && (
                      <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center animate-in fade-in duration-300">
                        <span className="text-[15px] font-medium text-gray-800 mb-1">Your bet will be placed in...</span>
                        <div className="flex flex-col items-center">
                          <span className="text-[20px] font-black text-gray-900 leading-none">{countdown}</span>
                          <div className="w-4 h-4 mt-1 border-t-2 border-black rounded-full animate-spin"></div>
                        </div>
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
                              className="w-10 h-full flex items-center justify-center text-gray-400 hover:bg-gray-50"
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
                              className="w-10 h-full flex items-center justify-center text-gray-400 hover:bg-gray-50"
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
                         <button className="text-[11px] font-black text-[#f36c21] uppercase hover:underline">Edit Stakes</button>
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
                          className={`py-2.5 rounded-[2px] text-[13px] font-black uppercase shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                            stakes[sel.id] ? 'bg-[#f36c21] text-white' : 'bg-[#e0e0e0] text-gray-400'
                          }`}
                        >
                          Place Bet
                        </button>
                      </div>

                      {/* Footer Info */}
                      <div className="flex items-start gap-2 mb-6">
                         <div className="bg-[#f36c21] rounded-full w-5 h-5 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                            <span className="text-[11px] font-black italic">i</span>
                         </div>
                         <p className="text-[11px] font-black text-[#f36c21] leading-[1.3]">
                            Min Bet: 100 Max Bet: 25000 Max Winning: 250000
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
          <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
            {/* UNMATCHED BETS SECTION */}
            <div className="rounded-[4px] overflow-hidden border border-[#f36c21] bg-[#111]">
              <div 
                className="flex items-center justify-between px-4 py-3 cursor-pointer group"
                onClick={() => setUnmatchedOpen(!unmatchedOpen)}
              >
                <span className="text-white text-[13px] font-bold tracking-tight">
                  Unmatched Bets
                </span>
                <div className="bg-[#f36c21] rounded-full p-0.5 w-6 h-6 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                   <ChevronDown size={16} className={`text-white transition-transform duration-300 ${unmatchedOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {unmatchedOpen && (
                <div className="px-4 pb-4 space-y-4 bg-[#111] animate-in fade-in slide-in-from-top-2 duration-300">
                  {unmatchedBets.length > 0 ? (
                    unmatchedBets.map((bet, idx) => (
                      <div key={idx} className="space-y-1.5 border-t border-white/5 pt-3 first:border-0 first:pt-0">
                         <div className="flex flex-col">
                            <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">{bet.Game}</span>
                            <span className="text-white text-[13px] font-black uppercase tracking-tight">{bet.Selection}</span>
                          </div>
                          <table className="w-full text-left bg-white rounded-[4px] overflow-hidden shadow-2xl">
                            <thead className="bg-gray-50/50">
                              <tr className="border-b border-gray-100">
                                <th className="py-2 px-3 text-[9px] font-black text-gray-500 uppercase tracking-widest">Odds</th>
                                <th className="py-2 px-3 text-[9px] font-black text-gray-500 uppercase tracking-widest text-center">Stake</th>
                                <th className="py-2 px-3 text-[9px] font-black text-gray-500 uppercase tracking-widest text-right">Profit/Liability</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className={`text-[#333] ${bet.Side === 'back' ? 'bg-[#a5d9fe]' : 'bg-[#f8d0ce]'}`}>
                                <td className="py-2.5 px-3 text-[13px] font-black">{bet.Rate}</td>
                                <td className="py-2.5 px-3 text-[13px] font-black text-center">{bet.Stake}</td>
                                <td className="py-2.5 px-3 text-[13px] font-black text-right">0</td>
                              </tr>
                            </tbody>
                          </table>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-center opacity-30">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black italic">No unmatched bets</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* MATCHED BETS SECTION */}
            <div className="rounded-[4px] overflow-hidden border border-[#f36c21] bg-[#111]">
              <div 
                className="flex items-center justify-between px-4 py-3 cursor-pointer group"
                onClick={() => setMatchedOpen(!matchedOpen)}
              >
                <span className="text-white text-[13px] font-bold tracking-tight">
                  Matched Bets
                </span>
                <div className="bg-[#f36c21] rounded-full p-0.5 w-6 h-6 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                   <ChevronDown size={16} className={`text-white transition-transform duration-300 ${matchedOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {matchedOpen && (
                <div className="px-4 pb-4 space-y-4 bg-[#111] animate-in fade-in slide-in-from-top-2 duration-300">
                  {/* Average Odds UI */}
                  <div className="flex items-center gap-2 pb-1 opacity-80 pt-1">
                     <div className="w-3.5 h-3.5 border border-[#f36c21] rounded-sm bg-[#f36c21] flex items-center justify-center">
                        <div className="w-2 h-1 border-l-2 border-b-2 border-white transform -rotate-45 -mt-0.5"></div>
                     </div>
                     <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Average Odds</span>
                  </div>

                  {matchedBets.length > 0 ? (
                    matchedBets.map((bet, idx) => {
                      const profit = (parseFloat(bet.Stake) * (parseFloat(bet.Rate) - 1)).toFixed(0);
                      return (
                        <div key={idx} className="space-y-1.5 border-t border-white/5 pt-3 first:border-0 first:pt-1">
                          <div className="flex flex-col">
                            <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">{bet.Game}</span>
                            <span className="text-white text-[13px] font-black uppercase tracking-tight">{bet.Selection}</span>
                          </div>

                          <table className="w-full text-left bg-white rounded-[4px] overflow-hidden shadow-2xl">
                            <thead className="bg-gray-50/50">
                              <tr className="border-b border-gray-100">
                                <th className="py-2 px-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">Odds</th>
                                <th className="py-2 px-3 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Stake</th>
                                <th className="py-2 px-3 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Profit/Liability</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className={`text-[#333] ${bet.Side === 'back' ? 'bg-[#a5d9fe]' : 'bg-[#f8d0ce]'}`}>
                                <td className="py-2.5 px-3 text-[13px] font-black">{bet.Rate}</td>
                                <td className="py-2.5 px-3 text-[13px] font-black text-center">{bet.Stake}</td>
                                <td className="py-2.5 px-3 text-[13px] font-black text-right">{profit}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )
                    })
                  ) : (
                    <div className="py-4 text-center opacity-30">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black italic">No matched bets</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

