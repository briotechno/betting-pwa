'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronDown, Calendar, Loader2 } from 'lucide-react'
import { statementController } from '@/controllers'
import { useAuthStore } from '@/store/authStore'

export default function TransactionsPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('DEPOSIT')
  const [loading, setLoading] = useState(false)
  const [transactions, setTransactions] = useState<any[]>([])
  
  // States for filters
  const [fromDate, setFromDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0])
  const [transactionFilter, setTransactionFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const fetchTransactions = useCallback(async () => {
    if (!user?.loginToken) return
    setLoading(true)
    try {
      const res = await statementController.getAccountStatement(user.loginToken, fromDate, toDate)
      if (res && typeof res === 'object') {
        const dataArray = Object.entries(res)
          .filter(([key]) => !isNaN(Number(key))) 
          .map(([_, value]) => value as any)
        setTransactions(dataArray)
      } else {
        setTransactions([])
      }
    } catch (err) {
      console.error('Failed to fetch transactions:', err)
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }, [user?.loginToken, fromDate, toDate])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const handleApply = () => {
    fetchTransactions()
  }

  // Filter transactions
  const filteredTransactions = transactions.filter(tx => {
    const typeKey = (tx["2"] || '').toUpperCase().trim()
    const description = (tx["3"] || '').toLowerCase()
    
    const isCredit = typeKey === 'D' || typeKey === 'CR' || typeKey === 'O'
    const isDebit = typeKey === 'W' || typeKey === 'DR'
    
    if (transactionFilter !== 'All') {
      const isActualDeposit = typeKey === 'D' || (typeKey === 'CR' && (description.includes('deposit') || description.includes('topup')))
      const isActualWithdraw = typeKey === 'W' || (typeKey === 'DR' && (description.includes('withdraw') || description.includes('payout')))
      if (transactionFilter === 'Deposit' && !isActualDeposit) return false
      if (transactionFilter === 'Withdraw' && !isActualWithdraw) return false
    } else {
      if (activeTab === 'DEPOSIT' && !isCredit) return false
      if (activeTab === 'WITHDRAW' && !isDebit) return false
    }

    if (statusFilter !== 'All' && statusFilter === 'Pending') return false
    return true
  })

  const getCategoryTheme = (typeKey: string, description: string) => {
    const desc = description.toLowerCase()
    const isActualDeposit = typeKey === 'D' || (typeKey === 'CR' && (desc.includes('deposit') || desc.includes('topup')))
    const isActualWithdraw = typeKey === 'W' || (typeKey === 'DR' && (desc.includes('withdraw') || desc.includes('payout')))
    
    if (isActualDeposit) return { label: 'DEPOSIT' }
    if (isActualWithdraw) return { label: 'WITHDRAW' }
    if (typeKey === 'CR') return { label: 'WIN' }
    if (typeKey === 'DR') return { label: 'LOSS' }
    if (typeKey === 'O') return { label: 'OPENING' }
    return { label: 'OTHER' }
  }

  const [isFromCalendarOpen, setIsFromCalendarOpen] = useState(false)
  const [isToCalendarOpen, setIsToCalendarOpen] = useState(false)

  const ThemedCalendarModal = ({ value, onChange, onClose }: any) => {
    const [viewDate, setViewDate] = useState(new Date(value))
    const [selectedDate, setSelectedDate] = useState(new Date(value))
    const month = viewDate.getMonth()
    const year = viewDate.getFullYear()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()
    const calendarDays = []
    for (let i = 0; i < firstDay; i++) calendarDays.push(null)
    for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i)
    const dateString = selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-6">
        <div className="bg-[#333] rounded-lg w-[320px] overflow-hidden shadow-2xl">
          <div className="bg-[#e15b24] p-5">
            <p className="text-white/80 text-[12px] font-medium">{selectedDate.getFullYear()}</p>
            <h2 className="text-white text-[24px] font-bold leading-tight">{dateString}</h2>
          </div>
          <div className="p-4 flex flex-col items-center">
             <div className="flex items-center justify-between w-full mb-6">
                <button onClick={() => setViewDate(new Date(year, month - 1, 1))}><ChevronLeft size={18} className="text-gray-400" /></button>
                <h3 className="text-white text-[14px] font-bold">{viewDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</h3>
                <button onClick={() => setViewDate(new Date(year, month + 1, 1))}><ChevronLeft size={18} className="text-gray-400 rotate-180" /></button>
             </div>
             <div className="grid grid-cols-7 w-full text-center gap-y-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (<span key={d} className="text-[11px] text-gray-500 font-bold h-8 flex items-center justify-center">{d}</span>))}
                {calendarDays.map((day, ix) => {
                  if (day === null) return <div key={ix} />
                  const isS = selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year
                  return (
                    <button key={day} onClick={() => setSelectedDate(new Date(year, month, day))}
                      className={`text-[12px] h-9 w-9 flex items-center justify-center rounded-full transition-all ${isS ? 'bg-[#e15b24] text-white font-bold' : 'text-gray-300 hover:bg-white/5'}`}>{day}</button>
                  )
                })}
             </div>
          </div>
          <div className="flex justify-end gap-8 px-6 py-4 mt-2">
            <button onClick={onClose} className="text-[#e15b24] text-[13px] font-bold">CANCEL</button>
            <button onClick={() => { onChange(selectedDate); onClose(); }} className="text-[#e15b24] text-[13px] font-bold">OK</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#111111] min-h-screen text-white flex flex-col pb-0">
      <div className="flex items-center px-4 py-3 bg-[#111] border-b border-white/5">
        <button onClick={() => router.back()} className="text-[#e8612c] pr-3"><ChevronLeft size={22} className="stroke-[3]" /></button>
        <h1 className="text-[15px] font-bold uppercase tracking-wide">My Transactions</h1>
      </div>

      <div className="px-4 py-6 bg-[#1a1a1a] border-b border-white/5 space-y-5">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 space-y-1.5">
            <label className="text-[10px] font-bold text-[#666] pl-1">From:</label>
            <div onClick={() => setIsFromCalendarOpen(true)} className="relative cursor-pointer">
              <div className="w-full bg-[#111] border border-white/20 rounded-full h-10 flex items-center px-4 text-white text-[12px]">{fromDate}</div>
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" size={14} />
            </div>
            {isFromCalendarOpen && <ThemedCalendarModal value={new Date(fromDate)} onChange={(date: Date) => setFromDate(date.toISOString().split('T')[0])} onClose={() => setIsFromCalendarOpen(false)} />}
          </div>
          <div className="flex-1 space-y-1.5">
            <label className="text-[10px] font-bold text-[#666] pl-1">To:</label>
            <div onClick={() => setIsToCalendarOpen(true)} className="relative cursor-pointer">
              <div className="w-full bg-[#111] border border-white/20 rounded-full h-10 flex items-center px-4 text-white text-[12px]">{toDate}</div>
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" size={14} />
            </div>
            {isToCalendarOpen && <ThemedCalendarModal value={new Date(toDate)} onChange={(date: Date) => setToDate(date.toISOString().split('T')[0])} onClose={() => setIsToCalendarOpen(false)} />}
          </div>
          <div className="flex-1 space-y-1.5">
            <label className="text-[10px] font-bold text-[#666] pl-1">Sort by Transaction:</label>
            <div className="relative">
              <select value={transactionFilter} onChange={(e) => setTransactionFilter(e.target.value)}
                className="w-full bg-[#111] border border-white/20 rounded-full h-10 px-4 text-white text-[12px] outline-none appearance-none cursor-pointer">
                <option value="All">All</option><option value="Deposit">Deposit</option><option value="Withdraw">Withdraw</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" size={14} />
            </div>
          </div>
          <div className="flex-1 space-y-1.5">
            <label className="text-[10px] font-bold text-[#666] pl-1">Sort by Status:</label>
            <div className="relative">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-[#111] border border-white/20 rounded-full h-10 px-4 text-white text-[12px] outline-none appearance-none cursor-pointer">
                <option value="All">All</option><option value="Confirmed">Confirmed</option><option value="Pending">Pending</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" size={14} />
            </div>
          </div>
        </div>
        <button onClick={handleApply} disabled={loading}
          className="w-[200px] h-10 bg-[#e15b24] text-white rounded-full text-[12px] font-bold uppercase tracking-widest active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'APPLY'}
        </button>
      </div>

      <div className="flex px-4 pt-4 border-b border-white/5 bg-[#111]">
        {['DEPOSIT', 'WITHDRAW'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`mr-8 pb-3 text-[11px] font-black tracking-widest transition-all ${activeTab === tab ? 'text-white border-b-2 border-[#e8612c]' : 'text-white/40'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 pb-20 overflow-y-auto bg-[#111]">
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 max-w-[1600px]">
          {loading ? (
             <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-30">
               <Loader2 className="w-10 h-10 animate-spin text-[#e8612c] mb-3" />
               <p className="text-[10px] font-black uppercase text-white tracking-widest">Updating Ledger...</p>
             </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="col-span-full flex justify-center pt-8 text-white/30 font-bold uppercase text-[12px] tracking-widest">No Records Found</div>
          ) : (
            filteredTransactions.map((tx, idx) => {
              const amount = parseFloat(tx["1"] || 0)
              const typeKey = (tx["2"] || '').toUpperCase().trim()
              const date = tx["0"]
              const description = tx["3"]?.replace(/&nbsp;/g, ' ').replace(/Transcation/g, '').replace(/^\s*\/+\s*/, '') || ''
              const { label } = getCategoryTheme(typeKey, description)
              const utrMatch = description.match(/\d{10,}/)
              const utr = utrMatch ? utrMatch[0] : 'N/A'

              return (
                <div key={idx} className="bg-[#1a1a1a] border border-[#e15b24]/30 rounded-lg overflow-hidden w-full">
                  <div className="px-2.5 py-1.5 flex justify-between items-center bg-[#1a1a1a]">
                    <div className="flex items-center gap-1"><span className="text-[9px] text-gray-400 font-bold">Amount:</span><span className="text-[9px] text-white font-black">{Math.abs(amount).toLocaleString()}</span></div>
                    <div className="flex items-center gap-1"><span className="text-[9px] text-gray-400 font-bold">Status:</span><span className="text-[9px] text-[#4caf50] font-black">Complete</span></div>
                  </div>
                  <div className="h-[1px] bg-white/5 w-full" />
                  <div className="p-2.5 grid grid-cols-2 gap-x-2 gap-y-1.5">
                    <div><p className="text-[9px] text-white font-black mb-0">Type:</p><p className="text-[8px] text-gray-400 font-medium truncate">{label}</p></div>
                    <div><p className="text-[9px] text-white font-black mb-0">Transaction ID:</p><p className="text-[8px] text-gray-400 font-medium truncate">{tx["4"] || 'N/A'}</p></div>
                    <div><p className="text-[9px] text-white font-black mb-0">Request Date:</p><p className="text-[8px] text-gray-400 font-medium truncate">{date.split(' ')[0]}</p></div>
                    <div><p className="text-[9px] text-white font-black mb-0">Approved Date:</p><p className="text-[8px] text-gray-400 font-medium truncate">{date.split(' ')[0]}</p></div>
                    <div className="col-span-2"><p className="text-[9px] text-white font-black mb-0">UTR:</p><p className="text-[8px] text-gray-400 font-medium truncate">{utr}</p></div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
