'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { useLayoutStore } from '@/store/layoutStore'

const games = [
  {
    id: 4,
    name: "Cricket",
    image: "https://www.fairplay247.vip/_nuxt/img/cricket.5c05f66.png",
    count: 13,
    link: "/sportsbook/Cricket"
  },
  {
    id: 1,
    name: "Soccer",
    image: "https://www.fairplay247.vip/_nuxt/img/soccer.9f718cc.png",
    count: 53,
    link: "/sportsbook/Soccer"
  },
  {
    id: 2,
    name: "Tennis",
    image: "https://www.fairplay247.vip/_nuxt/img/tennis.fc30791.png",
    count: 71,
    link: "/sportsbook/Tennis"
  },
  {
    id: 6,
    name: "Live Card",
    image: "https://www.fairplay247.vip/_nuxt/img/cardicon.7aecfb2.png",
    count: null,
    link: "/markets/live-cards"
  },
  {
    id: 7,
    name: "Casino",
    image: "https://www.fairplay247.vip/_nuxt/img/casino.1716d18.png",
    count: null,
    link: "/markets/live-casino"
  },
  {
    id: 8,
    name: "Slot Games",
    image: "https://www.fairplay247.vip/_nuxt/img/sloticon.b675c22.png",
    count: null,
    link: "/casino-slots"
  },
  {
    id: 9,
    name: "Kabaddi",
    image: "https://www.fairplay247.vip/_nuxt/img/kabaddi.0f69472.png",
    count: null,
    link: "/premium-sportsbook"
  },
  {
    id: 10,
    name: "Badminton",
    image: "https://www.fairplay247.vip/_nuxt/img/badminton.fdfeeb2.png",
    count: null,
    link: "/premium-sportsbook"
  },
  {
    id: 11,
    name: "Golf",
    image: "https://www.fairplay247.vip/_nuxt/img/golf.79503ca.png",
    count: null,
    link: "/premium-sportsbook"
  },
  {
    id: 12,
    name: "Baseball",
    image: "https://www.fairplay247.vip/_nuxt/img/baseball.d156a0e.png",
    count: null,
    link: "/premium-sportsbook"
  }
];

export default function Sidebar() {
  const pathname = usePathname()
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
        {games.map((game) => {
          const isActive = pathname === game.link

          return (
            <Link
              key={game.id}
              href={game.link}
              className={`flex items-center gap-4 px-4 h-[52px] border-b border-[#333] transition-all relative group ${
                isActive ? 'bg-[#2a2a2a] text-white' : 'text-[#efefef] hover:bg-[#252525]'
              }`}
            >
              <div className="w-7 h-7 flex items-center justify-center shrink-0">
                <img 
                  src={game.image} 
                  alt={game.name} 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${game.name}&background=random`
                  }}
                />
              </div>
              {!collapsed && (
                <>
                  <span className="flex-1 text-[13px] font-normal tracking-wide truncate">{game.name}</span>
                  {game.count && (
                    <span className="bg-[#e8612c] text-white text-[10px] font-bold rounded-full w-[22px] h-[22px] flex items-center justify-center shrink-0 shadow-sm">
                      {game.count}
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
