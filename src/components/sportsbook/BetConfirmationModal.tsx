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
  
  const mType = marketType?.toUpperCase() || 'ODDS';
  const isFancy = mType === 'FANCY' || mType === 'LINE';
  const profitLabel = isBack ? 'Profit' : 'Liability';
  
  let value = 0;
  if (mType === 'BOOKMAKER') {
    value = (odds * stake) / 100;
  } else if (mType === 'FANCY' || mType === 'LINE') {
    value = isBack ? (odds * stake / 100) : stake;
  } else {
    value = (odds - 1) * stake;
  }
  const displayProfit = Math.floor(value);

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
