'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react'

export default function OpenBetsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('MY BET')
  const [isUnmatchedOpen, setIsUnmatchedOpen] = useState(true)
  const [isMatchedOpen, setIsMatchedOpen] = useState(false)

  return (
    <div className="bg-[#181818] min-h-screen text-white pb-20 font-sans flex flex-col">
      {/* Sub Header */}
      <div className="flex items-center px-4 py-3 bg-[#222222]">
        <button onClick={() => router.back()} className="text-[#e8612c] pr-3">
          <ChevronLeft size={22} className="stroke-[3]" />
        </button>
        <h1 className="text-[15px] font-bold text-white">Open Bets</h1>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#222222] border-b border-black">
        <button 
          onClick={() => setActiveTab('MY BET')}
          className={`group flex-1 py-4 flex flex-col items-center justify-center relative`}
        >
          <span className={`text-[12px] font-bold tracking-wider ${activeTab === 'MY BET' ? 'text-[#e8612c]' : 'text-gray-400'}`}>MY BET</span>
          {activeTab === 'MY BET' && <div className="absolute bottom-0 w-[50px] h-[2px] bg-[#e8612c]" />}
        </button>
        <button 
          onClick={() => setActiveTab('MY MARKET')}
          className={`group flex-1 py-4 flex flex-col items-center justify-center relative`}
        >
          <span className={`text-[12px] font-bold tracking-wider ${activeTab === 'MY MARKET' ? 'text-[#e8612c]' : 'text-gray-400'}`}>MY MARKET</span>
          {activeTab === 'MY MARKET' && <div className="absolute bottom-0 w-[60px] h-[2px] bg-[#e8612c]" />}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1">
        {activeTab === 'MY BET' ? (
          <div className="p-2 space-y-2 pt-3">
            {/* Unmatched Bets Accordion */}
            <div className="overflow-hidden border border-gray-400/20 shadow-sm" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
              <button 
                onClick={() => setIsUnmatchedOpen(!isUnmatchedOpen)}
                className="w-full bg-[#dedede] flex items-center justify-between px-4 h-[40px] border-b border-gray-300/50"
              >
                <span className="text-[#3a3a3a] text-[13px] font-bold">Unmatched Bets</span>
                <div className="w-[18px] h-[18px] bg-[#e8612c] rounded-full flex items-center justify-center shadow-sm">
                  {isUnmatchedOpen ? <ChevronUp size={14} className="text-white" strokeWidth={4} /> : <ChevronDown size={14} className="text-white" strokeWidth={4} />}
                </div>
              </button>
              
              <div 
                className={`grid transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.5,1)] ${isUnmatchedOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <div className="bg-white p-10 flex flex-col items-center justify-center gap-4">
                    <div className="flex flex-col items-center gap-2">
                       <AlertTriangle size={52} className="text-[#e8612c]" strokeWidth={2.5} />
                       <p className="text-[#e8612c] text-[14px] font-bold tracking-tight">No Unmatched Bets!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Matched Bets Accordion */}
            <div className="overflow-hidden border border-gray-400/20 shadow-sm" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
              <button 
                onClick={() => setIsMatchedOpen(!isMatchedOpen)}
                className="w-full bg-[#dedede] flex items-center justify-between px-4 h-[40px] border-b border-gray-300/50"
              >
                <span className="text-[#3a3a3a] text-[13px] font-bold">Matched Bets</span>
                <div className="w-[18px] h-[18px] bg-[#e8612c] rounded-full flex items-center justify-center shadow-sm">
                  {isMatchedOpen ? <ChevronUp size={14} className="text-white" strokeWidth={4} /> : <ChevronDown size={14} className="text-white" strokeWidth={4} />}
                </div>
              </button>
              
              <div 
                className={`grid transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.5,1)] ${isMatchedOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <div className="bg-white p-10 flex flex-col items-center justify-center gap-4">
                    <div className="flex flex-col items-center gap-2">
                       <AlertTriangle size={52} className="text-[#e8612c]" strokeWidth={2.5} />
                       <p className="text-[#e8612c] text-[14px] font-bold tracking-tight">No Matched Bets!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 pt-16 flex flex-col items-center justify-center gap-4">
            <AlertTriangle size={48} className="text-[#e8612c]" strokeWidth={2.5} />
            <p className="text-[#e8612c] text-[13px] font-bold">Your markets will be shown here.</p>
          </div>
        )}
      </div>
    </div>
  )
}
