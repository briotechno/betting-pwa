'use client'
import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function BetContainer() {
  const [activeTab, setActiveTab] = useState<'BETSLIP' | 'OPEN_BETS'>('OPEN_BETS')
  const [unmatchedOpen, setUnmatchedOpen] = useState(true)
  const [matchedOpen, setMatchedOpen] = useState(true)

  return (
    <div className="w-full bg-[#121212] border-l border-[#333] min-h-screen">
      {/* Tabs */}
      <div className="flex border-b border-[#333]">
        <button
          onClick={() => setActiveTab('BETSLIP')}
          className={`flex-1 py-3 text-[12px] font-bold tracking-wider transition-all ${
            activeTab === 'BETSLIP' ? 'text-[#e8612c] border-b-2 border-[#e8612c]' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          BETSLIP
        </button>
        <button
          onClick={() => setActiveTab('OPEN_BETS')}
          className={`flex-1 py-3 text-[12px] font-bold tracking-wider transition-all ${
            activeTab === 'OPEN_BETS' ? 'text-[#e8612c] border-b-2 border-[#e8612c]' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          OPEN BETS
        </button>
      </div>

      <div className="p-3">
        {activeTab === 'OPEN_BETS' ? (
          <div className="space-y-4">
            {/* Unmatched Bets */}
            <div className="border border-[#e8612c] rounded-[20px] overflow-hidden shadow-sm">
               <button 
                onClick={() => setUnmatchedOpen(!unmatchedOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-transparent text-white text-[12px] font-bold"
               >
                 <span>Unmatched Bets</span>
                 <div className="bg-[#e8612c] rounded-full p-1 shadow-md">
                   <ChevronDown size={14} className={`text-white transition-transform duration-300 stroke-[3px] ${unmatchedOpen ? '' : '-rotate-90'}`} />
                 </div>
               </button>
               {unmatchedOpen && (
                 <div className="p-4 bg-black/40 text-center text-[11px] text-gray-500 border-t border-[#333]">
                   No unmatched bets found
                 </div>
               )}
            </div>

            {/* Matched Bets */}
            <div className="border border-[#e8612c] rounded-[20px] overflow-hidden shadow-sm">
               <button 
                 onClick={() => setMatchedOpen(!matchedOpen)}
                 className="w-full flex items-center justify-between px-4 py-3 bg-transparent text-white text-[12px] font-bold"
               >
                 <span>Matched Bets</span>
                 <div className="bg-[#e8612c] rounded-full p-1 shadow-md">
                   <ChevronDown size={14} className={`text-white transition-transform duration-300 stroke-[3px] ${matchedOpen ? '' : '-rotate-90'}`} />
                 </div>
               </button>
               {matchedOpen && (
                 <div className="p-4 bg-black/40 text-center text-[11px] text-gray-500 border-t border-[#333]">
                   No matched bets found
                 </div>
               )}
            </div>
          </div>
        ) : (
          <div className="p-6 bg-black/40 rounded-[20px] text-center text-[11px] text-gray-500 italic border border-[#333]">
            Your betslip is empty. Select some odds to start betting!
          </div>
        )}
      </div>
    </div>
  )
}
