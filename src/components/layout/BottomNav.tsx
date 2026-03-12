'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Trophy, Gamepad2, ClipboardList, Wallet } from 'lucide-react'
import { useBetSlipStore } from '@/store/betSlipStore'

const navItems = [
  { id: 'sports', label: 'Sportsbook', icon: '/nav/sportsbook_new.png', href: '/' },
  { id: 'casino', label: 'Live Casino', icon: '/nav/live-casino.png', href: '/markets/live-casino' },
  { id: 'slots',  label: 'Slot Games',  icon: '/nav/slots.png', href: '/casino-slots' },
  { id: 'crash',  label: 'Crash Games', icon: '/nav/crash.png', href: '/crash-games' },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { selections } = useBetSlipStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Hide on auth pages and prevent hydration mismatch
  if (!mounted || pathname?.startsWith('/auth')) return null

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[70] safe-bottom bg-[#000] border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,1)]">
      <div className="flex items-center w-full h-16 bg-gradient-to-b from-[#1a1a1a] to-[#000]">
        {navItems.map((item, index) => {
          const isActive = item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href.split('?')[0])

          return (
            <React.Fragment key={item.id}>
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-all relative ${isActive ? 'text-white' : 'text-[#ccc]'}`}
              >
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-12 h-7 flex items-center justify-center overflow-visible">
                    <img 
                      src={item.icon} 
                      alt={item.label} 
                      className={`h-full object-contain transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] brightness-110' : 'opacity-80 grayscale-[0.2]'}`} 
                    />
                  </div>
                  {item.id === 'sports' && selections.length > 0 && (
                    <span
                      className="absolute top-1 right-2 lg:right-4 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center bg-[#e8612c] shadow-[0_0_8px_rgba(232,97,44,0.6)] z-10"
                    >
                      {selections.length}
                    </span>
                  )}
                  <span className={`text-[10px] font-bold tracking-tight whitespace-nowrap leading-tight transition-all ${isActive ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]' : 'text-[#888]'}`}>
                    {item.label}
                  </span>
                </div>
              </Link>
              {index < navItems.length - 1 && (
                <div className="h-8 w-[1px] bg-white/10 shrink-0" />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </nav>
  )
}
