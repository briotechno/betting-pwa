'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronDown, Calendar, Loader2, X, Trophy, XCircle } from 'lucide-react'
import { statementController } from '@/controllers'
import { useAuthStore } from '@/store/authStore'
import { formatTime12h } from '@/utils/format'

export default function TransactionsPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('ALL')
  const [loading, setLoading] = useState(false)
  const [transactions, setTransactions] = useState<any[]>([])
  
  // Bet statement popup state
  const [betModalOpen, setBetModalOpen] = useState(false)
  const [betLoading, setBetLoading] = useState(false)
  const [betData, setBetData] = useState<any>(null)

  // States for filters
  const [fromDate, setFromDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0])


  const fetchTransactions = useCallback(async () => {
    if (!user?.loginToken) return
    setLoading(true)
    try {
      const res = await statementController.getAccountStatement(user.loginToken, fromDate, toDate)
      if (res && typeof res === 'object') {
        const dataArray = Object.entries(res)
          .filter(([key]) => !isNaN(Number(key))) 
          .map(([_, value]) => value as any)
        
        // Sort descending: newest first
        const sorted = dataArray.sort((a, b) => {
          const parseDate = (str: string) => {
            if (!str) return 0;
            const parts = str.split(' ')
            if (parts.length === 2) {
              const dateParts = parts[0].split('-')
              const timeParts = parts[1].split(':')
              if (dateParts.length === 3 && timeParts.length >= 2) {
                return new Date(
                  parseInt(dateParts[2]), 
                  parseInt(dateParts[1]) - 1, 
                  parseInt(dateParts[0]),
                  parseInt(timeParts[0]),
                  parseInt(timeParts[1]),
                  parseInt(timeParts[2] || '0')
                ).getTime()
              }
            }
            return new Date(str).getTime() || 0;
          }
          return parseDate(b["0"]) - parseDate(a["0"])
        })
        setTransactions(sorted)
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

  // Handle clicking a Win/Loss card to open bet details popup
  const handleCardClick = async (tx: any) => {
    const eid = tx["4"]
    if (!eid || !eid.toString().trim()) return
    
    setBetModalOpen(true)
    setBetLoading(true)
    setBetData(null)
    try {
      const res = await statementController.getBetStatement(eid.toString(), user?.loginToken || '')
      if (res && res.error !== '1') {
        setBetData(res)
      } else {
        setBetData({ error: '1', msg: res?.msg || 'No Bet List Found' })
      }
    } catch (err) {
      console.error('Failed to fetch bet statement:', err)
      setBetData({ error: '1', msg: 'Failed to load bet details' })
    } finally {
      setBetLoading(false)
    }
  }

  // Filter transactions based on active tab
  const filteredTransactions = transactions.filter(tx => {
    if (activeTab === 'ALL') return true
    const typeKey = (tx["2"] || '').toUpperCase().trim()
    const description = (tx["3"] || '').toLowerCase()
    
    const isDepositDescr = description.includes('deposit') || description.includes('topup')
    const isWithdrawDescr = description.includes('withdraw') || description.includes('payout')

    if (activeTab === 'DEPOSIT') {
      if (typeKey === 'D' || typeKey === 'O') return true;
      if (typeKey === 'W' || typeKey === 'DR') return false;
      return isDepositDescr;
    }
    if (activeTab === 'WITHDRAW') {
      if (typeKey === 'W') return true;
      if (typeKey === 'D' || typeKey === 'CR' || typeKey === 'O') return false;
      return isWithdrawDescr;
    }
    if (activeTab === 'WIN') {
      return typeKey === 'CR' && !isDepositDescr
    }
    if (activeTab === 'LOSS') {
      return typeKey === 'DR' && !isWithdrawDescr
    }

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

  const formatDateLocal = (date: Date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

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
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (<span key={`${d}-${i}`} className="text-[11px] text-gray-500 font-bold h-8 flex items-center justify-center">{d}</span>))}
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
            {isFromCalendarOpen && <ThemedCalendarModal value={new Date(fromDate)} onChange={(date: Date) => setFromDate(formatDateLocal(date))} onClose={() => setIsFromCalendarOpen(false)} />}
          </div>
          <div className="flex-1 space-y-1.5">
            <label className="text-[10px] font-bold text-[#666] pl-1">To:</label>
            <div onClick={() => setIsToCalendarOpen(true)} className="relative cursor-pointer">
              <div className="w-full bg-[#111] border border-white/20 rounded-full h-10 flex items-center px-4 text-white text-[12px]">{toDate}</div>
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" size={14} />
            </div>
            {isToCalendarOpen && <ThemedCalendarModal value={new Date(toDate)} onChange={(date: Date) => setToDate(formatDateLocal(date))} onClose={() => setIsToCalendarOpen(false)} />}
          </div>
        </div>
        <button onClick={handleApply} disabled={loading}
          className="w-[200px] h-10 bg-[#e15b24] text-white rounded-full text-[12px] font-bold uppercase tracking-widest active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'APPLY'}
        </button>
      </div>

      {/* Tabs: DEPOSIT, WITHDRAW, WIN, LOSS */}
      <div className="flex px-4 pt-4 border-b border-white/5 bg-[#111]">
        {['ALL', 'DEPOSIT', 'WITHDRAW', 'WIN', 'LOSS'].map((tab) => (
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
              const hasEid = !!(tx["4"] && tx["4"].toString().trim())
              const isWinLoss = (activeTab === 'WIN' || activeTab === 'LOSS')
              const isClickable = isWinLoss && hasEid

              return (
                <div 
                  key={idx} 
                  className={`bg-[#1a1a1a] border border-[#e15b24]/30 rounded-lg overflow-hidden w-full ${isClickable ? 'cursor-pointer active:scale-[0.98] transition-transform hover:border-[#e15b24]/60' : ''}`}
                  onClick={() => isClickable && handleCardClick(tx)}
                >
                  <div className="px-2.5 py-1.5 flex justify-between items-center bg-[#1a1a1a]">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] text-gray-400 font-bold">Amount:</span>
                      <span className={`text-[9px] font-black ${typeKey === 'CR' || typeKey === 'D' || typeKey === 'O' ? 'text-green-400' : 'text-red-400'}`}>
                        {typeKey === 'CR' || typeKey === 'D' || typeKey === 'O' ? '+' : '-'}
                        {Math.abs(amount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="h-[1px] bg-white/5 w-full" />
                  <div className="p-2.5 grid grid-cols-2 gap-x-2 gap-y-1.5">
                    <div>
                      <p className="text-[9px] text-white font-black mb-0">Type:</p>
                      <p className={`text-[8px] font-bold ${label === 'WIN' ? 'text-green-400' : label === 'LOSS' ? 'text-red-400' : 'text-gray-400'}`}>{label}</p>
                    </div>

                    {isWinLoss ? (
                      <>
                        <div>
                          <p className="text-[9px] text-white font-black mb-0">Event ID:</p>
                          <p className="text-[8px] text-gray-400 font-medium truncate">{tx["4"] || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-white font-black mb-0">Date:</p>
                          <p className="text-[8px] text-gray-400 font-medium truncate">{formatTime12h(date).split(' ')[0]}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-white font-black mb-0">Time:</p>
                          <p className="text-[8px] text-gray-400 font-medium truncate">
                            {formatTime12h(date).split(' ')[1]} {formatTime12h(date).split(' ')[2]}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-[9px] text-white font-black mb-0">Details:</p>
                          <p className="text-[8px] text-gray-400 font-medium whitespace-normal">{description || 'N/A'}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-[9px] text-white font-black mb-0">Date:</p>
                          <p className="text-[8px] text-gray-400 font-medium truncate">{formatTime12h(date)}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-[9px] text-white font-black mb-0">Description:</p>
                          <p className="text-[8px] text-gray-400 font-medium whitespace-normal">{description || 'N/A'}</p>
                        </div>
                      </>
                    )}
                  </div>
                  {isClickable && (
                    <div className="px-2.5 pb-2">
                      <div className="text-[8px] text-[#e15b24] font-black uppercase tracking-widest text-center">Tap to view bet details →</div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Bet Statement Popup/Modal */}
      {betModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setBetModalOpen(false)} />
          <div className="relative z-10 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#111]">
              <h3 className="text-[13px] font-black text-white uppercase tracking-tight">Bet Statement</h3>
              <button onClick={() => setBetModalOpen(false)} className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {betLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-10 h-10 animate-spin text-[#e8612c] mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Loading Bet Details...</p>
                </div>
              ) : betData?.error === '1' ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle size={28} />
                  </div>
                  <p className="text-red-400 uppercase font-black text-[10px] tracking-widest">{betData.msg}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(betData || {})
                    .filter(([key]) => !isNaN(Number(key)))
                    .map(([key, bet]: [string, any]) => {
                      const isBack = bet.Type?.toLowerCase() === 'back'
                      return (
                        <div key={key} className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3">
                          {/* Game Name + Type Badge */}
                          <div className="flex items-start justify-between border-b border-white/5 pb-3">
                            <p className="text-[11px] font-black text-white uppercase tracking-tight leading-relaxed">
                              {bet.Game?.replace(/&nbsp;/g, ' ')}
                            </p>
                            <span className={`px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-wider ${isBack ? 'bg-blue-500/20 text-blue-400' : 'bg-pink-500/20 text-pink-400'}`}>
                              {bet.Type}
                            </span>
                          </div>

                          {/* Bet Details Grid */}
                          <div className="grid grid-cols-2 gap-y-3">
                            <div>
                              <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Selection</p>
                              <p className="text-[11px] font-bold text-white uppercase">{bet.Selection}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Date</p>
                              <p className="text-[9px] font-medium text-white/60">{formatTime12h(bet.Date)}</p>
                            </div>
                            <div>
                              <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Rate</p>
                              <p className="text-[13px] font-black text-[#e8612c] tracking-tighter">{bet.Rate}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Stake</p>
                              <p className="text-[13px] font-black text-white tracking-tighter">₹{parseFloat(bet.Stake || '0').toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  
                  <button 
                    onClick={() => setBetModalOpen(false)}
                    className="w-full py-3 bg-[#e15b24] text-white font-black uppercase tracking-widest text-[11px] rounded-lg hover:brightness-110 active:scale-[0.98] transition-all mt-1"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
