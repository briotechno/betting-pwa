'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import { useLayoutStore } from '@/store/layoutStore'
import Header from './Header'

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
    <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-[80px]' : 'lg:pl-[220px]'}`}>
      {/* Header - fixed to top, offset by sidebar */}
      <Header />

      {/* Main page content - pt accounts for header height */}
      <main className="min-h-screen pb-16 lg:pb-0 pt-[112px] lg:pt-[122px]" style={{ background: '#000' }}>
        {children}
      </main>
    </div>
  )
}
