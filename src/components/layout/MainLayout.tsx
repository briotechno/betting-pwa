'use client'
import React, { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useLayoutStore } from '@/store/layoutStore'
import { useAuthStore } from '@/store/authStore'
import { useSnackbarStore } from '@/store/snackbarStore'
import { userController } from '@/controllers/user/userController'
import Header from './Header'
import ProfileSidebar from './ProfileSidebar'
import Footer from './Footer'
import Sidebar from './Sidebar'
import { Suspense } from 'react'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const {
    sidebarCollapsed,
    leftDrawerOpen,
    profileSidebarOpen,
    searchModalOpen,
    moreMenuOpen,
    auraCasinoOpen,
    feedbackModalOpen
  } = useLayoutStore()
  const { user, isAuthenticated, updateBalance, logout } = useAuthStore()
  const { show: showSnackbar } = useSnackbarStore()
  const pathname = usePathname()

  const handleWhatsAppClick = async () => {
    if (user?.loginToken) {
      try {
        const res = await userController.getWhatsAppLink(user.loginToken)
        if (res && res.error === '0' && res.Link) {
          window.open(res.Link, '_blank')
          return
        }
      } catch (err) {
        console.error('WhatsApp redirect failed:', err)
      }
    }
    // Fallback if not logged in or API fails
    window.open('https://go.wa.link/ambikaexchangesupport', '_blank')
  }

  // Session Watchdog: Poll balance every 7s, force logout on error "2"
  useEffect(() => {
    if (!isAuthenticated || !user?.loginToken) return

    let isMounted = true
    let timeoutId: NodeJS.Timeout

    const checkSession = async () => {
      try {
        const res = await userController.getBalance(user.loginToken!)
        if (!isMounted) return

        if (res?.error === '2') {
          // Session invalidated — another login or token changed
          logout()
          showSnackbar(' Please login again.', 'error')
          return
        }

        // Update balance if valid
        if (res?.error === '0' && res?.balance !== undefined) {
          updateBalance(
            parseFloat(res.balance) || 0,
            parseFloat(res.exposure) || 0,
            parseFloat(res.availablebalance ?? res.availableBalance) || 0
          )
        }
      } catch (_) {
        // Network error — skip silently, don't logout
      }

      if (isMounted) timeoutId = setTimeout(checkSession, 7000)
    }

    timeoutId = setTimeout(checkSession, 7000) // start after 7s delay

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
  }, [isAuthenticated, user?.loginToken, logout, updateBalance])

  // Global Scroll Lock
  useEffect(() => {
    const isAnyOverlayOpen =
      leftDrawerOpen ||
      profileSidebarOpen ||
      searchModalOpen ||
      moreMenuOpen ||
      auraCasinoOpen ||
      feedbackModalOpen

    const body = document.body
    const html = document.documentElement

    if (isAnyOverlayOpen) {
      // Aggressive lock for mobile and desktop
      body.style.setProperty('overflow', 'hidden', 'important')
      html.style.setProperty('overflow', 'hidden', 'important')
      body.style.height = '100%'
      html.style.height = '100%'
      body.style.touchAction = 'none'
    } else {
      body.style.removeProperty('overflow')
      html.style.removeProperty('overflow')
      body.style.height = ''
      html.style.height = ''
      body.style.touchAction = ''
    }

    return () => {
      body.style.removeProperty('overflow')
      html.style.removeProperty('overflow')
      body.style.height = ''
      html.style.height = ''
      body.style.touchAction = ''
    }
  }, [leftDrawerOpen, profileSidebarOpen, searchModalOpen, moreMenuOpen, auraCasinoOpen, feedbackModalOpen])

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

      <div className={`flex flex-1 items-start w-full ${pathname?.startsWith('/sportsbook') || pathname?.startsWith('/premium-sportsbook') || pathname?.startsWith('/favorites') ? '  lg:px-20 !mx-auto lg:gap-4' : ''}`}>
        {/* Sidebar - Now correctly contained in flow */}
        {(pathname === '/' ||
          pathname?.startsWith('/sportsbook') ||
          pathname?.startsWith('/favorites') ||
          (pathname?.startsWith('/premium-sportsbook') && !pathname?.includes('rules'))) && (
            <Suspense fallback={null}>
              <Sidebar />
            </Suspense>
          )}

        <div className="flex flex-col min-w-0 flex-auto max-w-full relative">
          {/* Profile Sidebar - slide from right when active */}
          <ProfileSidebar />

          {/* Floating WhatsApp Icon */}
          {!isAuthPage && (
            <button
              onClick={handleWhatsAppClick}
              className="fixed bottom-[70px] left-4 z-[55] w-[50px] h-[50px] rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            >
              <img src="/whatsapp.png" alt="WhatsApp" className="w-full h-full object-cover" />
            </button>
          )}

          {/* Main page content */}
          <main className="flex-auto max-w-full relative">
            <div className="pb-0 lg:pb-0">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Full Width Footer - Now outside the flex wrapper */}
      {(pathname === '/' ||
        pathname?.startsWith('/favorites') ||
        (pathname?.startsWith('/premium-sportsbook') && !pathname?.includes('rules'))) && (
          <Footer />
        )}
    </div>
  )
}
