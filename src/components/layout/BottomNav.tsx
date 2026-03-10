'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Trophy, Gamepad2, ClipboardList, Wallet } from 'lucide-react'
import { useBetSlipStore } from '@/store/betSlipStore'

const navItems = [
  { id: 'home',    label: 'Sportsbook', icon: '🏠',   href: '/' },
  { id: 'casino',  label: 'Live Casino', icon: '🎰',  href: '/casino' },
  { id: 'slots',   label: 'Slot Games',  icon: '🎲',  href: '/casino?tab=slots' },
  { id: 'crash',   label: 'Crash Games', icon: '🚀',  href: '/casino?tab=crash' },
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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[70] safe-bottom bg-[#000] border-t border-white/5 shadow-[0_-4px_20px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href.split('?')[0])

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all ${isActive ? 'text-[#e8612c]' : 'text-[#555]'}`}
            >
              <div className="relative">
                <span className={`text-2xl transition-transform ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(232,97,44,0.4)]' : ''}`}>{item.icon}</span>
                {item.id === 'home' && selections.length > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center bg-[#e8612c] ring-2 ring-black"
                  >
                    {selections.length}
                  </span>
                )}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-tight ${isActive ? 'opacity-100' : 'opacity-60'}`}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
