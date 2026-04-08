'use client'
import React, { useState } from 'react'
import { Info } from 'lucide-react'
import { toTitleCase } from '@/utils/format'


interface InlineBetContainerProps {
    selection: string
    matchName: string
    marketName?: string
    odds: number
    type: 'back' | 'lay'
    onCancel: () => void
    onPlaceBet: (stake: number) => void
}

export default function InlineBetContainer({ 
    selection, 
    matchName, 
    marketName = 'bookmaker',
    odds: initialOdds, 
    type, 
    onCancel, 
    onPlaceBet 
}: InlineBetContainerProps) {
    const [odds, setOdds] = useState(initialOdds)
    const [stake, setStake] = useState('')
    const [confirmBeforePlace, setConfirmBeforePlace] = useState(true)
    const stakes = [100, 500, 1000, 5000, 10000, 25000]

    const handleStakeClick = (val: number) => {
        setStake(prev => {
            const current = parseInt(prev) || 0
            return (current + val).toString()
        })
    }

    return (
        <div className={`bg-white p-4 border border-[#a5d9fe] rounded-[2px] space-y-4 animate-in fade-in slide-in-from-top-1 duration-200 shadow-sm`}>
            {/* Header / Context */}
            <div className="space-y-1">
                <p className="text-[13px] font-bold text-[#333] leading-tight">{toTitleCase(matchName)}</p>
                <p className="text-[13px] font-bold text-[#333] leading-tight">{toTitleCase(selection)} {toTitleCase(marketName)}</p>
            </div>


            {/* Inputs Row */}
            <div className="grid grid-cols-2 gap-4">
                {/* Odds Input */}
                <div className="relative">
                    <label className="absolute -top-[9px] left-2.5 px-1 bg-white text-[10px] text-gray-400 font-bold z-10 leading-none">Odds</label>
                    <div className="flex items-center h-10 border border-gray-300 rounded-[2px] px-2">
                        <input 
                            type="number" 
                            readOnly
                            value={odds} 
                            className="flex-1 w-full text-center font-bold text-[15px] outline-none bg-transparent text-gray-800"
                        />
                    </div>
                </div>

                {/* Stake Input */}
                <div className="relative">
                    <label className="absolute -top-[9px] left-2.5 px-1 bg-white text-[10px] text-[#f36c21] font-bold z-10 leading-none">Stake</label>
                    <div className="flex flex-col">
                        <input 
                            type="number" 
                            value={stake}
                            placeholder="0"
                            onChange={(e) => setStake(e.target.value)}
                            className="h-10 border border-[#f36c21] rounded-[2px] text-center px-3 font-bold text-[15px] outline-none text-[#333]"
                        />
                    </div>
                </div>
            </div>

            {/* Choose stake size */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-gray-600">or Choose You Stake Size</span>
                    <button className="text-[11px] font-bold text-[#f36c21] uppercase">EDIT STAKES</button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {stakes.map((s) => (
                        <button 
                            key={s} 
                            onClick={() => handleStakeClick(s)}
                            className="h-10 bg-[#f36c21] text-white rounded-[2px] text-[13px] font-black shadow-sm active:scale-95 transition-transform"
                        >
                            +{s.toLocaleString()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-[1fr_1.5fr] gap-2">
                <button 
                    onClick={onCancel}
                    className="h-10 border border-black text-gray-600 rounded-[2px] text-[13px] font-black uppercase active:bg-gray-50 transition-colors"
                >
                    CANCEL
                </button>
                <button 
                    disabled={!stake}
                    onClick={() => onPlaceBet(parseInt(stake))}
                    className={`h-10 rounded-[2px] text-[13px] font-black uppercase transition-all shadow-sm ${
                        !stake ? 'bg-[#e0e0e0] text-gray-400 cursor-not-allowed' : 'bg-[#f36c21] text-white active:brightness-110'
                    }`}
                >
                    PLACE BET
                </button>
            </div>

            {/* Min/Max Info Block */}
            <div className="flex items-start gap-2">
                <div className="bg-[#f36c21] rounded-full w-5 h-5 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                    <span className="text-[11px] font-black italic">i</span>
                </div>
                <p className="text-[11px] font-black text-[#f36c21] leading-tight">
                    Min Bet: 100 Max Bet: 50000 Max Winning: 250000
                </p>
            </div>

            {/* Toggle */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-[13px] font-bold text-gray-600">Confirm bets before placing</span>
                <button 
                    onClick={() => setConfirmBeforePlace(!confirmBeforePlace)}
                    className={`w-[44px] h-[24px] rounded-full transition-colors relative flex items-center px-[3px] ${confirmBeforePlace ? 'bg-[#f36c21]' : 'bg-[#e0e0e0]'}`}
                >
                    <div className={`w-[18px] h-[18px] bg-white rounded-full transition-transform ${confirmBeforePlace ? 'translate-x-5' : ''} shadow-sm`} />
                </button>
            </div>
        </div>
    )
}

