'use client'
import React, { useState } from 'react'
import { X, Plus, Minus, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { bettingController } from '@/controllers/betting/bettingController'
import { useBetSlipStore, BetSelection } from '@/store/betSlipStore'
import { useSnackbarStore } from '@/store/snackbarStore'
import { toTitleCase } from '@/utils/format'

interface BetSlipFormProps {
  selection: BetSelection;
  onClose: () => void;
}

export default function BetSlipForm({ selection, onClose }: BetSlipFormProps) {
  const { user } = useAuthStore()
  const { 
    stakes, 
    setStake, 
    confirmBeforePlace,
    toggleConfirmBeforePlace,
    clearAll,
    updateOdds
  } = useBetSlipStore()
  const snackbar = useSnackbarStore()
  
  const [loading, setLoading] = useState(false)
  const stake = stakes[selection.id] || 0
  const quickStakes = [100, 500, 1000, 5000, 10000, 25000]

  const placeBet = async () => {
    if (!user || !user.loginToken) {
       snackbar.show("Please login to place a bet", "error")
       return
    }

    if (!stake || stake <= 0) {
      snackbar.show("Please enter a valid stake amount", "warning")
      return
    }

    setLoading(true)
    try {
      let res;
      const common = {
        LoginToken: user.loginToken,
        Eid: selection.eventId,
        Amount: stake,
        Rate: selection.odds,
        IP: '127.0.0.1' 
      }

      const mType = selection.marketType?.toUpperCase() || 'ODDS'
      const isWinner = selection.marketName.toLowerCase().includes('winner')
      const teamMap: Record<number, 'A' | 'B' | 'C'> = { 0: 'A', 1: 'B', 2: 'C' }
      const teamLetter = teamMap[selection.marketIndex] || 'A'
      const betTypeChar = selection.betType === 'back' ? 'B' : 'L'
      const runnersCount = selection.runnersCount || 2

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
              Eid: selection.marketId, // Use MarketId as Eid per [ekey for rates]
              Team: teamLetter, 
              Type: betTypeChar
            })
            break

          case 'FANCY':
            res = await bettingController.placeFancyBet({
              ...common,
              Eid: selection.marketId, // Use MarketId as Eid
              No: selection.odds, // Value/Rate
              Yes: selection.odds, // Value/Rate
              Rate: 100, // Fixed price for fancy often 100/100
              Type: betTypeChar
            })
            break

          case 'LINE':
            res = await bettingController.placeLineBet({
              ...common,
              Eid: selection.marketId, // Use MarketId as Eid
              Type: betTypeChar
            })
            break

          case 'EXTRA':
          case 'GOAL':
          case 'GOALS':
            res = await bettingController.placeExtraBet({
              ...common,
              Eid: selection.marketId, // Use MarketId as Eid
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
         snackbar.show("Bet placed successfully!", "success")
         clearAll()
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

  return (
    <div className="bg-[#fff] border border-[#a5d9fe] rounded-[2px] overflow-hidden my-2 shadow-2xl animate-in slide-in-from-top-4 duration-300">
      {/* Header Info */}
      <div className="p-3 bg-white">
        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-tight mb-0.5 opacity-70">{selection.matchName}</p>
        <p className="text-[13px] font-black text-[#333] uppercase leading-tight">{selection.selectionName}</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Controls Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <label className="absolute -top-[9px] left-2.5 px-1 bg-white text-[10px] font-bold text-gray-400 z-10 leading-none">Odds</label>
            <div className="flex items-center h-10 border border-gray-300 rounded-[2px] overflow-hidden bg-white">
              <button 
                onClick={() => updateOdds(selection.id, -0.01)}
                className="w-10 h-full flex items-center justify-center text-gray-400 hover:bg-gray-50 active:scale-95 transition-transform"
              >
                <Minus size={14} strokeWidth={3} />
              </button>
              <input 
                type="number" 
                value={selection.odds} 
                readOnly
                className="w-full text-center text-[15px] font-bold focus:outline-none text-gray-900 bg-transparent" 
              />
              <button 
                onClick={() => updateOdds(selection.id, 0.01)}
                className="w-10 h-full flex items-center justify-center text-gray-400 hover:bg-gray-50 active:scale-95 transition-transform"
              >
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>
          </div>

          <div className="relative">
             <label className="absolute -top-[9px] left-2.5 px-1 bg-white text-[10px] font-bold text-[#f36c21] z-10 leading-none">Stake</label>
             <div className="h-10 border border-[#f36c21] rounded-[2px] overflow-hidden bg-white">
                <input 
                  type="number" 
                  placeholder="0"
                  value={stake || ''}
                  onChange={(e) => setStake(selection.id, parseFloat(e.target.value) || 0)}
                  className="w-full h-full text-center text-[15px] font-bold focus:outline-none placeholder:opacity-30 text-gray-900 bg-transparent" 
                />
             </div>
          </div>
        </div>

        {/* Quick Stakes Grid */}
        <div className="space-y-3">
           <div className="flex justify-between items-center">
              <p className="text-[11px] font-bold text-gray-600">or Choose You Stake Size</p>
              <button className="text-[11px] font-black text-[#f36c21] uppercase hover:underline">Edit Stakes</button>
           </div>
           <div className="grid grid-cols-3 gap-2">
             {quickStakes.map(s => (
               <button 
                 key={s} 
                 onClick={() => setStake(selection.id, (stake || 0) + s)}
                 className="py-2.5 text-[13px] font-black rounded-[2px] bg-[#f36c21] text-white hover:brightness-110 active:scale-[0.97] transition-all shadow-sm"
               >
                 +{s.toLocaleString()}
               </button>
             ))}
           </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-[1fr_1.5fr] gap-2">
           <button 
             onClick={onClose}
             className="py-2.5 text-[13px] font-black text-gray-500 uppercase border border-black rounded-[2px] hover:bg-gray-50 transition-colors"
           >
             Cancel
           </button>
           <button 
             onClick={placeBet}
             disabled={loading || stake === 0}
             className={`py-2.5 text-[13px] font-black uppercase rounded-[2px] transition-all shadow-sm ${
               stake > 0 
               ? 'bg-[#f36c21] text-white active:brightness-110' 
               : 'bg-[#e0e0e0] text-gray-400 cursor-not-allowed'
             }`}
           >
             {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Place Bet'}
           </button>
        </div>

        {/* Footer Info */}
        <div className="flex items-start gap-2 pt-1">
            <div className="bg-[#f36c21] rounded-full w-5 h-5 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                <span className="text-[11px] font-black italic">i</span>
            </div>
            <p className="text-[11px] font-black text-[#f36c21] leading-tight">
                Min Bet: 100 Max Bet: 25000 Max Winning: 250000
            </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-[13px] font-bold text-gray-600 uppercase opacity-80">Confirm bets before placing</span>
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
}
