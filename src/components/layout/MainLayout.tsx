'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import { useLayoutStore } from '@/store/layoutStore'
import Header from './Header'
import ProfileSidebar from './ProfileSidebar'
import Footer from './Footer'


import NewsTicker from '../common/NewsTicker'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useLayoutStore()
  const pathname = usePathname()

  // If we are on an auth page, don't show the header and remove the sidebar offset/padding
  const isAuthPage = pathname?.startsWith('/auth')

  if (isAuthPage) {
    return (
      <main className="min-h-screen" style={{ background: '#121212' }}>
        {children}
      </main>
    )
  }

  return (
    <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-[65px]' : 'lg:pl-[220px]'}`}>
      {/* News Ticker - Fixed at the very top of the screen */}
      <div className="fixed top-0 left-0 right-0 z-[70]">
        <NewsTicker />
      </div>

      {/* Header - fixed below news ticker */}
      <Header />

      {/* Profile Sidebar - slide from right when active */}
      <ProfileSidebar />

      {/* Floating WhatsApp Icon */}
      {!isAuthPage && (
        <a
          href="https://wa.me/1234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-24 left-4 z-[55]"
        >
          <div className="w-[50px] h-[50px]   rounded-full flex items-center justify-center c transition-transform hover:scale-110">
            <img src="/whatsapp.png" alt="WhatsApp" className="w-[50px] h-[50px] object-cover" />
          </div>
        </a>
      )}

      {/* Main page content - pt accounts for news ticker (34px) + header (148px) = 182px */}
      <main className="min-h-screen pt-0 lg:pt-[182px]" style={{ background: '#121212' }}>
        <div className="pb-0 lg:pb-0">
          {children}
        </div>
        <Footer />
      </main>
    </div>

  )
}
