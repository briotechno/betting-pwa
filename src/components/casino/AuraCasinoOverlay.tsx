'use client'
import React, { useEffect, useState } from 'react'
import { X, ChevronLeft, Search, Wallet, User } from 'lucide-react'
import { useLayoutStore } from '@/store/layoutStore'
import { useAuthStore } from '@/store/authStore'

export default function AuraCasinoOverlay() {
  const { auraCasinoOpen, setAuraCasinoOpen } = useLayoutStore()
  const { user, isAuthenticated } = useAuthStore()
  const [mounted, setMounted] = useState(false)
  const [showTapToContinue, setShowTapToContinue] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !auraCasinoOpen) return null

  return (
    <div className={`fixed inset-0 ${isAuthenticated ? 'top-[34px]' : 'top-0'} z-[100] bg-black flex flex-col`}>
      {/* Header - Similar to the image */}
      <div className="flex items-center justify-between px-3 h-14 bg-[#1a1a1a] border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAuraCasinoOpen(false)}
            className="p-1 text-white/70 hover:text-white"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex items-center gap-1 group">
            <span className="text-xl font-black tracking-tighter text-[#e8612c]">fair</span>
            <span className="text-xl font-black text-white tracking-tighter">play</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 md:gap-2">
          <button className="w-8 h-8 rounded-full bg-[#f26522] flex items-center justify-center shadow-lg">
            <Search size={14} className="text-white" strokeWidth={3} />
          </button>

          <div className="h-8 px-2.5 rounded-full border border-white/10 bg-black/40 flex items-center justify-center">
            <img src="/nav/deposit.svg" alt="Deposit" className="w-4 h-4" />
          </div>

          <div className="h-8 px-3 rounded-full border border-white/10 bg-black/40 flex items-center gap-1.5">
            <img src="/nav/wallet.svg" alt="Wallet" className="w-3.5 h-3.5" />
            <span className="text-white text-[12px] font-black uppercase tracking-tight">
              ₹{user?.balance.toLocaleString() || '0'}
            </span>
          </div>

          <button className="w-8 h-8 rounded-full border border-white/10 bg-black/40 flex items-center justify-center">
            <User size={14} className="text-white" />
          </button>
        </div>
      </div>

      {/* Iframe Content */}
      <div className="flex-1 relative bg-black overflow-hidden group">
        <iframe
          id="teenpattiFrame"
          className="w-full h-full border-0"
          src="https://aura.fawk.app/WyIyMDI2LTAzLTEzVDEwOjQ1OjA2LjM3MDI0NSIsMTA1MTIxNjIsIjlBMUZBNEY2QkY5ODJDMEJGQjBGMTgzMUQxMDAzNDVFQkY3QTVCQkFGMzk3NkUyMTFDOTZDODE0NzZBNjg5QTMiXQ/9414/98789?opentable=98789"
          allow="autoplay; fullscreen"
        ></iframe>

        {/* Floating WhatsApp button */}
        <div className="absolute left-4 bottom-10 z-20">
          <button className="w-11 h-11 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-green-500/20 active:scale-95 transition-all">
            <img src="https://cdn-icons-png.flaticon.com/512/124/124034.png" alt="WA" className="w-6 h-6" />
          </button>
        </div>

        {/* Tap to continue Overlay - as seen in image */}

      </div>
    </div>
  )
}
