'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { casinoController } from '@/controllers/casino/casinoController'
import { useAuthStore } from '@/store/authStore'
import { useSnackbarStore } from '@/store/snackbarStore'
import { Loader2, Search, ChevronLeft } from 'lucide-react'
import GameOverlay from '@/components/casino/GameOverlay'

interface Game {
  game_code: string;
  game_id: string;
  name: string;
  image: string;
  provider: string;
  Category: string;
}

export default function LiveCardsPage() {
  const router = useRouter()
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [overlayGame, setOverlayGame] = useState<{ url: string | null; title: string; isOpen: boolean }>({
    url: null,
    title: '',
    isOpen: false
  })
  const { user, isAuthenticated } = useAuthStore()
  const { show: showSnackbar } = useSnackbarStore()

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true)
        const res = await casinoController.getCasinoGames('ALL')
        const rawGames = Array.isArray(res) ? res : (res?.data && Array.isArray(res.data) ? res.data : []);

        if (rawGames.length > 0) {
          // Filter for card games or specific providers that offer cards if known.
          // For now, let's filter by Category if available, or just show all if no specific filter was given.
          // many card games have 'Table' or 'Cards' or 'Indian' categories.
          const cardKeywords = ['card', 'teen patti', 'poker', 'andar bahar', 'hi-low', 'hi low', 'baccarat', 'dragon tiger']
          const cardGames = rawGames.filter((game: Game) => 
            (game.Category?.toLowerCase().includes('card')) || 
            (game.name?.toLowerCase().split(' ').some(word => cardKeywords.includes(word.toLowerCase()))) ||
            (game.Category?.toLowerCase().includes('table'))
          )

          // Deduplicate
          const uniqueGames = cardGames.reduce((acc: Game[], current: Game) => {
            if (!acc.find(item => item.game_code === current.game_code)) {
              acc.push(current);
            }
            return acc;
          }, []);

          setGames(uniqueGames)
        }
      } catch (err) {
        showSnackbar('Network error', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [showSnackbar])

  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGameClick = async (game: Game) => {
    if (!isAuthenticated) {
      showSnackbar('Please login to play', 'error')
      router.push('/auth/login')
      return
    }

    try {
      setOverlayGame({ url: null, title: game.name, isOpen: true })
      const res = await casinoController.openCasinoGame({
        LoginToken: user?.loginToken || '',
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
        <Loader2 className="w-10 h-10 text-[#e8612c] animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-[#000] min-h-screen text-white pb-20">
      <div className="sticky top-16 lg:top-[76px] z-[40] bg-[#1a1a1a] px-4 py-4 border-b border-white/5">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => router.back()} className="text-[#e8612c]">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-black uppercase text-[#e15b24] tracking-tight">Live Cards</h1>
          <div className="ml-auto text-[10px] font-bold text-white/40 uppercase bg-white/5 px-2 py-1 rounded">
            {games.length} Games
          </div>
        </div>
        
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={18} className="text-white/40" />
          </div>
          <input
            type="text"
            placeholder="Search card games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 bg-black border border-white/10 rounded-full pl-12 pr-4 text-[14px] placeholder:text-white/40 focus:ring-1 focus:ring-[#e15b24]/50 outline-none transition-all"
          />
        </div>
      </div>

      <div className="p-4">
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {filteredGames.map((game: Game) => (
              <div
                key={game.game_code}
                onClick={() => handleGameClick(game)}
                className="relative group active:scale-95 transition-transform overflow-hidden rounded-[12px] border border-white/5 bg-[#1a1a1a] cursor-pointer shadow-xl aspect-[3/4.2]"
              >
                <img
                  src={`/drmicon/${game.image}`}
                  alt={game.name}
                  className="w-full h-full object-cover rounded-[12px]"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(game.name)}&background=1a1a1a&color=fff&size=128&font-size=0.33`
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-2 flex flex-col justify-end h-[60%] pointer-events-none">
                  <span className="text-[9px] font-black text-white leading-tight uppercase line-clamp-2 text-center drop-shadow-lg mb-0.5">
                    {game.name}
                  </span>
                  <span className="text-[7px] font-extrabold text-[#e15b24] uppercase text-center tracking-tighter">
                    {game.provider}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <Search size={48} className="mb-4 text-white/20" />
            <p className="text-[14px] font-bold">No card games found</p>
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
