'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import { useLayoutStore } from '@/store/layoutStore'
import { useAuthStore } from '@/store/authStore'
import Header from './Header'
import ProfileSidebar from './ProfileSidebar'
import Footer from './Footer'
import Sidebar from './Sidebar'
import { Suspense } from 'react'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useLayoutStore()
  const { isAuthenticated } = useAuthStore()
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
    <div className="min-h-screen flex flex-col" style={{ background: '#121212' }}>
      {/* Header - Now top level, no left space */}
      <Header />

      <div className={`flex w-full ${pathname?.startsWith('/sportsbook') || pathname?.startsWith('/premium-sportsbook') ? '  lg:px-20 !mx-auto lg:gap-4' : ''}`}>
        {/* Sidebar - Now correctly contained in flow */}
        {(pathname === '/' || pathname?.startsWith('/sportsbook') || pathname?.startsWith('/premium-sportsbook')) && (
          <Suspense fallback={null}>
            <Sidebar />
          </Suspense>
        )}

        <div className="flex flex-col min-w-0 flex-auto max-w-full relative">
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
              <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center transition-transform hover:scale-110">
                <img src="/whatsapp.png" alt="WhatsApp" className="w-[50px] h-[50px] object-cover" />
              </div>
            </a>
          )}

          {/* Main page content */}
          <main className="flex-auto max-w-full relative">
            <div className="pb-0 lg:pb-0">
              {children}
            </div>
            {pathname === '/' && <Footer />}
          </main>
        </div>
      </div>
    </div>
  )
}
