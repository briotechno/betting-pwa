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
  const { sidebarCollapsed, setProfileSidebarOpen, setLeftDrawerOpen, setMoreMenuOpen } = useLayoutStore()
  const { language, setLanguage, t } = useI18nStore()
  const pathname = usePathname()

  const [showSearch, setShowSearch] = useState(false)
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
    <header className="fixed top-0 left-0 right-0 z-[60] bg-black border-b border-white/5 backdrop-blur-md">

      {/* ── Top Row ── */}
      <div className="flex items-center justify-between px-2 md:px-5 h-20 lg:h-[92px]">
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
          <Link href="/" className="lg:hidden flex items-center gap-0.5">
            <span className="text-xl font-black italic tracking-tighter text-[#e8612c]">f</span>
            <span className="text-xl font-black italic text-white tracking-tighter">p</span>
          </Link>
        </div>

        {/* Search Bar - Repositioned */}
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

        {/* Right side actions */}
        <div className="flex items-center gap-1 md:gap-2 ml-auto">
          {/* Language Selector (Desktop) */}
          {mounted && (
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1 md:gap-1.5 px-2 md:px-4 h-8 md:h-11 rounded-lg border border-[#2a2a2a] bg-[#111] text-[9px] md:text-[11px] font-black uppercase text-[#888] hover:text-white hover:border-[#e8612c40] transition-all shadow-inner"
              >
                <Globe size={11} className="text-[#e8612c] md:w-3.5 md:h-3.5" />
                <span className="min-w-[20px]">{language.toUpperCase()}</span>
                <ChevronDown size={11} className={`transition-transform text-[#444] ${showLangMenu ? 'rotate-180' : ''}`} />
              </button>

              {showLangMenu && (
                <div className="absolute top-full right-0 mt-2 w-40 rounded-xl bg-[#0d0d0d] border border-[#2a2a2a] shadow-2xl z-50 overflow-hidden py-1 animate-in fade-in zoom-in duration-200">
                  <div className="max-h-[300px] overflow-y-auto no-scrollbar">
                    {[
                      { id: 'en', label: 'English' },
                      { id: 'bn', label: 'Bengali' },
                      { id: 'gu', label: 'Gujarati' },
                      { id: 'hi', label: 'Hindi' },
                      { id: 'kn', label: 'Kannada' },
                      { id: 'ml', label: 'Malayalam' },
                      { id: 'mr', label: 'Marathi' },
                      { id: 'ta', label: 'Tamil' },
                      { id: 'te', label: 'Telugu' },
                    ].map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => { setLanguage(lang.id as Language); setShowLangMenu(false); }}
                        className={`w-full px-4 py-2.5 text-left text-[11px] font-bold transition-all border-b border-white/[0.02] last:border-0 ${language === lang.id ? 'text-[#e8612c] bg-[#e8612c05]' : 'text-[#888] hover:bg-[#1a1a1a] hover:text-white'}`}
                      >
                        {lang.label.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Search Toggle */}
          {mounted && (
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg border border-[#2a2a2a] bg-[#111] text-[#888] hover:text-white transition-all shadow-inner"
            >
              {showSearch ? <X size={16} /> : <Search size={16} className="text-[#e8612c]" />}
            </button>
          )}

          {/* AUTH SECTION */}
          {mounted && isAuthenticated && user ? (
            <div className="flex items-center gap-1 md:gap-2.5">
              {/* Open Bets Button */}
              <Link
                href="/my-bets"
                className="flex items-center gap-1.5 md:gap-2 h-8 md:h-10 px-2 md:px-6 rounded-lg border border-[#e8612c] bg-black text-[10px] md:text-[13px] font-black text-white hover:bg-white/5 transition-all uppercase tracking-widest whitespace-nowrap"
              >
                <FileText size={14} className="text-white md:w-4 md:h-4" />
                <span className="hidden md:inline">{t('common.open_bets') || 'Open Bets'}</span>
              </Link>

              {/* Deposit Now Button */}
              <Link
                href="/wallet/deposit"
                className="flex items-center gap-1.5 md:gap-2 h-8 md:h-10 px-2 md:px-6 rounded-lg border border-[#28a745] bg-black text-[10px] md:text-[13px] font-black text-white hover:bg-[#28a74510] transition-all uppercase tracking-widest whitespace-nowrap"
              >
                <Wallet size={14} className="text-white md:w-4 md:h-4" />
                <span className="hidden md:inline">{t('common.deposit_now') || 'Deposit Now'}</span>
              </Link>

              {/* Balance Button */}
              <Link
                href="/wallet"
                className="flex items-center gap-1.5 md:gap-2 h-8 md:h-10 px-2 md:px-6 rounded-lg border border-[#e8612c] bg-black text-[10px] md:text-[13px] font-black text-white hover:bg-white/5 transition-all uppercase tracking-widest whitespace-nowrap"
              >
                <Wallet size={14} className="text-white md:w-4 md:h-4" />
                ₹{user.balance.toLocaleString()}
              </Link>

              {/* Profile Button */}
              <button
                onClick={() => setProfileSidebarOpen(true)}
                className="flex items-center gap-1.5 md:gap-2 h-8 md:h-10 px-2 md:px-6 rounded-lg border border-[#e8612c] bg-black text-[10px] md:text-[13px] font-black text-white hover:bg-white/5 transition-all uppercase tracking-widest whitespace-nowrap"
              >
                <User size={14} className="text-white md:w-4 md:h-4" />
                <span className="hidden md:inline">{t('common.profile') || 'Profile'}</span>
              </button>
            </div>
          ) : (
            mounted && (
              <div className="hidden lg:flex items-center gap-4 ml-6" onKeyDown={(e) => e.key === 'Enter' && handleLogin()}>
                <div className="flex flex-col gap-1">
                  <div className="flex gap-4">
                    {/* Username */}
                    <div className="flex flex-col w-36">
                      <div className={`border-b ${showErrors && !username ? 'border-[#ff5c5c]' : 'border-white/20'} pb-0.5 transition-colors`}>
                        <input 
                          type="text" 
                          placeholder="Username" 
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full bg-transparent text-[13px] font-medium text-white outline-none placeholder-[#888]"
                        />
                      </div>
                      {showErrors && !username && (
                        <span className="text-[10px] text-[#ff5c5c] mt-0.5 font-bold uppercase tracking-tighter">Username is required</span>
                      )}
                    </div>

                    {/* Password */}
                    <div className="flex flex-col w-36">
                      <div className={`border-b ${showErrors && !password ? 'border-[#ff5c5c]' : 'border-white/20'} pb-0.5 flex items-center transition-colors`}>
                        <input 
                          type="password" 
                          placeholder="Password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-transparent text-[13px] font-medium text-white outline-none placeholder-[#888]"
                        />
                        <button className="text-[#ff5c5c] ml-1 hover:opacity-80">
                          <Eye size={16} />
                        </button>
                      </div>
                      {showErrors && !password && (
                        <span className="text-[10px] text-[#ff5c5c] mt-0.5 font-bold uppercase tracking-tighter">Password is required</span>
                      )}
                    </div>
                  </div>

                  {/* Links Row */}
                  <div className="flex items-center justify-between mt-1">
                    <label className="flex items-center gap-1.5 cursor-pointer group">
                      <div className="w-3.5 h-3.5 rounded-full border border-[#e8612c] bg-white flex items-center justify-center shrink-0" />
                      <span className="text-[10px] font-black text-[#e8612c] uppercase tracking-tighter">Remember Me</span>
                    </label>
                    <Link href="/auth/forgot" className="text-[10px] font-black text-[#e8612c] uppercase tracking-tighter hover:underline">Forgot Password?</Link>
                  </div>
                </div>

                <div className="flex items-start gap-2 self-start pb-4">
                  <button 
                    onClick={() => handleLogin()}
                    className="px-5 py-2.5 text-[11px] font-black rounded-lg text-white bg-[#e8612c] hover:bg-[#f97316] transition-all uppercase"
                  >
                    Login
                  </button>
                  <Link href="/auth/signup" className="px-5 py-2.5 text-[11px] font-black rounded-lg text-white bg-[#28a745] hover:bg-[#218838] transition-all uppercase shadow-lg shadow-green-900/10">
                    Join Now
                  </Link>
                </div>
              </div>
            )
          )}
          {/* Mobile Auth Buttons */}
          {mounted && !isAuthenticated && (
            <div className="lg:hidden flex items-center gap-1.5">
              <Link href="/auth/signup" className="px-3 py-1.5 text-[9px] font-black rounded-[4px] text-white bg-[#5cb85c] uppercase tracking-tighter shadow-lg shadow-green-900/20">
                Join Now
              </Link>
              <Link href="/auth/login" className="px-3 py-1.5 text-[9px] font-black rounded-[4px] text-white bg-[#e8612c] uppercase tracking-tighter">
                Login
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Language backdrop */}
      {showLangMenu && <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />}

      {/* Mobile search popup */}
      {showSearch && (
        <div className="md:hidden absolute top-20 left-4 right-4 bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-3 shadow-2xl z-[70] animate-in fade-in zoom-in-95 duration-200">
          <div className="relative">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]" />
            <input
              type="text" 
              placeholder="Search Markets..." 
              autoFocus
              className="w-full rounded-lg py-2.5 pl-11 pr-4 text-xs text-white bg-black border border-white/10 focus:border-[#e8612c40] focus:outline-none transition-all"
            />
          </div>
        </div>
      )}

      {/* ── Sub Header / Category Nav ── */}
      <div className="flex items-center justify-center lg:h-12 h-11 overflow-x-auto no-scrollbar border-t border-white/5 bg-[#000] px-4 gap-4">
        {topTabs.map((tab, idx) => {
          const isActive = activeTab === tab.id
          
          // On mobile, only show first 3 + More button
          const isMobileVisible = idx < 3
          
          if (!isMobileVisible) return null

          return (
            <Link
              key={tab.id}
              href={tab.href}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-1 h-full text-[10px] lg:text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all shrink-0 group ${isActive ? 'text-white' : 'text-[#a5caf6]'}`}
            >
              <div className="flex items-center gap-[1px]">
                <span className="text-sm scale-110 drop-shadow-md">{tab.emoji || (tab.id === 'inplay' ? '▶' : '')}</span>
              </div>
              <span className={`${isActive ? 'text-[#e8612c]' : 'group-hover:text-white'} transition-colors underline-offset-[12px] decoration-2 ${isActive ? 'underline' : ''}`}>
                {tab.label}
              </span>
            </Link>
          )
        })}

        {/* More Button (Mobile Only) */}
        <button 
          onClick={() => setMoreMenuOpen(true)}
          className="lg:hidden flex items-center gap-2 px-1 h-full text-[10px] font-black uppercase tracking-widest text-[#a5caf6] shrink-0"
        >
          <span>More</span>
          <ChevronDown size={12} />
        </button>

        {/* Desktop Remaining Tabs */}
        {topTabs.map((tab, idx) => {
          const isActive = activeTab === tab.id
          if (idx < 3) return null
          return (
            <Link
              key={tab.id}
              href={tab.href}
              onClick={() => setActiveTab(tab.id)}
              className={`hidden lg:flex items-center gap-2.5 px-1 h-full text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all shrink-0 group ${isActive ? 'text-white' : 'text-[#a5caf6]'}`}
            >
              <div className="flex items-center gap-[1px]">
                <span className="text-base scale-110 drop-shadow-md">{tab.emoji}</span>
              </div>
              <span className={`${isActive ? 'text-[#e8612c]' : 'group-hover:text-white'} transition-colors`}>{tab.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Profile Sidebar overlay will be handled by the ProfileSidebar component */}
    </header>
  )
}
