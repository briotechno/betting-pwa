'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

export default function StakeSettingsPage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [stakes, setStakes] = useState(['100', '500', '1000', '5000', '10000', '25000'])

  return (
    <div className="bg-[#181818] min-h-screen text-white pb-20 font-sans flex flex-col">
      {/* Sub Header */}
      <div className="flex items-center px-4 py-3 bg-[#222222]">
        <button onClick={() => router.back()} className="text-[#e8612c] pr-3">
          <ChevronLeft size={22} className="stroke-[3]" />
        </button>
        <h1 className="text-[15px] font-bold text-white uppercase tracking-tight">Settings</h1>
      </div>

      <div className="p-4 pt-4">
        <h2 className="text-[#e8612c] text-[15px] font-bold mb-2">Edit Stakes</h2>

        {/* Stake Grid Card */}
        <div className="bg-white rounded-[4px] p-4 border-[2px] border-[#e8612c] shadow-2xl">
          <div className="grid grid-cols-3 gap-x-2 gap-y-4 mb-6 pt-2">
            {isEditing ? (
              stakes.map((stake, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={stake}
                  onChange={(e) => {
                    const newStakes = [...stakes]
                    newStakes[idx] = e.target.value
                    setStakes(newStakes)
                  }}
                  className="w-full h-10 border border-gray-400 rounded-[3px] text-[#333] text-[15px] font-medium text-center shadow-inner outline-none focus:border-[#e8612c]"
                />
              ))
            ) : (
              stakes.map((stake, idx) => (
                <div
                  key={idx}
                  className="bg-[#e8612c] text-white h-10 rounded-[3px] flex items-center justify-center text-[15px] font-black tracking-tight shadow-md"
                >
                  {stake}
                </div>
              ))
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="h-[44px] border border-gray-400 text-[#333] text-[14px] font-bold uppercase tracking-widest rounded-[3px] active:scale-95 transition-all"
                >
                  EDIT
                </button>
                <button className="h-[44px] bg-[#dfdfdf] text-[#999] text-[14px] font-bold uppercase tracking-widest rounded-[3px] cursor-not-allowed">
                  SAVE
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="h-[44px] border border-gray-400 text-[#333] text-[14px] font-bold uppercase tracking-widest rounded-[3px] active:scale-95 transition-all"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="h-[44px] bg-[#e8612c] text-white text-[14px] font-bold uppercase tracking-widest rounded-[3px] shadow-lg active:scale-95 transition-all"
                >
                  SAVE
                </button>
              </>
            )}
          </div>
        </div>
      </div>


    </div>
  )
}
