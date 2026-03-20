'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Star, Loader2, Info } from 'lucide-react'
import { marketController } from '@/controllers'
import { useAuthStore } from '@/store/authStore'
import MatchCard from '@/components/sportsbook/MatchCard'

export default function FavoritesPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated) {
        setLoading(false)
        return
      }

      try {
        const token = localStorage.getItem('fairbet-auth') ? 
          JSON.parse(localStorage.getItem('fairbet-auth')!).state.user?.loginToken : null
        
        if (!token) {
          setLoading(false)
          return
        }

        const response = await marketController.getMultiMarketList(token)
        if (response.error === '0') {
          // Assuming response.data or response.list contains the games
          setFavorites(response.data || response.list || [])
        }
      } catch (error) {
        console.error('Failed to fetch favorites:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [isAuthenticated])

  return (
    <div className="bg-[#121212] min-h-screen text-white pb-20">
      {/* Sub Header */}
      <div className="flex items-center px-4 py-3 bg-[#222222] border-b border-white/5 sticky top-0 z-10 transition-all">
        <button onClick={() => router.back()} className="text-[#e8612c] pr-3">
          <ChevronLeft size={22} className="stroke-[3]" />
        </button>
        <h1 className="text-[15px] font-bold text-white uppercase tracking-tight">Favorites</h1>
      </div>

      <div className="p-4 pt-6 max-w-4xl mx-auto">
        {!isAuthenticated ? (
          <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-12 text-center shadow-xl">
             <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Info size={40} className="text-white/20" />
             </div>
             <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Login Required</h3>
             <p className="text-white/50 text-sm mb-8 max-w-xs mx-auto">Please login to view and manage your favorite matches and events.</p>
             <button 
                onClick={() => router.push('/auth/login')}
                className="px-12 h-12 rounded-full font-black tracking-widest bg-[#e8612c] text-white hover:bg-[#ff7a45] transition-all"
             >
                JOIN THE ACTION
             </button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-32">
             <div className="relative">
                <Loader2 className="animate-spin text-[#e8612c]" size={48} />
                <Star size={16} className="absolute inset-0 m-auto text-[#e8612c] fill-current" />
             </div>
             <p className="text-white/30 font-black uppercase tracking-[0.3em] text-[10px] mt-6">Loading your favorites</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-16 text-center shadow-xl">
             <Star size={64} className="mx-auto text-white/5 mb-6" />
             <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Empty Watchlist</h3>
             <p className="text-white/40 text-sm">Tap the star on any match to add it to your favorites for quick access.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {favorites.map((game: any) => (
              <MatchCard 
                key={game.id || game.Eid}
                id={game.id || game.Eid}
                competition={game.competition || game.Cname}
                teamA={game.teamA || game.T1}
                teamB={game.teamB || game.T2}
                startTime={game.startTime || game.Stime}
                sport={game.sport?.toLowerCase() || 'cricket'}
                isFavourite={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
