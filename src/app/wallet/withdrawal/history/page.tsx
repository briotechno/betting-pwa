'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Loader2, Landmark, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { walletController } from '@/controllers'
import { useAuthStore } from '@/store/authStore'
import { formatDate } from '@/utils/format'

export default function WithdrawalHistoryPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    const fetchHistory = async () => {
      if (!isAuthenticated) {
        setLoading(false)
        return
      }

      try {
        const token = localStorage.getItem('fairbet-auth') ? 
          JSON.parse(localStorage.getItem('fairbet-auth')!).state.user?.loginToken : null
        
        if (!token) return

        const response = await walletController.getWithdrawalHistory(token)
        if (response.error === '0') {
          setHistory(Array.isArray(response.data) ? response.data : response.list || [])
        }
      } catch (error) {
        console.error('Failed to fetch withdrawal history:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [isAuthenticated])

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'completed':
      case 'approved':
        return <CheckCircle2 size={16} className="text-[#4caf50]" />
      case 'rejected':
      case 'cancelled':
      case 'failed':
        return <XCircle size={16} className="text-[#f44336]" />
      default:
        return <Clock size={16} className="text-[#ff9800]" />
    }
  }

  const getStatusColor = (status: string) => {
     switch (status?.toLowerCase()) {
      case 'success':
      case 'completed':
      case 'approved':
        return 'text-[#4caf50]'
      case 'rejected':
      case 'cancelled':
      case 'failed':
        return 'text-[#f44336]'
      default:
        return 'text-[#ff9800]'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#181818] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#e8612c]" size={40} />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24 bg-[#181818] text-white">
      {/* Sub Header */}
      <div className="flex items-center px-4 py-3 sticky top-0 z-20 bg-[#222222] border-b border-white/5">
        <button onClick={() => router.back()} className="text-[#e8612c] pr-3">
          <ChevronLeft size={22} strokeWidth={3} />
        </button>
        <h1 className="text-[15px] font-bold text-white uppercase tracking-tight">Withdrawal History</h1>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {history.length === 0 ? (
          <div className="bg-[#111] border border-white/5 rounded-2xl p-12 text-center shadow-xl">
             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-white/20" />
             </div>
             <p className="text-white/40 font-bold">No withdrawal records found.</p>
             <p className="text-[11px] text-white/20 mt-1">Your transaction requests will appear here once submitted.</p>
          </div>
        ) : (
          history.map((item: any, idx) => (
            <div key={idx} className="bg-[#111] border border-white/5 rounded-2xl p-5 space-y-4 hover:border-white/10 transition-colors shadow-lg">
               <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                        <Landmark size={20} className="text-white/40" />
                     </div>
                     <div>
                        <p className="text-[13px] font-black uppercase tracking-tight text-white/80">{item.Bank || 'Bank Transfer'}</p>
                        <p className="text-[10px] text-white/30 font-medium">Txn ID: {item.transid || item.id || 'N/A'}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-lg font-black text-[#e8612c]">₹ {parseFloat(item.Amount || item.amount).toLocaleString()}</p>
                     <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{formatDate(item.date || item.created_at)}</p>
                  </div>
               </div>

               <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div className="flex items-center gap-2">
                     {getStatusIcon(item.status)}
                     <span className={`text-[11px] font-black uppercase tracking-wider ${getStatusColor(item.status)}`}>
                        {item.status || 'Pending'}
                     </span>
                  </div>
                  {item.ACno && (
                    <p className="text-[11px] text-white/30 font-bold">A/C: ****{String(item.ACno).slice(-4)}</p>
                  )}
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
