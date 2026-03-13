'use client'
import React, { useState } from 'react'
import { Info } from 'lucide-react'

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
        <div className="bg-white p-3 border-x-[1.5px] border-b-[1.5px] border-[#a5d9fe] space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
            {/* Header / Context */}
            <div className="space-y-0.5">
                <p className="text-[12px] font-bold text-[#333] leading-tight">{matchName}</p>
                <p className="text-[12px] font-bold text-[#333] leading-tight">{selection} {marketName}</p>
            </div>

            {/* Inputs Row */}
            <div className="grid grid-cols-2 gap-4">
                {/* Odds Input */}
                <div className="relative">
                    <label className="absolute -top-[7px] left-2 px-1 bg-white text-[10px] text-gray-400 font-bold z-10 leading-none">Odds</label>
                    <div className="flex items-center h-10 border border-gray-300 rounded-[4px] px-2">
                        <input 
                            type="number" 
                            value={odds} 
                            step="0.01"
                            onChange={(e) => setOdds(parseFloat(e.target.value))}
                            className="flex-1 w-full text-left font-bold text-[15px] outline-none bg-transparent"
                        />
                    </div>
                </div>

                {/* Stake Input */}
                <div className="relative">
                    <label className="absolute -top-[7px] left-2 px-1 bg-white text-[10px] text-gray-500 font-bold z-10 leading-none">Stake</label>
                    <div className="flex flex-col">
                        <input 
                            type="number" 
                            value={stake}
                            placeholder="0"
                            onChange={(e) => setStake(e.target.value)}
                            className="h-10 border border-gray-400 rounded-[4px] text-left px-3 font-bold text-[18px] outline-none text-[#333]"
                        />
                    </div>
                </div>
            </div>

            {/* Choose stake size */}
            <div className="space-y-4 pt-1">
                <div className="flex justify-between items-center">
                    <span className="text-[12px] font-bold text-[#333]">or Choose You Stake Size</span>
                    <button className="text-[12px] font-bold text-[#e15b24] uppercase tracking-tighter">EDIT STAKES</button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {stakes.map((s) => (
                        <button 
                            key={s} 
                            onClick={() => handleStakeClick(s)}
                            className="h-11 bg-[#e15b24] text-white rounded-[2px] text-[15px] font-black shadow-sm active:scale-95 transition-transform"
                        >
                            +{s.toLocaleString()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-1">
                <button 
                    onClick={onCancel}
                    className="h-12 border border-gray-400 text-[#333] rounded-[2px] text-[15px] font-bold uppercase active:bg-gray-50"
                >
                    CANCEL
                </button>
                <button 
                    disabled={!stake}
                    onClick={() => onPlaceBet(parseInt(stake))}
                    className={`h-12 rounded-[2px] text-[15px] font-bold uppercase transition-colors ${
                        !stake ? 'bg-[#dfdfdf] text-[#b3b3b3] cursor-not-allowed' : 'bg-green-600 text-white shadow-lg'
                    }`}
                >
                    PLACE BET
                </button>
            </div>

            {/* Min/Max Info Block */}
            <div className="flex items-start gap-2 pt-1">
                <div className="bg-[#e15b24] p-1 rounded-full shrink-0 mt-0.5">
                    <Info size={18} className="text-white fill-white" />
                </div>
                <p className="text-[12px] font-bold text-[#e15b24] leading-tight">
                    Min Bet: 100 Max Bet: 50000 Max Winning: 250000
                </p>
            </div>

            {/* Toggle */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-[13px] font-bold text-[#333]">Confirm bets before placing</span>
                <button 
                    onClick={() => setConfirmBeforePlace(!confirmBeforePlace)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${confirmBeforePlace ? 'bg-[#e15b24]' : 'bg-gray-300'}`}
                >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${confirmBeforePlace ? 'right-1' : 'left-1'}`} />
                </button>
            </div>
        </div>
    )
}
