'use client'
import React from 'react'
import { Info, Lock } from 'lucide-react'

export interface OddValue {
  price: number | '-'
  size?: string
}

export interface Runner {
  name: string
  back: [OddValue, OddValue, OddValue]
  lay: [OddValue, OddValue, OddValue]
  suspended?: boolean
}

interface MarketSectionProps {
  title: string
  runners: Runner[]
  onOddsClick: (runner: string, price: number, type: 'back' | 'lay') => void
  isSelected: (runner: string, price: number, type: 'back' | 'lay') => boolean
}

export default function MarketSection({ title, runners, onOddsClick, isSelected }: MarketSectionProps) {
  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-xl mb-4 border border-cardBorder">
      {/* Market Header */}
      <div className="bg-gradient-to-r from-[#e8612c] to-[#f97316] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-white font-black text-[11px] uppercase tracking-widest">{title}</span>
          <Info size={12} className="text-white/70 cursor-help" />
        </div>
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-1">
             <div className="w-4 h-4 rounded-full border border-white/30 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_8px_white]" />
             </div>
             <span className="text-white font-black text-[10px]">6</span>
           </div>
        </div>
      </div>

      {/* Column Headers */}
      <div className="flex items-center justify-end h-8 bg-[#0d0d0d] px-0 border-b border-cardBorder">
         <div className="w-[184px] flex justify-center border-l border-cardBorder">
            <span className="text-white/40 font-black text-[9px] uppercase tracking-[0.2em]">Back</span>
         </div>
         <div className="w-[184px] flex justify-center border-l border-cardBorder">
            <span className="text-white/40 font-black text-[9px] uppercase tracking-[0.2em]">Lay</span>
         </div>
      </div>

      {/* Runners Grid */}
      <div className="divide-y divide-cardBorder">
        {runners.map((runner) => (
          <div key={runner.name} className="flex items-center hover:bg-white/5 transition-all duration-200">
            <div className="flex-1 px-4 py-0 h-[56px] flex items-center">
              <span className="text-white font-black text-[11px] uppercase tracking-tight">{runner.name}</span>
            </div>

            <div className="flex items-center py-0 px-0 relative">
              {runner.suspended && (
                 <div className="absolute inset-x-0 inset-y-0 z-10 bg-black/60 backdrop-blur-[2px] flex items-center justify-end pr-[140px]">
                    <div className="flex items-center gap-1.5 px-6 py-2 bg-[#f44336] rounded-md shadow-lg border border-white/10">
                       <Lock size={14} className="text-white" />
                       <span className="text-white font-black text-[11px] uppercase italic tracking-tighter">Suspended</span>
                    </div>
                 </div>
              )}

              {/* Back Columns (3 cells) */}
              <div className="flex items-center justify-end gap-[1px] w-[184px] border-l border-cardBorder bg-black/5">
                {runner.back.map((odd, idx) => (
                  <button
                    key={`back-${idx}`}
                    onClick={() => odd.price !== '-' && onOddsClick(runner.name, odd.price as number, 'back')}
                    disabled={odd.price === '-' || runner.suspended}
                    className={`w-[60px] h-[52px] flex flex-col items-center justify-center transition-all duration-150 ${
                        odd.price === '-' 
                        ? 'bg-transparent text-transparent' 
                        : isSelected(runner.name, odd.price as number, 'back')
                        ? 'bg-[#1a91eb] text-white shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)] scale-[1] ring-1 ring-inset ring-white/30'
                        : idx === 2 // Back1 (Middle) is more prominent
                        ? 'bg-[#a5d5ff] hover:bg-[#a5d5ff] hover:scale-[1.02] text-black shadow-sm'
                        : 'bg-[#a5d5ff]/60 hover:bg-[#a5d5ff]/80 text-black/70'
                    }`}
                  >
                    <span className="text-[11px] font-black leading-none">{odd.price}</span>
                    {odd.size && <span className="text-[8px] font-bold mt-0.5 opacity-40">{odd.size}</span>}
                  </button>
                ))}
              </div>

              {/* Lay Columns (3 cells) */}
              <div className="flex items-center justify-start gap-[1px] w-[184px] border-l border-cardBorder bg-black/5">
                {runner.lay.map((odd, idx) => (
                  <button
                    key={`lay-${idx}`}
                    onClick={() => odd.price !== '-' && onOddsClick(runner.name, odd.price as number, 'lay')}
                    disabled={odd.price === '-' || runner.suspended}
                    className={`w-[60px] h-[52px] flex flex-col items-center justify-center transition-all duration-150 ${
                        odd.price === '-' 
                        ? 'bg-transparent text-transparent' 
                        : isSelected(runner.name, odd.price as number, 'lay')
                        ? 'bg-[#f2708b] text-white shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)] scale-[1] ring-1 ring-inset ring-white/30'
                        : idx === 0 // Lay1 (Middle) is more prominent
                        ? 'bg-[#faa9ba] hover:bg-[#faa9ba] hover:scale-[1.02] text-black shadow-sm'
                        : 'bg-[#faa9ba]/60 hover:bg-[#faa9ba]/80 text-black/70'
                    }`}
                  >
                    <span className="text-[11px] font-black leading-none">{odd.price}</span>
                    {odd.size && <span className="text-[8px] font-bold mt-0.5 opacity-40">{odd.size}</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
