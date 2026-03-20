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
      {/* Header - fixed to top, full width */}
      <Header />

      {/* News Ticker - Fixed below sub-header on desktop, below top header on mobile */}
      <div className="fixed top-20 lg:top-[148px] left-0 right-0 z-[58] lg:pl-[220px]">
        <NewsTicker />
      </div>

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

      {/* Main page content - pt accounts for fixed header parts */}
      <main className="min-h-screen pt-[112px] lg:pt-[180px]" style={{ background: '#121212' }}>
        <div className="pb-0 lg:pb-0">
          {children}
        </div>
        <Footer />
      </main>
    </div>

  )
}
