'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { casinoController } from '@/controllers/casino/casinoController'
import { useAuthStore } from '@/store/authStore'
import { useSnackbarStore } from '@/store/snackbarStore'
import { Loader2, Search, X } from 'lucide-react'
import GameOverlay from '@/components/casino/GameOverlay'

// Image base URL fallback
const IMG_BASE_URL = 'https://luckmedia.link/';

interface Game {
  game_code: string;
  game_id: string;
  name: string;
  image: string;
  provider: string;
  Category: string;
}

export default function LiveCasinoPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('lobby')
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [overlayGame, setOverlayGame] = useState<{ url: string | null; title: string; isOpen: boolean }>({
    url: null,
    title: '',
    isOpen: false
  })
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const { show: showSnackbar } = useSnackbarStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true)
        const res = await casinoController.getCasinoGames('ALL')

        // API returns a flat array directly, or an object with data array
        const rawGames = Array.isArray(res) ? res : (res?.data && Array.isArray(res.data) ? res.data : []);
        const errorMsg = !Array.isArray(res) && res?.error === '1' ? (res.msg || 'Failed to fetch games') : null;

        if (rawGames.length > 0) {
          // Deduplicate by game_code
          const uniqueGames = rawGames.reduce((acc: Game[], current: Game) => {
            if (!acc.find(item => item.game_code === current.game_code)) {
              acc.push(current);
            }
            return acc;
          }, []);
          setGames(uniqueGames)

          // Initial categories from full game set
          const grouped = uniqueGames.reduce((acc: Record<string, Game[]>, game: Game) => {
            const category = game.Category || 'Others'
            if (!acc[category]) acc[category] = []
            acc[category].push(game)
            return acc
          }, {})
          setCategories(Object.keys(grouped))
        } else if (errorMsg) {
          showSnackbar(errorMsg, 'error')
        }
      } catch (err) {
        showSnackbar('Network error', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [])

  // Derive providers based on active category
  const providerList = React.useMemo(() => {
    const listGames = activeTab === 'lobby'
      ? games
      : games.filter(g => (g.Category || 'Others') === activeTab)
    return Array.from(new Set(listGames.map(g => g.provider))).sort()
  }, [games, activeTab])

  // Reset provider when category changes
  useEffect(() => {
    setSelectedProvider(null)
  }, [activeTab])

  // Filter games based on selected provider
  const filteredGames = selectedProvider
    ? games.filter(g => g.provider === selectedProvider)
    : games

  // Group filtered games by category
  const groupedGames = filteredGames.reduce((acc: Record<string, Game[]>, game) => {
    const category = game.Category || 'Others'
    if (!acc[category]) acc[category] = []
    acc[category].push(game)
    return acc
  }, {})

  const scrollToCategory = (id: string) => {
    setActiveTab(id)
    if (id === 'lobby') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const element = sectionRefs.current[id]
    if (element) {
      const headerOffset = 180 // Higher offset for two navigation rows
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

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
        showSnackbar(res.msg || 'Failed to open game', 'error')
        setOverlayGame(prev => ({ ...prev, isOpen: false }))
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
    <div className="bg-[#000] min-h-screen text-white">
      {/* ── Two-Level Navigation ── */}
      <div className="sticky top-20 lg:top-[92px] z-[40]">
        {/* Row 1: Categories */}
        <div className="flex overflow-x-auto no-scrollbar bg-[#3d3d3d] h-[45px] items-stretch border-b border-white/5">
          <button
            onClick={() => scrollToCategory('lobby')}
            className={`px-5 h-full text-[12px] font-black uppercase tracking-tight whitespace-nowrap transition-all border-r border-black/20 ${activeTab === 'lobby' ? 'bg-[#e15b24] text-white shadow-inner' : 'text-gray-200 hover:text-white'
              }`}
          >
            Lobby
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => scrollToCategory(cat)}
              className={`px-5 h-full text-[12px] font-black uppercase tracking-tight whitespace-nowrap transition-all border-r border-black/20 ${activeTab === cat ? 'bg-[#e15b24] text-white shadow-inner' : 'text-gray-200 hover:text-white'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Row 2: Providers */}
        <div className="flex overflow-x-auto no-scrollbar bg-[#1a1a1a] h-[45px] items-stretch border-b border-white/5 shadow-lg">
          <button
            onClick={() => setSelectedProvider(null)}
            className={`px-5 h-full text-[12px] font-black uppercase tracking-tight whitespace-nowrap transition-all border-r border-black/20 ${!selectedProvider ? 'bg-[#e15b24] text-white shadow-inner' : 'text-gray-400 hover:text-white'
              }`}
          >
            ALL
          </button>
          {providerList.map((provider) => (
            <button
              key={provider}
              onClick={() => setSelectedProvider(provider)}
              className={`px-5 h-full text-[12px] font-black uppercase tracking-tight whitespace-nowrap transition-all border-r border-black/20 ${selectedProvider === provider ? 'bg-[#e15b24] text-white shadow-inner' : 'text-gray-400 hover:text-white'
                }`}
            >
              {provider}
            </button>
          ))}
        </div>
      </div>

      {/* Lobby Sections */}
      <div className="p-3 space-y-6 mt-4">
        {categories.map((cat) => {
          // Only show category if it has filtered games
          const gamesInCat = groupedGames[cat] || [];
          if (gamesInCat.length === 0) return null;

          return (
            <div
              key={cat}
              ref={(el) => { sectionRefs.current[cat] = el }}
              className="w-full"
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-[16px] font-bold text-white tracking-tight leading-none uppercase">{cat}</h2>
                <button className="bg-[#4caf50] text-[#fff] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg active:scale-95 transition-all">
                  See All
                </button>
              </div>

              {/* Games Horizontal Slider - Matches Reference Look */}
              <div className="flex overflow-x-auto no-scrollbar gap-2 px-0.5 pb-2">
                {gamesInCat.map((game) => (
                  <div
                    key={game.game_code}
                    onClick={() => handleGameClick(game)}
                    className="relative min-w-[115px] aspect-[3/4.2] group active:scale-95 transition-transform overflow-hidden rounded-[4px] border border-white/5 bg-[#1a1a1a] cursor-pointer shadow-xl"
                  >
                    <img
                      // src={game.image.startsWith('http') ? game.image : `${IMG_BASE_URL}${game.image}`}
                      src={`/drmicon/${game.image}`}
                      alt={game.name}
                      className="w-full h-full object-cover rounded-[4px]"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(game.name)}&background=1a1a1a&color=fff&size=128&font-size=0.33`
                      }}
                    />
                    {/* Reference style Overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-2.5 flex flex-col justify-end h-[60%] pointer-events-none">
                      <span className="text-[8px] font-black text-white leading-tight uppercase line-clamp-2 text-center drop-shadow-lg mb-1">
                        {game.name}
                      </span>
                      <span className="text-[7px] font-extrabold text-white/40 uppercase text-center tracking-tighter">
                        {game.provider}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Space for bottom nav */}
      <div className="h-24" />

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


