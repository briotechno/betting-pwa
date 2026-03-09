'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, ChevronDown, Globe, Wallet, User, X, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useBetSlipStore } from '@/store/betSlipStore'
import { useLayoutStore } from '@/store/layoutStore'
import { useI18nStore } from '@/store/i18nStore'
import { Language } from '@/i18n/translations'

const getTabs = (t: (key: string) => string) => [
  { id: 'inplay', label: t('nav.inplay'), emoji: null, icon: '▶', href: '/', color: '#e8612c' },
  { id: 'premium', label: t('nav.premium'), emoji: '🏆', icon: null, href: '/sports?sport=premium' },
  { id: 'crash', label: t('nav.crash'), emoji: '🎮', icon: null, href: '/casino?tab=crash' },
  { id: 'livecasino', label: t('nav.live_casino'), emoji: '🎰', icon: null, href: '/casino' },
  { id: 'slots', label: t('nav.slots'), emoji: '🎲', icon: null, href: '/casino?tab=slots' },
]

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { selections } = useBetSlipStore()
  const { sidebarCollapsed } = useLayoutStore()
  const { language, setLanguage, t } = useI18nStore()
  const pathname = usePathname()

  const [showSearch, setShowSearch] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [activeTab, setActiveTab] = useState('inplay')
  const [mounted, setMounted] = useState(false)

  const topTabs = getTabs(t)

  // Prevent hydration mismatch for persisted store values
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className={`fixed top-0 right-0 z-40 transition-all duration-300 ${sidebarCollapsed ? 'lg:left-[80px]' : 'lg:left-[220px]'} left-0`} style={{ background: '#000', borderBottom: '1px solid #1a1a1a' }}>

      {/* ── Top Row ── */}
      <div className="flex items-center justify-between px-3 md:px-5 h-16 lg:h-18">
        {/* Mobile Logo */}
        <Link href="/" className="lg:hidden flex items-center gap-1 shrink-0 mr-2">
          <span className="text-2xl font-black italic" style={{ color: '#e8612c' }}>f</span>
          <span className="text-xl font-black italic text-white leading-none">P</span>
        </Link>

        {/* Search Bar — Desktop */}
        <div className="hidden md:flex items-center flex-1 max-w-xl mx-auto">
          <div className="relative w-full shadow-2xl px-4">
            <div className="relative">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#666' }} />
              <input
                type="text"
                placeholder={t('common.search')}
                className="w-full rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder-gray-600 focus:outline-none transition-all"
                style={{ background: '#111', border: '1px solid #2a2a2a' }}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded text-[10px] font-bold text-[#444] border border-[#2a2a2a]">
                ⌘K
              </div>
            </div>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1.5 ml-2">
          {/* Mobile search toggle */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="md:hidden p-2 transition-colors text-[#888]"
          >
            <Search size={18} />
          </button>

          {/* Language Selector */}
          {mounted && (
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg transition-colors bg-[#111] border border-[#2a2a2a] text-[#888] hover:border-[#e8612c40]"
              >
                <Globe size={12} />
                <span className="font-bold">{language === 'en' ? 'English' : 'हिंदी'}</span>
                <ChevronDown size={10} className={`transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
              </button>

              {showLangMenu && (
                <div className="absolute top-full right-0 mt-2 w-32 rounded-xl bg-[#0d0d0d] border border-[#2a2a2a] shadow-2xl z-50 overflow-hidden py-1 animate-in fade-in zoom-in duration-200">
                  <button
                    onClick={() => { setLanguage('en'); setShowLangMenu(false); }}
                    className={`w-full px-4 py-2 text-left text-xs font-bold transition-all ${language === 'en' ? 'bg-[#e8612c20] text-[#e8612c]' : 'text-[#888] hover:bg-[#1a1a1a] hover:text-white'}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => { setLanguage('hi'); setShowLangMenu(false); }}
                    className={`w-full px-4 py-2 text-left text-xs font-bold transition-all ${language === 'hi' ? 'bg-[#e8612c20] text-[#e8612c]' : 'text-[#888] hover:bg-[#1a1a1a] hover:text-white'}`}
                  >
                    हिंदी
                  </button>
                </div>
              )}
            </div>
          )}

          {/* PROTECTED AUTH ZONE - HIDDEN UNTIL MOUNTED TO PREVENT HYDRATION MISMATCH */}
          {mounted && isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <button className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg bg-[#111] border border-[#2a2a2a] text-[#aaa]">
                {t('common.bets')}
                {selections.length > 0 && (
                  <span className="bg-[#e8612c] text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-black">
                    {selections.length}
                  </span>
                )}
              </button>

              <Link href="/wallet" className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg bg-[#111] border border-[#2a2a2a]">
                <Wallet size={13} className="text-[#e8612c]" />
                <span className="font-bold text-white tracking-tight">₹{user.balance.toLocaleString()}</span>
              </Link>

              <Link href="/wallet/deposit"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-black rounded-lg text-white bg-gradient-to-r from-[#e8612c] to-[#f97316] shadow-lg shadow-orange-900/20 active:scale-95 transition-all">
                {t('common.deposit')}
              </Link>

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-lg bg-[#111] border border-[#2a2a2a] hover:border-[#e8612c] transition-all">
                  <div className="w-7 h-7 rounded-md bg-[#e8612c20] flex items-center justify-center text-[#e8612c]">
                    <User size={16} />
                  </div>
                  <ChevronDown size={12} className={`text-[#444] transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl shadow-2xl z-50 overflow-hidden bg-[#0d0d0d] border border-[#2a2a2a] animate-in fade-in zoom-in duration-200">
                    <div className="px-5 py-4 border-b border-[#1a1a1a]" style={{ background: '#e8612c15' }}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#e8612c] flex items-center justify-center text-white font-black text-xs">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[11px] font-black text-white uppercase tracking-wider">Hi {user.username}...</p>
                          <p className="text-[10px] text-[#e8612c] font-black uppercase tracking-widest mt-0.5">You are in {user.tier} tier</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2.5 bg-[#0a0a0a]">
                      {[
                        { label: 'Wallet Amount', value: `₹${user.balance.toLocaleString()}` },
                        { label: 'Main Wallet Exposure', value: '0' },
                        { label: 'Main Wallet Balance', value: `₹${user.balance.toLocaleString()}` },
                        { label: 'Free Cash', value: '0' },
                      ].map((stat, i) => (
                        <div key={i} className="flex justify-between px-5 py-2 text-[10px] font-bold border-b border-[#1a1a1a]/40 last:border-none">
                          <span className="text-[#666] uppercase tracking-tighter">{stat.label}</span>
                          <span className="text-white">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 p-3 bg-[#0d0d0d] border-y border-[#1a1a1a]">
                      <Link href="/wallet/deposit" onClick={() => setShowUserMenu(false)}
                        className="flex-1 py-2 text-[10px] font-black text-white text-center rounded-lg bg-[#e8612c] hover:bg-[#f97316] transition-colors">DEPOSIT</Link>
                      <Link href="/wallet" onClick={() => setShowUserMenu(false)}
                        className="flex-1 py-2 text-[10px] font-black text-white text-center rounded-lg border border-[#333] hover:bg-[#1a1a1a] transition-all">WITHDRAW</Link>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto no-scrollbar py-2">
                      {['Betting P&L', 'My Transactions', 'Profile', 'My Wallet', 'Reset Password', 'Open Bets', 'Favourites', 'Notification', 'Rules & Regulations', 'Stake Settings', 'Feedback'].map((item) => (
                        <Link key={item} href="#" onClick={() => setShowUserMenu(false)}
                          className="flex items-center px-5 py-2.5 text-[11px] font-bold text-[#888] hover:text-white hover:bg-[#1a1a1a] transition-all uppercase tracking-tight">
                          {item}
                        </Link>
                      ))}
                    </div>
                    <div className="p-3 bg-[#050505] border-t border-[#1a1a1a]">
                      <button onClick={logout} className="w-full py-2.5 rounded-xl text-[11px] font-black text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center gap-2">
                        <LogOut size={13} /> LOGOUT
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            mounted && (
              <div className="flex items-center gap-2">
                <Link href="/auth/login" className="px-4 py-2 text-xs font-bold text-[#aaa] hover:text-white transition-colors">
                  {t('common.login')}
                </Link>
                <Link href="/auth/signup" className="px-5 py-2 text-xs font-black rounded-lg text-white bg-[#e8612c] hover:bg-[#f97316] shadow-lg shadow-orange-900/20 active:scale-95 transition-all">
                  {t('common.signup')}
                </Link>
              </div>
            )
          )}
        </div>
      </div>

      {/* Language backdrop */}
      {showLangMenu && <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />}

      {/* Mobile search bar (expandable) */}
      {showSearch && (
        <div className="lg:hidden px-4 pb-3 border-t border-[#1a1a1a] pt-3 animate-in slide-in-from-top duration-300">
          <div className="relative">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]" />
            <input
              type="text" placeholder="Search Markets..." autoFocus
              className="w-full rounded-xl py-3 pl-11 pr-4 text-sm text-white bg-[#111] border border-[#2a2a2a] focus:border-[#e8612c] focus:outline-none transition-all"
            />
          </div>
        </div>
      )}

      {/* ── Tabs Row ── */}
      <div className="flex items-center h-12 overflow-x-auto no-scrollbar border-t border-[#1a1a1a] bg-[#0a0a0a] px-2">
        {topTabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <Link
              key={tab.id}
              href={tab.href}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 h-full text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all shrink-0 border-b-2 ${isActive ? 'text-[#e8612c] border-[#e8612c] bg-[#e8612c08]' : 'text-[#555] border-transparent hover:text-[#888]'
                }`}
            >
              {tab.id === 'inplay' && (
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                </div>
              )}
              {tab.emoji && <span className="text-sm">{tab.emoji}</span>}
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </div>

      {/* User menu backdrop */}
      {showUserMenu && <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />}
    </header>
  )
}
