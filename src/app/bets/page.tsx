'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronDown, ChevronUp, AlertTriangle, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useBetSlipStore, Bet } from '@/store/betSlipStore'
import { bettingController } from '@/controllers/betting/bettingController'

export default function OpenBetsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { myBets: bets, setMyBets: setBets } = useBetSlipStore()
  
  const [activeTab, setActiveTab] = useState('MY BET')
  const [isUnmatchedOpen, setIsUnmatchedOpen] = useState(true)
  const [isMatchedOpen, setIsMatchedOpen] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user?.loginToken) {
      fetchBets()
    }
  }, [isAuthenticated, user?.loginToken])

  const fetchBets = async () => {
    try {
      setLoading(true)
      const res = await bettingController.getMyBets(user?.loginToken || '')
      if (res && typeof res === 'object' && !res.error) {
        // The API returns an object where keys are indices, we need common array
        const betArray = Object.values(res).filter(item => typeof item === 'object' && item !== null) as Bet[]
        setBets(betArray)
      }
    } catch (err) {
      console.error('Failed to fetch bets:', err)
    } finally {
      setLoading(false)
    }
  }

  const matchedBets = bets.filter((b: Bet) => b.Type?.toLowerCase().includes('match') || b.IsMatched === '1')
  const unmatchedBets = bets.filter((b: Bet) => !b.Type?.toLowerCase().includes('match') && b.IsMatched !== '1')

  const renderBetTable = (betList: Bet[]) => (
    <div className="space-y-4 p-2 bg-white">
      {betList.map((bet, idx) => {
        const profit = (parseFloat(bet.Stake) * (parseFloat(bet.Rate) - 1)).toFixed(0);
        return (
          <div key={`${bet.Game}-${idx}`} className="space-y-1.5 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <div className="flex flex-col mb-1">
              <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">{bet.Game}</span>
              <span className="text-[#1a1a1a] text-[13px] font-black uppercase tracking-tight leading-tight">{bet.Selection}</span>
              <span className="text-[9px] text-gray-500 font-medium">{bet.Date}</span>
            </div>
            
            <div className="rounded-lg overflow-hidden border border-gray-100 shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-100">
                    <th className="py-2 px-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">Odds</th>
                    <th className="py-2 px-3 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Stake</th>
                    <th className="py-2 px-3 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Profit/Liability</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={`${bet.Side === 'back' ? 'bg-[#a5d9fe]' : 'bg-[#f8d0ce]'} text-[#1a1a1a]`}>
                    <td className="py-2.5 px-3 text-[14px] font-bold">{bet.Rate}</td>
                    <td className="py-2.5 px-3 text-[14px] font-bold text-center">₹{bet.Stake}</td>
                    <td className="py-2.5 px-3 text-[14px] font-bold text-right">{profit}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </div>
  )

  const emptyState = (message: string) => (
    <div className="bg-white p-12 flex flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-[#e8612c]/10 rounded-full flex items-center justify-center">
            <AlertTriangle size={32} className="text-[#e8612c]" strokeWidth={2.5} />
        </div>
         <p className="text-[#e8612c] text-[14px] font-bold tracking-tight uppercase">{message}</p>
      </div>
    </div>
  )

  return (
    <div className="bg-[#181818] min-h-screen text-white pb-20 font-sans flex flex-col">
      {/* Sub Header */}
      <div className="flex items-center px-4 py-4 bg-[#222222] border-b border-white/5 sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-[#e8612c] pr-4 transition-transform active:scale-90">
          <ChevronLeft size={24} strokeWidth={3} />
        </button>
        <div className="flex flex-col">
            <h1 className="text-[17px] font-black text-white uppercase tracking-tight">Open Bets</h1>
            <div className="w-8 h-1 bg-[#e8612c] mt-0.5 rounded-full" />
        </div>

        {loading && (
           <div className="ml-auto">
             <Loader2 size={20} className="text-[#e8612c] animate-spin" />
           </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-[#222222] border-b border-black/20">
        <button 
          onClick={() => setActiveTab('MY BET')}
          className={`flex-1 py-4 flex flex-col items-center justify-center relative font-black uppercase tracking-widest text-[11px] transition-all ${activeTab === 'MY BET' ? 'text-[#e8612c]' : 'text-gray-500'}`}
        >
          <span>MY BET</span>
          {activeTab === 'MY BET' && <div className="absolute bottom-0 w-[40px] h-1 bg-[#e8612c] rounded-t-full shadow-[0_0_10px_#e8612c]" />}
        </button>
        <button 
          onClick={() => setActiveTab('MY MARKET')}
          className={`flex-1 py-4 flex flex-col items-center justify-center relative font-black uppercase tracking-widest text-[11px] transition-all ${activeTab === 'MY MARKET' ? 'text-[#e8612c]' : 'text-gray-500'}`}
        >
          <span>MY MARKET</span>
          {activeTab === 'MY MARKET' && <div className="absolute bottom-0 w-[40px] h-1 bg-[#e8612c] rounded-t-full shadow-[0_0_10px_#e8612c]" />}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pt-3 px-3">
        {!isAuthenticated ? (
           <div className="flex flex-col items-center justify-center py-20 px-8 text-center gap-4">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-2">
                 <AlertTriangle size={32} className="text-gray-500" />
              </div>
              <p className="text-gray-400 font-bold uppercase text-[12px] tracking-widest leading-relaxed">
                 Please login to view your open bets
              </p>
              <button 
                onClick={() => router.push('/auth/login')}
                className="bg-[#e8612c] text-white px-8 py-3 rounded-full font-black uppercase text-[12px] tracking-wider shadow-lg shadow-[#e8612c]/20 transition-all active:scale-95 mt-2"
              >
                Login Now
              </button>
           </div>
        ) : activeTab === 'MY BET' ? (
          <div className="space-y-4 pb-24">
            {/* Unmatched Bets Accordion */}
            <div className="overflow-hidden border border-gray-400/10 shadow-xl rounded-xl">
              <button 
                onClick={() => setIsUnmatchedOpen(!isUnmatchedOpen)}
                className="w-full bg-[#dedede] flex items-center justify-between px-4 h-12 border-b border-gray-300"
              >
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-[#e8612c] rounded-full" />
                    <span className="text-[#1a1a1a] text-[13px] font-black uppercase tracking-tight">Unmatched Bets</span>
                </div>
                <div className="w-[22px] h-[22px] bg-[#e8612c] rounded-full flex items-center justify-center shadow-md">
                  {isUnmatchedOpen ? <ChevronUp size={16} className="text-white" strokeWidth={4} /> : <ChevronDown size={16} className="text-white" strokeWidth={4} />}
                </div>
              </button>
              
              <div 
                className={`grid transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.5,1)] ${isUnmatchedOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                   {unmatchedBets.length > 0 ? renderBetTable(unmatchedBets) : emptyState('No Unmatched Bets!')}
                </div>
              </div>
            </div>

            {/* Matched Bets Accordion */}
            <div className="overflow-hidden border border-gray-400/10 shadow-xl rounded-xl">
              <button 
                onClick={() => setIsMatchedOpen(!isMatchedOpen)}
                className="w-full bg-[#dedede] flex items-center justify-between px-4 h-12 border-b border-gray-300"
              >
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-[#4caf50] rounded-full" />
                    <span className="text-[#1a1a1a] text-[13px] font-black uppercase tracking-tight">Matched Bets</span>
                </div>
                <div className="w-[22px] h-[22px] bg-[#e8612c] rounded-full flex items-center justify-center shadow-md">
                  {isMatchedOpen ? <ChevronUp size={16} className="text-white" strokeWidth={4} /> : <ChevronDown size={16} className="text-white" strokeWidth={4} />}
                </div>
              </button>
              
              <div 
                className={`grid transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.5,1)] ${isMatchedOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                   {matchedBets.length > 0 ? renderBetTable(matchedBets) : emptyState('No Matched Bets!')}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 mt-16 flex flex-col items-center justify-center gap-6 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                <AlertTriangle size={40} className="text-gray-600" strokeWidth={2} />
            </div>
            <p className="text-gray-500 text-[12px] font-black uppercase tracking-widest text-center leading-relaxed">
                Your market positions<br />will be shown here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
