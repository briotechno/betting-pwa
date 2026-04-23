'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Star, Loader2, Info } from 'lucide-react'
import { marketController } from '@/controllers'
import { useAuthStore } from '@/store/authStore'
import MultiMarketTable from '@/components/sportsbook/MultiMarketTable'
import BetContainer from '@/components/sportsbook/BetContainer'

export default function FavoritesPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [favorites, setFavorites] = useState<any[]>([])
  const [liveRates, setLiveRates] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated || !user?.loginToken) {
        setLoading(false)
        return
      }

      try {
        const response = await marketController.getMultiMarketList(user.loginToken)
        if (response) {
          let dataArray: any[] = []
          const rawData = response.data || response.list || response.BankList || response
          
          if (Array.isArray(rawData)) {
            dataArray = rawData
          } else if (typeof rawData === 'object' && rawData !== null) {
            if (rawData.eid || rawData.Eid || rawData.MarketId) {
              dataArray = [rawData]
            } else {
              dataArray = Object.values(rawData).filter(v => 
                v && typeof v === 'object' && ((v as any).eid || (v as any).Eid || (v as any).gid || (v as any).Gid || (v as any).MarketId)
              )
            }
          }
          setFavorites(dataArray.sort((a, b) => {
            const parseDate = (str: string) => {
              if (!str || str === 'Live') return new Date(0);
              let d = new Date(str.includes('T') ? str : str.replace(' ', 'T'));
              if (isNaN(d.getTime())) {
                const parts = str.split(/[-/ :]/);
                if (parts.length >= 3) {
                  d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]), parseInt(parts[3] || '0'), parseInt(parts[4] || '0'), parseInt(parts[5] || '0'));
                }
              }
              return d;
            };
            const timeA = parseDate(a.DateTime || a.startTime || a.StartTime || '').getTime();
            const timeB = parseDate(b.DateTime || b.startTime || b.StartTime || '').getTime();
            return timeA - timeB;
          }))
        }
      } catch (error) {
        console.error('Failed to fetch favorites:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [isAuthenticated, user?.loginToken])

  // Polling for live rates
  useEffect(() => {
    // Generate a comma-separated string of MarketId/eid for the MarketId parameter
    const marketIds = favorites
      .map(f => f.MarketId || f.marketid || f.eid || f.Eid || '')
      .filter(id => id !== '')
      .join(',')
      
    const ids = favorites
      .map(f => {
        // Collect identifying keys, handling both empty strings and undefined
        const gkey = f.gkey || f.gid || f.Gid || ''
        const ekey = f.ekey || f.eid || f.Eid || f.MarketId || ''
        return { gkey, ekey }
      })
      .filter(id => id.ekey) // At minimum we need an ekey to poll

    if (ids.length === 0 || !marketIds) return

    let isMounted = true
    let timeoutId: any

    const pollRates = async () => {
      try {
        const res = await marketController.getMultiMarketRate(marketIds, ids)
        if (res && typeof res === 'object' && isMounted) {
          // If the response is success (no error field or error is '0')
          if (res.error === undefined || res.error === '0') {
             setLiveRates(prev => ({ ...prev, ...res }))
          }
        }
      } catch (err) {
        console.error('Failed to poll multi-market rates:', err)
      }

      if (isMounted) {
        timeoutId = setTimeout(pollRates, 1000)
      }
    }

    pollRates()
    return () => {
      isMounted = false
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [favorites])

  const handleToggleFav = async (eid: string) => {
    if (!user?.loginToken) return
    try {
      const res = await marketController.toggleFavourite(user.loginToken, eid)
      if (res.error === '0') {
        setFavorites(prev => prev.filter(f => (f.eid || f.Eid) !== eid))
      }
    } catch (err) {
      console.error('Failed to untoggle fav:', err)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#121212] lg:gap-4 lg:bg-transparent">
      {/* Main Content Area */}
      <div className="flex-1 pb-20 bg-[#121212] rounded-lg overflow-hidden">
        {/* Sub Header */}
        <div className="flex items-center px-4 py-3 bg-[#222222] border-b border-white/5 sticky top-0 z-10 transition-all">
          <button onClick={() => router.back()} className="text-[#e8612c] pr-3">
            <ChevronLeft size={22} className="stroke-[3]" />
          </button>
          <h1 className="text-[15px] font-bold text-white uppercase tracking-tight">Favorites</h1>
        </div>

        <div className="p-4 pt-6">
          {!isAuthenticated ? (
            <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-12 text-center shadow-xl max-w-2xl mx-auto">
               <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Info size={40} className="text-white/20" />
               </div>
               <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Login Required</h3>
               <p className="text-white/50 text-sm mb-8 max-w-xs mx-auto">Please login to view and manage your favorite matches and events.</p>
               <button 
                  onClick={() => router.push('/auth/login')}
                  className="px-12 h-12 rounded-full font-black tracking-widest bg-[#e8612c] text-white hover:bg-[#ff7a45] transition-all"
               >
                  JOIN THE ACTION
               </button>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-32">
               <div className="relative">
                  <Loader2 className="animate-spin text-[#e8612c]" size={48} />
                  <Star size={16} className="absolute inset-0 m-auto text-[#e8612c] fill-current" />
               </div>
               <p className="text-white/30 font-black uppercase tracking-[0.3em] text-[10px] mt-6">Loading your favorites</p>
            </div>
          ) : favorites.length === 0 ? (
            <div className="bg-[#1a1a1a] border border-orange-500/50 rounded-lg p-3 text-left">
               <div className="flex items-center gap-3">
                 <Info size={20} className="text-[#e8612c]" />
                 <p className="text-[#e8612c] text-[15px] font-medium leading-none">You haven&apos;t added anything to favorites.</p>
               </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {favorites.map((market: any) => {
                const mIds = [
                  market.MarketId, market.marketid, 
                  market.eid, market.Eid, market.ekey,
                  market.gid, market.Gid, market.gkey
                ].filter(id => !!id)

                // Find rate data by any of its identifiers
                let marketRate = null
                for (const id of mIds) {
                  if (liveRates[id]) {
                    marketRate = liveRates[id]
                    break
                  }
                }
                
                // Final fallback: search all rate values for this market's ID
                if (!marketRate) {
                  marketRate = Object.values(liveRates).find((r: any) => 
                    r && (mIds.includes(r.MarketId) || mIds.includes(r.marketid) || mIds.includes(r.eid) || mIds.includes(r.Eid))
                  )
                }
                
                // Merge live rates with static market data to preserve internal fields like RunnerName
                const staticRunners = Array.isArray(market.runners) ? market.runners : Object.values(market.runners || {})
                const liveRunnersMap = (marketRate as any)?.runners || (marketRate as any)?.runner || {}
                const liveRunners = Array.isArray(liveRunnersMap) ? liveRunnersMap : Object.values(liveRunnersMap)

                const runnersArray = staticRunners.map((sr: any, idx: number) => {
                  // Find live data by selectionId or fallback to index
                  const liveData = liveRunners.find((lr: any) => lr.SelectionId === sr.SelectionId) || liveRunners[idx] || {}
                  return { ...sr, ...liveData }
                })

                const matchName = market.name || 
                                  (market.Team1 && market.Team2 ? `${market.Team1} vs ${market.Team2}` : 
                                  market.Event_Name || market.Game_Name || 'Main Market')

                return (
                  <MultiMarketTable 
                    key={market.eid || market.Eid || market.MarketId}
                    sportName={market.Event_Type || market.sport || 'Cricket'}
                    competitionName={matchName}
                    marketName={market.name || 'Winner'}
                    rateData={marketRate || {}}
                    runners={runnersArray as any}
                    isFavourite={true}
                    onToggleFavourite={() => handleToggleFav(market.eid || market.Eid || market.MarketId)}
                    onRowClick={(runner) => {
                       const sport = (market.Event_Type || market.sport || 'cricket').toLowerCase()
                       const cid = market.Cid || 'league'
                       const gid = market.gid || market.Gid
                       if (gid) router.push(`/sportsbook/${sport}/${cid}/${gid}`)
                    }}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bet Container - attached but separate column */}
      {(isAuthenticated || user) && (
        <div className="w-full lg:w-[480px] lg:sticky lg:top-[134px] lg:max-h-[calc(100vh-150px)] lg:overflow-y-auto self-start shrink-0 lg:border-none lg:rounded-lg lg:overflow-hidden lg:border-l border-white/5 bg-[#111] z-30">
          <BetContainer hideBetslipOnMobile={true} />
        </div>
      )}
    </div>
  )
}

