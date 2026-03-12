'use client'
import React, { useEffect, useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { useLayoutStore } from '@/store/layoutStore'

export default function SearchModal() {
  const { searchModalOpen, setSearchModalOpen } = useLayoutStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !searchModalOpen) return null

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
      {/* Backdrop - Root Level Overlay */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
        onClick={() => setSearchModalOpen(false)}
      />
      
      {/* Modal Container - Centered Vertically & Horizontally */}
      <div className="relative w-full max-w-[420px] bg-[#1a1a1a] rounded-[4px] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.9)] overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        {/* Modal Header */}
        <div className="px-5 pt-5 pb-2">
          <h2 className="text-[18px] font-bold text-white uppercase tracking-tight">Search</h2>
        </div>

        {/* Modal Body */}
        <div className="px-5 pb-5 pt-2">
          <div className="relative group">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f26522]" strokeWidth={3} />
            <input
              type="text"
              autoFocus
              placeholder=""
              className="w-full h-11 bg-white rounded-[4px] pl-12 pr-10 text-[16px] text-black font-semibold outline-none focus:ring-0"
              onKeyDown={(e) => e.key === 'Escape' && setSearchModalOpen(false)}
            />
            <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f26522]" strokeWidth={3} />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 pb-5 pt-0">
          <button 
            onClick={() => setSearchModalOpen(false)}
            className="text-[#f26522] font-black text-[13px] uppercase tracking-widest active:scale-95 transition-all hover:brightness-125"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  )
}
