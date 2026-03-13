'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

export default function StakeSettingsPage() {
  const router = useRouter()
  const [stakes, setStakes] = useState(['+100', '+500', '+1,000', '+5,000', '+10,000', '+25,000'])

  return (
    <div className="bg-[#121212] min-h-screen text-white pb-20 font-sans">
      {/* Sub Header */}
      <div className="flex items-center px-4 py-3 bg-[#1a1a1a] shadow-md border-b border-white/5">
        <button onClick={() => router.back()} className="text-white/80 pr-3">
          <ChevronLeft size={24} color="#e15b24" />
        </button>
        <h1 className="text-[17px] font-bold">Settings</h1>
      </div>

      <div className="p-4">
        <h2 className="text-[#e15b24] text-[16px] font-bold mb-4">Edit Stakes</h2>

        {/* Stake Grid Card */}
        <div className="bg-white rounded-sm p-6 border-2 border-[#e15b24] shadow-xl">
          <div className="grid grid-cols-3 gap-3 mb-8">
            {stakes.map((stake, idx) => (
              <div 
                key={idx}
                className="bg-[#e15b24] text-white h-9 rounded-sm flex items-center justify-center text-[13px] font-black tracking-tight"
              >
                {stake}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="h-12 border-2 border-gray-200 text-gray-800 text-[14px] font-black uppercase tracking-widest rounded-sm">
              EDIT
            </button>
            <button className="h-12 bg-[#dfdfdf] text-white/60 text-[14px] font-black uppercase tracking-widest rounded-sm cursor-not-allowed">
              SAVE
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
