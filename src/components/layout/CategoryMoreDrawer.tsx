'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLayoutStore } from '@/store/layoutStore'
import { useI18nStore } from '@/store/i18nStore'
import { getTabs } from '@/constants/navigation'

export default function CategoryMoreDrawer() {
  const { moreMenuOpen, setMoreMenuOpen } = useLayoutStore()
  const { t } = useI18nStore()
  const [mounted, setMounted] = useState(false)
  const tabs = getTabs(t)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-[100] bg-black/80 backdrop-blur-md transition-opacity duration-300 ${
          moreMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMoreMenuOpen(false)} 
      />

      {/* Drawer */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-[101] bg-[#111] border-t border-white/10 rounded-t-3xl p-6 shadow-2xl transition-transform duration-350 ease-out flex flex-col max-h-[70vh] ${
          moreMenuOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8 shrink-0" />
        
        <div className="overflow-y-auto no-scrollbar pb-8">
          <div className="grid grid-cols-3 gap-y-8 gap-x-4">
            {tabs.slice(3).map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                onClick={() => setMoreMenuOpen(false)}
                className="flex flex-col items-center gap-2 group transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#1a1a1a] border border-white/5 flex items-center justify-center text-3xl group-active:scale-90 group-active:bg-[#222] transition-all shadow-inner">
                  {tab.emoji}
                </div>
                <span className="text-[10px] font-black text-white/70 group-hover:text-[#e8612c] uppercase tracking-tighter text-center leading-tight transition-colors">
                  {tab.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <button 
          onClick={() => setMoreMenuOpen(false)}
          className="mt-2 w-full py-4 text-[11px] font-black text-white/40 uppercase tracking-widest border-t border-white/[0.03] hover:text-white transition-colors"
        >
          Close Menu
        </button>
      </div>
    </>
  )
}
