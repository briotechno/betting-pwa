'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Star, Loader2 } from 'lucide-react'
import { toTitleCase } from '@/utils/format'
import BetContainer from '@/components/sportsbook/BetContainer'
import { marketController } from '@/controllers/market/marketController'

const sportsList = [
  { id: 'Cricket', name: 'Cricket', count: 14, icon: 'https://www.fairplay247.vip/_nuxt/img/cricket.5c05f66.png' },
  { id: 'Soccer', name: 'Soccer', count: 29, icon: 'https://www.fairplay247.vip/_nuxt/img/soccer.9f718cc.png' },
  { id: 'Tennis', name: 'Tennis', count: 41, icon: 'https://www.fairplay247.vip/_nuxt/img/tennis.fc30791.png' },
]

const MatchTable = ({ match }: { match: any }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated } = useAuthStore()

  const navigateToMatch = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/sportsbook/${params.sport}/${match.competitionId || 'league'}/${match.matchId}`)
  }

  const handleOddsClick = () => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }
    router.push(`/sportsbook/${params.sport}/${match.competitionId || 'league'}/${match.matchId}`)
  }

  return (
    <div className="bg-white rounded-b-[12px] shadow-sm border border-[#f36c21] mt-5 relative group">
      {/* Live Badge - Overlapping Corner */}
      {!match.isUpcoming ? (
        <div 
          onClick={navigateToMatch}
          className="absolute -top-[12px] text-normal -left-[4px] bg-[#28a745] text-white text-[9px] lg:text-[11px] font-black px-2.5 py-[3px] rounded-[6px] italic leading-tight uppercase z-40 shadow-md transform transition-transform duration-200 cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-1 border border-[#238a3a]"
        >
          LIVE
        </div>
      ) : (
        <div 
          onClick={navigateToMatch}
          className="absolute -top-[12px] text-normal -left-[4px] bg-[#1a9ebf] text-white text-[9px] lg:text-[11px] font-black px-2.5 py-[3px] rounded-[6px] italic leading-tight uppercase z-40 shadow-md transform transition-transform duration-200 cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-1 border border-[#147a93]"
        >
          UPCOMING
        </div>
      )}

      {/* Header */}
      <div className="h-10 lg:h-12 flex items-center relative select-none bg-[#e0e0e0] overflow-hidden">
        {/* Toggle Button Column */}
        <div 
          className="w-10 lg:w-12 h-full flex items-center justify-center bg-[#e8612c] text-white cursor-pointer hover:bg-[#d85826] transition-colors z-20"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <span className="text-[18px] lg:text-[20px] font-medium leading-none mb-1">
            {isCollapsed ? '+' : '−'}
          </span>
        </div>

        {/* Match Name - Main Clickable Area */}
        <div 
          onClick={navigateToMatch}
          className="flex-1 h-full flex items-center pl-2 lg:pl-4 bg-gradient-to-r from-[#e8612c] to-[#e8612c] cursor-pointer hover:to-[#f1713d] transition-all relative z-10"
          style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)' }}
        >
          <span className="text-white text-[12px] lg:text-[14px] font-bold whitespace-nowrap uppercase tracking-tight group-hover:pl-1 transition-all">
            {toTitleCase(match.teamA)} V {toTitleCase(match.teamB)}
          </span>
        </div>

        {/* Right Side - Icons */}
        <div className="flex items-center justify-end pr-3 gap-3 z-0 ml-[-20px] pl-8 flex-1">
          <div className="w-4 h-4 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#28a745] fill-current">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <Star size={18} className="text-[#ffd700] fill-none stroke-[2px]" />
          <div className="hidden lg:flex ml-2 text-[11px] font-bold text-gray-500 italic uppercase">
             {match.startTime}
          </div>
        </div>
      </div>

      {/* Table Body */}
      {!isCollapsed && (
        <div className="overflow-x-auto lg:overflow-visible rounded-b-[11px]">
          <table className="w-full border-collapse">
            <tbody>
              {/* Team Rows */}
              {[match.teamA, match.teamB].map((team, tIdx) => (
                <tr key={team} className={tIdx === 0 ? "border-b border-gray-100" : ""}>
                  <td className="py-3 px-3 lg:px-4 min-w-[140px]">
                    <span className="text-[13px] lg:text-[14px] font-bold text-[#333] tracking-tight whitespace-nowrap">
                      {toTitleCase(team)}
                    </span>
                  </td>
                  <td className="p-1 px-2">
                    <div className="flex justify-end gap-1">
                      {/* Odds columns - Responsive */}
                      <div className="flex gap-1 py-1">
                        {/* Mobile: Only show 2 columns; Desktop: Show all 6 */}

                        {/* Back Columns */}
                        <div className="hidden lg:flex gap-1">
                          <OddsBox onClick={handleOddsClick} val={match.odds[tIdx].back3} vol={match.odds[tIdx].backVol3} type="back" intensity="low" />
                          <OddsBox onClick={handleOddsClick} val={match.odds[tIdx].back2} vol={match.odds[tIdx].backVol2} type="back" intensity="medium" />
                        </div>
                        <OddsBox onClick={handleOddsClick} val={match.odds[tIdx].back} vol={match.odds[tIdx].backVol} type="back" intensity="high" />

                        {/* Lay Columns */}
                        <OddsBox onClick={handleOddsClick} val={match.odds[tIdx].lay} vol={match.odds[tIdx].layVol} type="lay" intensity="high" />
                        <div className="hidden lg:flex gap-1">
                          <OddsBox onClick={handleOddsClick} val={match.odds[tIdx].lay2} vol={match.odds[tIdx].layVol2} type="lay" intensity="medium" />
                          <OddsBox onClick={handleOddsClick} val={match.odds[tIdx].lay3} vol={match.odds[tIdx].layVol3} type="lay" intensity="low" />
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const OddsBox = ({ val, vol, type, intensity = 'high', onClick }: { val: string, vol: string, type: 'back' | 'lay', intensity?: 'low' | 'medium' | 'high', onClick?: () => void }) => {
  const [blink, setBlink] = React.useState(false)
  const prevValue = React.useRef(val)

  React.useEffect(() => {
    // Exact logic from main page
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
      className={`w-[65px] lg:w-[60px] h-[40px] rounded-[0.4rem] flex flex-col items-center justify-center transition-all shadow-sm border border-transparent ${isEmpty ? 'bg-[#e0e0e0] opacity-70' : bgColor} ${blink ? 'animate-rate-change' : ''} hover:brightness-95 active:scale-95`}
    >
      <span className={`text-[12px] lg:text-[12px] font-black ${isEmpty ? 'text-[#999]' : 'text-[#2e2e2e]'} leading-none mb-0.5`}>{val || '-'}</span>
      {!isEmpty && <span className="text-[8.5px] lg:text-[9px] text-[#4a4a4a] font-bold leading-none">{vol || ''}</span>}
    </button>
  )
}

import { useAuthStore } from '@/store/authStore'

export default function SportDetailPage() {
  const { user } = useAuthStore()
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const [activeSubTab, setActiveSubTab] = useState('LIVE & UPCOMING')

  const subTabs = ['LIVE & UPCOMING', 'LEAGUES', 'RESULTS']

  // Find active sport based on URL path or default to Cricket on /sportsbook
  const activeSportId = sportsList.find(s => 
    pathname.toLowerCase().includes(s.id.toLowerCase())
  )?.id || 'Cricket'

  const searchParams = useSearchParams()
  const competitionCode = searchParams.get('competition')

  const [competitions, setCompetitions] = useState<any[]>([])
  const [loadingLeagues, setLoadingLeagues] = useState(false)

  const [games, setGames] = useState<any[]>([])
  const [liveOdds, setLiveOdds] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)

  // 0. Fetch Leagues 
  useEffect(() => {
    let isMounted = true;
    const fetchLeagues = async () => {
      try {
        setLoadingLeagues(true)
        const res = await marketController.getCompetitionList(activeSportId)
        if (isMounted) {
          if (Array.isArray(res)) setCompetitions(res)
          else if (res && typeof res === 'object' && !res.error) setCompetitions(Object.values(res))
        }
      } catch (error) {
         console.error(error)
      } finally {
        if (isMounted) setLoadingLeagues(false)
      }
    }
    fetchLeagues()
    return () => { isMounted = false }
  }, [activeSportId])

  // 1. Fetch Gamlist initially (Always full list for the sport here)
  useEffect(() => {
    let isMounted = true;
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const gameRes = await marketController.getGameList(activeSportId);

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
        console.error("Error fetching data:", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchInitialData();
    return () => { isMounted = false; };
  }, [activeSportId]);

  // 2. Poll Live Odds for fetched games
  useEffect(() => {
    if (games.length === 0) return;
    const marketIds = games.map(g => g.MarketId || g.marketid).filter(Boolean).join(',');
    if (!marketIds) return;

    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const poll = async () => {
      try {
        const res = await marketController.getLiveRates(marketIds);
        if (isMounted && res && typeof res === 'object' && !res.error) {
          if (Array.isArray(res)) {
            const oddsMap: Record<string, any> = {};
            res.forEach(item => { if (item.MarketId || item.marketid) oddsMap[item.MarketId || item.marketid] = item; });
            setLiveOdds(prev => ({ ...prev, ...oddsMap }));
          } else {
            setLiveOdds(prev => ({ ...prev, ...res }));
          }
        }
      } catch (e) {
        console.error("Poll Error:", e)
      }

      if (isMounted) {
        timeoutId = setTimeout(poll, 200); // Fast poll like main page
      }
    };

    poll();
    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [games]);

  // 3. Process matches for MatchTable format
  const processedMatches = useMemo(() => {
    return games.map((g, index) => {
      const mId = g.MarketId || g.marketid;
      const oddsData = liveOdds[mId];
      const runners = oddsData?.runner || oddsData?.runners || [];
      const runnerArr = Array.isArray(runners) ? runners : Object.values(runners);

      const getPrices = (r: any, type: 'back'|'lay') => {
        if (!r) return { p1: '', v1: '', p2: '', v2: '', p3: '', v3: '' };
        const data = type === 'back' ? (r.back || r.availableToBack || r.ex?.availableToBack) : (r.lay || r.availableToLay || r.ex?.availableToLay);
        const arr = Array.isArray(data) ? data : Object.values(data || {});
        
        // Match main page extraction precisely
        const rate1 = arr[0]?.rate || arr[0]?.price || (type === 'back' ? r.lastPriceTraded : '') || '';
        
        return {
          p1: rate1 ? rate1.toString() : '',
          v1: arr[0]?.size || '',
          p2: (arr[1]?.rate || arr[1]?.price || '')?.toString(),
          v2: arr[1]?.size || '',
          p3: (arr[2]?.rate || arr[2]?.price || '')?.toString(),
          v3: arr[2]?.size || '',
        };
      };

      const teamAOdds = runnerArr[0];
      const teamBOdds = runnerArr[1];

      const backA = getPrices(teamAOdds, 'back');
      const layA = getPrices(teamAOdds, 'lay');
      const backB = getPrices(teamBOdds, 'back');
      const layB = getPrices(teamBOdds, 'lay');

      // Check if upcoming
      let isUpcoming = false;
      const now = new Date();
      if (g.DateTime) {
        let startTimeStr = g.DateTime;
        let d = new Date(startTimeStr.includes('T') ? startTimeStr : startTimeStr.replace(' ', 'T'));
        if (isNaN(d.getTime())) {
          const parts = startTimeStr.split(/[-/ :]/);
          if (parts.length >= 3) {
            d = new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]), parseInt(parts[3]||'0'), parseInt(parts[4]||'0'), parseInt(parts[5]||'0'));
          }
        }
        if (d && !isNaN(d.getTime()) && d > now) {
          isUpcoming = true;
        }
      }

      return {
        id: g.Event_Id || g.gid || index,
        teamA: g.Team1 || g.Game_name?.split(' Vs ')[0] || 'Team A',
        teamB: g.Team2 || g.Game_name?.split(' Vs ')[1] || 'Team B',
        startTime: g.DateTime || 'Live',
        isUpcoming: isUpcoming,
        matchId: g.gid || g.Event_Id,
        competitionId: g.CompetitionCode || g.cid || 'all',
        odds: [
          { 
            back: backA.p1, backVol: backA.v1, back2: backA.p2, backVol2: backA.v2, back3: backA.p3, backVol3: backA.v3,
            lay: layA.p1, layVol: layA.v1, lay2: layA.p2, layVol2: layA.v2, lay3: layA.p3, layVol3: layA.v3
          },
          { 
            back: backB.p1, backVol: backB.v1, back2: backB.p2, backVol2: backB.v2, back3: backB.p3, backVol3: backB.v3,
            lay: layB.p1, layVol: layB.v1, lay2: layB.p2, layVol2: layB.v2, lay3: layB.p3, layVol3: layB.v3
          }
        ]
      }
    })
  }, [games, liveOdds]);

  return (
    <div className="flex min-h-screen bg-[#1a1a1a]">
      {/* Main Content Area */}
      <div className="flex-1 pb-20 overflow-hidden">
        {/* Sports Navigation Bar - Mobile Only */}
        <div className="md:hidden bg-[#1a1a1a] px-2 pt-2 pb-0">
          <div className="flex items-stretch justify-center h-[72px] mx-[-8px]">
            {sportsList.map((sport) => (
              <button
                key={sport.id}
                onClick={() => {
                   if (sport.id === 'Cricket') {
                     router.push('/sportsbook')
                   } else {
                     router.push('/sportsbook/' + sport.id)
                   }
                }}
                className={`flex-1 flex flex-col items-center justify-center py-2 px-1 relative ${
                  activeSportId === sport.id ? 'after:content-[""] after:absolute after:bottom-0 after:left-1/4 after:right-1/4 after:h-[2px] after:bg-[#e8612c]' : ''
                }`}
              >
                <div className="relative mb-1">
                  <img src={sport.icon} alt={sport.name} className="w-8 h-8 object-contain" />
                  <div className="absolute -top-1 -right-4 bg-[#e8612c] text-white text-[10px] font-black rounded-full min-w-[20px] h-5 flex items-center justify-center border border-[#1a1a1a] px-1 shadow-sm z-10">
                    {sport.count}
                  </div>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-tight ${
                  activeSportId === sport.id ? 'text-white' : 'text-gray-400 opacity-80'
                }`}>
                  {sport.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Sub tabs nav */}
        <div className="flex bg-[#1a1a1a] border-b border-white/5 h-10">
          {subTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`flex-1 h-full text-[11px] font-black uppercase tracking-tight relative ${activeSubTab === tab ? 'text-[#e8612c]' : 'text-gray-400'
                }`}
            >
              {tab}
              {activeSubTab === tab && (
                <div className="absolute bottom-0 left-[20%] right-[20%] h-[2px] bg-[#e8612c]" />
              )}
            </button>
          ))}
        </div>

        {/* Main Content Area based on Tab */}
        <div className="p-2 space-y-3">
          {activeSubTab === 'LEAGUES' ? (
             <div className="flex flex-col gap-1">
               {loadingLeagues ? (
                 <div className="py-20 flex flex-col items-center justify-center text-white/20 gap-3">
                   <Loader2 size={40} className="animate-spin text-[#e8612c]" />
                   <p className="text-[10px] font-black uppercase tracking-widest">Loading Leagues...</p>
                 </div>
               ) : competitions.length > 0 ? (
                 competitions.map((comp: any) => (
                   <button
                     key={comp.CompetitionCode || comp.Competition}
                     onClick={() => {
                        router.push(`/sportsbook/${activeSportId}/${comp.CompetitionCode}`);
                     }}
                     className="w-full text-left px-4 py-3 bg-[#222] text-[13px] text-gray-300 hover:text-white cursor-pointer hover:bg-[#333] transition-colors border-l-2 border-transparent hover:border-[#e8612c] rounded-md font-bold mb-1"
                   >
                     {comp.Competition}
                   </button>
                 ))
               ) : (
                 <div className="text-center py-10 text-gray-400 font-bold uppercase text-[12px]">No Leagues Found</div>
               )}
             </div>
          ) : activeSubTab === 'RESULTS' ? (
             <div className="text-center py-10 text-gray-400 font-bold uppercase text-[12px]">No Results Available</div>
          ) : (
            <>
              {isLoading && games.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-white/20 gap-3">
                  <Loader2 size={40} className="animate-spin text-[#e8612c]" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Loading Live Data...</p>
                </div>
              ) : processedMatches.length > 0 ? (
                processedMatches.map((match) => (
                  <MatchTable key={match.id} match={match} />
                ))
              ) : (
                <div className="text-center py-10 text-gray-400 font-bold uppercase text-[12px]">No Matches Found</div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bet Container - attached but separate column */}
      {user && (
        <div className="hidden lg:block lg:w-[350px] shrink-0">
          <BetContainer />
        </div>
      )}
    </div>
  )
}
