'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Loader2, RefreshCw } from 'lucide-react'
import { casinoController } from '@/controllers/casino/casinoController'
import { useAuthStore } from '@/store/authStore'
import { useSnackbarStore } from '@/store/snackbarStore'

export default function PremiumSportsbookPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { show: showSnackbar } = useSnackbarStore()
  const [url, setUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSportsbookUrl = async () => {
    if (!user) {
      setError('Please login to access the premium sportsbook')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const res = await casinoController.openSportsbook(user.loginToken || '')
      
      if (res.error === '0' && res.url) {
        setUrl(res.url)
      } else {
        setError(res.msg || 'Failed to fetch sportsbook URL')
        showSnackbar(res.msg || 'Failed to fetch sportsbook URL', 'error')
      }
    } catch (err) {
      setError('Network error')
      showSnackbar('Network error', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }
    fetchSportsbookUrl()
  }, [isAuthenticated, user])

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#1a1a1a] z-[60] flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 text-[#e8612c] animate-spin mb-4" />
        <p className="text-[14px] font-bold uppercase tracking-widest opacity-60">Loading Sportsbook...</p>
      </div>
    )
  }

  if (error || !url) {
    return (
      <div className="fixed inset-0 bg-[#1a1a1a] z-[60] flex flex-col items-center justify-center text-white px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
          <RefreshCw className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-xl font-black mb-2 uppercase tracking-tight">Access Denied</h1>
        <p className="text-gray-400 text-[14px] mb-8 max-w-xs">{error || 'Unable to load the sportsbook at this time.'}</p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
           <button 
             onClick={fetchSportsbookUrl}
             className="w-full h-12 bg-[#e8612c] text-white font-black rounded-lg uppercase tracking-wider"
           >
             Retry
           </button>
           <button 
             onClick={() => router.back()}
             className="w-full h-12 bg-white/5 text-gray-300 font-bold rounded-lg"
           >
             Go Back
           </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`fixed inset-0 ${isAuthenticated ? 'top-[34px]' : 'top-0'} z-[60] bg-black flex flex-col`}>
      {/* Header matching app style */}
      <div className="flex items-center justify-between px-3 h-14 bg-[#1a1a1a] border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-1 text-white/70 hover:text-white"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex items-center gap-1 group">
            <span className="text-xl font-black tracking-tighter text-[#e8612c]">PREMIUM</span>
            <span className="text-xl font-black text-white tracking-tighter uppercase">Sports</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <div className="h-8 px-3 rounded-full border border-white/10 bg-black/40 flex items-center gap-1.5">
             <span className="text-white text-[12px] font-black tracking-tight">
               ₹{user?.balance.toLocaleString() || '0'}
             </span>
           </div>
        </div>
      </div>

      {/* Sportsbook Iframe */}
      <div className="flex-1 relative bg-black overflow-hidden">
        <iframe
          src={url}
          className="w-full h-full border-0"
          allow="autoplay; fullscreen"
          id="premiumSportsbookFrame"
        />
      </div>
    </div>
  )
}
