'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Search, Calendar, X, Loader2, Trophy, XCircle } from 'lucide-react'
import { formatTime12h } from '@/utils/format'
import { useAuthStore } from '@/store/authStore'
import { userController } from '@/controllers/user/userController'
import { statementController } from '@/controllers/wallet/statementController'



const MarketCalendar = ({ 
  tempStartDate, 
  setTempStartDate, 
  tempEndDate, 
  setTempEndDate, 
  onClose, 
  onConfirm 
}: any) => {
  const [viewDate, setViewDate] = useState(new Date(tempEndDate || new Date()))
  const [isSelectingEnd, setIsSelectingEnd] = useState(false)
  
  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay()
  
  const month = viewDate.getMonth()
  const year = viewDate.getFullYear()
  const days = daysInMonth(month, year)
  const firstDay = firstDayOfMonth(month, year)
  const monthName = viewDate.toLocaleString('en-US', { month: 'long' })
  
  const calendarDays = []
  for (let i = 0; i < firstDay; i++) calendarDays.push(null)
  for (let i = 1; i <= days; i++) calendarDays.push(i)

  const handleDateClick = (clickedDate: Date) => {
    const d = new Date(clickedDate.getFullYear(), clickedDate.getMonth(), clickedDate.getDate())
    if (!isSelectingEnd) {
      setTempStartDate(d)
      setTempEndDate(d)
      setIsSelectingEnd(true)
    } else {
      if (d < tempStartDate) {
        setTempStartDate(d)
      } else {
        setTempEndDate(d)
        setIsSelectingEnd(false)
      }
    }
  }

  return (
    <div className="absolute top-[42px] left-0 md:left-auto md:right-0 z-[100] w-[320px] shadow-2xl" onClick={e => e.stopPropagation()}>
      <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <button onClick={() => setViewDate(new Date(year, month - 1, 1))}><ChevronLeft size={18} className="text-gray-400" /></button>
          <h3 className="text-[14px] font-bold text-gray-700">{monthName} {year}</h3>
          <button onClick={() => setViewDate(new Date(year, month + 1, 1))}><ChevronRight size={18} className="text-gray-400" /></button>
        </div>
        <div className="grid grid-cols-7 px-4 pt-4 text-center">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <span key={d} className="text-[11px] text-gray-400 font-bold pb-2">{d}</span>)}
        </div>
        <div className="grid grid-cols-7 px-4 pb-6 text-center gap-y-1">
          {calendarDays.map((day, idx) => {
            if (day === null) return <div key={`empty-${idx}`} />
            const d = new Date(year, month, day)
            const isStart = d.getTime() === tempStartDate.getTime()
            const isEnd = d.getTime() === tempEndDate.getTime()
            const inRange = d > tempStartDate && d < tempEndDate
            return (
              <button key={day} onClick={() => handleDateClick(d)}
                className={`relative flex items-center justify-center h-8 w-8 text-[12px] rounded-full transition-all
                  ${isStart || isEnd ? 'bg-[#e15b24] text-white font-bold' : inRange ? 'bg-[#e15b24]/10 text-[#e15b24]' : 'text-gray-600 hover:bg-gray-100'}
                `}>{day}</button>
            )
          })}
        </div>
        <div className="flex justify-end gap-6 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button onClick={onClose} className="text-gray-400 text-[12px] font-bold">CANCEL</button>
          <button onClick={onConfirm} className="text-[#e15b24] text-[12px] font-bold">OK</button>
        </div>
      </div>
    </div>
  )
}

export default function ProfitLossPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  
  const [selectedGame, setSelectedGame] = useState('All')
  const [isGameDropdownOpen, setIsGameDropdownOpen] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  
  // Date states
  const today = new Date()
  const lastMonth = new Date()
  lastMonth.setMonth(today.getMonth() - 1)
  
  const [startDate, setStartDate] = useState(lastMonth)
  const [endDate, setEndDate] = useState(today)
  const [tempStartDate, setTempStartDate] = useState(lastMonth)
  const [tempEndDate, setTempEndDate] = useState(today)
  
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Bet statement popup state
  const [betModalOpen, setBetModalOpen] = useState(false)
  const [betLoading, setBetLoading] = useState(false)
  const [betData, setBetData] = useState<any>(null)

  const gameOptions = React.useMemo(() => {
    const types = results.map(item => item.Type).filter(Boolean)
    return ['All', ...Array.from(new Set(types))]
  }, [results])

  useEffect(() => {
    if (!gameOptions.includes(selectedGame)) {
      setSelectedGame('All')
    }
  }, [gameOptions, selectedGame])

  const formatDateLabel = (date: Date) => {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const formatAPIDate = (date: Date) => {
    const d = new Date(date)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}-${month}-${year}`
  }

  const fetchPL = async () => {
    if (!isAuthenticated || !user?.loginToken) return
    try {
      setLoading(true)
      const res = await userController.getAccountStatement(
        user.loginToken,
        formatAPIDate(startDate),
        formatAPIDate(endDate)
      )
      if (res && typeof res === 'object' && !res.error) {
        const dataArray = Object.values(res).filter(item => typeof item === 'object' && item !== null)
        setResults(dataArray)
      } else {
        setResults([])
      }
    } catch (err) {
      console.error('Failed to fetch P&L:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPL()
  }, [startDate, endDate])

  const sortedResults = React.useMemo(() => {
    const filtered = results.filter(item => {
      if (selectedGame === 'All') return true
      return item.Type === selectedGame
    })

    return [...filtered].sort((a, b) => {
      const parse = (str: string) => {
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
      return parse(b.DateTime) - parse(a.DateTime)
    })
  }, [results, selectedGame])

  const [collapsedItems, setCollapsedItems] = useState<Record<number, boolean>>({})

  const toggleCollapse = (idx: number) => {
    setCollapsedItems(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }))
  }

  const handleCardClick = async (eid: any) => {
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

  const totalPL = results.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0)
  const currentTotal = sortedResults.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0)

  return (
    <div className="bg-[#181818] min-h-screen text-white pb-20 font-sans">
      {/* Black Header */}
      <div className="flex items-center px-4 h-14 bg-[#111111] border-b border-white/5 sticky top-0 z-50">
        <button onClick={() => router.back()} className="text-[#e8612c] mr-4">
          <ChevronLeft size={22} strokeWidth={3} />
        </button>
        <div className="flex items-center gap-2">
           <h1 className="text-[15px] font-bold text-white">Profit & Loss</h1>
           <span className="text-[12px] text-gray-500 font-bold ml-2">Total P&L : <span className={totalPL >= 0 ? 'text-[#4caf50]' : 'text-[#f44336]'}>{totalPL.toLocaleString()}</span></span>
        </div>
      </div>

      <div className="p-4 w-full flex flex-col items-center">
        <div className="w-full max-w-[1000px] px-2 md:px-10">
          <div className="flex flex-col lg:flex-row items-center gap-4 mb-4 w-full">
            <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
                <div className="relative w-full md:w-[220px]">
                  <div 
                    onClick={() => setIsGameDropdownOpen(!isGameDropdownOpen)}
                    className="w-full bg-[#111] border border-white/20 rounded-full h-10 flex items-center justify-between px-4 cursor-pointer relative"
                  >
                    <label className="absolute -top-2 left-4 px-1 bg-[#181818] text-[9px] text-[#e8612c] font-bold z-10">Games</label>
                    <span className="text-[13px] text-white">{selectedGame}</span>
                    <ChevronDown size={14} className="text-white" />
                  </div>
                  
                  {isGameDropdownOpen && (
                    <div className="absolute top-[42px] left-0 right-0 bg-[#222] border border-white/10 rounded-lg overflow-hidden z-[60] shadow-2xl">
                      {gameOptions.map((opt: any) => (
                        <div key={opt} onClick={() => { setSelectedGame(opt); setIsGameDropdownOpen(false); }}
                          className={`px-4 py-3 text-[13px] hover:bg-[#282828] cursor-pointer transition-colors ${selectedGame === opt ? 'bg-[#4a2618] text-[#e8612c] font-bold' : 'text-gray-300'}`}>
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div onClick={() => setIsCalendarOpen(true)} className="relative w-full md:w-[260px] cursor-pointer">
                  <div className="w-full bg-[#111] border border-white/20 rounded-full h-10 flex items-center justify-between px-4 relative">
                    <label className="absolute -top-2 left-4 px-1 bg-[#181818] text-[9px] text-[#e8612c] font-bold z-10">Select Dates</label>
                    <span className="text-[11px] font-semibold text-white">
                      {formatDateLabel(startDate)} - {formatDateLabel(endDate)}
                    </span>
                  </div>
                  {isCalendarOpen && (
                    <MarketCalendar 
                      tempStartDate={tempStartDate}
                      setTempStartDate={setTempStartDate}
                      tempEndDate={tempEndDate}
                      setTempEndDate={setTempEndDate}
                      onClose={() => setIsCalendarOpen(false)}
                      onConfirm={() => {
                        setStartDate(tempStartDate)
                        setEndDate(tempEndDate)
                        setIsCalendarOpen(false)
                      }}
                    />
                  )}
                </div>
            </div>

            <button onClick={fetchPL} className="bg-[#e15b24] text-white rounded-full h-10 px-12 flex-initial flex items-center justify-center font-bold text-[13px] uppercase tracking-widest transition-all active:scale-[0.98] min-w-[170px]">
                SEARCH
            </button>
          </div>

          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#e15b24] bg-black gap-1.5 mb-6">
            <span className="text-[12px] font-bold text-white tracking-tight">{selectedGame} :</span>
            <span className={`text-[12px] font-bold ${currentTotal >= 0 ? 'text-[#4caf50]' : 'text-[#f44336]'}`}>
              {currentTotal.toLocaleString()}
            </span>
          </div>

        <div className="space-y-4">
           {loading ? (
             <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-[#e8612c] border-t-transparent rounded-full animate-spin" />
             </div>
           ) : sortedResults.length > 0 ? (
             sortedResults.map((item: any, idx) => {
               const amount = parseFloat(item.amount || 0)
               const isPositive = amount >= 0
               const isCollapsed = collapsedItems[idx]
               return (
                 <div key={idx} className="overflow-hidden rounded-lg bg-white border border-white/10 shadow-lg">
                   <div 
                    onClick={() => toggleCollapse(idx)}
                    className="bg-[#e15b24] px-4 py-2 flex items-center justify-between cursor-pointer hover:brightness-95 transition-all select-none"
                   >
                      <span className="text-white text-[12px] font-medium">{formatTime12h(item.DateTime)}</span>
                      {isCollapsed ? <ChevronDown size={16} className="text-white" /> : <ChevronUp size={16} className="text-white" />}
                   </div>
                   {!isCollapsed && (
                     <div className="px-4 py-3 text-black bg-white flex justify-between items-start animate-in slide-in-from-top-2 duration-200">
                        <div className="flex flex-col gap-0.5">
                           <span className="text-[11px] font-bold text-black uppercase tracking-tight opacity-50">Game Activity</span>
                           <h4 className="text-[12px] font-bold text-[#007bff]">{item.GameName}</h4>
                           <p className="text-[11px] text-gray-500">Timestamp: {formatTime12h(item.DateTime)}</p>
                           {item.Eid && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleCardClick(item.Eid); }}
                                className="mt-2 flex items-center gap-1 text-[10px] font-bold text-[#e15b24] hover:underline"
                              >
                                View Bet Details →
                              </button>
                           )}
                        </div>
                        <div className="flex flex-col items-end gap-1 min-w-[100px]">
                           <div className="flex items-center gap-1">
                              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">Net Win:</span>
                              <span className={`text-[12px] font-black ${isPositive ? 'text-[#4caf50]' : 'text-[#f44336]'}`}>
                                 {isPositive ? '+' : ''}{amount.toLocaleString()}
                              </span>
                           </div>
                           <span className="text-[8px] font-black uppercase tracking-widest text-gray-300">Settled</span>
                        </div>
                     </div>
                   )}
                 </div>
               )
             })
           ) : (
             <div className="bg-[#111] p-20 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-4">
                <Calendar size={48} className="text-gray-700" />
                <p className="text-gray-500 font-bold uppercase text-[11px] tracking-widest">No transaction found for the selected period.</p>
             </div>
           )}
        </div>
        </div>
      </div>

       {isGameDropdownOpen && <div className="fixed inset-0 z-50" onClick={() => setIsGameDropdownOpen(false)} />}
      {isCalendarOpen && <div className="fixed inset-0 z-50" onClick={() => setIsCalendarOpen(false)} />}

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
                  {Object.values(betData || {})
                    .filter((bet: any) => typeof bet === 'object' && bet !== null)
                    .map((bet: any, idx: number) => {
                      const isBack = bet.Type?.toLowerCase() === 'back'
                      return (
                        <div key={idx} className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3">
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
