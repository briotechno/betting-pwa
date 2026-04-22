'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Star, Loader2 } from 'lucide-react'
import { toTitleCase, formatTime12h } from '@/utils/format'
import BetContainer from '@/components/sportsbook/BetContainer'
import { marketController } from '@/controllers/market/marketController'
import { useAuthStore } from '@/store/authStore'
import { useSnackbarStore } from '@/store/snackbarStore'

const sportsList = [
  { id: 'Cricket', name: 'Cricket', icon: '/sports-icons/cricket.13c45ec.png' },
  { id: 'Football', name: 'Football', icon: '/sports-icons/soccer.edef26e.png' },
  { id: 'Tennis', name: 'Tennis', icon: '/sports-icons/tennis.61acaee.png' },
]

const MatchTable = ({ match, onToggleFav }: { match: any, onToggleFav: () => void }) => {
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
      <div className="h-10 lg:h-12 flex items-center relative select-none bg-[#e0e0e0]">
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
          className="flex-[4] h-full flex items-center pl-2 lg:pl-4 bg-gradient-to-r from-[#e8612c] to-[#e8612c] cursor-pointer hover:to-[#f1713d] transition-all relative z-10"
          style={{ clipPath: 'polygon(0 0, 100% 0, 97% 100%, 0% 100%)' }}
        >
          <div className="flex flex-col justify-center py-1">
            <span className="text-white text-[11px] lg:text-[13px] font-bold uppercase tracking-[0.02em] group-hover:pl-1 transition-all leading-[1.1]">
              {(match.teamA || '').replace(/_/g, ' ')} V {(match.teamB || '').replace(/_/g, ' ')}
            </span>
            <span className="text-white/80 text-[8px] lg:text-[9px] font-medium uppercase italic mt-0.5">
              {formatTime12h(match.startTime)}
            </span>
          </div>
        </div>

        {/* Right Side - Icons */}
        <div className="flex items-center justify-end pr-3 gap-3 z-20 ml-[-10px] pl-6 flex-initial min-w-[60px]">
          <div 
            className="w-4 h-4 hidden md:flex items-center justify-center relative group/inplay cursor-pointer"
            onClick={(e) => { e.stopPropagation(); setIsCollapsed(!isCollapsed); }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#28a745] fill-current">
              <path d="M8 5v14l11-7z" />
            </svg>
            <div className="absolute bottom-full right-0 mb-2 hidden group-hover/inplay:block z-[100] whitespace-nowrap bg-black text-white text-[10px] font-black px-2 py-1 rounded shadow-lg uppercase tracking-wider">
              In Play
            </div>
          </div>
          <Star 
            size={18} 
            className={`hidden md:block text-[#ffd700] cursor-pointer transition-all hover:scale-110 active:scale-95 ${match.isFavourite ? 'fill-[#ffd700]' : 'fill-none'} stroke-[2px]`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFav();
            }}
          />
        </div>
      </div>

      {/* Table Body */}
      {!isCollapsed && (
        <div className="overflow-x-auto lg:overflow-visible rounded-b-[11px]">
          <table className="w-full border-collapse">
            <tbody>
              {/* Team Rows */}
              {[match.teamA, match.teamB].map((team, tIdx) => (
                <tr key={team} className={tIdx === 0 ? "border-b border-black/30" : ""}>
                  <td className="py-2 px-3 lg:px-4 min-w-[140px] max-w-[200px]">
                    <div className="flex flex-col">
                      <span className="text-[0.7rem] lg:text-[0.75rem] font-bold text-[#333] tracking-[0.02em] uppercase leading-tight">
                        {(team || '').replace(/_/g, ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="p-1 px-2">
                    <div className="flex justify-end gap-1">
                      {/* Odds columns - Responsive */}
                      <div className="flex gap-1 py-1">
                        {/* Mobile: Only show 2 columns; Desktop: Show all 6 */}

                        {/* Back Columns */}
                        <div className="hidden lg:flex gap-1">
                          <OddsBox onClick={handleOddsClick} val={match.odds[tIdx].back3} vol={match.odds[tIdx].backVol3} type="back" intensity="low" isUpcoming={match.isUpcoming} />
                          <OddsBox onClick={handleOddsClick} val={match.odds[tIdx].back2} vol={match.odds[tIdx].backVol2} type="back" intensity="medium" isUpcoming={match.isUpcoming} />
                        </div>
                        <OddsBox onClick={handleOddsClick} val={match.odds[tIdx].back} vol={match.odds[tIdx].backVol} type="back" intensity="high" isUpcoming={match.isUpcoming} />

                        {/* Lay Columns */}
                        <OddsBox onClick={handleOddsClick} val={match.odds[tIdx].lay} vol={match.odds[tIdx].layVol} type="lay" intensity="high" isUpcoming={match.isUpcoming} />
                        <div className="hidden lg:flex gap-1">
                          <OddsBox onClick={handleOddsClick} val={match.odds[tIdx].lay2} vol={match.odds[tIdx].layVol2} type="lay" intensity="medium" isUpcoming={match.isUpcoming} />
                          <OddsBox onClick={handleOddsClick} val={match.odds[tIdx].lay3} vol={match.odds[tIdx].layVol3} type="lay" intensity="low" isUpcoming={match.isUpcoming} />
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

const OddsBox = ({ val, vol, type, intensity = 'high', onClick, isUpcoming }: { val: string, vol: string, type: 'back' | 'lay', intensity?: 'low' | 'medium' | 'high', onClick?: () => void, isUpcoming?: boolean }) => {
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
      disabled={isUpcoming}
      className={`w-[65px] lg:w-[60px] h-[40px] rounded-[0.4rem] flex flex-col items-center justify-center transition-all shadow-sm border border-transparent relative overflow-hidden ${isEmpty && !isUpcoming ? 'bg-[#e0e0e0] opacity-70' : bgColor} ${blink && !isUpcoming ? 'animate-rate-change' : ''} hover:brightness-95 active:scale-95`}
    >
      <span className={`relative z-0 text-[12px] lg:text-[12px] font-black ${isEmpty ? 'text-[#999]' : 'text-[#2e2e2e]'} leading-none mb-0.5`}>{val || '-'}</span>
      {!isEmpty && <span className="relative z-0 text-[8.5px] lg:text-[9px] text-[#4a4a4a] font-bold leading-none">{vol || ''}</span>}
      
      {isUpcoming && (
        <div className="absolute inset-0 bg-[#212121] opacity-[0.46] z-10"></div>
      )}
    </button>
  )
}


function SportDetailContent() {
  const { user, isAuthenticated } = useAuthStore()
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const [activeSubTab, setActiveSubTab] = useState('LIVE & UPCOMING')
  const [sportCounts, setSportCounts] = useState<Record<string, number>>({})

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

  // Fetch Sport Counts for Mobile Nav
  useEffect(() => {
    let isMounted = true
    const fetchCounts = async () => {
      try {
        const res = await marketController.getGameList('Cricket,Football,Tennis')
        if (!isMounted) return

        let matchData: any[] = []
        if (res && typeof res === 'object') {
          matchData = Object.values(res).filter((v: any) => typeof v === 'object' && v !== null && (v.MarketId || v.marketid || v.Gid || v.gid))
        } else if (Array.isArray(res)) {
          matchData = res
        }

        const counts: Record<string, number> = {}
        matchData.forEach(m => {
          const status = (m.Status || m.status || 'OPEN').toUpperCase()
          if (status === 'CLOSED' || status === 'INACTIVE') return

          const type = (m.Type || m.sportname || '').toLowerCase()
          const sportKeys = ['Cricket', 'Football', 'Tennis']
          
          sportKeys.forEach(key => {
            const kLower = key.toLowerCase()
            let isMatch = type.includes(kLower) || kLower.includes(type)
            if (!isMatch) {
              if (kLower === 'football' && type === 'soccer') isMatch = true
              if (kLower === 'soccer' && type === 'football') isMatch = true
            }
            if (isMatch) counts[key] = (counts[key] || 0) + 1
          })
        })
        setSportCounts(counts)
      } catch (err) {
        console.error('Failed to fetch sidebar counts:', err)
      }
    }

    fetchCounts()
    const interval = setInterval(fetchCounts, 60000)
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

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
  const handleToggleFav = async (eid: string, index: number) => {
    if (!isAuthenticated || !user?.loginToken) {
      router.push('/auth/login')
      return
    }
    try {
      const res = await marketController.toggleFavourite(user.loginToken, eid.toString())
      if (res.error === '0' || res.status === 'success' || res.message?.toLowerCase().includes('success')) {
        const newGames = [...games]
        const game = newGames[index]
        if (game) {
          const currentFav = game.IsFavorite === '1' || game.isFavorite === 'Yes' || game.fav === '1' || game.IsFavorite === true
          game.IsFavorite = currentFav ? '0' : '1'
          game.fav = currentFav ? '0' : '1'
          setGames(newGames)
          useSnackbarStore.getState().show(
            currentFav ? 'Removed from Favorites' : 'Added to Favorites',
            'success'
          )
        }
      } else {
        useSnackbarStore.getState().show(res.message || 'Failed to update favorites', 'error')
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err)
      useSnackbarStore.getState().show('Failed to update favorites', 'error')
    }
  }

  const processedMatches = useMemo(() => {
    return games.map((g, index) => {
      const mId = g.MarketId || g.marketid;
      const oddsData = liveOdds[mId];
      const runners = oddsData?.runner || oddsData?.runners || [];
      const runnerArr = Array.isArray(runners) ? runners : Object.values(runners);

      const getPrices = (r: any, type: 'back' | 'lay') => {
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
            d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]), parseInt(parts[3] || '0'), parseInt(parts[4] || '0'), parseInt(parts[5] || '0'));
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
        isFavourite: g.IsFavorite === '1' || g.isFavorite === 'Yes' || g.fav === '1' || g.IsFavorite === true,
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
    }).sort((a, b) => {
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
      return parseDate(a.startTime).getTime() - parseDate(b.startTime).getTime();
    })
  }, [games, liveOdds]);

  return (
    <div className="flex min-h-screen bg-[#1a1a1a] lg:gap-4 lg:bg-transparent">
      {/* Main Content Area */}
      <div className="flex-1 pb-20 bg-[#1a1a1a] rounded-lg overflow-hidden">
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
                className={`flex-1 flex flex-col items-center justify-center py-2 px-1 relative ${activeSportId === sport.id ? 'after:content-[""] after:absolute after:bottom-0 after:left-1/4 after:right-1/4 after:h-[2px] after:bg-[#e8612c]' : ''
                  }`}
              >
                <div className="relative mb-1">
                  <img src={sport.icon} alt={sport.name} className="w-8 h-8 object-contain" />
                  {sportCounts[sport.name] !== undefined && (
                    <div className="absolute -top-1 -right-4 bg-[#e8612c] text-white text-[10px] font-black rounded-full min-w-[20px] h-5 flex items-center justify-center border border-[#1a1a1a] px-1 shadow-sm z-10">
                      {sportCounts[sport.name]}
                    </div>
                  )}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-tight ${activeSportId === sport.id ? 'text-white' : 'text-gray-400 opacity-80'
                  }`}>
                  {sport.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Sub tabs nav */}
        <div className="flex justify-center bg-[#1a1a1a] border-b border-white/5 h-10 px-4 gap-4 box-border">
          {subTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className="h-full relative group flex items-center"
            >
              <span className={`text-[13px] font-black uppercase tracking-tight h-full flex items-center transition-colors border-b-2 ${activeSubTab === tab 
                ? 'text-[#f36c21] border-[#f36c21]' 
                : 'text-gray-400 border-transparent hover:text-white'
              }`}>
                {tab}
              </span>
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
                processedMatches.map((match, index) => (
                  <MatchTable 
                    key={match.id} 
                    match={match} 
                    onToggleFav={() => handleToggleFav(match.matchId, index)} 
                  />
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
        <div className="hidden lg:block lg:w-[480px] sticky top-0 max-h-screen overflow-y-auto self-start shrink-0 lg:border-none lg:rounded-lg lg:overflow-hidden border-l border-white/5 bg-[#111] z-30">
          <BetContainer />
        </div>
      )}
    </div>
  )
}

export default function SportDetailPage() {
  return (
    <React.Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#1a1a1a]">
        <Loader2 size={40} className="animate-spin text-[#e8612c]" />
      </div>
    }>
      <SportDetailContent />
    </React.Suspense>
  )
}

