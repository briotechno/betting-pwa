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
      // Normalizing the API parameters: 
      // - Eid is usually the overall match/game/event ID
      // - selectionId is the specific runner/choice
      const common = {
        LoginToken: user.loginToken,
        Eid: selection.eventId, // The Game/Match ID
        Amount: stake,
        Rate: selection.odds,
        IP: '127.0.0.1' 
      }

      console.log('--- Placing Mobile Bet Data ---');
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
    <div className="bg-[#fff] border-2 border-[#a5d9fe] rounded-lg overflow-hidden my-2 shadow-2xl animate-in slide-in-from-top-4 duration-300">
      {/* Header Info */}
      <div className="p-3 border-b border-gray-100 bg-white">
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight mb-0.5">{selection.matchName}</p>
        <p className="text-[12px] font-black text-[#333] uppercase leading-tight">{selection.selectionName} <span className="text-[9px] opacity-60 font-medium">({selection.marketName})</span></p>
      </div>

      <div className={`p-4 space-y-4 ${selection.betType === 'back' ? 'bg-[#a5d9fe]/5' : 'bg-[#f8d0ce]/5'}`}>
        {/* Controls Row */}
        <div className="flex gap-4">
          <div className="flex-1 group">
            <label className="text-[9px] font-black text-gray-400 uppercase mb-1 block group-focus-within:text-[#f36c21] transition-colors">Odds</label>
            <div className="flex items-center border border-gray-200 rounded-md overflow-hidden h-10 bg-white focus-within:border-[#f36c21]/50">
              <button 
                onClick={() => updateOdds(selection.id, -0.01)}
                className="px-3 h-full hover:bg-gray-50 text-gray-400 active:scale-90 transition-transform"
              >
                <Minus size={14} />
              </button>
              <input 
                type="number" 
                value={selection.odds} 
                readOnly
                className="w-full text-center text-[14px] font-black focus:outline-none text-gray-900" 
              />
              <button 
                onClick={() => updateOdds(selection.id, 0.01)}
                className="px-3 h-full hover:bg-gray-50 text-gray-400 active:scale-90 transition-transform"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="flex-1 group">
             <label className={`text-[9px] font-black ${stake === 0 ? 'text-red-500' : 'text-gray-400'} uppercase mb-1 block group-focus-within:text-[#f36c21]`}>Stake</label>
             <div className={`flex items-center border ${stake === 0 ? 'border-red-500' : 'border-gray-200'} rounded-md overflow-hidden h-10 bg-white focus-within:border-[#f36c21]/50`}>
                <input 
                  type="number" 
                  placeholder="0"
                  value={stake || ''}
                  onChange={(e) => setStake(selection.id, parseFloat(e.target.value) || 0)}
                  className="w-full text-center text-[14px] font-black focus:outline-none placeholder:opacity-30 text-gray-900" 
                />
             </div>
             {stake === 0 && <p className="text-[8px] text-red-500 font-bold mt-1 uppercase italic tracking-tighter">Stake is required</p>}
          </div>
        </div>

        {/* Quick Stakes Grid */}
        <div className="space-y-2">
           <div className="flex justify-between items-center mb-1">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Quick Stakes</p>
              <button className="text-[9px] font-black text-[#f36c21] uppercase tracking-widest hover:underline">Edit Stakes</button>
           </div>
           <div className="grid grid-cols-3 gap-2">
             {quickStakes.map(s => (
               <button 
                 key={s} 
                 onClick={() => setStake(selection.id, (stake || 0) + s)}
                 className="py-2.5 text-[11px] font-black rounded bg-[#e8612c] text-white hover:brightness-110 active:scale-[0.97] transition-all shadow-sm"
               >
                 +{s.toLocaleString()}
               </button>
             ))}
           </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
           <button 
             onClick={onClose}
             className="flex-1 py-3 text-[12px] font-black text-gray-500 uppercase border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
           >
             Cancel
           </button>
           <button 
             onClick={placeBet}
             disabled={loading || stake === 0}
             className={`flex-[2] py-3 text-[12px] font-black uppercase rounded-lg transition-all ${
               stake > 0 
               ? 'bg-[#1a91eb] text-white shadow-lg active:scale-95' 
               : 'bg-gray-200 text-gray-400 cursor-not-allowed'
             }`}
             style={{
                backgroundColor: stake > 0 ? (selection.betType === 'back' ? '#1a91eb' : '#f2708b') : '#eee'
             }}
           >
             {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Place Bet'}
           </button>
        </div>

        {/* Footer Info */}
        <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
           <div className="flex items-start gap-2">
              <div className="w-4 h-4 bg-[#f36c21] rounded-full flex items-center justify-center text-white text-[8px] font-black flex-shrink-0 mt-0.5">i</div>
              <p className="text-[9px] text-[#e8612c] font-bold leading-tight">
                Min Bet: 100 Max Bet: 100000 Max Winning: 2000000
              </p>
           </div>

           <div className="flex items-center justify-between pb-2">
              <span className="text-[10px] font-bold text-[#333] uppercase opacity-70">Confirm bets before placing</span>
              <label className="relative inline-flex items-center cursor-pointer">
                 <input type="checkbox" checked={confirmBeforePlace} onChange={toggleConfirmBeforePlace} className="sr-only peer" />
                 <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#f36c21]"></div>
              </label>
           </div>
        </div>
      </div>
    </div>
  )
}
