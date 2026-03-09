import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'
import BetSlip from '@/components/sportsbook/BetSlip'
import MainLayout from '@/components/layout/MainLayout'
import Providers from './providers'


const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
}

export const metadata: Metadata = {
  title: 'FairBet | Premium Sports Betting & Casino',
  description: 'Experience the best live betting and casino games.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FairBet',
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>

          {/* Sidebar - desktop only, fixed to left */}
          <Sidebar />

          {/* Main content area - client component to handle dynamic padding */}
          <MainLayout>
            {children}
          </MainLayout>

          {/* Bottom Navigation - mobile only */}
          <BottomNav />

          {/* Bet Slip - desktop right / mobile bottom sheet */}
          <BetSlip />


        </Providers>
      </body>
    </html>
  )
}
