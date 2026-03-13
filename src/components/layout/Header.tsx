'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, ChevronDown, Globe, Wallet, User, X, LogOut, Eye, Menu, FileText } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useBetSlipStore } from '@/store/betSlipStore'
import { useLayoutStore } from '@/store/layoutStore'
import { useI18nStore } from '@/store/i18nStore'
import { Language } from '@/i18n/translations'
import { getTabs } from '@/constants/navigation'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { selections } = useBetSlipStore()
  const { sidebarCollapsed, setProfileSidebarOpen, setLeftDrawerOpen, setMoreMenuOpen, searchModalOpen, setSearchModalOpen, setAuraCasinoOpen } = useLayoutStore()
  const { language, setLanguage, t } = useI18nStore()
  const pathname = usePathname()

  const [showLangMenu, setShowLangMenu] = useState(false)
  const [activeTab, setActiveTab] = useState('inplay')
  const [mounted, setMounted] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showErrors, setShowErrors] = useState(false)

  const { login } = useAuthStore()
  const topTabs = getTabs(t)

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!username || !password) {
      setShowErrors(true)
      return
    }

    // Mock Login Success
    login({
      id: '1',
      username: username,
      email: `${username}@example.com`,
      balance: 10000,
      tier: 'Gold',
      avatar: 'https://github.com/shadcn.png'
    })
  }

  // Prevent hydration mismatch for persisted store values
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="z-[60]">
      {/* ── Fixed Top Header (All Devices) ── */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-black border-b border-white/5 backdrop-blur-md h-20 lg:h-[92px]">
        <div className="flex items-center justify-between px-2 md:px-5 h-full max-w-[2000px] mx-auto">
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setLeftDrawerOpen(true)}
              className="p-2 -ml-2 text-white/70 hover:text-white transition-colors"
            >
              <Menu size={24} />
            </button>

            {/* Desktop Logo */}
            <Link href="/" className="hidden lg:flex items-center gap-1 group scale-110">
              <span className="text-3xl font-black italic tracking-tighter text-[#e8612c]">fair</span>
              <span className="text-3xl font-black italic text-white tracking-tighter">play</span>
              <div className="ml-1.5 px-2 py-1 rounded bg-[#e8612c] text-white text-[10px] font-black uppercase tracking-widest leading-none">
                VIP
              </div>
            </Link>

            {/* Mobile Logo */}
            <Link href="/" className="lg:hidden flex items-center h-8">
              <img 
                src="https://www.fairplay247.vip/_nuxt/img/fairplay-website-logo.09a29c5.png" 
                alt="Fairplay Logo" 
                className="h-full object-contain"
              />
            </Link>
          </div>

          {/* Search Bar (Desktop Only) */}
          <div className="hidden lg:flex items-center flex-1 max-w-sm ml-12">
            <div className="relative w-full">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]" />
              <input
                type="text"
                placeholder={t('common.search')}
                className="w-full rounded-xl py-3 pl-11 pr-4 text-xs text-white bg-[#111] border border-[#2a2a2a] focus:border-[#e8612c40] outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-1.5 md:gap-2 ml-auto">
            {mounted && !isAuthenticated && (
              <div className="lg:hidden flex items-center gap-2">
                <Link href="/auth/login" className="px-5 py-1.5 text-[11px] font-black rounded-full text-white bg-[#e8612c] uppercase tracking-tighter whitespace-nowrap">
                  Login
                </Link>
                <Link href="/auth/signup" className="px-4 py-1.5 text-[11px] font-black rounded-full text-white bg-[#28a745] uppercase tracking-tighter whitespace-nowrap">
                  Join Now
                </Link>
              </div>
            )}

            {mounted && isAuthenticated && user ? (
              <div className="flex items-center gap-1.5">
                <button 
                  className="w-8 h-8 rounded-full bg-[#f26522] flex items-center justify-center shadow-md active:scale-95 transition-all"
                  onClick={() => setSearchModalOpen(!searchModalOpen)}
                >
                  <Search size={14} className="text-white" strokeWidth={3} />
                </button>

                <Link href="/wallet/deposit" className="h-8 px-3 rounded-full border border-[#28a745] flex items-center justify-center active:scale-95 transition-all">
                  <img src="/nav/deposit.svg" alt="Deposit" className="w-4 h-4" />
                </Link>

                <Link href="/wallet" className="h-8 px-3 rounded-full border border-[#f26522] flex items-center gap-1.5 active:scale-95 transition-all">
                  <img src="/nav/wallet.svg" alt="Wallet" className="w-3.5 h-3.5" />
                  <span className="text-white text-[13px] font-black uppercase tracking-tight">
                    ₹{user.balance.toLocaleString()}
                  </span>
                </Link>

                <button onClick={() => setProfileSidebarOpen(true)} className="h-8 px-4 rounded-full border border-[#f26522] flex items-center justify-center active:scale-95 transition-all">
                  <svg width="10" height="12" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.5 4.05263C3.5 6.01132 5.07033 7.60526 7 7.60526C8.92967 7.60526 10.5 6.01132 10.5 4.05263C10.5 2.09395 8.92967 0.5 7 0.5C5.07033 0.5 3.5 2.09395 3.5 4.05263ZM13.2222 15.5H14V14.7105C14 11.6639 11.557 9.18421 8.55556 9.18421H5.44444C2.44222 9.18421 0 11.6639 0 14.7105V15.5H13.2222Z" fill="white"/>
                  </svg>
                </button>
              </div>
            ) : (
              mounted && (
                <div className="hidden lg:flex items-center gap-4 ml-6" onKeyDown={(e) => e.key === 'Enter' && handleLogin()}>
                  {/* Auth form items */}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Inplay Header (NOT STICKY) ── */}
      <div className="lg:hidden px-2 py-1.5 bg-[#1a1a1a] mt-20 relative z-[50]">
        <div className="flex w-[95%] h-[60px] p-2 rounded-[12px] bg-[#3d3d3d] mx-auto relative z-[1] items-center justify-between">
          <Link href="/in-play" className="flex flex-col items-center justify-center flex-1 gap-1 transition-all active:scale-95 group">
            <img src="/nav/inplay.png" alt="Inplay" className="w-7 h-7 object-contain" />
            <span className="text-[10px] font-bold text-white uppercase tracking-tight">Inplay</span>
          </Link>
          <button 
            onClick={() => setAuraCasinoOpen(true)}
            className="flex flex-col items-center justify-center flex-1 gap-1 transition-all active:scale-95 group"
          >
            <img src="/nav/aura-casino.png" alt="Aura Casino" className="w-7 h-7 object-contain" />
            <span className="text-[10px] font-bold text-white uppercase tracking-tight">Aura Casino</span>
          </button>
          <Link href="/sportsbook" className="flex flex-col items-center justify-center flex-1 gap-1 transition-all active:scale-95 group">
            <img src="/nav/sportsbook.png" alt="Sportsbook" className="w-7 h-7 object-contain" />
            <span className="text-[10px] font-bold text-white uppercase tracking-tight">SportsBook</span>
          </Link>
          <button onClick={() => setMoreMenuOpen(true)} className="flex flex-col items-center justify-center flex-1 gap-1 transition-all active:scale-95 group">
            <img src="/nav/more.png" alt="More" className="w-7 h-7 object-contain" />
            <span className="text-[10px] font-bold text-white uppercase tracking-tight">More</span>
          </button>
        </div>
      </div>

      {/* ── Fixed Desktop Sub Header (Pins below Top Header) ── */}
      <div className="hidden lg:flex fixed top-[92px] left-0 right-0 z-[59] items-center justify-center h-12 overflow-x-auto no-scrollbar border-t border-white/5 bg-[#000] px-4 gap-4">
        {topTabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <Link
              key={tab.id}
              href={tab.href}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-1 h-full text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all shrink-0 group ${isActive ? 'text-white' : 'text-[#a5caf6]'}`}
            >
              <div className="flex items-center gap-[1px]">
                <span className="text-base scale-110 drop-shadow-md">{tab.emoji}</span>
              </div>
              <span className={`${isActive ? 'text-[#e8612c]' : 'group-hover:text-white'} transition-colors`}>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
