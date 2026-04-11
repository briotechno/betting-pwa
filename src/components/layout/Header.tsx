'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Search, ChevronDown, Globe, Wallet, User, X, LogOut, Eye, Menu, FileText, Loader2, Calendar, Trophy, ArrowRight, Home } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useBetSlipStore } from '@/store/betSlipStore'
import { useLayoutStore } from '@/store/layoutStore'
import { useI18nStore } from '@/store/i18nStore'
import { useSnackbarStore } from '@/store/snackbarStore'
import { authController } from '@/controllers/auth'
import { Language } from '@/i18n/translations'
import { getTabs } from '@/constants/navigation'
import { userController } from '@/controllers'
import { marketController } from '@/controllers/market/marketController'
import NewsTicker from '../common/NewsTicker'

interface SearchResult {
  Datetime: string;
  Type: string;
  GameName: string;
  Gid: string;
}

export default function Header() {
  const router = useRouter()
  const { user, isAuthenticated, logout, setUser: setAuthUser, setToken, updateBalance } = useAuthStore()
  const { selections } = useBetSlipStore()
  const { sidebarCollapsed, setProfileSidebarOpen, setLeftDrawerOpen, setMoreMenuOpen, searchModalOpen, setSearchModalOpen, setAuraCasinoOpen } = useLayoutStore()
  const { openSlip } = useBetSlipStore()
  const { language, setLanguage, t } = useI18nStore()
  const { show: showSnackbar } = useSnackbarStore()
  const pathname = usePathname()

  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [showRegionMenu, setShowRegionMenu] = useState(false)
  const [activeTab, setActiveTab] = useState('inplay')
  const [mounted, setMounted] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [showErrors, setShowErrors] = useState(false)

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)

  const topTabs = getTabs(t)

  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'gu', name: 'ગુજરાતી' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'മലയാളം' },
    { code: 'mr', name: 'मરાઠી' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' }
  ]

  const currentLang = languages.find(l => l.code === language) || languages[0]

  const refreshBalance = async () => {
    if (!isAuthenticated || !user?.loginToken) return
    try {
      const response = await userController.getBalance(user.loginToken)
      if (response.error === '0' && response.balance !== undefined) {
        updateBalance(
          parseFloat(response.balance),
          parseFloat(response.exposure || '0'),
          parseFloat(response.available_balance || '0')
        )
      }
    } catch (error) {
      console.error('Failed to refresh balance:', error)
    }
  }

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!username || !password) {
      setShowErrors(true)
      showSnackbar('Please enter both username and password', 'error')
      return
    }

    setLoading(true)
    try {
      const response = await authController.login({
        username: username,
        password: password,
        ip: '127.0.0.1'
      })

      if (response.error === '0') {
        const loggedUser = {
          id: response.UserId || '1',
          username: username,
          email: '',
          balance: parseFloat(response.balance || '0'),
          exposure: parseFloat(response.exposure || '0'),
          availableBalance: parseFloat(response.available_balance || response.balance || '0'),
          tier: 'Beginner' as const,
          loginToken: response.LoginToken
        }

        setAuthUser(loggedUser)
        setToken(response.LoginToken)
        showSnackbar('Logged in successfully.', 'success')

        setUsername('')
        setPassword('')
      } else {
        showSnackbar(response.msg || 'Login failed. Please check your credentials.', 'error')
      }
    } catch (error) {
      showSnackbar('An error occurred during login. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    if (isAuthenticated) {
      refreshBalance()
      const interval = setInterval(refreshBalance, 30000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  const handleSearch = async (val: string) => {
    setSearchQuery(val)
    if (val.length < 3) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    if (!user?.loginToken) return

    try {
      setSearchLoading(true)
      const res = await marketController.search(user.loginToken, val)
      if (Array.isArray(res)) {
        setSearchResults(res)
        setShowSearchResults(true)
      } else {
        setSearchResults([])
        setShowSearchResults(false)
      }
    } catch (err) {
      console.error('Search failed:', err)
    } finally {
      setSearchLoading(false)
    }
  }

  const handleResultClick = (result: SearchResult) => {
    setShowSearchResults(false)
    setSearchQuery('')
    const sportSegment = result.Type.toLowerCase()
    router.push(`/sports/${sportSegment}/${result.Gid}`)
  }

  return (
    <div className="z-[60]">
      {/* ── Main Top Header (All Devices) ── */}
      <div className={`relative z-[60] bg-black backdrop-blur-md h-16 lg:h-[76px] transition-all duration-300`}>
        <div className="flex items-center justify-between px-2 md:px-5 h-full max-w-[2000px] mx-auto">
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setLeftDrawerOpen(true)}
              className="p-1 -ml-1 text-white/70 hover:text-white transition-colors flex items-center justify-center"
            >
              <img src="/menuIcon.png" alt="Menu" className="w-[30px] h-[30px] object-contain" />
            </button>

            <Link href="/" className="flex items-center h-8 lg:h-12">
              <img
                src="https://www.fairplay247.vip/_nuxt/img/fairplay-website-logo.09a29c5.png"
                alt="Fairplay Logo"
                className="h-full object-contain"
              />
            </Link>
          </div>

          {/* Search Bar (Desktop Only) */}
          {mounted && isAuthenticated && (
            <div className="hidden lg:flex items-center flex-1 max-w-md ml-8 relative pt-2">
              <div className="relative w-full">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#777]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchQuery.length >= 3 && setShowSearchResults(true)}
                  placeholder={t('common.search')}
                  className="w-full rounded-[4px] py-2 pl-11 pr-10 text-[13px] text-white bg-[#111] border border-[#2a2a2a] focus:border-[#e8612c90] outline-none transition-all font-bold placeholder:font-normal"
                  onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                />
                {searchLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 size={14} className="text-[#e8612c] animate-spin" />
                  </div>
                )}
              </div>

              {/* Desktop Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-white/10 rounded-md shadow-2xl py-2 z-[70] max-h-[400px] overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-200 custom-scrollbar">
                  {searchResults.map((res: SearchResult) => (
                    <button
                      key={res.Gid}
                      onClick={() => handleResultClick(res)}
                      className="w-full h-[52px] flex items-center gap-3 px-4 hover:bg-white/5 transition-colors group text-left border-b border-white/5 last:border-0"
                    >
                      <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-[#f26522]/20 transition-colors">
                        {res.Type.toLowerCase().includes('cricket') ? (
                          <span className="text-[14px]">🏏</span>
                        ) : res.Type.toLowerCase().includes('foot') ? (
                          <span className="text-[14px]">⚽</span>
                        ) : (
                          <Trophy size={14} className="text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black text-white group-hover:text-[#f26522] transition-colors truncate uppercase tracking-tight">
                          {res.GameName}
                        </p>
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter mt-0.5">{res.Datetime} • {res.Type}</p>
                      </div>
                      <ArrowRight size={14} className="text-gray-600 group-hover:text-white transition-transform transform translate-x-[-5px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* User Actions / Auth Form */}
          <div className="flex items-center gap-2 ml-auto">
            {mounted && !isAuthenticated && (
              <div className="lg:hidden flex items-center gap-1.5">
                <Link href="/" className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center active:scale-95 transition-all">
                  <Home size={14} className="text-white" />
                </Link>
                <Link href="/auth/login" className="px-3 py-1.5 text-[10px] font-black rounded-full text-white bg-[#e8612c] uppercase tracking-tighter whitespace-nowrap">
                  {t('common.login')}
                </Link>
                <Link href="/auth/signup" className="px-3 py-1.5 text-[10px] font-black rounded-full text-white bg-[#28a745] uppercase tracking-tighter whitespace-nowrap">
                  {t('common.signup')}
                </Link>
              </div>
            )}

            {mounted && isAuthenticated && user ? (
              <>
                {/* Mobile Authenticated */}
                <div className="lg:hidden flex items-center gap-1">
                  <Link href="/" className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center active:scale-95 transition-all mr-1">
                    <Home size={14} className="text-white" />
                  </Link>
                  <button
                    className="w-7 h-7 rounded-full bg-[#f26522] flex items-center justify-center shadow-md active:scale-95 transition-all"
                    onClick={() => setSearchModalOpen(!searchModalOpen)}
                  >
                    <Search size={12} className="text-white" strokeWidth={4} />
                  </button>

                  <Link href="/wallet/deposit" className="h-7 w-7 rounded-full border border-[#28a745] flex items-center justify-center active:scale-95 transition-all">
                    <img src="/nav/deposit.svg" alt="Deposit" className="w-3.5 h-3.5" />
                  </Link>

                  <Link href="/wallet" className="h-7 px-2 rounded-full border border-[#f26522] flex items-center gap-1 active:scale-95 transition-all">
                    <img src="/nav/wallet.svg" alt="Wallet" className="w-3 h-3" />
                    <span className="text-white text-[11px] font-black uppercase tracking-tight">
                      ₹{user.balance?.toLocaleString() ?? '0'}
                    </span>
                  </Link>

                  <button onClick={() => setProfileSidebarOpen(true)} className="h-7 w-7 rounded-full border border-[#f26522] flex items-center justify-center active:scale-95 transition-all">
                    <svg width="10" height="11" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.5 4.05263C3.5 6.01132 5.07033 7.60526 7 7.60526C8.92967 7.60526 10.5 6.01132 10.5 4.05263C10.5 2.09395 8.92967 0.5 7 0.5C5.07033 0.5 3.5 2.09395 3.5 4.05263ZM13.2222 15.5H14V14.7105C14 11.6639 11.557 9.18421 8.55556 9.18421H5.44444C2.44222 9.18421 0 11.6639 0 14.7105V15.5H13.2222Z" fill="white" />
                    </svg>
                  </button>
                </div>

                {/* Desktop Authenticated */}
                <div className="hidden lg:flex items-center gap-4">
                  <div className="relative">
                    <button
                      onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-[4px] border border-white/30 bg-black min-w-[120px] transition-colors hover:border-white/60"
                    >
                      <span className="text-white text-[14px] font-bold">{currentLang.name}</span>
                      <ChevronDown size={14} className={`text-white ml-auto transition-transform ${showLanguageMenu ? 'rotate-180' : ''}`} />
                    </button>
                    {showLanguageMenu && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-[#111] border border-white/10 rounded-md shadow-2xl py-1 z-[70] animate-in fade-in slide-in-from-top-2 duration-200">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setLanguage(lang.code)
                              setShowLanguageMenu(false)
                            }}
                            className={`w-full text-left px-4 py-2 text-[13px] transition-colors ${language === lang.code ? 'text-[#e8612c] bg-white/5 font-bold' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
                          >
                            {lang.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link
                    href="/bets"
                    className="h-10 px-5 rounded-full border border-[#f26522] flex items-center justify-center text-white text-[13px] font-bold tracking-tight hover:bg-[#f26522]/10 transition-all active:scale-95"
                  >
                    {t('common.open_bets')}
                  </Link>

                  <Link
                    href="/wallet/deposit"
                    className="h-10 px-5 rounded-full border border-[#58a049] flex items-center gap-2 text-white text-[13px] font-bold tracking-tight hover:bg-[#58a049]/10 transition-all active:scale-95"
                  >
                    <Wallet size={16} className="text-white" />
                    {t('common.deposit_now')}
                  </Link>

                  <Link
                    href="/wallet"
                    className="h-10 px-5 rounded-full border border-[#f26522] flex items-center gap-2 text-white text-[13px] font-bold tracking-tight hover:bg-[#f26522]/10 transition-all active:scale-95"
                  >
                    <Wallet size={16} className="text-white" />
                    ₹{user.balance?.toLocaleString() ?? '0'}
                  </Link>

                  <button
                    onClick={() => setProfileSidebarOpen(true)}
                    className="h-10 px-5 rounded-full border border-[#f26522] flex items-center gap-2 text-white text-[13px] font-bold tracking-tight hover:bg-[#f26522]/10 transition-all active:scale-95"
                  >
                    <User size={16} className="text-white" />
                    {t('common.profile')}
                  </button>
                </div>
              </>
            ) : (
              mounted && (
                <div className="hidden lg:flex items-center gap-4 mt-2" onKeyDown={(e) => e.key === 'Enter' && handleLogin()}>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-4">
                      {/* Language Select */}
                      <div className="relative">
                        <div
                          onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-white/30 bg-black min-w-[110px] cursor-pointer hover:border-white/60 transition-colors"
                        >
                          <span className="text-white text-[13px] font-bold">{currentLang.name}</span>
                          <ChevronDown size={14} className={`text-white ml-auto transition-transform ${showLanguageMenu ? 'rotate-180' : ''}`} />
                        </div>
                        {showLanguageMenu && (
                          <div className="absolute top-full left-0 mt-1 w-full bg-[#111] border border-white/10 rounded-md shadow-2xl py-1 z-[70] animate-in fade-in slide-in-from-top-2 duration-200">
                            {languages.map((lang) => (
                              <button
                                key={lang.code}
                                onClick={() => {
                                  setLanguage(lang.code)
                                  setShowLanguageMenu(false)
                                }}
                                className={`w-full text-left px-4 py-2 text-[13px] transition-colors ${language === lang.code ? 'text-[#e8612c] bg-white/5 font-bold' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
                              >
                                {lang.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Region Select */}
                      <div className="relative">
                        <div
                          onClick={() => setShowRegionMenu(!showRegionMenu)}
                          className="flex items-center gap-1.5 px-2 py-1.5 rounded-[4px] border border-white/30 bg-black min-w-[65px] cursor-pointer hover:border-white/60 transition-colors"
                        >
                          <span className="text-white text-[13px] font-bold uppercase whitespace-nowrap">IN</span>
                          <ChevronDown size={14} className={`text-white ml-auto transition-transform ${showRegionMenu ? 'rotate-180' : ''}`} />
                        </div>
                        {showRegionMenu && (
                          <div className="absolute top-full left-0 mt-1 w-full bg-[#111] border border-white/10 rounded-md shadow-2xl py-1 z-[70]">
                            <button className="w-full text-left px-4 py-2 text-[13px] text-[#e8612c] font-bold bg-white/5">IN</button>
                          </div>
                        )}
                      </div>

                      {/* Username */}
                      <div className="flex flex-col w-[160px] border-b border-white pb-0.5">
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder={`0 ${t('common.login')}`}
                          className="bg-transparent outline-none text-white text-[13px] font-bold placeholder:text-white/70"
                        />
                      </div>

                      {/* Password */}
                      <div className="flex items-center w-[160px] border-b border-white pb-0.5">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Password"
                          className="flex-1 bg-transparent outline-none text-white text-[13px] font-bold placeholder:text-white/70"
                        />
                        <button onClick={() => setShowPassword(!showPassword)} className="text-white/80 hover:text-white">
                          <Eye size={18} />
                        </button>
                      </div>

                      {/* Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleLogin()}
                          className="px-6 py-2 rounded-full bg-gradient-to-b from-[#f26522] to-[#e8612c] text-white text-[13px] font-black uppercase tracking-tight shadow-lg active:scale-95 transition-all"
                        >
                          {t('common.login')}
                        </button>
                        <Link
                          href="/auth/signup"
                          className="px-5 py-2 rounded-full bg-gradient-to-b from-[#58a049] to-[#28a745] text-white text-[13px] font-black uppercase tracking-tight shadow-lg active:scale-95 transition-all"
                        >
                          {t('common.signup')}
                        </Link>
                      </div>
                    </div>

                    {/* Bottom Links */}
                    <div className="flex items-center gap-10 pl-48">
                      <label className="flex items-center gap-2 cursor-pointer pt-1" onClick={() => setRememberMe(!rememberMe)}>
                        <div
                          className={`w-3.5 h-3.5 rounded-full border border-white flex items-center justify-center transition-all ${rememberMe ? 'bg-[#f26522] border-[#f26522]' : 'bg-white'}`}
                        >
                          {rememberMe && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <span className="text-orange-500 text-[10px] font-bold">Remember Me</span>
                      </label>
                      <Link href="/auth/forgot-password" text-color="orange" className="text-orange-500 text-[10px] font-bold hover:underline pt-1">
                        Forgot Password?
                      </Link>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* ── News Ticker - Between Header and Game Header ── */}
      {isAuthenticated && (
        <div className="relative z-[59]">
          <NewsTicker />
        </div>
      )}

      {/* ── Mobile Inplay Header ── */}
      <div className={`lg:hidden px-2 py-1.5 bg-[#1a1a1a] relative z-[50]`}>
        <div className="flex w-[98%] h-[60px] p-1 rounded-[12px] bg-[#3d3d3d] mx-auto relative z-[1] items-center justify-between">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center flex-1 gap-1 transition-all active:scale-95 group ${pathname === '/' ? 'opacity-100 scale-105' : 'opacity-60'}`}
          >
            <img src="/nav/inplay.png" alt="Inplay" className="w-7 h-7 object-contain" />
            <span className="text-[10px] font-bold text-white uppercase tracking-tight">Inplay</span>
          </Link>

          <div className="h-8 w-[1px] bg-white/10" />

          <Link
            href="/markets/live-casino"
            className="flex flex-col items-center justify-center flex-1 gap-1 transition-all active:scale-95 group opacity-60 hover:opacity-100"
          >
            <img src="/nav/aura-casino.png" alt="Live Casino" className="w-7 h-7 object-contain" />
            <span className="text-[10px] font-bold text-white uppercase tracking-tight">Live Casino</span>
          </Link>

          <div className="h-8 w-[1px] bg-white/10" />

          <Link
            href="/sportsbook"
            className={`flex flex-col items-center justify-center flex-1 gap-1 transition-all active:scale-95 group ${pathname === '/sportsbook' ? 'opacity-100 scale-105' : 'opacity-60'}`}
          >
            <img src="/nav/sportsbook.png" alt="Sportsbook" className="w-7 h-7 object-contain" />
            <span className="text-[10px] font-bold text-white uppercase tracking-tight">SportsBook</span>
          </Link>

          <div className="h-8 w-[1px] bg-white/10" />

          <button
            onClick={() => setMoreMenuOpen(true)}
            className="flex flex-col items-center justify-center flex-1 gap-1 transition-all active:scale-95 group opacity-60 hover:opacity-100"
          >
            <img src="/nav/more.png" alt="More" className="w-7 h-7 object-contain" />
            <span className="text-[10px] font-bold text-white uppercase tracking-tight">More</span>
          </button>
        </div>
      </div>

      {/* ── Desktop Sub Header ── */}
      <div className={`hidden lg:flex relative z-[58] items-center justify-center h-[58px] overflow-x-auto no-scrollbar bg-[#000] px-4 transition-all duration-300`}>
        <div className="flex items-center gap-1">
          {[
            { id: 'inplay', label: 'Inplay', icon: 'https://www.fairplay247.vip/_nuxt/img/inplay.a7c4dae.png', href: '/' },
            { id: 'cricket', label: 'Cricket', icon: 'https://www.fairplay247.vip/_nuxt/img/cricket.5c05f66.png', href: '/sportsbook/Cricket' },
            { id: 'soccer', label: 'Football', icon: 'https://www.fairplay247.vip/_nuxt/img/soccer.9f718cc.png', href: '/sportsbook/Football' },
            { id: 'tennis', label: 'Tennis', icon: 'https://www.fairplay247.vip/_nuxt/img/tennis.fc30791.png', href: '/sportsbook/Tennis' },
            { id: 'premium', label: 'Premium Sportbook', icon: 'https://www.fairplay247.vip/_nuxt/img/premium-notebook.cfec1a1.png', href: '/premium-sportsbook' },
            { id: 'crash', label: 'Crash Games', icon: 'https://www.fairplay247.vip/_nuxt/img/crash_games.a192ffd.png', href: '/crash-games' },
            { id: 'casino', label: 'Live Casino', icon: 'https://www.fairplay247.vip/_nuxt/img/live-casino.761f895.png', href: '/markets/live-casino' },
            { id: 'slots', label: 'Slot Games', icon: 'https://www.fairplay247.vip/_nuxt/img/slot-games.ccf3217.png', href: '/casino-slots' }
          ].map((tab) => {
            const isActive = pathname === tab.href || (tab.id === 'inplay' && pathname === '/')
            return (
              <Link
                key={tab.id}
                href={tab.href}
                onClick={(e) => {
                  if (!isAuthenticated && (tab.id === 'casino' || tab.id === 'slots')) {
                    e.preventDefault();
                    showSnackbar('Please login to access ' + tab.label, 'error');
                    router.push('/auth/login');
                    return;
                  }
                  setActiveTab(tab.id);
                }}
                className={`py-1 px-3 flex items-center gap-1 transition-all whitespace-nowrap ${isActive ? 'border-[0.09rem] border-[#f36c21] rounded-[30px] !pr-3 font-black text-[#f36c21]' : 'text-white hover:text-white font-bold'}`}
              >
                <div className="h-[20px] w-[49px] flex items-center justify-center overflow-hidden shrink-0">
                  <img src={tab.icon} alt={tab.label} className="h-full w-full object-contain" />
                </div>
                <span className="text-[11px] uppercase tracking-wide ml-1">{tab.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
