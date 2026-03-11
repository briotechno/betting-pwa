'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  X, 
  Store, 
  Newspaper, 
  Info, 
  ShieldCheck, 
  HelpCircle, 
  Megaphone, 
  Crown, 
  Share2, 
  FileText, 
  ChevronRight,
  Menu,
  Globe,
  ChevronDown
} from 'lucide-react'
import { useLayoutStore } from '@/store/layoutStore'
import { useAuthStore } from '@/store/authStore'
import { useI18nStore } from '@/store/i18nStore'
import { Language } from '@/i18n/translations'

const menuItems = [
  { id: 'market', label: 'Market', icon: Store, href: '/sports' },
  { id: 'news', label: 'News', icon: Newspaper, href: '/news' },
  { id: 'about', label: 'About', icon: Info, href: '/about' },
  { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck, href: '/rules?tab=privacy' },
  { id: 'faq', label: 'FAQ', icon: HelpCircle, href: '/rules?tab=faq' },
  { id: 'promotions', label: 'Promotions', icon: Megaphone, href: '/promotions' },
  { id: 'loyalty', label: 'Loyalty', icon: Crown, href: '/loyalty' },
  { id: 'affiliate', label: 'Affiliate', icon: Share2, href: '/affiliate' },
  { id: 'tc', label: 'T&C', icon: FileText, href: '/rules?tab=tc' },
]

export default function LeftDrawer() {
  const { leftDrawerOpen, setLeftDrawerOpen } = useLayoutStore()
  const { user, isAuthenticated } = useAuthStore()
  const { language, setLanguage } = useI18nStore()
  const [mounted, setMounted] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          leftDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setLeftDrawerOpen(false)}
      />

      {/* Drawer */}
      <div 
        className={`fixed top-0 left-0 bottom-0 w-[280px] z-[101] bg-black shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          leftDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* User Header */}
        <div className="relative h-24 bg-gradient-to-br from-[#1e88e5] to-[#1565c0] flex items-center px-4 gap-3 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
          
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#1565c0] font-black text-lg border-2 border-white/20 shadow-lg">
            {isAuthenticated && user ? user.username.slice(0, 2).toUpperCase() : 'FB'}
          </div>
          
          <div className="flex-1 overflow-hidden">
            <h3 className="text-white font-black text-sm truncate uppercase tracking-tight">
              {isAuthenticated && user ? user.username : 'Guest User'}
            </h3>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-0.5">
               {isAuthenticated && user ? `ID: ${user.id}` : 'FairBet VIP'}
            </p>
          </div>

          <button 
            onClick={() => setLeftDrawerOpen(false)}
            className="absolute top-2 right-2 p-1 text-white/50 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-2">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setLeftDrawerOpen(false)}
              className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/5 transition-all group border-b border-white/[0.03] last:border-0"
            >
              <item.icon size={20} className="text-[#e8612c] group-hover:scale-110 transition-transform" />
              <span className="flex-1 text-[13px] font-black text-white uppercase tracking-tight">{item.label}</span>
              <ChevronRight size={14} className="text-white/20 group-hover:text-white/40 transition-colors" />
            </Link>
          ))}

          {/* Language Selector (Mobile) */}
          <div className="mt-2 border-t border-white/5">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="w-full flex items-center gap-4 px-4 py-4 hover:bg-white/5 transition-all group"
            >
              <Globe size={20} className="text-[#e8612c]" />
              <span className="flex-1 text-[13px] font-black text-white uppercase tracking-tight text-left">Language</span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-[#e8612c] uppercase">{language}</span>
                <ChevronDown size={14} className={`text-white/20 transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
              </div>
            </button>
            
            {showLangMenu && (
              <div className="bg-[#0a0a0a] border-y border-white/5 py-1 animate-in slide-in-from-top-2 duration-200">
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
                    onClick={() => { 
                      setLanguage(lang.id as Language); 
                      setShowLangMenu(false);
                      // Optionally close drawer: setLeftDrawerOpen(false);
                    }}
                    className={`w-full px-12 py-3 text-left text-[11px] font-bold transition-all ${
                      language === lang.id ? 'text-[#e8612c] bg-[#e8612c05]' : 'text-[#888] hover:text-white'
                    }`}
                  >
                    {lang.label.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer / Download Button */}
        <div className="p-4 border-t border-white/5 bg-[#050505]">
          <button className="w-full h-11 bg-[#e8612c] text-white rounded-lg text-xs font-black uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-orange-900/20">
            Download App
          </button>
          <p className="text-center text-[9px] text-white/20 font-bold uppercase tracking-widest mt-3 italic">
            FairBet VIP &copy; 2026
          </p>
        </div>
      </div>
    </>
  )
}
