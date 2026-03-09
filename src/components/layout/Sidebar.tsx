'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { ChevronRight, ChevronLeft, Home, ChevronDown, ChevronUp } from 'lucide-react'

const sports = [
  { id: 'cricket', label: 'Cricket', emoji: '🏏', count: 15 },
  { id: 'soccer', label: 'Soccer', emoji: '⚽', count: 109 },
  { id: 'tennis', label: 'Tennis', emoji: '🎾', count: 34 },
  { id: 'live-card', label: 'Live Card', emoji: '🃏' },
  { id: 'casino', label: 'Casino', emoji: '🎰' },
  { id: 'slot-games', label: 'Slot Games', emoji: '🎲' },
  { id: 'kabaddi', label: 'Kabaddi', emoji: '🤼' },
  { id: 'badminton', label: 'Badminton', emoji: '🏸' },
  { id: 'golf', label: 'Golf', emoji: '⛳' },
  { id: 'baseball', label: 'Baseball', emoji: '⚾' },
]

import { useLayoutStore } from '@/store/layoutStore'
import { useI18nStore } from '@/store/i18nStore'

export default function Sidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentSport = searchParams.get('sport')
  const currentTab = searchParams.get('tab')
  const { sidebarCollapsed: collapsed, setSidebarCollapsed: setCollapsed } = useLayoutStore()
  const { t } = useI18nStore()
  const [showMore, setShowMore] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Hide on auth pages and prevent hydration mismatch
  const isAuthPage = pathname?.startsWith('/auth')
  if (!mounted || isAuthPage) return null

  const visibleSports = showMore ? sports : sports.slice(0, 8)

  return (
    <aside
      className="hidden lg:flex flex-col shrink-0 transition-all duration-300 overflow-hidden fixed top-0 left-0 bottom-0 z-50 shadow-2xl bg-sidebarBg border-r border-cardBorder"
      style={{
        width: collapsed ? '80px' : '220px',
      }}
    >
      {/* ── Logo & Brand ── */}
      <div className="flex items-center px-5 h-16 lg:h-18 border-b border-cardBorder bg-background">
        <Link href="/" className="flex items-center gap-1 overflow-hidden group">
          <span className="text-2xl font-black italic tracking-tighter shrink-0 transition-transform group-hover:scale-110 text-primary">fair</span>
          {!collapsed && (
            <div className="flex items-center animate-in slide-in-from-left duration-500">
              <span className="text-2xl font-black italic text-textPrimary tracking-tighter">play</span>
              <div className="ml-2 px-1.5 py-0.5 rounded bg-primary text-textPrimary text-[8px] font-black uppercase tracking-widest leading-none shadow-lg shadow-primary/30">
                VIP
              </div>
            </div>
          )}
        </Link>
      </div>



      {/* Sports Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {!collapsed && (
          <p className="px-3 mb-2 text-[10px] font-black text-textMuted uppercase tracking-widest">{t('common.main_menu')}</p>
        )}
        <Link
          href="/"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
            pathname === '/' ? 'bg-primary text-textPrimary' : 'text-textSecondary hover:bg-surface hover:text-textPrimary'
          }`}
        >
          <Home size={18} className={pathname === '/' ? 'text-textPrimary' : 'text-primary'} />
          {!collapsed && <span className="text-xs font-bold uppercase tracking-wider">{t('sidebar.home')}</span>}
        </Link>

        {visibleSports.map((sport) => {
          let href = `/sports?sport=${sport.id}`
          if (sport.id === 'casino') href = '/casino'
          if (sport.id === 'live-card') href = '/casino?tab=live'
          if (sport.id === 'slot-games') href = '/casino?tab=slots'

          const isActive =
            (pathname === '/sports' && (currentSport === sport.id || (!currentSport && sport.id === 'cricket'))) ||
            (pathname === '/casino' && (
              (sport.id === 'casino' && !currentTab) ||
              (sport.id === 'live-card' && currentTab === 'live') ||
              (sport.id === 'slot-games' && currentTab === 'slots')
            ))

          return (
            <Link
              key={sport.id}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group ${
                isActive ? 'bg-primary text-textPrimary shadow-lg' : 'text-textSecondary hover:bg-surface hover:text-textPrimary'
              }`}
            >
              <span className="text-lg shrink-0">{sport.emoji}</span>
              {!collapsed && (
                <>
                  <span className="flex-1 text-xs font-bold uppercase tracking-wide truncate">{t(`nav.${sport.id.replace('-', '_')}`)}</span>
                  {sport.count && (
                    <span
                      className={`text-[10px] font-black rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1 shrink-0 ${
                        isActive ? 'bg-textPrimary text-primary' : 'bg-surface text-textSecondary border border-cardBorder'
                      }`}
                    >
                      {sport.count}
                    </span>
                  )}
                </>
              )}
              {collapsed && isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-textPrimary rounded-r-full" />
              )}
            </Link>
          )
        })}

        {!collapsed && (
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-left text-[10px] font-bold text-textMuted hover:text-primary transition-colors"
          >
            <span className="text-xs">{showMore ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}</span>
            <span className="uppercase tracking-widest">
              {showMore ? t('sidebar.show_less') : t('sidebar.show_more').replace('{{count}}', String(sports.length - 8))}
            </span>
          </button>
        )}
      </nav>

      {/* WhatsApp support */}
      <div className="p-3 border-t border-cardBorder bg-background">
        <a
          href="https://wa.me/1234567890"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-3 px-3 py-3 rounded-2xl transition-all bg-sidebarBg border border-cardBorder hover:border-success/20 hover:bg-success/5`}
        >
          <span className="text-xl">💬</span>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-[10px] font-black text-textPrimary uppercase leading-none">WhatsApp</p>
              <p className="text-[9px] text-success font-bold mt-1">24/7 {t('common.support')}</p>
            </div>
          )}
        </a>
      </div>

      {/* Collapse Button - New Position */}
      <div className="p-2 border-t border-cardBorder bg-background">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`flex items-center transition-all duration-300 w-full rounded-xl hover:bg-surface group ${
            collapsed ? 'justify-center py-4' : 'px-4 py-3 gap-3'
          }`}
        >
          <div className={`transition-transform duration-500 ${collapsed ? 'rotate-180' : ''}`}>
             <ChevronLeft size={18} className={collapsed ? 'text-primary' : 'text-textMuted group-hover:text-textPrimary'} />
          </div>
          {!collapsed && (
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-textMuted group-hover:text-textPrimary transition-all">
              {t('common.collapse')}
            </span>
          )}
        </button>
      </div>
    </aside>
  )
}
