'use client'
import React, { useState, useEffect, useRef } from 'react'
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

export default function SlotGamesPage() {
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
          const slotGamesList = rawGames.filter((game: Game) => game.Category === 'Video Slots')
          const uniqueGames = slotGamesList.reduce((acc: Game[], current: Game) => {
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
    return Array.from(new Set(games.map(g => g.provider))).sort()
  }, [games])

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
      <div className="sticky top-20 lg:top-[92px] z-[40]">
        <div className="flex overflow-x-auto no-scrollbar bg-[#1a1a1a] h-[45px] items-stretch border-b border-white/5 shadow-lg">
          <button
            onClick={() => setSelectedProvider(null)}
            className={`px-5 h-full text-[12px] font-black uppercase tracking-tight whitespace-nowrap transition-all border-r border-black/20 ${!selectedProvider ? 'bg-[#e15b24] text-white shadow-inner' : 'text-gray-400 hover:text-white'}`}
          >
            ALL
          </button>
          {providerList.map((provider) => (
            <button
              key={provider}
              onClick={() => setSelectedProvider(provider)}
              className={`px-5 h-full text-[12px] font-black uppercase tracking-tight whitespace-nowrap transition-all border-r border-black/20 ${selectedProvider === provider ? 'bg-[#e15b24] text-white shadow-inner' : 'text-gray-400 hover:text-white'}`}
            >
              {provider}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-6 pb-2">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={18} className="text-white/40" />
          </div>
          <input
            type="text"
            placeholder="Search game"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 bg-[#1a1a1a] border border-white/10 rounded-full pl-12 pr-4 text-[14px] placeholder:text-white/40 focus:ring-1 focus:ring-[#e15b24]/50 outline-none transition-all"
          />
        </div>
      </div>

      <div className="p-3 space-y-8 mt-2">
        {providersToDisplay.map((provider) => {
          const gamesInProvider = (groupedGamesByProvider[provider] || []).filter(game => 
            game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            game.provider.toLowerCase().includes(searchQuery.toLowerCase())
          );
          
          if (gamesInProvider.length === 0) return null;

          return (
            <div key={provider} className="w-full">
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-[14px] font-black text-white tracking-tight leading-none uppercase">{provider}</h2>
                <button className="bg-[#4caf50] text-[#fff] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg active:scale-95 transition-all">
                  See All
                </button>
              </div>

              <div className="flex overflow-x-auto no-scrollbar gap-2 px-0.5 pb-2">
                {gamesInProvider.map((game: Game) => (
                  <div
                    key={game.game_code}
                    onClick={() => handleGameClick(game)}
                    className="relative min-w-[115px] aspect-[3/4.2] group active:scale-95 transition-transform overflow-hidden rounded-[8px] border border-white/5 bg-[#1a1a1a] cursor-pointer shadow-xl"
                  >
                    <img
                      src={game.image.startsWith('http') ? game.image : `${IMG_BASE_URL}${game.image}`}
                      alt={game.name}
                      className="w-full h-full object-cover rounded-[8px]"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(game.name)}&background=1a1a1a&color=fff&size=128&font-size=0.33`
                      }}
                    />
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

        {providersToDisplay.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <p className="text-[14px] font-bold">No providers found</p>
          </div>
        )}
      </div>

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
