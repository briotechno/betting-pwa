'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { casinoController } from '@/controllers/casino/casinoController'
import { useAuthStore } from '@/store/authStore'
import { useSnackbarStore } from '@/store/snackbarStore'
import { Loader2, ArrowLeft } from 'lucide-react'
import GameOverlay from '@/components/casino/GameOverlay'

interface Game {
  game_code: string;
  game_id: string;
  name: string;
  image: string;
  provider: string;
  Category: string;
}

const slugToSearchTerm: Record<string, string> = {
  'roulette': 'Roulette',
  'lightningdice': 'Lightning Dice',
  'crazytime': 'Crazy Time',
  'dealnodeal': 'Deal No Deal',
  'moneywheel': 'Money Wheel',
  'dragontiger': 'Dragon Tiger'
}

export default function DynamicLiveCasinoPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
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
          const searchTerm = slugToSearchTerm[slug.replace(/-/g, '')] || slug;
          
          const filtered = rawGames.filter((g: Game) => {
            const name = g.name.toLowerCase().replace(/\s+/g, '')
            const target = searchTerm.toLowerCase().replace(/\s+/g, '')
            return name.includes(target)
          })
          
          setGames(filtered)
        }
      } catch (err) {
        showSnackbar('Failed to fetch games', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [slug])

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
        showSnackbar(res.msg || 'Error opening game', 'error')
        setOverlayGame(prev => ({ ...prev, isOpen: false }))
      }
    } catch (err) {
      showSnackbar('Error launching game', 'error')
      setOverlayGame(prev => ({ ...prev, isOpen: false }))
    }
  }

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#e8612c] animate-spin" />
      </div>
    )
  }

  const title = slugToSearchTerm[slug.replace(/-/g, '')] || (slug.charAt(0).toUpperCase() + slug.slice(1))

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white p-3">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 bg-[#1a1a1a] p-4 rounded-xl border border-white/5 shadow-lg">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[18px] font-black uppercase tracking-widest text-[#e8612c]">{title}</h1>
      </div>

      {games.length === 0 ? (
        <div className="py-20 text-center text-gray-500 font-bold uppercase tracking-widest opacity-30">
          No Games Found
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {games.map((game) => (
            <div
              key={game.game_code}
              onClick={() => handleGameClick(game)}
              className="relative aspect-[3/4.2] group active:scale-95 transition-transform overflow-hidden rounded-lg border border-white/5 bg-[#1a1a1a] cursor-pointer shadow-2xl"
            >
              <img
                src={`/drmicon/${game.image}`}
                alt={game.name}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(game.name)}&background=1a1a1a&color=fff&size=200&font-size=0.3`
                }}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-2.5 flex flex-col justify-end h-[60%]">
                <span className="text-[10px] font-black text-white leading-tight uppercase line-clamp-2 text-center mb-1">
                  {game.name}
                </span>
                <span className="text-[8px] font-bold text-white/40 uppercase text-center tracking-tighter">
                  {game.provider}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

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
