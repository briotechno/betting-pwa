'use client'
import React, { useState, useEffect } from 'react'
import { ChevronDown, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { bettingController } from '@/controllers/betting/bettingController'

interface Bet {
  Game: string;
  Selection: string;
  Type: string;
  Rate: string;
  Stake: string;
  Date: string;
  Side: 'back' | 'lay';
  IsMatched?: string; // Optional if API provides it
}

export default function BetContainer() {
  const [activeTab, setActiveTab] = useState<'BETSLIP' | 'OPEN_BETS'>('OPEN_BETS')
  const [unmatchedOpen, setUnmatchedOpen] = useState(true)
  const [matchedOpen, setMatchedOpen] = useState(true)
  const [bets, setBets] = useState<Bet[]>([])
  const [loading, setLoading] = useState(false)
  
  const { user } = useAuthStore()

  useEffect(() => {
    if (activeTab === 'OPEN_BETS' && user?.loginToken) {
      fetchBets()
    }
  }, [activeTab, user?.loginToken])

  const fetchBets = async () => {
    try {
      setLoading(true)
      const res = await bettingController.getMyBets(user?.loginToken || '')
      
      // API returns an object with numerical keys
      if (res && typeof res === 'object' && !res.error) {
        const betArray = Object.values(res).filter(item => typeof item === 'object' && item !== null) as Bet[]
        setBets(betArray)
      }
    } catch (err) {
      console.error('Failed to fetch bets:', err)
    } finally {
      setLoading(false)
    }
  }

  // Logic for filtration: 
  // We'll use 'Type' as a fallback if 'IsMatched' isn't explicitly provided.
  // Many exchange APIs use Type="Matched" or similar.
  const matchedBets = bets.filter((b: Bet) => b.Type?.toLowerCase().includes('match') || b.IsMatched === '1')
  const unmatchedBets = bets.filter((b: Bet) => !b.Type?.toLowerCase().includes('match') && b.IsMatched !== '1')

  const renderBetCard = (bet: Bet) => (
    <div key={`${bet.Game}-${bet.Date}`} className="bg-[#1a1a1a] p-3 border-b border-[#333] last:border-0">
      <div className="flex justify-between items-start mb-1">
        <span className="text-[11px] font-bold text-white uppercase tracking-tight truncate flex-1 pr-2">{bet.Game}</span>
        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${bet.Side === 'back' ? 'bg-[#a5d9fe] text-black' : 'bg-[#f8d0ce] text-black'}`}>
          {bet.Side}
        </span>
      </div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] text-gray-400 font-medium">{bet.Selection}</span>
        <span className="text-[10px] text-white font-black">@ {bet.Rate}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[9px] text-gray-500">{bet.Date}</span>
        <span className="text-[10px] text-[#e8612c] font-bold">₹{bet.Stake}</span>
      </div>
    </div>
  )

  return (
    <div className="w-full bg-[#121212] border-l border-[#333] min-h-screen">
      {/* Tabs */}
      <div className="flex border-b border-[#333]">
        <button
          onClick={() => setActiveTab('BETSLIP')}
          className={`flex-1 py-3 text-[12px] font-bold tracking-wider transition-all ${
            activeTab === 'BETSLIP' ? 'text-[#e8612c] border-b-2 border-[#e8612c]' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          BETSLIP
        </button>
        <button
          onClick={() => setActiveTab('OPEN_BETS')}
          className={`flex-1 py-3 text-[12px] font-bold tracking-wider transition-all ${
            activeTab === 'OPEN_BETS' ? 'text-[#e8612c] border-b-2 border-[#e8612c]' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          OPEN BETS
        </button>
      </div>

      <div className="p-3">
        {activeTab === 'OPEN_BETS' ? (
          <div className="space-y-4">
            {/* Unmatched Bets */}
            <div className="border border-[#e8612c] rounded-[12px] overflow-hidden shadow-sm bg-[#1a1a1a]">
               <button 
                onClick={() => setUnmatchedOpen(!unmatchedOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-[#111] text-white text-[12px] font-bold"
               >
                 <div className="flex items-center gap-2">
                   <span>Unmatched Bets</span>
                   {unmatchedBets.length > 0 && (
                     <span className="bg-[#e8612c] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{unmatchedBets.length}</span>
                   )}
                 </div>
                 <div className="bg-[#e8612c] rounded-full p-1 shadow-md">
                   <ChevronDown size={14} className={`text-white transition-transform duration-300 stroke-[3px] ${unmatchedOpen ? '' : '-rotate-90'}`} />
                 </div>
               </button>
               {unmatchedOpen && (
                 <div className="bg-black/20 divide-y divide-[#333]">
                   {loading ? (
                     <div className="p-8 flex justify-center"><Loader2 size={20} className="text-[#e8612c] animate-spin" /></div>
                   ) : unmatchedBets.length > 0 ? (
                     unmatchedBets.map(renderBetCard)
                   ) : (
                     <div className="p-8 text-center text-[11px] text-gray-500 uppercase tracking-widest font-black italic opacity-40">
                       No unmatched bets found
                     </div>
                   )}
                 </div>
               )}
            </div>

            {/* Matched Bets */}
            <div className="border border-[#e8612c] rounded-[12px] overflow-hidden shadow-sm bg-[#1a1a1a]">
               <button 
                 onClick={() => setMatchedOpen(!matchedOpen)}
                 className="w-full flex items-center justify-between px-4 py-3 bg-[#111] text-white text-[12px] font-bold"
               >
                 <div className="flex items-center gap-2">
                   <span>Matched Bets</span>
                   {matchedBets.length > 0 && (
                     <span className="bg-[#e8612c] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{matchedBets.length}</span>
                   )}
                 </div>
                 <div className="bg-[#e8612c] rounded-full p-1 shadow-md">
                   <ChevronDown size={14} className={`text-white transition-transform duration-300 stroke-[3px] ${matchedOpen ? '' : '-rotate-90'}`} />
                 </div>
               </button>
               {matchedOpen && (
                 <div className="bg-black/20 divide-y divide-[#333]">
                    {loading ? (
                     <div className="p-8 flex justify-center"><Loader2 size={20} className="text-[#e8612c] animate-spin" /></div>
                   ) : matchedBets.length > 0 ? (
                     matchedBets.map(renderBetCard)
                   ) : (
                     <div className="p-8 text-center text-[11px] text-gray-500 uppercase tracking-widest font-black italic opacity-40">
                       No matched bets found
                     </div>
                   )}
                 </div>
               )}
            </div>
          </div>
        ) : (
          <div className="p-6 bg-black/40 rounded-[20px] text-center text-[11px] text-gray-500 italic border border-[#333]">
            Your betslip is empty. Select some odds to start betting!
          </div>
        )}
      </div>
    </div>
  )
}
