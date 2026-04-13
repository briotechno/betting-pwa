'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { casinoController } from '@/controllers/casino/casinoController'
import { useAuthStore } from '@/store/authStore'
import { useSnackbarStore } from '@/store/snackbarStore'
import { Loader2 } from 'lucide-react'
import GameOverlay from '@/components/casino/GameOverlay'

interface Game {
  game_code: string;
  game_id: string;
  name: string;
  image: string;
  provider: string;
  Category: string;
}

export default function SlotGamesPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { show: showSnackbar } = useSnackbarStore()

  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('LOBBY')
  const [activeProvider, setActiveProvider] = useState<string | null>(null)

  const [overlayGame, setOverlayGame] = useState<{ url: string | null; title: string; isOpen: boolean }>({
    url: null,
    title: '',
    isOpen: false
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true)
        const res = await casinoController.getCasinoGames('ALL')
        const rawGames = Array.isArray(res) ? res : (res?.data && Array.isArray(res.data) ? res.data : []);

        // Remove duplicates and save all
        const uniqueGames = rawGames.reduce((acc: Game[], current: Game) => {
          if (!acc.find(item => item.game_code === current.game_code)) {
            acc.push(current);
          }
          return acc;
        }, []);

        setGames(uniqueGames)
      } catch (err) {
        showSnackbar('Failed to load games', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchGames()
  }, [showSnackbar])

  const categories = useMemo(() => {
    const cats = Array.from(new Set(games.map(g => g.Category).filter(Boolean)))
    return ['LOBBY', ...cats]
  }, [games])

  const providers = useMemo(() => {
    return Array.from(new Set(games.map(g => g.provider).filter(Boolean))).sort()
  }, [games])

  const filteredGames = useMemo(() => {
    let list = games
    if (activeCategory !== 'LOBBY') {
      list = list.filter(g => g.Category === activeCategory)
    }
    if (activeProvider) {
      list = list.filter(g => g.provider === activeProvider)
    }
    return list
  }, [games, activeCategory, activeProvider])

  const groupedByLobby = useMemo(() => {
    if (activeCategory !== 'LOBBY') return {}

    return games.reduce((acc: Record<string, Game[]>, game) => {
      if (activeProvider && game.provider !== activeProvider) return acc
      const cat = game.Category || 'Others'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(game)
      return acc
    }, {})
  }, [games, activeCategory, activeProvider])

  const handleGameClick = async (game: Game) => {
    if (!user) {
      showSnackbar('Please login to play', 'error')
      return
    }

    try {
      setOverlayGame({ url: null, title: game.name, isOpen: true })
      const res = await casinoController.openCasinoGame({
        LoginToken: user.loginToken || '',
        Game_id: game.game_id,
        Game_code: game.game_code
      })

      if (res.error === '0' && res.url) {
        setOverlayGame(prev => ({ ...prev, url: res.url }))
      } else {
        showSnackbar(res.msg || 'Launching game...', 'info')
      }
    } catch (err) {
      showSnackbar('Error launching game', 'error')
      setOverlayGame(prev => ({ ...prev, isOpen: false }))
    }
  }

  if (loading) {
    return (
      <div className="bg-[#000] min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#e15b24] animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-[#1a1a1a] min-h-screen text-white pb-20">
      {/* Sticky Header with Two Navigation Rows */}
      <div className="sticky top-20 lg:top-[92px] z-[45] flex flex-col shadow-2xl">
        {/* Row 1: Categories */}
        <div className="flex overflow-x-auto no-scrollbar bg-[#3d3d3d] h-[40px] items-stretch border-b border-white/5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat)
                window.scrollTo(0, 0)
              }}
              className={`px-[12px] py-[7px] h-full text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all border-r border-[#6e6e6e] ${activeCategory === cat ? 'bg-[#e8612c] text-white' : 'bg-[#3d3d3d] text-white'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Row 2: Providers */}
        <div className="flex overflow-x-auto no-scrollbar bg-[#3d3d3d] h-[40px] items-stretch border-b border-white/5">
          <button
            onClick={() => setActiveProvider(null)}
            className={`px-[12px] py-[7px] h-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border-r border-[#6e6e6e] ${activeProvider === null ? 'bg-[#e8612c] text-white' : 'bg-[#3d3d3d] text-white'
              }`}
          >
            ALL PROVIDERS
          </button>
          {providers.map((p) => (
            <button
              key={p}
              onClick={() => setActiveProvider(p)}
              className={`px-[12px] py-[7px] h-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border-r border-[#6e6e6e] ${activeProvider === p ? 'bg-[#e8612c] text-white' : 'bg-[#3d3d3d] text-white'
                }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-3">
        {activeCategory === 'LOBBY' ? (
          /* LOBBY VIEW: Sections per Category */
          <div className="space-y-4">
            {Object.entries(groupedByLobby).map(([catName, gameList]) => (
              <div key={catName} className="flex flex-col">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h2 className="text-[15px] font-black text-white tracking-tight leading-none uppercase">{catName}</h2>
                  <button
                    onClick={() => setActiveCategory(catName)}
                    className="bg-[#4caf50] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md active:scale-95 transition-all"
                  >
                    See All
                  </button>
                </div>

                <div className="flex overflow-x-auto no-scrollbar gap-2.5 pb-2">
                  {gameList.slice(0, 10).map((game) => (
                    <div
                      key={game.game_code}
                      onClick={() => handleGameClick(game)}
                      className="relative min-w-[110px] aspect-[1/1.4] bg-[#111] rounded-lg overflow-hidden border border-white/5 shadow-lg active:scale-95 transition-transform cursor-pointer"
                    >
                      <img
                        src={`/drmicon/${game.image}`}
                        alt={game.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(game.name)}&background=1a1a1a&color=fff&size=128&font-size=0.33`
                        }}
                      />
                      <div className="absolute inset-x-0 bottom-0 p-2 bg-black/60 backdrop-blur-[2px]">
                        <p className="text-[9px] font-black text-white leading-tight uppercase line-clamp-1 text-center">{game.name}</p>
                        <p className="text-[7px] text-white/40 uppercase text-center mt-0.5 font-bold">{game.provider}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* CATEGORY VIEW: High-Density Vertical Grid */
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
            {filteredGames.map((game) => (
              <div
                key={game.game_code}
                onClick={() => handleGameClick(game)}
                className="relative aspect-[1/1.4] bg-[#111] rounded-lg overflow-hidden border border-white/5 shadow-lg active:scale-95 transition-transform cursor-pointer"
              >
                <img
                  src={`/drmicon/${game.image}`}
                  alt={game.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(game.name)}&background=1a1a1a&color=fff&size=128&font-size=0.33`
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-2.5 bg-black/60 backdrop-blur-[2px]">
                  <p className="text-[10px] font-black text-white leading-tight uppercase line-clamp-1 text-center">{game.name}</p>
                  <p className="text-[8px] text-white/40 uppercase text-center mt-0.5 font-bold">{game.provider}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredGames.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 opacity-30">
            <p className="text-[14px] font-black uppercase tracking-widest">No games found</p>
          </div>
        )}
      </div>

      <GameOverlay
        isOpen={overlayGame.isOpen}
        url={overlayGame.url}
        title={overlayGame.title}
        isFloating={true}
        onClose={() => setOverlayGame(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  )
}
