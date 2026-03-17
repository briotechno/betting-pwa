'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { useLayoutStore } from '@/store/layoutStore'

const sports = [
  { id: 'cricket', label: 'Cricket', icon: '/sports-icons/cricket.13c45ec.png', count: 15 },
  { id: 'soccer', label: 'Soccer', icon: '/sports-icons/soccer.edef26e.png', count: 41 },
  { id: 'tennis', label: 'Tennis', icon: '/sports-icons/tennis.61acaee.png', count: 69 },
  { id: 'live-card', label: 'Live Card', icon: '/casino-icons/teenpatti.ec813d1.png' },
  { id: 'casino', label: 'Casino', icon: '/casino-icons/roulette.d32562e.png' },
  { id: 'slot-games', label: 'Slot Games', icon: '/casino-icons/money-wheel.6da4f96.png' },
  { id: 'kabaddi', label: 'Kabaddi', icon: '/sports-icons/tabletennis.e584580.png' }, // Fallback to tabletennis or similar if kabaddi doesn't exist
  { id: 'badminton', label: 'Badminton', icon: '/sports-icons/badminton.fdfeeb2.png' },
  { id: 'golf', label: 'Golf', icon: '/sports-icons/golf.6f52b62.png' },
  { id: 'baseball', label: 'Baseball', icon: '/sports-icons/baseball.5a270fc.png' },
]


export default function Sidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentSport = searchParams.get('sport')
  const { sidebarCollapsed: collapsed, setSidebarCollapsed: setCollapsed } = useLayoutStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Hide on auth pages
  const isAuthPage = pathname?.startsWith('/auth')
  if (isAuthPage) return null

  return (
    <aside
      className="hidden lg:flex flex-col shrink-0 transition-all duration-300 overflow-hidden fixed top-[148px] left-0 bottom-0 z-50 bg-[#1e1e1e] border-r border-[#333]"
      style={{
        width: collapsed ? '65px' : '100%',
        minWidth: collapsed ? '65px' : '175px',
        maxWidth: collapsed ? '65px' : '220px',
        transform: 'translateX(0px)',
        transition: 'all ease 300ms'
      }}
    >
      <nav className="flex-1 overflow-y-auto no-scrollbar">
        {sports.map((sport) => {
          let href = `/sportsbook?sport=${sport.id}`
          if (sport.id === 'casino') href = '/markets/live-casino'
          if (sport.id === 'live-card') href = '/markets/live-casino'
          if (sport.id === 'slot-games') href = '/casino-slots'

          const isActive =
            (pathname === '/sportsbook' && (currentSport === sport.id || (!currentSport && sport.id === 'cricket'))) ||
            (pathname === '/markets/live-casino' && (sport.id === 'casino' || sport.id === 'live-card')) ||
            (pathname === '/casino-slots' && sport.id === 'slot-games')

          return (
            <Link
              key={sport.id}
              href={href}
              className={`flex items-center gap-4 px-4 h-[52px] border-b border-[#333] transition-all relative group ${
                isActive ? 'bg-[#2a2a2a] text-white' : 'text-[#efefef] hover:bg-[#252525]'
              }`}
            >
              <div className="w-7 h-7 flex items-center justify-center shrink-0">
                <img 
                  src={sport.icon} 
                  alt={sport.id} 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${sport.label}&background=random`
                  }}
                />
              </div>
              {!collapsed && (
                <>
                  <span className="flex-1 text-[13px] font-normal tracking-wide truncate">{sport.label}</span>
                  {sport.count && (
                    <span className="bg-[#e8612c] text-white text-[10px] font-bold rounded-full w-[22px] h-[22px] flex items-center justify-center shrink-0 shadow-sm">
                      {sport.count}
                    </span>
                  )}
                </>
              )}
            </Link>

          )
        })}



      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-3 text-[#555] hover:text-white flex justify-center transition-colors border-t border-[#333]"
      >
        <ChevronLeft size={20} className={collapsed ? 'rotate-180' : ''} />
      </button>
    </aside>
  )
}
