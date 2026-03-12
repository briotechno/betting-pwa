'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useLayoutStore } from '@/store/layoutStore'

const menuItems = [
  { id: 'pnl', label: 'Betting P&L', icon: '/nav/bet_pnl.png', href: '/profit-loss' },
  { id: 'tx', label: 'My Transactions', icon: '/nav/transactions.png', href: '/transactions' },
  { id: 'profile', label: 'Profile', icon: '/nav/profile.png', href: '/profile' },
  { id: 'wallet', label: 'My Wallet', icon: '/nav/wallet_sidebar.png', href: '/wallet' },
  { id: 'reset', label: 'Reset Password', icon: '/nav/reset_password.png', href: '/reset-password' },
  { id: 'bets', label: 'Open Bets', icon: '/nav/open_bets.png', href: '/bets', count: 0 },
  { id: 'fav', label: 'Favourites', icon: '/nav/favorites.png', href: '/favorites' },
  { id: 'notif', label: 'Notification', icon: '/nav/notification.png', href: '/notifications' },
  { id: 'rules', label: 'Rules & Regulations', icon: '/nav/rules.png', href: '/rules-regulations' },
  { id: 'settings', label: 'Stake Settings', icon: '/nav/settings.png', href: '/settings' },
  { id: 'feedback', label: 'Feedback', icon: '/nav/feedback.png', href: '/feedback' },
]

export default function ProfileSidebar() {
  const { user, logout } = useAuthStore()
  const { profileSidebarOpen, setProfileSidebarOpen } = useLayoutStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !user) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 ${profileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setProfileSidebarOpen(false)}
      />

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-[280px] bg-[#000] z-[101] shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${profileSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
          {/* User Tier Card */}
          <div className="p-0">
            <Link
              href="/profile"
              onClick={() => setProfileSidebarOpen(false)}
              className="relative block w-full aspect-[2.8/1] overflow-hidden bg-black group"
            >
              <img src="/nav/tier-blue.png" alt="Blue Tier" className="absolute inset-0 w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 px-6 flex flex-col justify-center gap-1">
                <div className="text-[15px] font-black text-white leading-tight line-clamp-1 uppercase tracking-tight">
                  Hi {user.username || user.email}
                </div>
                <div className="text-[14px] text-white/90">
                  You are in <span className="font-black text-white text-[16px]">Beginner</span> tier
                </div>
              </div>
            </Link>
          </div>

          {/* Wallet Info */}
          <div className="px-4 py-2 space-y-3">
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-white/60">Wallet Amount</span>
              <span className="text-[#4caf50] font-bold text-[15px] tabular-nums">₹{user.balance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-white/60">Main Wallet Exposure</span>
              <span className="text-[#f44336] font-bold text-[15px]">0</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-white/60">Main Wallet Balance</span>
              <span className="text-white font-bold text-[15px]">₹{user.balance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-white/60">Free Cash</span>
              <span className="text-white font-bold text-[15px]">0</span>
            </div>

            {/* Awaiting Bonus */}
            <div className="mt-4 border border-[#e15b24] rounded-full h-10 flex items-center justify-between px-6 bg-black">
              <span className="text-[12px] font-black text-white uppercase tracking-tight">Awaiting Bonus</span>
              <span className="text-[15px] font-black text-[#e15b24]">0</span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                href="/wallet/deposit"
                onClick={() => setProfileSidebarOpen(false)}
                className="h-10 bg-[#e15b24] text-white rounded-full flex items-center justify-center text-[12px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-[#e15b24]/20"
              >
                Deposit
              </Link>
              <Link
                href="/wallet/withdrawal"
                onClick={() => setProfileSidebarOpen(false)}
                className="h-10 bg-[#e15b24] text-white rounded-full flex items-center justify-center text-[12px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-[#e15b24]/20"
              >
                Withdraw Now
              </Link>
            </div>
          </div>

          <div className="my-4 border-t border-white/[0.08]" />

          {/* Navigation Items */}
          <div className="space-y-0 text-white">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setProfileSidebarOpen(false)}
                className="flex items-center py-2 transition-all border-b border-gray-600 hover:bg-white/[0.03]"
              >
                <div className="ml-4 flex items-center self-center flex-1 flex-wrap overflow-hidden">
                  <div className="flex items-center justify-start w-full">
                    <img
                      src={item.icon}
                      alt={item.label}
                      className="w-6 h-6 object-contain"
                    />
                    <div className="flex flex-1 justify-between items-center ml-4 pr-3">
                      <span className="text-[16px] font-bold text-white tracking-tight">
                        {item.label}
                      </span>
                      {item.count !== undefined && (
                        <span className="bg-[#e15b24] text-white text-[10px] min-w-[20px] h-5 rounded-full flex items-center justify-center font-black px-1.5 ml-auto">
                          {item.count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Social / Connect */}
          <div className="mt-6 bg-[#424242] py-8 px-6 flex flex-col items-center gap-5">
            <span className="text-[16px] font-black text-white">Connect with us on</span>
            <button className="w-[90%] h-12 border border-white rounded-full flex items-center justify-center gap-3 active:scale-95 transition-all bg-transparent">
              <img 
                src="/nav/whatsapp_now.png" 
                alt="Whatsapp" 
                className="w-7 h-7 object-contain" 
              />
              <span className="text-[15px] font-black text-white uppercase tracking-wider">WHATSAPP</span>
            </button>
          </div>
        </div>

        {/* Global Action (Logout) */}
        <div className="p-0">
          <button
            onClick={() => {
              logout()
              setProfileSidebarOpen(false)
            }}
            className="w-full h-14 bg-[#4caf50] hover:bg-[#43a047] text-white text-[15px] font-black uppercase tracking-widest transition-all"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
