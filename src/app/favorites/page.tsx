'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, AlertCircle } from 'lucide-react'

export default function FavoritesPage() {
  const router = useRouter()

  return (
    <div className="bg-[#121212] min-h-screen text-white pb-20 font-sans">
      {/* Sub Header */}
      <div className="flex items-center px-4 py-3 bg-[#1a1a1a] shadow-md border-b border-white/5">
        <button onClick={() => router.back()} className="text-white/80 pr-3">
          <ChevronLeft size={24} color="#e15b24" />
        </button>
        <h1 className="text-[17px] font-bold">Favorites</h1>
      </div>

      <div className="p-4 pt-10">
        <div className="bg-[#1a1a1a] border border-[#e15b24] rounded-sm p-4 flex items-start gap-4">
          <span className="text-[#e15b24] text-[20px] font-bold mt-1">!</span>
          <div className="text-[#e15b24] text-[15px] font-bold leading-snug">
            You haven't added anything to favorites.
          </div>
        </div>
      </div>
    </div>
  )
}
