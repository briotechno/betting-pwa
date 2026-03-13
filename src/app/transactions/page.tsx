'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Calendar } from 'lucide-react'

export default function TransactionsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('DEPOSIT')

  return (
    <div className="bg-[#121212] min-h-screen text-white pb-20">
      {/* Sub Header */}
      <div className="flex items-center px-4 py-3 bg-[#1a1a1a] shadow-md">
        <button onClick={() => router.back()} className="text-white/80 pr-3">
          <ChevronLeft size={24} color="#e15b24" />
        </button>
        <h1 className="text-[17px] font-bold">My Transactions</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Date Filters */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[12px] opacity-70 ml-1">From:</span>
            <div className="relative">
              <input 
                type="text" 
                defaultValue="2025-03-13" 
                className="w-full bg-transparent border border-white/20 rounded-full h-11 px-4 text-white text-[14px] outline-none"
              />
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[12px] opacity-70 ml-1">To:</span>
            <div className="relative">
              <input 
                type="text" 
                defaultValue="2026-03-13" 
                className="w-full bg-transparent border border-white/20 rounded-full h-11 px-4 text-white text-[14px] outline-none"
              />
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
            </div>
          </div>
        </div>

        {/* Sort Filters */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[12px] opacity-70 ml-1">Sort by Transaction:</span>
            <select className="w-full bg-transparent border border-white/20 rounded-full h-11 px-4 text-white text-[14px] outline-none appearance-none">
              <option value="All">All</option>
            </select>
          </div>
          <div className="space-y-1">
            <span className="text-[12px] opacity-70 ml-1">Sort by Status:</span>
            <select className="w-full bg-transparent border border-white/20 rounded-full h-11 px-4 text-white text-[14px] outline-none appearance-none">
              <option value="All">All</option>
            </select>
          </div>
        </div>

        {/* Apply Button */}
        <button className="w-full h-12 bg-[#e15b24] text-white rounded-full text-[14px] font-black uppercase tracking-widest shadow-lg active:scale-[0.98] transition-all mt-2">
          APPLY
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 mt-2">
        <button 
          onClick={() => setActiveTab('DEPOSIT')}
          className={`flex-1 py-4 text-[13px] font-black tracking-tight ${activeTab === 'DEPOSIT' ? 'text-white border-b-2 border-[#e15b24]' : 'text-white/60'}`}
        >
          DEPOSIT
        </button>
        <button 
          onClick={() => setActiveTab('WITHDRAW')}
          className={`flex-1 py-4 text-[13px] font-black tracking-tight ${activeTab === 'WITHDRAW' ? 'text-white border-b-2 border-[#e15b24]' : 'text-white/60'}`}
        >
          WITHDRAW
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center py-10 gap-6 opacity-90">
        <h2 className="text-[18px] font-bold">No Transactions Found!</h2>
        <div className="w-[180px] h-[180px] rounded-full border-[6px] border-[#333] flex items-center justify-center relative bg-gradient-to-t from-gray-900 to-transparent">
          <img 
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZkOG9nbnkzZ3BtbmY0bmh6Ymx4Ymx4Ymx4Ymx4Ymx4Ymx4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1z/3o7TKVUn7iM8FMEU24/giphy.gif" 
            alt="Hamster" 
            className="w-16 h-16 grayscale-[0.2]"
          />
          <div className="absolute inset-0 border-[6px] border-[#333] rounded-full [clip-path:polygon(0_0,100%_0,100%_100%)] opacity-20" />
          <div className="absolute w-[120%] h-[2px] bg-[#333] rotate-45" />
        </div>
      </div>
    </div>
  )
}
