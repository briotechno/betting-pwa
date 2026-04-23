'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronDown, ChevronUp, AlertTriangle, Loader2, Star } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useBetSlipStore, Bet } from '@/store/betSlipStore'
import { bettingController } from '@/controllers/betting/bettingController'
import { marketController } from '@/controllers/market/marketController'
import { formatTime12h } from '@/utils/format'

export default function OpenBetsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { myBets: bets, setMyBets: setBets } = useBetSlipStore()
  
  const [activeTab, setActiveTab] = useState('MY BET')
  const [loading, setLoading] = useState(false)

  const groupBetsByGame = (bets: Bet[]) => {
    return bets.reduce((acc: Record<string, Bet[]>, bet) => {
      const game = bet.Game || 'Unknown Match'
      if (!acc[game]) acc[game] = []
      acc[game].push(bet)
      return acc
    }, {})
  }

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

  const handleBetClick = (bet: any) => {
    const type = (bet.Type || '').toLowerCase();
    let sport = 'cricket';
    if (type.includes('football') || type.includes('soccer')) sport = 'football';
    if (type.includes('tennis')) sport = 'tennis';

    // Prioritize GID as requested by the user/developer
    const gid = bet.gid || bet.Gid || bet.eventId || bet.matchId;
    
    if (gid) {
      router.push(`/sportsbook/${sport}/all/${gid}`);
    } else {
      console.warn('Click ignored: No GID found in bet data.', bet);
    }
  }

  const renderBetTable = (betList: Bet[]) => (
    <div className="space-y-4 p-2 bg-white">
      {betList.map((bet, idx) => {
        const isBack = bet.Side === 'back';
        const profit = isBack 
          ? (parseFloat(bet.Stake) * (parseFloat(bet.Rate) - 1)).toFixed(2)
          : parseFloat(bet.Stake).toFixed(2);
        return (
          <div key={`${bet.Game}-${idx}`} className="space-y-1.5 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <div className="flex flex-col mb-1">
              <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">{bet.Game}</span>
              <span className="text-[#1a1a1a] text-[13px] font-black uppercase tracking-tight leading-tight">{bet.Selection}</span>
              <span className="text-[9px] text-gray-500 font-medium">{formatTime12h(bet.Date)}</span>
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
      <div className="flex items-center px-4 h-14 bg-[#111111] border-b border-white/5 sticky top-0 z-50">
        <button onClick={() => router.back()} className="text-[#e8612c] mr-4 transition-transform active:scale-90">
          <ChevronLeft size={22} strokeWidth={3} />
        </button>
        <h1 className="text-[15px] font-bold text-white">Open Bets</h1>
      </div>

      <div className="flex-1 w-full max-w-[1400px] mx-auto px-4 md:px-10 lg:px-16">
        {/* Tabs */}
        <div className="flex justify-center border-b border-white/10 mt-6">
          <div className="flex gap-8">
            <button 
              onClick={() => setActiveTab('MY BET')}
              className={`py-2 px-4 relative font-bold uppercase tracking-tight text-[11px] transition-all ${activeTab === 'MY BET' ? 'text-[#e8612c]' : 'text-gray-400'}`}
            >
              <span>MY BET</span>
              {activeTab === 'MY BET' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e8612c]" />}
            </button>
            <button 
              onClick={() => setActiveTab('MY MARKET')}
              className={`py-2 px-4 relative font-bold uppercase tracking-tight text-[11px] transition-all ${activeTab === 'MY MARKET' ? 'text-[#e8612c]' : 'text-gray-400'}`}
            >
              <span>MY MARKET</span>
              {activeTab === 'MY MARKET' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e8612c]" />}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 mb-12">
          {!isAuthenticated ? (
             <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                <AlertTriangle size={48} className="text-gray-600 mb-2" />
                <p className="text-gray-400 font-bold uppercase text-[12px] tracking-widest">
                   Please login to view your open bets
                </p>
                <button 
                  onClick={() => router.push('/auth/login')}
                  className="bg-[#e8612c] text-white px-8 py-3 rounded font-black uppercase text-[12px] mt-4"
                >
                  Login
                </button>
             </div>          ) : activeTab === 'MY BET' ? (
            <div className="space-y-4 bg-white p-2">
              {Object.keys(groupBetsByGame(bets)).length > 0 ? (
                Object.entries(groupBetsByGame(bets)).map(([gameName, gameBets]) => (
                  <div key={gameName} className="flex flex-col">
                    {/* Match Name */}
                    <h3 className="text-[12px] font-bold text-black mb-1">{gameName}</h3>
                    
                    {gameBets.map((bet, bIdx) => {
                      const isBack = bet.Side?.toLowerCase() === 'back';
                      const rateNum = parseFloat(bet.Rate || '0');
                      const stakeNum = parseFloat(bet.Stake || '0');
                      
                      const amount = rateNum > 10 
                        ? (stakeNum * rateNum / 100).toFixed(0) 
                        : (stakeNum * (rateNum - 1)).toFixed(0);
                      
                      const label = isBack ? 'to win' : 'liability';
                      const sideLabel = bet.Side?.toUpperCase() || 'BACK';

                      return (
                        <div key={bIdx} className="mb-4">
                          {/* Market Name above colored box */}
                          <p className="text-[11px] text-[#444] mb-1 ml-2">{bet.Game_Type || 'Winner'}</p>
                          
                          {/* Colored Bet Box */}
                          <div 
                            onClick={() => handleBetClick(bet)}
                            className={`${isBack ? 'bg-[#a5d9fe]' : 'bg-[#f8d0ce]'} p-3 cursor-pointer hover:brightness-95 transition-all text-black`}
                          >
                            <p className="text-[12px] font-bold mb-1">
                              {sideLabel} {bet.Selection} for {bet.Stake} @ {bet.Rate} {label} {amount} .
                            </p>
                            <p className="text-[11px] font-medium mb-1">{bet.Game_Type || 'Winner'}</p>
                            <p className="text-[11px] text-gray-700">Placed: {formatTime12h(bet.Date)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              ) : (
                <div className="p-12 flex flex-col items-center justify-center text-[#e15b24] gap-2 bg-[#1a1a1a] rounded-xl border border-white/5">
                  <AlertTriangle size={40} strokeWidth={2.5} />
                  <p className="text-[13px] font-bold uppercase tracking-widest text-center">No Open Bets Found!</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-0 border-t border-b border-white/10">
              {Array.from(new Set(bets.map(b => b.Game))).length > 0 ? (
                Array.from(new Set(bets.map(b => b.Game))).map((gameName, idx) => {
                  const gameData = bets.find(b => b.Game === gameName);
                  return (
                    <div 
                      key={idx} 
                      className="bg-white flex items-center justify-between px-4 h-14 border-b border-black/5 last:border-0 group select-none cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleBetClick(gameData!)}
                    >
                      <span className="text-[13px] font-bold text-[#1a1a1a] uppercase truncate pr-4">{gameName}</span>
                      <button 
                        onClick={async (e) => {
                          e.stopPropagation();
                          const eidToUse = (gameData as any).eid || (gameData as any).Eid || gameData?.eventId;
                          if (eidToUse) {
                            await marketController.toggleFavourite(user?.loginToken || '', eidToUse);
                          }
                        }}
                        className="text-gray-400 hover:text-[#ffb800] hover:scale-110 transition-all p-2"
                      >
                        <Star size={20} strokeWidth={2} />
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="p-20 flex flex-col items-center justify-center text-gray-500 bg-[#111] rounded-xl">
                  <AlertTriangle size={48} className="mb-4" />
                  <p className="font-bold uppercase text-[11px] tracking-widest text-center leading-relaxed">
                    You haven't placed any bets yet.<br />Explore the sportsbook to get started.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
