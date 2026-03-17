import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'
import LeftDrawer from '@/components/layout/LeftDrawer'
import ProfileSidebar from '@/components/layout/ProfileSidebar'
import CategoryMoreDrawer from '@/components/layout/CategoryMoreDrawer'
import SearchModal from '@/components/layout/SearchModal'
import FeedbackModal from '@/components/layout/FeedbackModal'
import BottomNav from '@/components/layout/BottomNav'
import BetSlip from '@/components/sportsbook/BetSlip'
import MainLayout from '@/components/layout/MainLayout'
import AuraCasinoOverlay from '@/components/casino/AuraCasinoOverlay'
import DesktopBottomNav from '@/components/layout/DesktopBottomNav'
import Snackbar from '@/components/ui/Snackbar'
import Providers from './providers'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
}

export const metadata: Metadata = {
  title: 'fairplay',
  description: 'Experience the best live betting and casino games.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'fairplay',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/Favicon.png" sizes="any" />
        <link rel="apple-touch-icon" href="/Favicon.png" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>

          {/* Sidebar - desktop only, fixed to left */}
          <Suspense fallback={null}>
            <Sidebar />
          </Suspense>

          {/* Main content area - client component to handle dynamic padding */}
          <MainLayout>
            {children}
          </MainLayout>

          {/* Bottom Navigation - mobile only */}
          <Suspense fallback={null}>
            <BottomNav />
          </Suspense>

          {/* Bet Slip - desktop right / mobile bottom sheet */}
          <Suspense fallback={null}>
            <BetSlip />
          </Suspense>

          <Suspense fallback={null}>
            <LeftDrawer />
          </Suspense>

          <Suspense fallback={null}>
            <ProfileSidebar />
          </Suspense>

          <Suspense fallback={null}>
            <CategoryMoreDrawer />
          </Suspense>

          <Suspense fallback={null}>
            <SearchModal />
          </Suspense>
          
          <Suspense fallback={null}>
            <FeedbackModal />
          </Suspense>
          
          <Suspense fallback={null}>
            <AuraCasinoOverlay />
          </Suspense>

          <Suspense fallback={null}>
            <DesktopBottomNav />
          </Suspense>

          <Snackbar />
        </Providers>
      </body>
    </html>
  )
}
