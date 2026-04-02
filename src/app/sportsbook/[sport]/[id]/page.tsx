'use client'
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Star, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { toTitleCase } from '@/utils/format'
import BetContainer from '@/components/sportsbook/BetContainer'
import { marketController } from '@/controllers/market/marketController'
import { useBetSlipStore } from '@/store/betSlipStore'

const sportsList = [
  { id: 'Cricket', name: 'Cricket', count: 14, icon: 'https://www.fairplay247.vip/_nuxt/img/cricket.5c05f66.png' },
  { id: 'Soccer', name: 'Soccer', count: 29, icon: 'https://www.fairplay247.vip/_nuxt/img/soccer.9f718cc.png' },
  { id: 'Tennis', name: 'Tennis', count: 41, icon: 'https://www.fairplay247.vip/_nuxt/img/tennis.fc30791.png' },
]

const OddsBox = ({ val, vol, type, intensity = 'high', onClick }: { val: string, vol: string, type: 'back' | 'lay', intensity?: 'low' | 'medium' | 'high', onClick?: () => void }) => {
  const [blink, setBlink] = useState(false)
  const prevValue = useRef(val)

  useEffect(() => {
    if (prevValue.current !== val && val !== '0' && val !== '0.00' && val !== '-' && parseFloat(val) > 0) {
      setBlink(true)
      const timer = setTimeout(() => setBlink(false), 300)
      prevValue.current = val
      return () => clearTimeout(timer)
    }
    prevValue.current = val
  }, [val])

  const bgColor = type === 'back'
    ? (intensity === 'high' ? 'bg-[#a5d9fe]' : intensity === 'medium' ? 'bg-[#bce4ff]' : 'bg-[#d1eeff]')
    : (intensity === 'high' ? 'bg-[#f8d0ce]' : intensity === 'medium' ? 'bg-[#fbe3e2]' : 'bg-[#fff0f0]')

  const isEmpty = !val || val === '0' || val === '0.00' || val === '-' || parseFloat(val) === 0

  return (
    <button 
      onClick={onClick} 
      className={`w-[58px] lg:w-[60px] h-[38px] rounded-[4px] flex flex-col items-center justify-center transition-all shadow-sm border border-transparent ${isEmpty ? 'bg-[#f2f2f2] opacity-60' : bgColor} ${blink ? 'animate-rate-change' : ''} hover:brightness-95 active:scale-95`}
    >
      <span className={`text-[12px] lg:text-[13px] font-black ${isEmpty ? 'text-[#aaa]' : 'text-[#2e2e2e]'} leading-none mb-0.5 tracking-tight`}>{val || '-'}</span>
      {!isEmpty && <span className="text-[8.5px] lg:text-[9px] text-[#555] font-bold leading-none">{vol || ''}</span>}
    </button>
  )
}

const MarketTable = ({ 
  marketName, 
  runners, 
  marketId, 
  liveRates, 
  isUpcoming, 
  startTime, 
  isWinnerType,
  matchId,
  matchName
}: { 
  marketName: string, 
  runners: any[], 
  marketId: string, 
  liveRates: any, 
  isUpcoming: boolean,
  startTime: string,
  isWinnerType?: boolean,
  matchId: string,
  matchName: string
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const router = useRouter()
  const params = useParams()
  const addSelection = useBetSlipStore(state => state.addSelection)

  const getRunnerRates = (runnerId: string | number) => {
    const rateData = liveRates[marketId]
    const runnersData = rateData?.runner || rateData?.runners || []
    const runnerArr = Array.isArray(runnersData) ? runnersData : Object.values(runnersData)
    
    // Find runner by id or index
    let r = runnerArr.find((item: any) => item.selectionId === runnerId || item.id === runnerId)
    if (!r && typeof runnerId === 'number') r = runnerArr[runnerId]

    const getPrices = (r: any, type: 'back'|'lay') => {
      if (!r) return { p1: '', v1: '', p2: '', v2: '', p3: '', v3: '' };
      const data = type === 'back' ? (r.back || r.availableToBack || r.ex?.availableToBack) : (r.lay || r.availableToLay || r.ex?.availableToLay);
      const arr = Array.isArray(data) ? data : Object.values(data || {});
      
      return {
        p1: (arr[0]?.rate || arr[0]?.price || (type === 'back' ? r.lastPriceTraded : '') || '')?.toString(),
        v1: arr[0]?.size || '',
        p2: (arr[1]?.rate || arr[1]?.price || '')?.toString(),
        v2: arr[1]?.size || '',
        p3: (arr[2]?.rate || arr[2]?.price || '')?.toString(),
        v3: arr[2]?.size || '',
      };
    };

    const back = getPrices(r, 'back')
    const lay = getPrices(r, 'lay')

    return { back, lay }
  }

  const navigateToGame = () => {
    router.push(`/sportsbook/${params.sport}/${params.id}/${matchId}`)
  }

  return (
    <div className="bg-white rounded-t-lg rounded-b-lg shadow-lg border border-[#f36c21]/20 overflow-hidden mb-4">
      {/* Table Header Section */}
      <div className="h-11 lg:h-12 flex items-center justify-between cursor-pointer select-none bg-[#333]">
        <div className="flex items-center h-full" onClick={navigateToGame}>
           <div className="h-full bg-[#f36c21] px-4 flex items-center justify-center min-w-[140px] relative overflow-hidden" style={{ clipPath: 'polygon(0 0, 90% 0, 100% 100%, 0% 100%)' }}>
             <span className="text-white text-[12px] lg:text-[13px] font-black uppercase tracking-wider">{marketName}</span>
           </div>
           {isUpcoming && (
             <div className="ml-4 flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-[#1a9ebf]" />
               <span className="text-[#1a9ebf] text-[10px] font-black uppercase italic tracking-tighter">Upcoming: {startTime}</span>
             </div>
           )}
        </div>
        <div className="flex items-center gap-4 px-4 h-full" onClick={() => setIsCollapsed(!isCollapsed)}>
           <div className="hidden lg:flex gap-16 mr-8 text-[10px] font-black uppercase tracking-widest text-white/40">
              <span className="w-[124px] text-center">Back</span>
              <span className="w-[124px] text-center">Lay</span>
           </div>
           {isCollapsed ? <ChevronDown className="text-white/60" size={20} /> : <ChevronUp className="text-white/60" size={20} />}
        </div>
      </div>

      {!isCollapsed && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f9f9f9] border-b border-gray-100">
                <th className="py-2 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Runners</th>
                <th className="py-2 px-4 text-center lg:text-right hidden lg:table-cell"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {runners.map((runner, rIdx) => {
                const { back, lay } = getRunnerRates(runner.selectionId || runner.id || rIdx)
                const runnerName = runner.name || runner.RunnerName ||`Runner ${rIdx + 1}`
                
                const handleAddBet = (odds: string, side: 'back' | 'lay') => {
                  if (!odds || odds === '-' || odds === '0') return;
                  addSelection({
                    id: `${marketId}-${runner.selectionId || rIdx}-${side}`,
                    matchId: marketId,
                    matchName: matchName,
                    marketName: marketName,
                    selectionName: runnerName,
                    odds: parseFloat(odds),
                    betType: side
                  })
                }

                return (
                  <tr key={runner.selectionId || rIdx} className="hover:bg-gray-50 transition-colors group">
                    <td className="py-3 px-4" onClick={navigateToGame}>
                      <div className="flex items-center gap-3">
                        <button className="text-gray-300 hover:text-[#f36c21 transition-colors">
                          <Star size={16} />
                        </button>
                        <span className="text-[13px] lg:text-[14px] font-black text-[#2e2e2e] uppercase tracking-tight group-hover:text-[#f36c21] transition-colors">{runnerName}</span>
                      </div>
                    </td>
                    <td className="py-2 px-4">
                        <div className="flex justify-end gap-1 lg:gap-2">
                           <div className="flex gap-1">
                              <div className="hidden lg:flex gap-1">
                                 <OddsBox val={back.p3} vol={back.v3} type="back" intensity="low" onClick={() => handleAddBet(back.p3, 'back')} />
                                 <OddsBox val={back.p2} vol={back.v2} type="back" intensity="medium" onClick={() => handleAddBet(back.p2, 'back')} />
                              </div>
                              <OddsBox val={back.p1} vol={back.v1} type="back" intensity="high" onClick={() => handleAddBet(back.p1, 'back')} />
                           </div>
                           <div className="flex gap-1">
                              <OddsBox val={lay.p1} vol={lay.v1} type="lay" intensity="high" onClick={() => handleAddBet(lay.p1, 'lay')} />
                              <div className="hidden lg:flex gap-1">
                                 <OddsBox val={lay.p2} vol={lay.v2} type="lay" intensity="medium" onClick={() => handleAddBet(lay.p2, 'lay')} />
                                 <OddsBox val={lay.p3} vol={lay.v3} type="lay" intensity="low" onClick={() => handleAddBet(lay.p3, 'lay')} />
                              </div>
                           </div>
                        </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function CompetitionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [activeSubTab, setActiveSubTab] = useState('LIVE & UPCOMING')

  const subTabs = ['LIVE & UPCOMING', 'RESULTS']

  const activeSportId = params.sport as string || 'Cricket'
  const competitionId = params.id as string

  const [games, setGames] = useState<any[]>([])
  const [gameDetails, setGameDetails] = useState<Record<string, any>>({})
  const [liveOdds, setLiveOdds] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)

  // 1. Fetch Competition Games initially
  useEffect(() => {
    let isMounted = true;
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const gameRes = await marketController.getCompetitionGames(competitionId);

        if (isMounted) {
          let matchData: any[] = [];
          if (gameRes && typeof gameRes === 'object' && !gameRes.error) {
            matchData = Object.values(gameRes).filter(v => typeof v === 'object' && v !== null && (v.MarketId || v.marketid || v.Event_Id || v.gid));
          } else if (Array.isArray(gameRes)) {
            matchData = gameRes;
          }
          setGames(matchData);
        }
      } catch (e) {
        console.error("Error fetching competition games:", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchInitialData();
    return () => { isMounted = false; };
  }, [competitionId]);

  // 2. Fetch Detailed Data (/gamedata) for each game
  useEffect(() => {
    if (games.length === 0) return;

    const fetchAllGameData = async () => {
      const dataMap: Record<string, any> = {};
      await Promise.all(games.map(async (game) => {
        const gid = game.gid || game.Event_Id;
        if (gid && !gameDetails[gid]) {
           try {
             // API docs say to call gamedata or gamedatalogin
             const res = await marketController.getGameData(gid);
             if (res && !res.error) {
               // Ensure data is parsed if it comes back as a string
               const parsedRes = typeof res === 'string' ? JSON.parse(res) : res;
               dataMap[gid] = parsedRes;
             }
           } catch (e) {
             console.error(`Error fetching gamedata for ${gid}:`, e);
           }
        }
      }));
      if (Object.keys(dataMap).length > 0) {
        setGameDetails(prev => ({ ...prev, ...dataMap }));
      }
    };

    fetchAllGameData();
  }, [games]);

  // 3. Poll Live Rates (/gamerate as per user request)
  useEffect(() => {
    if (games.length === 0) return;

    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const poll = async () => {
      try {
        const marketsToPoll: { gid: string, MarketId: string, eventid: string }[] = [];
        
        games.forEach(g => {
          const gid = g.gid || g.Event_Id;
          const details = gameDetails[gid];
          
          if (details) {
            // Get ODDS markets - handle both array and object
            const oddsData = details.ODDS || [];
            const oddsMarkets = Array.isArray(oddsData) ? oddsData : Object.values(oddsData);
            oddsMarkets.forEach((m: any) => {
              if (m.MarketId || m.marketid) marketsToPoll.push({ 
                gid: gid.toString(), 
                MarketId: m.MarketId || m.marketid, 
                eventid: g.Event_Id || gid.toString() 
              });
            });

            // Get BOOKMAKER markets
            const bmData = details.BOOKMAKER || [];
            const bmMarkets = Array.isArray(bmData) ? bmData : Object.values(bmData);
            bmMarkets.forEach((m: any) => {
              if (m.MarketId || m.marketid) marketsToPoll.push({ 
                gid: gid.toString(), 
                MarketId: m.MarketId || m.marketid, 
                eventid: g.Event_Id || gid.toString() 
              });
            });
          }

          // Always ensure the base market from competitiongames is polled if not already added
          const baseMarketId = g.MarketId || g.marketid;
          if (baseMarketId && !marketsToPoll.find(m => m.MarketId === baseMarketId)) {
             marketsToPoll.push({ 
               gid: gid.toString(), 
               MarketId: baseMarketId, 
               eventid: g.Event_Id || gid.toString() 
             });
          }
        });

        if (marketsToPoll.length > 0) {
           // User request: call 1 after another (sequentially)
           const oddsMap: Record<string, any> = {};
           
           for (const m of marketsToPoll) {
              if (!isMounted) break;
              try {
                const res = await marketController.getGameRate(m);
                if (res && typeof res === 'object' && !res.error) {
                  // Direct match
                  if (res[m.MarketId]) {
                    const data = typeof res[m.MarketId] === 'string' ? JSON.parse(res[m.MarketId]) : res[m.MarketId];
                    oddsMap[m.MarketId] = data;
                  }
                  
                  // Nested match in other keys (like "0", "1")
                  Object.keys(res).forEach(key => {
                    const val = res[key];
                    if (val && typeof val === 'object') {
                       if (val[m.MarketId]) {
                         const nestedData = typeof val[m.MarketId] === 'string' ? JSON.parse(val[m.MarketId]) : val[m.MarketId];
                         oddsMap[m.MarketId] = nestedData;
                       }
                    }
                  });
                }
              } catch (e) {
                console.error(`Error polling gamerate for ${m.MarketId}:`, e);
              }
           }
           
           if (isMounted && Object.keys(oddsMap).length > 0) {
             setLiveOdds(prev => ({ ...prev, ...oddsMap }));
           }
        }
      } catch (e) {
        console.error("Polling Error:", e)
      }

      if (isMounted) {
        timeoutId = setTimeout(poll, 2000); // Polling every 2s sequentially
      }
    };

    poll();
    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [games, gameDetails]);

  // Process data for rendering
  const matchSections = useMemo(() => {
    return games.map((g, index) => {
      const gid = g.gid || g.Event_Id;
      let details = gameDetails[gid];
      
      // Handle numerical wrapper if present (e.g., response is {"0": {...}})
      if (details && details["0"]) {
        details = details["0"];
      }
      
      let isUpcoming = false;
      const now = new Date();
      if (g.DateTime) {
        let startTimeStr = g.DateTime;
        let d = new Date(startTimeStr.includes('T') ? startTimeStr : startTimeStr.replace(' ', 'T'));
        if (d && !isNaN(d.getTime()) && d > now) isUpcoming = true;
      }

      const sections: any[] = [];

      if (details) {
        const allMarkets: any[] = [];

        // 1. Gather from standard categories
        ['ODDS', 'BOOKMAKER', 'FANCY'].forEach(cat => {
          const mData = details[cat] || [];
          const mArr = Array.isArray(mData) ? mData : Object.values(mData);
          mArr.forEach((m: any) => {
            if (m) allMarkets.push({ ...m, category: cat });
          });
        });

        // 2. Gather from "events" key (per user's response)
        const eventsData = details.events || [];
        const eventsArr = Array.isArray(eventsData) ? eventsData : Object.values(eventsData);
        eventsArr.forEach((m: any) => {
          if (m && !allMarkets.find(am => (am.MarketId || am.marketid) === (m.MarketId || m.marketid))) {
            allMarkets.push({ ...m, category: m.Type || 'ODDS' });
          }
        });

        // 3. Transform to sections
        allMarkets.forEach((m: any) => {
          let runners = m.runner || m.runners || [];
          if (!Array.isArray(runners)) {
            runners = Object.values(runners);
          }

          sections.push({
            id: m.MarketId || m.marketid || m.eid,
            marketName: m.name || m.MarketName || m.marketname || g.Game_Type || 'Match Odds',
            runners,
            marketId: m.MarketId || m.marketid || m.eid,
            isUpcoming,
            startTime: g.DateTime,
            isWinnerType: g.Game_Type === 'Winner' || m.name === 'Winner',
            matchId: gid,
            matchName: details.Team1 && details.Team2 ? `${details.Team1} V ${details.Team2}` : (g.Game_name || `${g.Team1} V ${g.Team2}`)
          });
        });
      }

      // If still no sections, add the base market from competitiongames as fallback
      if (sections.length === 0) {
        const baseMarketId = g.MarketId || g.marketid;
        if (baseMarketId) {
          sections.push({
            id: baseMarketId,
            marketName: g.Game_Type || 'Match Odds',
            runners: [
              { name: g.Team1 || 'Team A', selectionId: 0 },
              { name: g.Team2 || 'Team B', selectionId: 1 }
            ],
            marketId: baseMarketId,
            isUpcoming,
            startTime: g.DateTime,
            matchId: gid,
            matchName: g.Game_name || `${g.Team1} V ${g.Team2}`
          });
        }
      }

      return {
        gid,
        name: g.Game_name || `${g.Team1} V ${g.Team2}`,
        sections
      };
    });
  }, [games, gameDetails]);

  return (
    <div className="flex min-h-screen bg-[#111]">
      <div className="flex-1 pb-20 overflow-hidden">
        {/* Mobile Nav Bar */}
        <div className="md:hidden bg-[#111] px-2 pt-2">
          <div className="flex items-stretch justify-center h-[72px] mx-[-8px]">
            {sportsList.map((sport) => (
              <button
                key={sport.id}
                onClick={() => router.push('/sportsbook/' + sport.id)}
                className={`flex-1 flex flex-col items-center justify-center py-2 px-1 relative ${
                  activeSportId === sport.id ? 'after:content-[""] after:absolute after:bottom-0 after:left-1/4 after:right-1/4 after:h-[2px] after:bg-[#f36c21]' : ''
                }`}
              >
                <img src={sport.icon} alt={sport.name} className="w-8 h-8 object-contain mb-1" />
                <span className={`text-[10px] font-black uppercase tracking-tight ${
                  activeSportId === sport.id ? 'text-white' : 'text-gray-500'
                }`}>
                  {sport.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex bg-[#111] border-b border-white/5 h-12 sticky top-0 z-50">
          {subTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`flex-1 h-full text-[12px] font-black uppercase tracking-widest relative transition-colors ${activeSubTab === tab ? 'text-[#f36c21]' : 'text-gray-500 hover:text-gray-300'
                }`}
            >
              {tab}
              {activeSubTab === tab && (
                <div className="absolute bottom-0 left-[30%] right-[30%] h-[3px] bg-[#f36c21] rounded-t-full shadow-[0_-4px_10px_rgba(243,108,33,0.5)]" />
              )}
            </button>
          ))}
        </div>

        <div className="p-3 lg:p-4 space-y-6">
          {activeSubTab === 'RESULTS' ? (
             <div className="text-center py-20 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                   <Loader2 size={32} className="text-[#f36c21]/20" />
                </div>
                <span className="text-gray-500 font-black uppercase text-[11px] tracking-widest">No Results Data Available Yet</span>
             </div>
          ) : (
            <>
              {isLoading && games.length === 0 ? (
                <div className="py-24 flex flex-col items-center justify-center gap-4">
                  <div className="relative">
                    <Loader2 size={48} className="animate-spin text-[#f36c21]" />
                    <div className="absolute inset-0 blur-xl bg-[#f36c21]/20 animate-pulse rounded-full" />
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#f36c21]">Syncing Global Markets...</p>
                </div>
              ) : matchSections.length > 0 ? (
                matchSections.map((group) => (
                  <div key={group.gid} className="space-y-4">
                    <div className="flex items-center gap-3 mb-2 ml-1">
                       <div className="w-1 h-4 bg-[#f36c21] rounded-full shadow-[0_0_8px_rgba(243,108,33,1)]" />
                       <h2 className="text-white text-[13px] font-black uppercase tracking-widest opacity-90">{group.name}</h2>
                    </div>
                    {group.sections.map((section: any) => (
                      <MarketTable 
                        key={section.id} 
                        {...section} 
                        liveRates={liveOdds} 
                      />
                    ))}
                  </div>
                ))
              ) : (
                <div className="text-center py-20 text-gray-600 font-black uppercase text-[11px] tracking-widest">
                  No Active Markets Found In This Competition
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="hidden lg:block lg:w-[360px] shrink-0 border-l border-white/5 bg-[#1a1a1a]">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <BetContainer />
        </div>
      </div>
    </div>
  )
}

