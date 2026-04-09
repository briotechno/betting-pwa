'use client'
import React, { useState, useEffect, useRef } from 'react'
import { casinoController } from '@/controllers/casino/casinoController'
import { useAuthStore } from '@/store/authStore'
import { useSnackbarStore } from '@/store/snackbarStore'
import { Loader2, Search } from 'lucide-react'
import GameOverlay from '@/components/casino/GameOverlay'

interface Game {
  game_code: string;
  game_id: string;
  name: string;
  image: string;
  provider: string;
  Category: string;
}

export default function Mac88Page() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [overlayGame, setOverlayGame] = useState<{ url: string | null; title: string; isOpen: boolean }>({
    url: null,
    title: '',
    isOpen: false
  })
  const { user } = useAuthStore()
  const { show: showSnackbar } = useSnackbarStore()

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true)
        const res = await casinoController.getCasinoGames('ALL')

        const rawGames = Array.isArray(res) ? res : (res?.data && Array.isArray(res.data) ? res.data : []);

        if (rawGames.length > 0) {
          // Filter for Mac88 Gaming Virtual provider specifically
          const mac88GamesList = rawGames.filter((game: Game) => 
            game.provider === 'Mac88 Gaming Virtual'
          )

          // Deduplicate by game_code
          const uniqueGames = mac88GamesList.reduce((acc: Game[], current: Game) => {
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
      {/* ── Header Section ── */}
      <div className="sticky top-16 lg:top-[76px] z-[40] bg-[#1a1a1a] px-4 py-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-black uppercase text-[#e15b24] tracking-tight">Mac88 Games</h1>
          <div className="text-[10px] font-bold text-white/40 uppercase bg-white/5 px-2 py-1 rounded">
            {games.length} Games Available
          </div>
        </div>
        
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={18} className="text-white/40" />
          </div>
          <input
            type="text"
            placeholder="Search Mac88 games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 bg-black border border-white/10 rounded-full pl-12 pr-4 text-[14px] placeholder:text-white/40 focus:ring-1 focus:ring-[#e15b24]/50 outline-none transition-all"
          />
        </div>
      </div>

      <div className="p-4 mt-2">
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
                    Mac88
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <Search size={48} className="mb-4 text-white/20" />
            <p className="text-[14px] font-bold">No Mac88 games found</p>
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
