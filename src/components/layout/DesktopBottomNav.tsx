'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLayoutStore } from '@/store/layoutStore'

export default function DesktopBottomNav() {
  const pathname = usePathname()
  const { setAuraCasinoOpen } = useLayoutStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || pathname?.startsWith('/auth')) return null

  const navItems = [
    {
      label: 'Sportsbook',
      icon: '/nav/sportsbook_new.png',
      href: '/sportsbook',
      isCasino: false
    },
    {
      label: 'Live Casino',
      icon: '/nav/live-casino.png',
      onClick: () => setAuraCasinoOpen(true),
      isCasino: true
    },
    {
      label: 'Slot Games',
      icon: '/nav/slots.png',
      href: '/casino-slots',
      isCasino: false
    },
    {
      label: 'Crash Games',
      icon: '/nav/crash.png',
      href: '/crash-games',
      isCasino: false
    }
  ]

  return (
    <div className="hidden lg:flex fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-b from-[#1a1a1a] to-[#000000] border-t border-white/5 h-16 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] px-2">
      <div className="flex w-full h-full items-center justify-between" style={{
        flex: '1 0 auto',
        position: 'relative',
        background: 'linear-gradient(to top, rgba(10, 10, 10, 0.5) 50%, #323232 100%);',
        borderBottom: '1px solid #333',
        borderTop: '1px solid #4c4c4c'
      }}>
        {navItems.map((item, index) => {
          const content = (
            <div className={`flex flex-col items-center justify-center gap-1 group transition-all h-full w-full ${pathname === item.href ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}>
              <img
                src={item.icon}
                alt={item.label}
                className="h-7 w-7 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] transition-all group-hover:scale-110 group-hover:drop-shadow-[0_0_12px_rgba(232,97,44,0.3)]"
              />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.label}</span>
            </div>
          )

          return (
            <React.Fragment key={item.label}>
              {index > 0 && (
                <div className="h-10 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent self-center shrink-0" />
              )}
              {item.href ? (
                <Link href={item.href} className="flex-1 h-full flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />
                  {content}
                </Link>
              ) : (
                <button onClick={item.onClick} className="flex-1 h-full flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />
                  {content}
                </button>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
