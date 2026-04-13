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
          const cardKeywords = ['card', 'teen patti', 'poker', 'andar bahar', 'hi-low', 'hi low', 'baccarat', 'dragon tiger', 'matka', '32 card']
          const cardGames = rawGames.filter((game: Game) => 
            (game.Category?.toLowerCase().includes('card')) || 
            (game.name?.toLowerCase().includes('3 patti')) ||
            (game.name?.toLowerCase().includes('poker')) ||
            (game.name?.toLowerCase().includes('andar bahar')) ||
            (game.name?.toLowerCase().includes('dragon tiger')) ||
            (game.name?.toLowerCase().includes('32 card')) ||
            (game.name?.toLowerCase().includes('matka')) ||
            (game.Category?.toLowerCase().includes('table'))
          )

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
      <div className="bg-[#111] min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#e8612c] animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-[#111] min-h-screen text-white pb-20">
      {/* Top Bar Navigation */}
      <div className="sticky top-16 lg:top-[76px] z-[40] bg-[#1a1a1a] px-3 py-2 border-b border-white/5 flex items-center">
        <button onClick={() => router.back()} className="text-[#f36c21] p-1">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-[13px] font-bold text-white/90">Live Card</h1>
      </div>

      <div className="px-4 py-6 md:px-8">
        {/* Header Content */}
        <div className="max-w-[1400px] mb-8">
          <h2 className="text-[20px] md:text-[24px] font-black text-white leading-tight mb-2">
            Rummy makes people richer. Play online and win real cash.
          </h2>
          <p className="text-[10px] md:text-[11px] text-gray-400 leading-normal text-justify">
            fairplay invites you to discover thrilling online poker tournaments and games. Here, you can play games like 3 patti online, Indian card games, poker, etc. online using secured deposits. Play and benefit from instant withdrawals and advanced software. Things like 'play rummy win cash' is an everyday situation for this platform where you can awaken the champion inside you. Also, those who enjoy online 3 patti real money can rejoice as we also offer a beginners guide on poker rules, 3 patti rules, etc. and hand rankings to make it simple to play poker online. Our endeavour in offering players a platform to win prizes is what drives our efforts. Learn all moves low to high using our comprehensive guide. To play and win, sign up to Fairplay now!
          </p>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
          {games.map((game: Game) => {
            const isLiveLabel = game.name.toLowerCase().includes('3 patti') || game.name.toLowerCase().includes('andar bahar') || game.name.toLowerCase().includes('32 card') || game.name.toLowerCase().includes('dragon tiger')
            const displayName = game.name.replace(/Live/gi, '').trim()

            return (
              <div
                key={game.game_code}
                onClick={() => handleGameClick(game)}
                className="relative group cursor-pointer aspect-[1/1.1] overflow-hidden bg-[#000]"
              >
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
                  <img
                    src={`/drmicon/${game.image}`}
                    alt={game.name}
                    className="w-full h-full object-cover opacity-80"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(game.name)}&background=1a1a1a&color=fff&size=256&font-size=0.25`
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
                  {/* Gold Hexagon Icon Placeholder */}
                  <div className="mb-2 relative w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-[#c5a059]">
                      <path 
                        d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="3"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="relative z-10 text-[#c5a059]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <circle cx="15.5" cy="8.5" r="1.5"/>
                        <circle cx="15.5" cy="15.5" r="1.5"/>
                        <circle cx="8.5" cy="15.5" r="1.5"/>
                        <circle cx="12" cy="12" r="1.5"/>
                      </svg>
                    </div>
                  </div>

                  {/* Game Title */}
                  <div className="flex flex-col items-center">
                    <h3 className="text-[13px] md:text-[15px] font-bold text-white uppercase tracking-tight leading-tight">
                      {displayName}
                    </h3>
                    {isLiveLabel && (
                      <span className="text-[#ff0000] text-[12px] md:text-[14px] font-black italic mt-[-2px]">
                        Live
                      </span>
                    )}
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 border border-white/0 group-hover:border-[#c5a059]/40 transition-colors pointer-events-none" />
              </div>
            )
          })}
        </div>

        {games.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <p className="text-[14px] font-bold tracking-widest uppercase">No card games available</p>
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
