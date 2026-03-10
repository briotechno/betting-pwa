'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { X, User, Wallet, History, Settings, LogOut, ChevronRight, Bell, Heart, FileText, PieChart, Shield } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useLayoutStore } from '@/store/layoutStore'
import { useI18nStore } from '@/store/i18nStore'

export default function ProfileSidebar() {
  const { user, logout } = useAuthStore()
  const { profileSidebarOpen, setProfileSidebarOpen } = useLayoutStore()
  const { t } = useI18nStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !user) return null

  const menuItems = [
    { icon: <PieChart size={18} />, label: 'Betting P&L', href: '/betting-pl' },
    { icon: <History size={18} />, label: 'My Transactions', href: '/my-transactions' },
    { icon: <User size={18} />, label: 'Profile', href: '/profile' },
    { icon: <Wallet size={18} />, label: 'My Wallet', href: '/wallet' },
    { icon: <Shield size={18} />, label: 'Reset Password', href: '/reset-password' },
    { icon: <History size={18} />, label: 'Open Bets', href: '/my-bets' },
    { icon: <Heart size={18} />, label: 'Favourites', href: '/favourites' },
    { icon: <Bell size={18} />, label: 'Notification', href: '/notifications' },
    { icon: <FileText size={18} />, label: 'Rules & Regulations', href: '/rules' },
    { icon: <Settings size={18} />, label: 'Stake Settings', href: '/stake-settings' },
    { icon: <FileText size={18} />, label: 'Feedback', href: '/feedback' },
  ]

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 ${
          profileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setProfileSidebarOpen(false)}
      />

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 right-0 bottom-0 w-[320px] bg-[#0d0d0d] z-[101] shadow-2xl transition-transform duration-300 ease-in-out border-l border-white/5 flex flex-col ${
          profileSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black">
          <h2 className="text-sm font-black text-white uppercase tracking-widest">Account Details</h2>
          <button 
            onClick={() => setProfileSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-white/5 text-textMuted hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Info Card */}
        <div className="p-6 bg-[#050505] border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-[#222] flex items-center justify-center text-white border border-white/5 shadow-inner">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-full h-full rounded-lg object-cover" />
              ) : (
                <User size={32} />
              )}
            </div>
            <div>
              <p className="text-lg font-black text-white leading-tight uppercase tracking-tight">{user.username}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-md bg-[#e8612c] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-900/20">
                  {user.tier} Tier
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-[#111] border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Main Balance</p>
              <p className="text-xl font-black text-white mt-0.5">₹{user.balance.toLocaleString()}</p>
            </div>
            <Link 
              href="/wallet/deposit"
              onClick={() => setProfileSidebarOpen(false)}
              className="px-4 py-2 rounded-lg bg-[#28a745] text-white text-[11px] font-black uppercase tracking-tight hover:bg-[#218838] transition-colors"
            >
              Deposit
            </Link>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto no-scrollbar py-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setProfileSidebarOpen(false)}
              className="flex items-center gap-4 px-6 py-3.5 text-textMuted hover:text-white hover:bg-white/5 transition-all group border-b border-white/[0.02]"
            >
              <span className="text-white opacity-40 group-hover:opacity-100 transition-opacity">
                {item.icon}
              </span>
              <span className="flex-1 text-[13px] font-bold uppercase tracking-tight">{item.label}</span>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 bg-black border-t border-white/5">
          <button 
            onClick={() => {
              logout()
              setProfileSidebarOpen(false)
            }}
            className="w-full py-4 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 text-[13px] font-black uppercase tracking-widest transition-all hover:text-white flex items-center justify-center gap-3"
          >
            <LogOut size={18} />
            Logout Account
          </button>
        </div>
      </aside>
    </>
  )
}
