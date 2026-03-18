'use client'
import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function BetContainer() {
  const [activeTab, setActiveTab] = useState<'BETSLIP' | 'OPEN_BETS'>('OPEN_BETS')
  const [unmatchedOpen, setUnmatchedOpen] = useState(true)
  const [matchedOpen, setMatchedOpen] = useState(true)

  return (
    <div className="hidden xl:block w-[320px] shrink-0 bg-[#121212] border-l border-[#333] min-h-screen">
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
          <div className="space-y-3">
            {/* Unmatched Bets */}
            <div className="border border-[#e8612c] rounded overflow-hidden">
               <button 
                onClick={() => setUnmatchedOpen(!unmatchedOpen)}
                className="w-full flex items-center justify-between p-2 bg-transparent text-white text-[12px] font-bold"
               >
                 <span>Unmatched Bets</span>
                 <div className="bg-[#e8612c] rounded-full p-0.5">
                   <ChevronDown size={14} className={`transition-transform duration-300 ${unmatchedOpen ? '' : '-rotate-90'}`} />
                 </div>
               </button>
               {unmatchedOpen && (
                 <div className="p-4 bg-black/20 text-center text-[11px] text-gray-500">
                   No unmatched bets found
                 </div>
               )}
            </div>

            {/* Matched Bets */}
            <div className="border border-[#e8612c] rounded overflow-hidden">
               <button 
                 onClick={() => setMatchedOpen(!matchedOpen)}
                 className="w-full flex items-center justify-between p-2 bg-transparent text-white text-[12px] font-bold"
               >
                 <span>Matched Bets</span>
                 <div className="bg-[#e8612c] rounded-full p-0.5">
                   <ChevronDown size={14} className={`transition-transform duration-300 ${matchedOpen ? '' : '-rotate-90'}`} />
                 </div>
               </button>
               {matchedOpen && (
                 <div className="p-4 bg-black/20 text-center text-[11px] text-gray-500">
                   No matched bets found
                 </div>
               )}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-black/20 rounded text-center text-[11px] text-gray-500 italic">
            Your betslip is empty. Select some odds to start betting!
          </div>
        )}
      </div>
    </div>
  )
}
