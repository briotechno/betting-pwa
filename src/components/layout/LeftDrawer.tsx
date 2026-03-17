'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ChevronRight,
  ChevronDown
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useLayoutStore } from '@/store/layoutStore'
import { useI18nStore } from '@/store/i18nStore'
import type { Language } from '@/i18n/translations'

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'മലയാളം' },
  { code: 'mr', label: 'मराठी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
]

const menuItems = [
  { id: 'market', label: 'Market', icon: '/nav/market.png', href: '/sports' },
  { id: 'news', label: 'News', icon: '/nav/news.png', href: '/news' },
  { id: 'about', label: 'About', icon: '/nav/about-us.png', href: '/about' },
  { id: 'privacy', label: 'Privacy Policy', icon: '/nav/privacy.png', href: '/rules?tab=privacy' },
  { id: 'faq', label: 'FAQ', icon: '/nav/faqs.png', href: '/rules?tab=faq' },
  { id: 'promotions', label: 'Promotions', icon: '/nav/promotions.png', href: '/promotions' },
  { id: 'loyalty', label: 'Loyalty', icon: '/nav/loyalty.png', href: '/loyalty' },
  { id: 'affiliate', label: 'Affiliate', icon: '/nav/affiliate.png', href: '/affiliate' },
  { id: 'tc', label: 'T&C', icon: '/nav/terms-and-conditions.png', href: '/rules?tab=tc' },
]

export default function LeftDrawer() {
  const pathname = usePathname()
  const { user, isAuthenticated } = useAuthStore()
  const { leftDrawerOpen, setLeftDrawerOpen } = useLayoutStore()
  const { language, setLanguage } = useI18nStore()
  const [mounted, setMounted] = useState(false)
  const [isLangExpanded, setIsLangExpanded] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${leftDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setLeftDrawerOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-[260px] z-[101] bg-[#000] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${leftDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Header Section */}
        {isAuthenticated && user ? (
          <div className="p-0">
            <Link
              href="/profile"
              onClick={() => setLeftDrawerOpen(false)}
              className="relative block w-full aspect-[2.8/1] overflow-hidden bg-black group"
            >
              <img src="/nav/tier-blue.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 px-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#333] font-bold text-lg shadow-lg">
                  {user.username.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-bold text-white leading-tight truncate">
                    {user.username}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center pt-6 pb-4 px-6 gap-6">
            <div className="w-[130px]">
              <img src="/nav/logo.png" alt="Fairplay" className="w-full h-auto object-contain" />
            </div>
            <Link
              href="/auth/register"
              onClick={() => setLeftDrawerOpen(false)}
              className="w-auto p-2 h-10 bg-[#e15b24] text-normal text-white flex items-center justify-center rounded-[4px] text-[14px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-md"
            >
              Register
            </Link>
          </div>
        )}

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-0 drawerLeft">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href)

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setLeftDrawerOpen(false)}
                className={`flex items-center py-2.5 transition-all group border-b border-gray-600 ${isActive ? 'bg-[#e15b24]' : 'hover:bg-white/[0.03]'
                  }`}
              >
                <div className="ml-4 flex items-center self-center flex-1 flex-wrap overflow-hidden">
                  <div className="flex items-center justify-start w-full">
                    <img
                      src={item.icon}
                      alt={item.label}
                      className={`w-6 h-6 object-contain transition-transform duration-300 group-hover:scale-105 ${isActive ? 'brightness-[10]' : ''
                        }`}
                    />
                    <div className="flex flex-1 justify-between items-center ml-4 pr-3">
                      <span className={`text-[16px] font-bold text-white tracking-tight ${isActive ? 'font-black' : ''}`}>
                        {item.label}
                      </span>
                      <ChevronRight
                        size={18}
                        className={`transition-colors ${isActive ? 'text-white' : 'text-white/30 group-hover:text-white'
                          }`}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-6 flex flex-col gap-6">
          {/* Language Selector */}
          <div className="relative">
            <div
              className="w-full h-11 bg-[#050505] border border-white/20 rounded-[4px] flex items-center px-4 justify-between transition-all hover:border-white/40 cursor-pointer shadow-inner"
              onClick={() => setIsLangExpanded(!isLangExpanded)}
            >
              <span className="text-white text-[15px] font-bold">
                {LANGUAGES.find(l => l.code === language)?.label || 'English'}
              </span>
              <ChevronDown
                size={16}
                className={`text-white/60 transition-transform duration-300 ${isLangExpanded ? 'rotate-180' : ''}`}
              />
            </div>

            {/* Language Dropdown */}
            <div
              className={`absolute bottom-[calc(100%+8px)] left-0 w-full bg-[#111] border border-white/20 rounded-[4px] shadow-2xl overflow-hidden transition-all duration-300 origin-bottom ${isLangExpanded ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-95 pointer-events-none'
                }`}
            >
              <div className="max-h-[240px] overflow-y-auto no-scrollbar py-2">
                {LANGUAGES.map((lang) => (
                  <div
                    key={lang.code}
                    className={`px-4 py-2.5 text-[14px] cursor-pointer transition-colors ${language === lang.code
                      ? 'text-[#e15b24] bg-white/5 font-bold'
                      : 'text-white hover:bg-white/10'
                      }`}
                    onClick={() => {
                      setLanguage(lang.code)
                      setIsLangExpanded(false)
                    }}
                  >
                    {lang.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button className="w-full h-12 bg-[#e15b24] text-whit e rounded-[4px] text-[14px] text-normal font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-black/60">
            Download App
          </button>
        </div>
      </div>
    </>
  )
}
