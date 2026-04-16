'use client'
import React from 'react'
import { X } from 'lucide-react'

interface BetConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectionName: string;
  odds: number;
  stake: number;
  betType: 'back' | 'lay';
  marketType?: string;
}

export default function BetConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  selectionName,
  odds,
  stake,
  betType,
  marketType
}: BetConfirmationModalProps) {
  if (!isOpen) return null

  const isBack = betType === 'back';
  const bgColor = isBack ? 'bg-[#bce4ff]' : 'bg-[#fbd3d1]';
  
  // Calculate Profit/Liability
  // Profit = Stake * (Odds - 1) for Back (standard Odds)
  // For FANCY/LINE, Profit is usually different, but let's follow the standard pattern
  // Liability = Stake * (Odds - 1) for Lay? Or just Stake? 
  // In the image, for Back: Odds 98, Stake 100, Profit 98. This implies (Odds/100 * Stake)? 
  // Wait, if it's 98.00 odds (Indian context), then profit is stake * (98/100)?
  // Actually, in many Asian markets, 98 means 0.98 decimal odds.
  
  const isFancy = marketType === 'FANCY' || marketType === 'LINE';
  const profitLabel = isBack ? 'Profit' : 'Liability';
  
  // Calculation based on image logic (approximate)
  // Back Odds 98, Stake 100 -> Profit 98. (implies odds/100 * stake)
  // Lay Odds 0, Stake 100 -> Liability 100.
  const displayProfit = isBack 
    ? (isFancy ? (odds / 100 * stake) : (stake * (odds - 1))) 
    : (isFancy ? stake : (stake * (odds - 1)));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`${bgColor} w-full max-w-[400px] rounded-[4px] shadow-2xl p-6 relative animate-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <X size={20} />
        </button>

        <h3 className="text-[16px] font-bold text-gray-800 mb-6 mt-2">
          Are you sure you want to place the bet?
        </h3>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Odds/Runs Box */}
            <div className="relative border border-gray-400 rounded-[4px] p-3 pt-6 h-[70px]">
              <label className="absolute -top-[10px] left-2 px-1 text-[12px] font-bold text-gray-500">
                {isFancy ? 'Runs' : 'Odds'}
              </label>
              <div className="text-[20px] font-black text-gray-900 leading-none">
                {odds}
              </div>
            </div>

            {/* Stake Box */}
            <div className="relative border border-gray-400 rounded-[4px] p-3 pt-6 h-[70px]">
              <label className="absolute -top-[10px] left-2 px-1 text-[12px] font-bold text-gray-500">
                Stake
              </label>
              <div className="text-[20px] font-black text-gray-900 leading-none">
                {stake}
              </div>
            </div>
          </div>

          {/* Profit/Liability Box */}
          <div className="relative border border-gray-400 rounded-[4px] p-3 pt-6 h-[70px] w-full max-w-[180px]">
            <label className="absolute -top-[10px] left-2 px-1 text-[12px] font-bold text-gray-500">
              {profitLabel}
            </label>
            <div className="text-[20px] font-black text-gray-900 leading-none">
              {displayProfit.toFixed(0)}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-10">
          <button 
            onClick={onClose}
            className="w-24 h-10 border-2 border-black text-black text-[14px] font-black uppercase hover:bg-black/5 transition-colors"
          >
            NO
          </button>
          <button 
            onClick={onConfirm}
            className="w-24 h-10 bg-[#4caf50] text-white text-[14px] font-black uppercase shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            YES
          </button>
        </div>
      </div>
    </div>
  )
}
