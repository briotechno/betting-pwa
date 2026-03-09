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
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 safe-bottom bg-navBg border-t border-cardBorder"
    >
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const isActive = item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href.split('?')[0])

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 flex-1 py-1.5 transition-colors ${isActive ? 'text-primary' : 'text-textMuted'}`}
            >
              <div className="relative">
                <span className="text-xl">{item.icon}</span>
                {item.id === 'home' && selections.length > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-textPrimary text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center bg-primary"
                  >
                    {selections.length}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
