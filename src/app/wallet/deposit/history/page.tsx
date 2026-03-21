'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Loader2, Landmark, Clock, CheckCircle2, XCircle, AlertCircle, Phone, ArrowDownLeft } from 'lucide-react'
import { walletController } from '@/controllers'
import { useAuthStore } from '@/store/authStore'
import { formatDate } from '@/utils/format'

export default function DepositHistoryPage() {
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

        const response = await walletController.getDepositHistory(token) as any
        
        let historyData: any[] = []
        if (response) {
          if (Array.isArray(response)) {
            historyData = response
          } else if (response.data && Array.isArray(response.data)) {
            historyData = response.data
          } else if (response.list && Array.isArray(response.list)) {
            historyData = response.list
          } else {
            // Handle dictionary response (keys "0", "1", "2"...)
            const objValues = Object.values(response)
            const potentialItems = objValues.filter(v => v && typeof v === 'object' && ((v as any).Amount !== undefined || (v as any).amount !== undefined))
            if (potentialItems.length > 0) {
              historyData = potentialItems
            }
          }
        }
        setHistory(historyData)
      } catch (error) {
        console.error('Failed to fetch deposit history:', error)
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
        <h1 className="text-[15px] font-bold text-white uppercase tracking-tight">Deposit History</h1>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {history.length === 0 ? (
          <div className="bg-[#111] border border-white/5 rounded-2xl p-12 text-center shadow-xl">
             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-white/20" />
             </div>
             <p className="text-white/40 font-bold">No deposit records found.</p>
             <p className="text-[11px] text-white/20 mt-1">Your deposit requests will appear here once submitted.</p>
          </div>
        ) : (
          history.map((item: any, idx) => (
            <div key={idx} className="bg-[#111] border border-white/5 rounded-2xl p-5 space-y-4 hover:border-white/10 transition-colors shadow-lg group">
               <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-[#e8612c]/10 flex items-center justify-center text-[#e8612c]">
                        <ArrowDownLeft size={20} />
                     </div>
                     <div>
                        <p className="text-[13px] font-black uppercase tracking-tight text-white/80">{(item.bankname || item.name || item.Bank || 'Deposit').toUpperCase()}</p>
                        <p className="text-[10px] text-white/30 font-medium">UTR: {item.Utr || item.utr || 'N/A'}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-lg font-black text-[#e8612c]">₹ {parseFloat(item.Amount || item.amount || 0).toLocaleString()}</p>
                     <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{formatDate(item.Date || item.date || item.created_at)}</p>
                  </div>
               </div>

               <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div className="flex items-center gap-2">
                     {getStatusIcon(item.Status || item.status)}
                     <span className={`text-[11px] font-black uppercase tracking-wider ${getStatusColor(item.Status || item.status)}`}>
                        {item.Status || item.status || 'Pending'}
                     </span>
                  </div>
                  <button 
                    onClick={() => window.open('https://wa.me/', '_blank')}
                    className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-[#e8612c] transition-colors"
                  >
                     <Phone size={10} />
                     Support
                  </button>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
