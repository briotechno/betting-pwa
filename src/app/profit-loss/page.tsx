'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Search, Calendar, X } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { userController } from '@/controllers/user/userController'

const GAME_OPTIONS = [
  'All',
  'Live Casino',
  'Sportsbook',
  'Card Games',
  'Premium Sportsbook',
  'Racing'
]

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
        // Transform the dictionary response into an array if needed
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
  }, [])

  // Simple Calendar Component
  const MarketCalendar = () => {
    const [viewDate, setViewDate] = useState(new Date(tempEndDate))
    
    // Calendar logic
    const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay()
    
    const month = viewDate.getMonth()
    const year = viewDate.getFullYear()
    const days = daysInMonth(month, year)
    const firstDay = firstDayOfMonth(month, year)
    
    const monthName = viewDate.toLocaleString('en-US', { month: 'long' })
    
    const calendarDays = []
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null)
    }
    for (let i = 1; i <= days; i++) {
      calendarDays.push(i)
    }

    return (
      <div className="absolute top-[42px] left-0 md:left-auto md:right-0 z-[100] w-[320px] shadow-2xl">
        <div className="bg-white rounded-lg overflow-hidden border border-gray-100">
          {/* Calendar Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <button onClick={() => setViewDate(new Date(year, month - 1, 1))}>
              <ChevronLeft size={20} className="text-gray-400" />
            </button>
            <h3 className="text-[16px] font-bold text-gray-700">{monthName} {year}</h3>
            <button onClick={() => setViewDate(new Date(year, month + 1, 1))}>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </div>
          
          {/* Week Days */}
          <div className="grid grid-cols-7 px-4 pt-4 text-center">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
              <span key={d} className="text-[12px] text-gray-400 font-medium pb-2">{d}</span>
            ))}
          </div>
          
          {/* Days Grid */}
          <div className="grid grid-cols-7 px-4 pb-6 text-center gap-y-1">
            {calendarDays.map((day, idx) => {
              if (day === null) return <div key={`empty-${idx}`} />
              
              const isSelected = (
                (tempStartDate.getDate() === day && tempStartDate.getMonth() === month && tempStartDate.getFullYear() === year) ||
                (tempEndDate.getDate() === day && tempEndDate.getMonth() === month && tempEndDate.getFullYear() === year)
              )
              
              // Simplistic range highlight (all dates between start and end)
              const currentDate = new Date(year, month, day)
              const isInRange = currentDate >= tempStartDate && currentDate <= tempEndDate

              return (
                <button 
                  key={day}
                  onClick={() => {
                    // Primitive range selection logic
                    if (currentDate < tempStartDate) {
                      setTempStartDate(currentDate)
                    } else {
                      setTempEndDate(currentDate)
                    }
                  }}
                  className={`relative flex items-center justify-center h-9 w-9 text-[13px] rounded-full transition-all
                    ${isSelected ? 'bg-[#e15b24] text-white font-bold' : isInRange ? 'bg-[#e15b24]/20 text-gray-700' : 'text-gray-600 hover:bg-gray-100'}
                  `}
                >
                  {day}
                </button>
              )
            })}
          </div>
          
          {/* Footer Actions */}
          <div className="flex justify-end gap-6 px-6 py-4 border-t border-gray-100">
            <button 
              onClick={() => setIsCalendarOpen(false)}
              className="text-[#e15b24] text-[13px] font-bold tracking-wider"
            >
              CANCEL
            </button>
            <button 
              onClick={() => {
                setStartDate(tempStartDate)
                setEndDate(tempEndDate)
                setIsCalendarOpen(false)
              }}
              className="text-[#e15b24] text-[13px] font-bold tracking-wider"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#181818] min-h-screen text-white pb-20 font-sans">
      {/* Black Header */}
      <div className="flex items-center px-4 h-14 bg-[#111111] border-b border-white/5 sticky top-0 z-50">
        <button onClick={() => router.back()} className="text-[#e8612c] mr-4">
          <ChevronLeft size={22} strokeWidth={3} />
        </button>
        <div className="flex items-center gap-2">
           <h1 className="text-[15px] font-bold text-white">Profit & Loss</h1>
           <span className="text-[12px] text-gray-500 font-bold ml-2">Total P&L : 0</span>
        </div>
      </div>

      <div className="p-4 w-full flex flex-col items-center">
        <div className="w-full max-w-[1000px] px-2 md:px-10">
          {/* Filters and Search Row */}
          <div className="flex flex-col lg:flex-row items-center gap-4 mb-4 w-full">
            <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
                {/* Games Dropdown */}
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
                      {GAME_OPTIONS.map((opt) => (
                        <div 
                          key={opt}
                          onClick={() => {
                            setSelectedGame(opt)
                            setIsGameDropdownOpen(false)
                          }}
                          className={`px-4 py-3 text-[13px] hover:bg-[#282828] cursor-pointer transition-colors ${selectedGame === opt ? 'bg-[#4a2618] text-[#e8612c] font-bold' : 'text-gray-300'}`}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Select Dates */}
                <div 
                  onClick={() => setIsCalendarOpen(true)}
                  className="relative w-full md:w-[260px] cursor-pointer"
                >
                  <div className="w-full bg-[#111] border border-white/20 rounded-full h-10 flex items-center justify-between px-4 relative">
                    <label className="absolute -top-2 left-4 px-1 bg-[#181818] text-[9px] text-[#e8612c] font-bold z-10">Select Dates</label>
                    <span className="text-[11px] font-semibold text-white">
                      {formatDateLabel(startDate)} - {formatDateLabel(endDate)}
                    </span>
                  </div>
                  {isCalendarOpen && <MarketCalendar />}
                </div>
            </div>

            {/* Search Button */}
            <button 
              onClick={fetchPL}
              className="bg-[#e15b24] text-white rounded-full h-10 px-12 flex-initial flex items-center justify-center font-bold text-[13px] uppercase tracking-widest transition-all active:scale-[0.98] min-w-[170px]"
            >
                SEARCH
            </button>
          </div>

          {/* Results Badge */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#e15b24] bg-black gap-1.5 mb-6">
            <span className="text-[12px] font-bold text-white tracking-tight">{selectedGame} :</span>
            <span className="text-[12px] font-bold text-[#4caf50]">72.50</span>
          </div>

        {/* Results List */}
        <div className="space-y-4">
           {loading ? (
             <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-[#e8612c] border-t-transparent rounded-full animate-spin" />
             </div>
           ) : results.length > 0 ? (
             results.map((item, idx) => {
               const isPositive = parseFloat(item[4] || 0) >= 0
               return (
                 <div key={idx} className="overflow-hidden rounded-lg bg-white border border-white/10 shadow-lg">
                   {/* Date Header */}
                   <div className="bg-[#e15b24] px-4 py-2 flex items-center justify-between">
                      <span className="text-white text-[12px] font-medium">{item.date || item[0] || 'April 10th 2026'}</span>
                      <ChevronUp size={16} className="text-white" />
                   </div>
                   
                   {/* Card Body */}
                   <div className="px-4 py-3 text-black bg-white flex justify-between items-start">
                      <div className="flex flex-col gap-0.5">
                         <span className="text-[11px] font-bold text-black">Sportsbook</span>
                         <a href="#" className="text-[11px] font-medium text-[#007bff] hover:underline">
                            {item.market || item[3] || 'Rajasthan Royals v RC Bengaluru - To Win The Toss'}
                         </a>
                         <p className="text-[11px] text-black">Settled Date: {item.settled_date || item[1] || '10/04/2026, 8:02:14 pm'}</p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1 min-w-[100px]">
                         <div className="flex items-center gap-1">
                            <span className="text-[11px] text-black">Comm:</span>
                            <span className="text-[11px] text-black font-bold">0</span>
                         </div>
                         <div className="flex items-center gap-1">
                            <span className="text-[11px] text-black">Net Win:</span>
                            <span className={`text-[11px] font-bold ${isPositive ? 'text-[#4caf50]' : 'text-[#f44336]'}`}>
                               {item.win || item[2] || '98'}
                            </span>
                         </div>
                      </div>
                   </div>
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


      
      {/* Click outside to close dropdowns */}
      {isGameDropdownOpen && <div className="fixed inset-0 z-50" onClick={() => setIsGameDropdownOpen(false)} />}
      {isCalendarOpen && <div className="fixed inset-0 z-50" onClick={() => setIsCalendarOpen(false)} />}
    </div>
  )
}
