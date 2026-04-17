'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, RefreshCw } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { userController } from '@/controllers/user/userController'

export default function ProfileDetailsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [turnoverMsg, setTurnoverMsg] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const fetchTurnover = async () => {
    if (!isAuthenticated || !user?.loginToken) return
    try {
      setLoading(true)
      const res = await userController.getTurnover(user.loginToken)
      if (res && res.error === '0') {
        setTurnoverMsg(res.msg || '')
      } else {
        setTurnoverMsg('Unable to fetch turnover details.')
      }
    } catch (err) {
      console.error('Failed to fetch turnover:', err)
      setTurnoverMsg('Error loading turnover data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTurnover()
  }, [isAuthenticated, user?.loginToken])

  return (
    <div className="bg-[#121212] min-h-screen text-white pb-20">
      {/* Sub Header */}
      <div className="flex items-center px-4 py-3 bg-[#1a1a1a] shadow-md">
        <button onClick={() => router.back()} className="text-white/80 pr-3">
          <ChevronLeft size={24} color="#e15b24" />
        </button>
        <h1 className="text-[17px] font-bold">Profile</h1>
      </div>

      <div className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[12px] font-bold uppercase tracking-widest text-[#e15b24]">Account Activity</h2>
            <button 
              onClick={fetchTurnover} 
              disabled={loading}
              className={`text-white/40 hover:text-white transition-all ${loading ? 'animate-spin' : ''}`}
            >
              <RefreshCw size={14} />
            </button>
          </div>

          <div className="bg-[#1a1a1a] p-5 rounded-xl border border-white/5 shadow-inner">
            {loading ? (
              <div className="flex items-center gap-3 py-2">
                <div className="w-4 h-4 border-2 border-[#e15b24] border-t-transparent rounded-full animate-spin" />
                <span className="text-[13px] text-white/50">Fetching turnover details...</span>
              </div>
            ) : (
              <div className="text-[14px] font-bold leading-relaxed tracking-tight text-white/90">
                {turnoverMsg || 'No turnover data available.'}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-14 border-t border-white/5" />
      </div>
    </div>
  )
}
