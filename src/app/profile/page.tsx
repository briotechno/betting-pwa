'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

export default function ProfileDetailsPage() {
  const router = useRouter()

  return (
    <div className="bg-[#121212] min-h-screen text-white pb-20">
      {/* Sub Header */}
      <div className="flex items-center px-4 py-3 bg-[#1a1a1a] shadow-md">
        <button onClick={() => router.back()} className="text-white/80 pr-3">
          <ChevronLeft size={24} color="#e15b24" />
        </button>
        <h1 className="text-[17px] font-bold">Profile</h1>
      </div>

      <div className="p-6">
        <div className="text-[14px] font-bold leading-relaxed tracking-tight text-white/90">
          Your Current Turnover from 14-09-2025 to 13-03-2026 is <span className="text-[#fff] text-[18px] ml-1">₹ 0</span>
        </div>
        
        <div className="mt-14 border-t border-white/5" />
      </div>
    </div>
  )
}
