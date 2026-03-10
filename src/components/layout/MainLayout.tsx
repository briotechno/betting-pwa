'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import { useLayoutStore } from '@/store/layoutStore'
import Header from './Header'
import ProfileSidebar from './ProfileSidebar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useLayoutStore()
  const pathname = usePathname()

  // If we are on an auth page, don't show the header and remove the sidebar offset/padding
  const isAuthPage = pathname?.startsWith('/auth')

  if (isAuthPage) {
    return (
      <main className="min-h-screen" style={{ background: '#000' }}>
        {children}
      </main>
    )
  }

  return (
    <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-[65px]' : 'lg:pl-[200px]'}`}>
      {/* Header - fixed to top, full width */}
      <Header />
      
      {/* Profile Sidebar - slide from right when active */}
      <ProfileSidebar />

      {/* Main page content - pt accounts for 2-row header height (92px top + 48px sub = 140px) */}
      <main className="min-h-screen pb-16 lg:pb-0 pt-[128px] lg:pt-[140px]" style={{ background: '#000' }}>
        {children}
      </main>
    </div>
  )
}
