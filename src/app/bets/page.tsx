'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronDown } from 'lucide-react'

export default function OpenBetsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('MY BET')

  return (
    <div className="bg-[#121212] min-h-screen text-white pb-20 font-sans">
      {/* Sub Header */}
      <div className="flex items-center px-4 py-3 bg-[#1a1a1a] shadow-md border-b border-white/5">
        <button onClick={() => router.back()} className="text-white/80 pr-3">
          <ChevronLeft size={24} color="#e15b24" />
        </button>
        <h1 className="text-[17px] font-bold">Open Bets</h1>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#1a1a1a] mb-4">
        <button 
          onClick={() => setActiveTab('MY BET')}
          className={`flex-1 py-4 text-[13px] font-black tracking-tight transition-all ${activeTab === 'MY BET' ? 'text-[#e15b24] border-b-2 border-[#e15b24]' : 'text-white/60'}`}
        >
          MY BET
        </button>
        <button 
          onClick={() => setActiveTab('MY MARKET')}
          className={`flex-1 py-4 text-[13px] font-black tracking-tight transition-all ${activeTab === 'MY MARKET' ? 'text-[#e15b24] border-b-2 border-[#e15b24]' : 'text-white/60'}`}
        >
          MY MARKET
        </button>
      </div>

      {/* Accordions */}
      <div className="px-2 space-y-3">
        <div className="bg-[#dedede] rounded-md flex items-center justify-between px-4 py-3 border border-orange-500/30">
          <span className="text-black text-[15px] font-bold">Unmatched Bets</span>
          <div className="bg-[#e15b24] rounded-md p-0.5">
            <ChevronDown size={20} color="white" strokeWidth={3} />
          </div>
        </div>

        <div className="bg-[#dedede] rounded-md flex items-center justify-between px-4 py-3 border border-orange-500/30">
          <span className="text-black text-[15px] font-bold">Matched Bets</span>
          <div className="bg-[#e15b24] rounded-md p-0.5">
            <ChevronDown size={20} color="white" strokeWidth={3} />
          </div>
        </div>
      </div>
    </div>
  )
}
