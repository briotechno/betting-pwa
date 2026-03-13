'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

export default function ProfitLossPage() {
  const router = useRouter()
  const [game, setGame] = useState('All')

  return (
    <div className="bg-[#121212] min-h-screen text-white pb-20">
      {/* Sub Header */}
      <div className="flex items-center px-4 py-3 bg-[#1a1a1a] shadow-md">
        <button onClick={() => router.back()} className="text-white/80 pr-3">
          <ChevronLeft size={24} color="#e15b24" />
        </button>
        <div className="flex items-center gap-1">
          <h1 className="text-[17px] font-bold">Profit & Loss</h1>
          <span className="text-[14px] opacity-80 ml-1">Total P&L : 0</span>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Filters Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <span className="absolute -top-2 left-3 px-1 bg-[#121212] text-[10px] text-white/50 z-10">Games</span>
            <select 
              value={game} 
              onChange={(e) => setGame(e.target.value)}
              className="w-full bg-transparent border border-white/20 rounded-full h-11 px-4 text-white text-[14px] outline-none appearance-none"
            >
              <option value="All">All</option>
            </select>
          </div>

          <div className="relative">
            <span className="absolute -top-2 left-3 px-1 bg-[#121212] text-[10px] text-white/50 z-10">Select Dates</span>
            <div className="w-full bg-transparent border border-white/20 rounded-full h-11 flex items-center px-4 text-white text-[11px] outline-none">
              13 Feb 2026 - 13 Mar 2026
            </div>
          </div>
        </div>

        {/* Search Button */}
        <button className="w-full h-12 bg-[#e15b24] text-white rounded-xl text-[14px] font-black uppercase tracking-widest shadow-lg active:scale-[0.98] transition-all">
          SEARCH
        </button>

        {/* Results Badge */}
        <div className="inline-block px-5 py-2.5 rounded-full border border-[#e15b24] text-[15px] font-black tracking-tight">
          All : 0
        </div>
      </div>
    </div>
  )
}
