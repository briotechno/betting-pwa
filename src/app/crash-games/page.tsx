'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { casinoController } from '@/controllers/casino/casinoController'
import { useAuthStore } from '@/store/authStore'
import { useSnackbarStore } from '@/store/snackbarStore'
import { Loader2, Search } from 'lucide-react'
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

export default function CrashGamesPage() {
  const router = useRouter()
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('lobby')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [overlayGame, setOverlayGame] = useState<{ url: string | null; title: string; isOpen: boolean }>({
    url: null,
    title: '',
    isOpen: false
  })
  const { user } = useAuthStore()
  const { show: showSnackbar } = useSnackbarStore()
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true)
        const res = await casinoController.getCasinoGames('ALL')

        const rawGames = Array.isArray(res) ? res : (res?.data && Array.isArray(res.data) ? res.data : []);

        if (rawGames.length > 0) {
          // Filter for Crash Games specifically as requested
          const crashGamesList = rawGames.filter((game: Game) => game.Category === 'Crash Games')

          // Deduplicate by game_code
          const uniqueGames = crashGamesList.reduce((acc: Game[], current: Game) => {
            if (!acc.find(item => item.game_code === current.game_code)) {
              acc.push(current);
            }
            return acc;
          }, []);
          setGames(uniqueGames)

          const grouped = uniqueGames.reduce((acc: Record<string, Game[]>, game: Game) => {
            const category = game.Category || 'Others'
            if (!acc[category]) acc[category] = []
            acc[category].push(game)
            return acc
          }, {})
          setCategories(Object.keys(grouped))
        }
      } catch (err) {
        showSnackbar('Network error', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [showSnackbar])

  const providerList = React.useMemo(() => {
    const listGames = activeTab === 'lobby'
      ? games
      : games.filter(g => (g.Category || 'Others') === activeTab)
    return Array.from(new Set(listGames.map(g => g.provider))).sort()
  }, [games, activeTab])

  useEffect(() => {
    setSelectedProvider(null)
  }, [activeTab])

  const filteredGames = selectedProvider
    ? games.filter(g => g.provider === selectedProvider)
    : games

  const groupedGamesByProvider = React.useMemo(() => {
    return filteredGames.reduce((acc: Record<string, Game[]>, game) => {
      const provider = game.provider || 'Others'
      if (!acc[provider]) acc[provider] = []
      acc[provider].push(game)
      return acc
    }, {})
  }, [filteredGames])

  const providersToDisplay = Object.keys(groupedGamesByProvider).sort()

  const scrollToCategory = (id: string) => {
    setActiveTab(id)
    if (id === 'lobby') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const element = sectionRefs.current[id]
    if (element) {
      const headerOffset = 180
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
    }
  }

  const handleGameClick = async (game: Game) => {
    if (!user) {
      router.push('/auth/login')
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
    <div className="bg-[#0b0b0b] min-h-screen text-white font-sans">
      {/* ── Header ── */}
      <div className="sticky top-0 z-50 bg-[#0b0b0b] px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5">
        <h1 className="text-[18px] font-bold tracking-tight text-white/90">Crash Games</h1>
        
        {/* Search Bar */}
        <div className="relative w-full sm:max-w-[240px]">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={14} className="text-white/40" />
          </div>
          <input
            type="text"
            placeholder="Search games"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[36px] bg-[#1a1a1a] border border-white/10 rounded-full pl-9 pr-4 text-[12px] placeholder:text-white/30 focus:border-[#e8612c]/50 outline-none transition-all"
          />
        </div>
      </div>

      {/* ── Game Grid ── */}
      <div className="p-2 sm:p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-3">
            <Loader2 className="w-8 h-8 text-[#e8612c] animate-spin" />
            <p className="text-[10px] uppercase font-bold tracking-widest text-white/20">Loading games...</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-1.5 sm:gap-2">
            {games
              .filter(game => game.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((game: Game) => (
                <div
                  key={game.game_code}
                  onClick={() => handleGameClick(game)}
                  className="relative aspect-square group active:scale-95 transition-all overflow-hidden rounded-[4px] border border-[#e8612c] bg-[#1a1a1a] cursor-pointer shadow-lg"
                >
                  <img
                    src={`/drmicon/${game.image}`}
                    alt={game.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(game.name)}&background=1a1a1a&color=fff&size=200&font-size=0.1`
                    }}
                  />
                  
                  {/* Subtle Label Overlay if image doesn't have text */}
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 pt-4 pb-1 px-1 flex flex-col items-center justify-center pointer-events-none transform translate-y-full group-hover:translate-y-0 transition-transform">
                    <span className="text-[7px] font-black text-white uppercase text-center line-clamp-1">
                      {game.name}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}

        {!loading && games.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 opacity-30">
            <p className="text-[14px] font-bold">No Crash Games found</p>
          </div>
        )}
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/31612345678" // Example number
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 left-4 z-50 transition-transform hover:scale-110 active:scale-90"
      >
        <img
          src="/whatsapp.png"
          alt="WhatsApp Support"
          className="w-12 h-12 drop-shadow-2xl"
          onError={(e) => {
            e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/3670/3670051.png"
          }}
        />
      </a>

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


