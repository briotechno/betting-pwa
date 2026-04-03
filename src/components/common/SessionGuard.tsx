'use client'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'

export default function SessionGuard() {
  const { user, logout, isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || !user?.lastLoginAt) return

    const SESSION_DURATION = 40 * 60 * 1000 // 40 minutes in milliseconds
    
    const checkSession = () => {
      const now = Date.now()
      const elapsed = now - (user.lastLoginAt || 0)
      
      if (elapsed >= SESSION_DURATION) {
        console.warn("Session expired (40 min). Logging out...")
        logout()
        router.push('/') // Redirect to home on session expiry
      }
    }

    // Initial check
    checkSession()

    // Check every 30 seconds to be precise
    const interval = setInterval(checkSession, 30000)

    return () => clearInterval(interval)
  }, [isAuthenticated, user?.lastLoginAt, logout, router])

  return null // This is a logic-only component
}
