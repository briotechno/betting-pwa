'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronLeft, Home, Star, Loader2 } from 'lucide-react'
import { useLayoutStore } from '@/store/layoutStore'
import { marketController } from '@/controllers/market/marketController'

const games = [
  {
    id: 4,
    name: "Cricket",
    image: "/sports-icons/cricket.13c45ec.png",
    count: 13,
    link: "/sportsbook/Cricket"
  },
  {
    id: 1,
    name: "Football",
    image: "/sports-icons/soccer.edef26e.png",
    count: 53,
    link: "/sportsbook/Football"
  },
  {
    id: 2,
    name: "Tennis",
    image: "/sports-icons/tennis.61acaee.png",
    count: 71,
    link: "/sportsbook/Tennis"
  },
  {
    id: 6,
    name: "Live Card",
    image: "https://www.fairplay247.vip/_nuxt/img/cardicon.7aecfb2.png",
    count: null,
    link: "/markets/live-cards"
  },
  {
    id: 7,
    name: "Live Casino",
    image: "https://www.fairplay247.vip/_nuxt/img/casino.1716d18.png",
    count: null,
    link: "/markets/live-casino"
  },
  {
    id: 8,
    name: "Slot Games",
    image: "https://www.fairplay247.vip/_nuxt/img/sloticon.b675c22.png",
    count: null,
    link: "/casino-slots"
  },
  {
    id: 9,
    name: "Kabaddi",
    image: "https://www.fairplay247.vip/_nuxt/img/kabaddi.0f69472.png",
    count: null,
    link: "/premium-sportsbook"
  },
  {
    id: 10,
    name: "Badminton",
    image: "https://www.fairplay247.vip/_nuxt/img/badminton.fdfeeb2.png",
    count: null,
    link: "/premium-sportsbook"
  },
  {
    id: 11,
    name: "Golf",
    image: "https://www.fairplay247.vip/_nuxt/img/golf.79503ca.png",
    count: null,
    link: "/premium-sportsbook"
  },
  {
    id: 12,
    name: "Baseball",
    image: "https://www.fairplay247.vip/_nuxt/img/baseball.d156a0e.png",
    count: null,
    link: "/premium-sportsbook"
  },
  {
    id: 13,
    name: "Counter Strike",
    image: "https://www.fairplay247.vip/_nuxt/img/cs.9f42e30.png",
    count: null,
    link: "/premium-sportsbook"
  },
  {
    id: 14,
    name: "Rugby",
    image: "https://www.fairplay247.vip/_nuxt/img/rugby.ff7064a.png",
    count: null,
    link: "/premium-sportsbook"
  },
  {
    id: 15,
    name: "Boxing",
    image: "https://www.fairplay247.vip/_nuxt/img/boxing.22fa7c2.png",
    count: null,
    link: "/premium-sportsbook"
  },
  {
    id: 16,
    name: "FIFA",
    image: "https://www.fairplay247.vip/_nuxt/img/fifa.d5ed003.png",
    count: null,
    link: "/premium-sportsbook"
  },
  {
    id: 17,
    name: "Voleyball",
    image: "https://www.fairplay247.vip/_nuxt/img/voleyball.06a969d.png",
    count: null,
    link: "/premium-sportsbook"
  },
  {
    id: 18,
    name: "Dota 2",
    image: "https://www.fairplay247.vip/_nuxt/img/dota.a84e307.png",
    count: null,
    link: "/premium-sportsbook"
  },
  {
    id: 19,
    name: "Virtual",
    image: "https://www.fairplay247.vip/_nuxt/img/virtual.663631a.png",
    count: null,
    link: "/premium-sportsbook"
  },
  {
    id: 20,
    name: "eFighting",
    image: "https://www.fairplay247.vip/_nuxt/img/efighting.2749af6.png",
    count: null,
    link: "/premium-sportsbook"
  },
  {
    id: 21,
    name: "Table Tennis",
    image: "https://www.fairplay247.vip/_nuxt/img/table-tennis.cd1c2fa.png",
    count: null,
    link: "/premium-sportsbook"
  },
  {
    id: 22,
    name: "Formula 1",
    image: "https://www.fairplay247.vip/_nuxt/img/formula.1cfa0c6.png",
    count: null,
    link: "/premium-sportsbook"
  }
];

const cricketEvents = [
  "Warriors v Titans",
  "Kwazulu Natal Inland v Lions"
];

const cricketLeagues = [
  "CSA Provincial One-Day Challenge Div 1",
  "Legends Cricket League",
  "Pakistan National T20 Cup",
  "Womens International Twenty20 Matches",
  "International Twenty20 Matches",
  "CSA One-Day Challenge Div 2",
  "Plunket Shield",
  "T20 Ayodhya Premier League",
  "Pakistan Super League SRL",
  "Super Smash SRL",
  "Big Bash League SRL",
  "Premier League SRL",
  "Caribbean Premier League SRL",
  "SA T20 League SRL",
  "T20 International SRL",
  "T20 Series Namibia A vs Uganda",
  "Indian Premier League"
];

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { sidebarCollapsed: collapsed, setSidebarCollapsed: setCollapsed } = useLayoutStore()
  const [mounted, setMounted] = useState(false)
  const [dynamicLeagues, setDynamicLeagues] = useState<any[]>([])
  const [loadingLeagues, setLoadingLeagues] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [sportCounts, setSportCounts] = useState<Record<string, number>>({})

  // Fetch Sport Counts
  useEffect(() => {
    let isMounted = true
    const fetchCounts = async () => {
      try {
        const sportsToFetch = games.map(g => g.name).join(',')
        const res = await marketController.getGameList(sportsToFetch)
        if (!isMounted) return

        let matchData: any[] = []
        if (res && typeof res === 'object') {
          matchData = Object.values(res).filter((v: any) => typeof v === 'object' && v !== null && (v.MarketId || v.marketid || v.Gid || v.gid))
        } else if (Array.isArray(res)) {
          matchData = res
        }

        const counts: Record<string, number> = {}
        const now = new Date()

        matchData.forEach(m => {
          // Determine if it's bettable (Live or Upcoming)
          const status = (m.Status || m.status || 'OPEN').toUpperCase()
          if (status === 'CLOSED' || status === 'INACTIVE') return

          // Basic time check - usually we want anything that is happening now or in the future
          let isUpcoming = false
          const startTimeStr = m.DateTime || m.startTime
          if (startTimeStr) {
            let d = new Date(startTimeStr.includes('T') ? startTimeStr : startTimeStr.replace(' ', 'T'))
            // Fallback for DD-MM-YYYY
            if (isNaN(d.getTime())) {
              const parts = startTimeStr.split(/[-/ :]/)
              if (parts.length >= 3) {
                d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]), parseInt(parts[3] || '0'), parseInt(parts[4] || '0'), parseInt(parts[5] || '0'))
              }
            }
            if (d && !isNaN(d.getTime()) && d > now) {
              isUpcoming = true
            }
          }

          const type = (m.Type || m.sportname || '').toLowerCase()
          // Dynamically match against all sports in our games list
          games.forEach(g => {
            // Skip counting for Table Tennis as it's a redirect
            if (g.name === "Table Tennis") return;

            const gameNameLower = g.name.toLowerCase()
            let isMatch = false

            if (type === gameNameLower) {
              isMatch = true
            } else if (type.includes(gameNameLower)) {
              // Prevent "Table Tennis" match types from matching regular "Tennis"
              if (gameNameLower === 'tennis' && type.includes('table tennis')) {
                isMatch = false
              } else {
                isMatch = true
              }
            }

            // Special cases
            if (!isMatch) {
              if (gameNameLower === 'football' && type === 'soccer') isMatch = true
              if (gameNameLower === 'soccer' && type === 'football') isMatch = true
            }

            if (isMatch) {
              counts[g.name] = (counts[g.name] || 0) + 1
            }
          })
        })
        setSportCounts(counts)
      } catch (err) {
        console.error('Failed to fetch sidebar counts:', err)
      }
    }

    fetchCounts()
    const interval = setInterval(fetchCounts, 60000) // Update every minute
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  // Check path levels unconditionally
  const pathParts = pathname?.split('/').filter(Boolean) || []
  const isSportPath = pathname?.startsWith('/sportsbook') && pathParts.length >= 2
  const isEventPath = pathParts.length >= 3 // /sportsbook/sport/competitionId
  const currentSport = isSportPath ? pathParts[1] : null
  const competitionId = isEventPath ? (
    pathParts.length >= 4 && ['league', 'event', 'all'].includes(pathParts[2].toLowerCase()) 
      ? pathParts[3] 
      : pathParts[2]
  ) : null
  const activeSportData = games.find(g => g.name.toLowerCase() === currentSport?.toLowerCase())

  useEffect(() => {
    setMounted(true)
  }, [])

  // 1. Fetch Leagues dynamically if no competition is selected
  useEffect(() => {
    if (isSportPath && currentSport && !isEventPath) {
      let isMounted = true;
      const fetchLeagues = async () => {
        try {
          setLoadingLeagues(true)
          const res = await marketController.getCompetitionList(currentSport)
          if (isMounted) {
            if (Array.isArray(res)) setDynamicLeagues(res)
            else if (res && typeof res === 'object' && !res.error) setDynamicLeagues(Object.values(res))
          }
        } catch (error) {
          console.error(error)
        } finally {
          if (isMounted) setLoadingLeagues(false)
        }
      }
      fetchLeagues()
      return () => { isMounted = false }
    }
  }, [currentSport, isSportPath, isEventPath])

  // 2. Fetch Games dynamically if a competition IS selected
  const [competitionGames, setCompetitionGames] = useState<any[]>([])
  const [loadingGames, setLoadingGames] = useState(false)

  useEffect(() => {
    if (isSportPath && competitionId) {
      let isMounted = true;
      const fetchGames = async () => {
        try {
          setLoadingGames(true)
          const res = await marketController.getCompetitionGames(competitionId)
          if (isMounted) {
            let matchData: any[] = [];
            if (res && typeof res === 'object' && !res.error) {
              matchData = Object.values(res).filter(v => typeof v === 'object' && v !== null && (v.MarketId || v.marketid || v.Event_Id || v.gid));
            } else if (Array.isArray(res)) {
              matchData = res;
            }
            setCompetitionGames(matchData)
          }
        } catch (error) {
          console.error(error)
        } finally {
          if (isMounted) setLoadingGames(false)
        }
      }
      fetchGames()
      return () => { isMounted = false }
    }
  }, [competitionId, isSportPath])

  if (!mounted) return null

  // Hide on auth pages
  const isAuthPage = pathname?.startsWith('/auth')
  if (isAuthPage) return null

  return (
    <aside
      className="hidden lg:flex flex-col shrink-0 transition-all duration-300 overflow-hidden relative bg-[#1e1e1e] border-r border-[#333]"
      style={{
        width: collapsed ? '65px' : '220px',
        minWidth: collapsed ? '65px' : '200px',
        maxWidth: collapsed ? '65px' : '220px',
        transform: 'translateX(0px)',
        transition: 'all ease 300ms'
      }}
    >
      <nav className="overflow-y-auto no-scrollbar">
        {isSportPath && !collapsed ? (
          <div className="flex flex-col">
            {/* Nav Parts */}
            <div className="flex flex-col">
              {/* Sports Button */}
              <Link
                href="/sportsbook"
                className="flex items-center gap-4 px-4 h-[52px] border-b border-[#333] text-[#efefef] hover:bg-[#252525] transition-all"
              >
                <div className="w-7 h-7 flex items-center justify-center shrink-0">
                  <Home size={20} className="text-white" />
                </div>
                <span className="text-[13px] font-medium tracking-wide">Sports</span>
              </Link>

              {/* Selected Sport Highlighted */}
              <div className="flex items-center gap-4 px-4 h-[52px] border-b border-[#333] bg-[#e8612c] text-white">
                <div className="w-7 h-7 flex items-center justify-center shrink-0">
                  <img
                    src={activeSportData?.image || '/sports-icons/cricket.13c45ec.png'}
                    alt={currentSport || ''}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[13px] font-medium tracking-wide uppercase">{currentSport}</span>
              </div>

              {/* Previous Button */}
              <button
                onClick={() => router.back()}
                className="flex items-center gap-4 px-4 h-[52px] border-b border-[#333] text-[#efefef] hover:bg-[#252525] transition-all"
              >
                <div className="w-7 h-7 flex items-center justify-center shrink-0">
                  <ChevronLeft size={20} className="text-white" />
                </div>
                <span className="text-[13px] font-medium tracking-wide">Previous</span>
              </button>
            </div>

            {/* Content List */}
            {isEventPath ? (
              <div className="flex flex-col pt-2">
                {loadingGames ? (
                  <div className="p-4 flex justify-center">
                    <Loader2 className="animate-spin text-[#e8612c]" size={24} />
                  </div>
                ) : (
                  <>
                    {competitionGames.length > 0 ? (
                      competitionGames.map((game, idx) => {
                        const gameName = game.Team1 && game.Team2 ? `${game.Team1} V ${game.Team2}` : (game.Game_name || 'Game');
                        return (
                          <Link
                            key={game.gid || game.Event_Id || idx}
                            href={`/sportsbook/${currentSport}/${competitionId}/${game.gid || game.Event_Id}`}
                            className="px-4 py-3 text-[12px] text-gray-300 hover:text-white cursor-pointer hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 block truncate"
                          >
                            {gameName}
                          </Link>
                        )
                      })
                    ) : (
                      <div className="p-4 text-center text-gray-500 text-[10px] uppercase font-bold">No games found</div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="flex flex-col pt-2">
                {loadingLeagues ? (
                  <div className="p-4 flex justify-center">
                    <Loader2 className="animate-spin text-[#e8612c]" size={24} />
                  </div>
                ) : dynamicLeagues.map((league: any, idx) => (
                  <Link
                    key={league.CompetitionCode || idx}
                    href={`/sportsbook/${currentSport}/${league.CompetitionCode}`}
                    className="block px-4 py-3 text-[12px] text-gray-300 hover:text-white cursor-pointer hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 truncate"
                  >
                    {league.Competition}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          (isExpanded ? games : games.slice(0, 10)).map((game) => {
            const isActive = pathname === game.link

            return (
              <Link
                key={game.id}
                href={game.link}
                className={`flex items-center gap-4 px-4 h-[52px] border-b border-[#333] transition-all relative group ${isActive ? 'bg-[#e8612c] text-white' : 'text-[#efefef] hover:bg-[#252525]'
                  }`}
              >
                <div className="w-7 h-7 flex items-center justify-center shrink-0">
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${game.name}&background=random`
                    }}
                  />
                </div>
                {!collapsed && (
                  <>
                    <span className="flex-1 text-[13px] font-medium tracking-wide truncate">{game.name}</span>
                    {(sportCounts[game.name] || game.count) && (
                      <span className="bg-[#e8612c] text-white text-[10px] font-bold rounded-full w-[22px] h-[22px] flex items-center justify-center shrink-0 shadow-sm border border-white/10">
                        {sportCounts[game.name] || game.count}
                      </span>
                    )}
                  </>
                )}
              </Link>
            )
          })
        )}

        {/* View More Button */}
        {!isSportPath && !collapsed && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center gap-4 px-4 h-[52px] border-b border-[#333] text-[#efefef] hover:bg-[#252525] transition-all"
          >
            <div className="w-7 h-7 flex items-center justify-center shrink-0 bg-[#e8612c] rounded-full">
              <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <span className="text-[13px] font-medium tracking-wide">
              {isExpanded ? 'View less' : 'View more'}
            </span>
          </button>
        )}

        {/* Favourites Section */}
        {!isSportPath && !collapsed && (
          <Link href="/favorites" className="flex flex-col group active:scale-95 transition-all">
            <div className="bg-[#e8612c] h-10 flex items-center justify-center group-hover:bg-[#d85826] transition-colors">
              <span className="text-white text-[11px] font-bold uppercase tracking-widest">Favourites</span>
            </div>
            <div className="py-8 flex flex-col items-center justify-center gap-3 bg-white/0 hover:bg-white/5 transition-colors">
              <div className="transition-transform group-hover:scale-110">
                <Star size={32} className="text-[#ffb800] fill-[#ffb800]/20" strokeWidth={1.5} />
              </div>
              <span className="text-[#888] text-[13px] font-medium tracking-tight group-hover:text-white transition-all">Add to favorite</span>
            </div>
          </Link>
        )}
      </nav>
    </aside>
  )
}

