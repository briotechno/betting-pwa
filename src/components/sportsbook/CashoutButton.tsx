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
        h-10 px-4 rounded-[6px]
        flex items-center justify-between gap-3
        transition-all duration-300 ease-out
        ${disabled 
          ? 'bg-gray-800 cursor-not-allowed opacity-50' 
          : 'bg-gradient-to-r from-[#f36c21] to-[#e15b24] hover:shadow-[0_0_20px_rgba(243,108,33,0.4)] active:scale-[0.98]'
        }
        ${className}
      `}
    >
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Shine Effect */}
      <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine transition-all" />

      <div className="flex items-center gap-2 z-10">
        <div className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center">
          <DollarSign size={12} className="text-white" />
        </div>
        <span className="text-[11px] font-black uppercase tracking-wider text-white/90">
          Cashout
        </span>
      </div>

      <div className="flex items-center z-10">
        <div className={`
          px-2.5 py-0.5 rounded-full 
          ${isProfit ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
          border border-white/10 backdrop-blur-md
          flex items-center gap-1
        `}>
          {isLoading ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <>
              <span className="text-[13px] font-black tracking-tighter">
                {currency}{amount.toLocaleString()}
              </span>
              {isProfit && (
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              )}
            </>
          )}
        </div>
      </div>

      {/* Internal CSS for the shine animation if not globally defined */}
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
