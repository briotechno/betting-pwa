'use client'
import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-8xl mb-4">🏏</div>
      <h1 className="text-4xl font-black text-primary mb-2">404</h1>
      <h2 className="text-xl font-bold text-textPrimary mb-3">Page Not Found</h2>
      <p className="text-textMuted text-sm mb-6">The page you're looking for doesn't exist or has been moved.</p>
      <Link
        href="/"
        className="flex items-center gap-2 bg-primary hover:bg-primaryHover text-white font-semibold px-6 py-3 rounded-xl transition-colors"
      >
        <Home size={18} />
        Back to Home
      </Link>
    </div>
  )
}
