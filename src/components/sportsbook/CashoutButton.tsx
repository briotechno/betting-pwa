'use client'
import React from 'react'
import { DollarSign, Loader2 } from 'lucide-react'

interface CashoutButtonProps {
  amount: number;
  currency?: string;
  onCashout?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * CashoutButton - A premium, high-converting cashout UI component
 * Features:
 * - Dynamic value display
 * - Hover state with glassmorphism effects
 * - Pulse animation for interactivity
 */
export default function CashoutButton({
  amount,
  currency = '₹',
  onCashout,
  isLoading = false,
  disabled = false,
  className = ""
}: CashoutButtonProps) {

  const isProfit = amount > 0;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled && !isLoading && onCashout) onCashout();
      }}
      disabled={disabled || isLoading}
      className={`
        relative group overflow-hidden
        h-7 px-2 rounded-[4px]
        flex items-center justify-center gap-1.5
        transition-all duration-300 ease-out
        ${disabled
          ? 'bg-gray-800 cursor-not-allowed opacity-50'
          : 'bg-gradient-to-b from-[#fcd489] to-[#d4a85a] hover:brightness-110 active:opacity-90 shadow-sm'
        }
        ${className}
      `}
    >
      <div className="flex items-center gap-1 z-10">
        <span className="text-[11px] font-bold text-black/80 leading-none">
          {currency}
        </span>

        {isLoading ? (
          <Loader2 size={11} className="animate-spin text-black/60" />
        ) : (
          <span className="text-[12px] font-black leading-none text-[#ff5722]">
            {amount.toLocaleString()}
          </span>
        )}

        <span className="text-[10px] pl-1font-black uppercase tracking-tight text-black/80 leading-none ml-0.5">
          CASH OUT
        </span>
      </div>

      {/* Shine Effect */}
      <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shine transition-all" />

      <style jsx>{`
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        .group:hover .animate-shine {
          animation: shine 0.8s ease-in-out;
        }
      `}</style>
    </button>
  )
}
