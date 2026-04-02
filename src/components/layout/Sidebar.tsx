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
    image: "https://www.fairplay247.vip/_nuxt/img/cricket.5c05f66.png",
    count: 13,
    link: "/sportsbook/Cricket"
  },
  {
    id: 1,
    name: "Soccer",
    image: "https://www.fairplay247.vip/_nuxt/img/soccer.9f718cc.png",
    count: 53,
    link: "/sportsbook/Soccer"
  },
  {
    id: 2,
    name: "Tennis",
    image: "https://www.fairplay247.vip/_nuxt/img/tennis.fc30791.png",
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
    name: "Casino",
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

  // Check path levels unconditionally
  const pathParts = pathname?.split('/').filter(Boolean) || []
  const isSportPath = pathname?.startsWith('/sportsbook') && pathParts.length >= 2
  const isEventPath = pathParts.length >= 3 // /sportsbook/sport/competitionId
  const currentSport = isSportPath ? pathParts[1] : null
  const competitionId = isEventPath ? pathParts[2] : null
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
      className="hidden lg:flex flex-col shrink-0 transition-all duration-300 overflow-hidden fixed top-[148px] left-0 bottom-0 z-50 bg-[#1e1e1e] border-r border-[#333]"
      style={{
        width: collapsed ? '65px' : '220px',
        minWidth: collapsed ? '65px' : '200px',
        maxWidth: collapsed ? '65px' : '220px',
        transform: 'translateX(0px)',
        transition: 'all ease 300ms'
      }}
    >
      <nav className="flex-1 overflow-y-auto no-scrollbar">
        {isSportPath && !collapsed ? (
          <div className="flex flex-col h-full">
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
                <span className="text-[13px] font-bold tracking-wide">Sports</span>
              </Link>

              {/* Selected Sport Highlighted */}
              <div className="flex items-center gap-4 px-4 h-[52px] border-b border-[#333] bg-[#e8612c] text-white">
                <div className="w-7 h-7 flex items-center justify-center shrink-0">
                  <img 
                    src={activeSportData?.image || 'https://www.fairplay247.vip/_nuxt/img/cricket.5c05f66.png'} 
                    alt={currentSport || ''} 
                    className="w-full h-full object-contain brightness-0 invert" 
                  />
                </div>
                <span className="text-[13px] font-bold tracking-wide uppercase">{currentSport}</span>
              </div>

              {/* Previous Button */}
              <button
                onClick={() => router.back()}
                className="flex items-center gap-4 px-4 h-[52px] border-b border-[#333] text-[#efefef] hover:bg-[#252525] transition-all"
              >
                <div className="w-7 h-7 flex items-center justify-center shrink-0">
                  <ChevronLeft size={20} className="text-white" />
                </div>
                <span className="text-[13px] font-bold tracking-wide">Previous</span>
              </button>
            </div>

            {/* Content List */}
            {isEventPath ? (
              <div className="flex flex-col pt-2 mb-auto">
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
          games.map((game) => {
            const isActive = pathname === game.link

            return (
              <Link
                key={game.id}
                href={game.link}
                className={`flex items-center gap-4 px-4 h-[52px] border-b border-[#333] transition-all relative group ${
                  isActive ? 'bg-[#e8612c] text-white' : 'text-[#efefef] hover:bg-[#252525]'
                }`}
              >
                <div className="w-7 h-7 flex items-center justify-center shrink-0">
                  <img 
                    src={game.image} 
                    alt={game.name} 
                    className={`w-full h-full object-contain ${isActive ? 'brightness-0 invert' : ''}`}
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${game.name}&background=random`
                    }}
                  />
                </div>
                {!collapsed && (
                  <>
                    <span className="flex-1 text-[13px] font-normal tracking-wide truncate">{game.name}</span>
                    {game.count && (
                      <span className="bg-[#e8612c] text-white text-[10px] font-bold rounded-full w-[22px] h-[22px] flex items-center justify-center shrink-0 shadow-sm border border-white/10">
                        {game.count}
                      </span>
                    )}
                  </>
                )}
              </Link>
            )
          })
        )}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-3 text-[#555] hover:text-white flex justify-center transition-colors border-t border-[#333]"
      >
        <ChevronLeft size={20} className={collapsed ? 'rotate-180' : ''} />
      </button>
    </aside>
  )
}

