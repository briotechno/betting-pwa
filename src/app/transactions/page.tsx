'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Calendar } from 'lucide-react'

export default function TransactionsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('DEPOSIT')

  return (
    <div className="bg-[#222222] min-h-screen text-white flex flex-col pb-0">
      {/* Sub Header */}
      <div className="flex items-center px-4 py-3 bg-[#222222]">
        <button onClick={() => router.back()} className="text-[#e8612c] pr-3">
          <ChevronLeft size={22} className="stroke-[3]" />
        </button>
        <h1 className="text-[15px] font-bold">My Transactions</h1>
      </div>

      <div className="px-4 py-4 space-y-5 bg-[#222222]">
        {/* Date Filters */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-[11px] font-medium text-white mb-1">From:</label>
            <div className="relative">
              <input 
                type="text" 
                defaultValue="2025-03-16" 
                className="w-full bg-[#222222] border border-white/20 rounded-full h-[38px] px-4 text-white text-[13px] font-medium outline-none pr-10 focus:border-[#e8612c] transition-colors"
                readOnly
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-white" size={16} />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-[11px] font-medium text-white mb-1">To:</label>
            <div className="relative">
              <input 
                type="text" 
                defaultValue="2026-03-16" 
                className="w-full bg-[#222222] border border-white/20 rounded-full h-[38px] px-4 text-white text-[13px] font-medium outline-none pr-10 focus:border-[#e8612c] transition-colors"
                readOnly
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-white" size={16} />
            </div>
          </div>
        </div>

        {/* Sort Filters */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-[11px] font-medium text-white mb-1">Sort by Transaction:</label>
            <div className="relative">
              <select className="w-full bg-[#222222] border border-white/20 rounded-full h-[38px] pl-4 pr-10 text-white text-[13px] font-bold outline-none appearance-none focus:border-[#e8612c] transition-colors">
                <option value="All">All</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-white pointer-events-none" />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-[11px] font-medium text-white mb-1">Sort by Status:</label>
            <div className="relative">
              <select className="w-full bg-[#222222] border border-white/20 rounded-full h-[38px] pl-4 pr-10 text-white text-[13px] font-bold outline-none appearance-none focus:border-[#e8612c] transition-colors">
                <option value="All">All</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-white pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="pt-2">
          <button className="w-1/2 sm:w-[170px] h-10 bg-[#e8612c] text-white rounded-full text-[12px] font-bold tracking-wider active:scale-[0.98] transition-all">
            APPLY
          </button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex-1 bg-[#111111] flex flex-col pb-20">
        {/* Tabs */}
        <div className="flex px-4 pt-4 border-b border-black">
          <button 
            onClick={() => setActiveTab('DEPOSIT')}
            className={`mr-6 pb-2 text-[11px] font-black tracking-widest ${activeTab === 'DEPOSIT' ? 'text-white border-b-2 border-[#e8612c]' : 'text-white'}`}
          >
            DEPOSIT
          </button>
          <button 
            onClick={() => setActiveTab('WITHDRAW')}
            className={`pb-2 text-[11px] font-black tracking-widest ${activeTab === 'WITHDRAW' ? 'text-white border-b-2 border-[#e8612c]' : 'text-white'}`}
          >
            WITHDRAW
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center pt-8 gap-10">
          <h2 className="text-[15px] text-white">No Transactions Found!</h2>
          
          {/* Custom Hamster Wheel */}
          <div className="relative w-[150px] h-[150px] rounded-full border-[3px] border-[#888] flex items-center justify-center opacity-80">
            {/* Center column */}
            <div className="absolute inset-y-0 w-[6px] bg-[#888]" />
            {/* Center dot */}
            <div className="absolute w-[14px] h-[14px] rounded-full bg-[#888] z-10" />
            {/* Hamster */}
            <div className="absolute bottom-[2px] z-20 mix-blend-screen overflow-hidden rounded-b-full w-[140px] h-[70px] flex items-end justify-center">
              <img 
                src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZkOG9nbnkzZ3BtbmY0bmh6Ymx4Ymx4Ymx4Ymx4Ymx4Ymx4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1z/3o7TKVUn7iM8FMEU24/giphy.gif" 
                alt="Hamster" 
                className="w-20 h-20 object-cover object-bottom translate-y-[10px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
