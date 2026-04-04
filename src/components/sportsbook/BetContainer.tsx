'use client'
import React, { useState, useEffect } from 'react'
import { ChevronDown, Loader2, X, Plus, Minus } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { bettingController } from '@/controllers/betting/bettingController'
import { useBetSlipStore, BetSelection } from '@/store/betSlipStore'
import { useSnackbarStore } from '@/store/snackbarStore'
import { toTitleCase } from '@/utils/format'

interface Bet {
  Game: string;
  Selection: string;
  Type: string;
  Rate: string;
  Stake: string;
  Date: string;
  Side: 'back' | 'lay';
  IsMatched?: string;
}

export default function BetContainer() {
  const [activeTab, setActiveTab] = useState<'BETSLIP' | 'OPEN_BETS'>('BETSLIP')
  const [unmatchedOpen, setUnmatchedOpen] = useState(true)
  const [matchedOpen, setMatchedOpen] = useState(true)
  const [bets, setBets] = useState<Bet[]>([])
  const [loading, setLoading] = useState(false)

  const { user } = useAuthStore()
  const {
    selections,
    stakes,
    setStake,
    removeSelection,
    clearAll,
    confirmBeforePlace,
    toggleConfirmBeforePlace
  } = useBetSlipStore()
  const snackbar = useSnackbarStore()

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
        const betArray = Object.values(res).filter(item => typeof item === 'object' && item !== null) as Bet[]
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

      console.log('--- Placing Bet Data ---');
      console.log('Selection State:', JSON.stringify(selection, null, 2));
      console.log('API Common Object:', JSON.stringify(common, null, 2));

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

  const renderBetCard = (bet: Bet) => (
    <div key={`${bet.Game}-${bet.Date}`} className="bg-[#1a1a1a] p-3 border-b border-[#333] last:border-0">
      <div className="flex justify-between items-start mb-1">
        <span className="text-[11px] font-bold text-white uppercase tracking-tight truncate flex-1 pr-2">{bet.Game}</span>
        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${bet.Side === 'back' ? 'bg-[#a5d9fe] text-black' : 'bg-[#f8d0ce] text-black'}`}>
          {bet.Side}
        </span>
      </div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] text-gray-400 font-medium">{bet.Selection}</span>
        <span className="text-[10px] text-white font-black">@ {bet.Rate}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[9px] text-gray-500">{bet.Date}</span>
        <span className="text-[10px] text-[#e8612c] font-bold">₹{bet.Stake}</span>
      </div>
    </div>
  )

  return (
    <div className="w-full bg-[#121212] border-l border-[#333] min-h-screen">
      {/* Tabs */}
      <div className="flex border-b border-[#333] sticky top-0 z-10 bg-[#121212]">
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

      <div className="p-3">
        {activeTab === 'BETSLIP' ? (
          selections.length > 0 ? (
            <div className="space-y-4">
              {selections.map((sel) => (
                <div key={sel.id} className="bg-white rounded-lg overflow-hidden shadow-xl animate-in slide-in-from-right duration-300">
                  <div className={`px-3 py-2 flex justify-between items-center ${sel.betType === 'back' ? 'bg-[#a5d9fe]' : 'bg-[#f8d0ce]'}`}>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase text-black/60 truncate max-w-[200px] leading-tight">{sel.matchName}</span>
                      <span className="text-[11px] font-black text-black leading-tight uppercase">{sel.selectionName} <span className="text-[8px] opacity-60">({sel.marketName})</span></span>
                    </div>
                    <button onClick={() => removeSelection(sel.id)} className="text-black/60 hover:text-black">
                      <X size={16} strokeWidth={3} />
                    </button>
                  </div>

                  <div className="p-3 space-y-3 bg-white">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-[8px] font-black text-gray-400 uppercase mb-1 block">Odds</label>
                        <div className="flex items-center border border-gray-200 rounded-md overflow-hidden h-9">
                          <button className="px-2 h-full hover:bg-gray-50 text-gray-400"><Minus size={12} /></button>
                          <input
                            type="number"
                            value={sel.odds}
                            readOnly
                            className="w-full text-center text-[13px] font-black focus:outline-none text-gray-900"
                          />
                          <button className="px-2 h-full hover:bg-gray-50 text-gray-400"><Plus size={12} /></button>
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="text-[8px] font-black text-gray-400 uppercase mb-1 block">Stake</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={stakes[sel.id] || ''}
                          onChange={(e) => setStake(sel.id, parseFloat(e.target.value) || 0)}
                          className="w-full h-9 border border-gray-200 rounded-md text-center text-[13px] font-black focus:border-[#f36c21]/50 focus:outline-none placeholder:opacity-30 text-gray-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      {quickStakes.map(s => (
                        <button
                          key={s}
                          onClick={() => setStake(sel.id, (stakes[sel.id] || 0) + s)}
                          className="py-2 text-[10px] font-black border border-gray-100 rounded bg-[#f36c21] text-white hover:bg-[#d85a1a] transition-all"
                        >
                          +{s.toLocaleString()}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => removeSelection(sel.id)}
                        className="flex-1 py-2 text-[11px] font-black text-gray-400 uppercase border border-gray-200 rounded hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={placeBets}
                        disabled={loading || !stakes[sel.id]}
                        className="flex-2 py-2 px-6 text-[11px] font-black text-white uppercase bg-[#ccc] rounded cursor-not-allowed disabled:bg-gray-200"
                        style={{
                          backgroundColor: stakes[sel.id] ? (sel.betType === 'back' ? '#2196f3' : '#e91e63') : '#ccc',
                          cursor: stakes[sel.id] ? 'pointer' : 'not-allowed'
                        }}
                      >
                        {loading ? <Loader2 size={14} className="animate-spin" /> : 'Place Bet'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-2 border-t border-white/5">
                <div className="flex items-center justify-between px-1 mb-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#f36c21] rounded-full flex items-center justify-center text-white text-[8px] font-black">i</div>
                      <span className="text-[10px] font-bold text-gray-400 italic">
                        Min Bet: 100 Max Bet: 50000 Max Winning: 250000
                      </span>
                    </div>
                    {!Object.values(stakes).some(s => s > 0) && (
                      <span className="text-[10px] text-red-500 font-bold ml-6">Stake is required</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 mb-4">
                  <span className="text-[10px] font-black text-white uppercase opacity-70">Confirm bets before placing</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={confirmBeforePlace} onChange={toggleConfirmBeforePlace} className="sr-only peer" />
                    <div className="w-10 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#f36c21]"></div>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={clearAll}
                    className="flex-1 py-3 text-[11px] font-black text-gray-400 uppercase border border-white/10 rounded-lg hover:bg-white/5 transition-all"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={placeBets}
                    disabled={loading || !Object.values(stakes).some(s => s > 0)}
                    className={`flex-[2] py-3 text-[11px] font-black uppercase rounded-lg transition-all ${Object.values(stakes).some(s => s > 0)
                        ? 'bg-[#f36c21] text-white shadow-[0_4px_15px_rgba(243,108,33,0.3)] hover:brightness-110 active:scale-[0.98]'
                        : 'bg-white/10 text-white/20 cursor-not-allowed'
                      }`}
                  >
                    {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Place Bet'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-white/5 rounded-[20px] text-center border border-white/5 mt-4">
              <div className="w-12 h-12 bg-[#f36c21]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#f36c21]/20">
                <Plus className="text-[#f36c21]" size={20} />
              </div>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                Your betslip is empty.<br />Select some odds to start!
              </p>
            </div>
          )
        ) : (
          <div className="space-y-4">
            {/* Open Bets Section */}
            <div className="border border-[#e8612c]/40 rounded-xl overflow-hidden bg-[#1a1a1a]">
              <button
                onClick={() => setUnmatchedOpen(!unmatchedOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-[#111] text-white text-[12px] font-black uppercase tracking-tight"
              >
                <div className="flex items-center gap-2">
                  <span>Unmatched Bets</span>
                  {unmatchedBets.length > 0 && (
                    <span className="bg-[#e8612c] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{unmatchedBets.length}</span>
                  )}
                </div>
                <ChevronDown size={14} className={`text-gray-500 transition-transform duration-300 ${unmatchedOpen ? '' : '-rotate-90'}`} />
              </button>
              {unmatchedOpen && (
                <div className="bg-black/20 divide-y divide-[#333]">
                  {loading ? (
                    <div className="p-8 flex justify-center"><Loader2 size={20} className="text-[#e8612c] animate-spin" /></div>
                  ) : unmatchedBets.length > 0 ? (
                    unmatchedBets.map(renderBetCard)
                  ) : (
                    <div className="p-8 text-center text-[10px] text-gray-600 font-black uppercase tracking-widest italic opacity-40">
                      No unmatched bets found
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border border-[#e8612c]/40 rounded-xl overflow-hidden bg-[#1a1a1a]">
              <button
                onClick={() => setMatchedOpen(!matchedOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-[#111] text-white text-[12px] font-black uppercase tracking-tight"
              >
                <div className="flex items-center gap-2">
                  <span>Matched Bets</span>
                  {matchedBets.length > 0 && (
                    <span className="bg-[#e8612c] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{matchedBets.length}</span>
                  )}
                </div>
                <ChevronDown size={14} className={`text-gray-500 transition-transform duration-300 ${matchedOpen ? '' : '-rotate-90'}`} />
              </button>
              {matchedOpen && (
                <div className="bg-black/20 divide-y divide-[#333]">
                  {loading ? (
                    <div className="p-8 flex justify-center"><Loader2 size={20} className="text-[#e8612c] animate-spin" /></div>
                  ) : matchedBets.length > 0 ? (
                    matchedBets.map(renderBetCard)
                  ) : (
                    <div className="p-8 text-center text-[10px] text-gray-600 font-black uppercase tracking-widest italic opacity-40">
                      No matched bets found
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
