'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Trophy, Gamepad2, ClipboardList, Wallet } from 'lucide-react'
import { useBetSlipStore } from '@/store/betSlipStore'

const navItems = [
  { id: 'sports', label: 'Sportsbook', icon: 'https://www.fairplay247.vip/_nuxt/img/sportsbook.5e7a4f5.png', href: '/sportsbook' },
  { id: 'casino', label: 'Live Casino', icon: 'https://www.fairplay247.vip/_nuxt/img/live-casino.761f895.png', href: '/markets/live-casino' },
  { id: 'slots', label: 'Slot Games', icon: 'https://www.fairplay247.vip/_nuxt/img/slot-games.ccf3217.png', href: '/casino-slots' },
  { id: 'crash', label: 'Crash Games', icon: 'https://www.fairplay247.vip/_nuxt/img/crash_games.a192ffd.png', href: '/crash-games' },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { selections } = useBetSlipStore()
  const [mounted, setMounted] = useState(false)

  const isDeepSportsbook = pathname?.startsWith('/sportsbook/') && pathname !== '/sportsbook'

  useEffect(() => {
    setMounted(true)
  }, [])

  // Hide on auth pages and deep sportsbook pages
  if (!mounted || pathname?.startsWith('/auth') || isDeepSportsbook) return null

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[70] bg-[#1a1a1a]  safe-bottom">
      <div
        className="flex items-center w-full h-16 transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.5,1)] whitespace-nowrap"
        style={{
          flex: '1 0 auto',
          position: 'relative',
          background: 'linear-gradient(to top, rgba(10, 10, 10, 0.5) 50%, #323232 100%)',
          borderBottom: '1px solid #333',
          borderTop: '1px solid #4c4c4c'
        }}
      >
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
                <div className="flex flex-col items-center">
                  <div className="w-[50px] h-[25px] flex items-center justify-center mb-1">
                    <img
                      src={item.icon}
                      alt={item.label}
                      className={`h-full object-contain transition-all duration-300 ${isActive ? 'scale-110' : 'opacity-80'}`}
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
