'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Star, Loader2, Info } from 'lucide-react'
import { marketController } from '@/controllers'
import { useAuthStore } from '@/store/authStore'
import MatchCard from '@/components/sportsbook/MatchCard'
import BetContainer from '@/components/sportsbook/BetContainer'

export default function FavoritesPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated || !user?.loginToken) {
        setLoading(false)
        return
      }

      try {
        const response = await marketController.getMultiMarketList(user.loginToken)
        if (response.error === '0') {
          setFavorites(response.data || response.list || [])
        }
      } catch (error) {
        console.error('Failed to fetch favorites:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [isAuthenticated, user?.loginToken])

  return (
    <div className="flex min-h-screen bg-[#121212] lg:gap-4 lg:bg-transparent">
      {/* Main Content Area */}
      <div className="flex-1 pb-20 bg-[#121212] rounded-lg overflow-hidden">
        {/* Sub Header */}
        <div className="flex items-center px-4 py-3 bg-[#222222] border-b border-white/5 sticky top-0 z-10 transition-all">
          <button onClick={() => router.back()} className="text-[#e8612c] pr-3">
            <ChevronLeft size={22} className="stroke-[3]" />
          </button>
          <h1 className="text-[15px] font-bold text-white uppercase tracking-tight">Favorites</h1>
        </div>

        <div className="p-4 pt-6">
          {!isAuthenticated ? (
            <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-12 text-center shadow-xl max-w-2xl mx-auto">
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
            <div className="bg-[#1a1a1a] border border-orange-500/50 rounded-lg p-3 text-left">
               <div className="flex items-center gap-3">
                 <Info size={20} className="text-[#e8612c]" />
                 <p className="text-[#e8612c] text-[15px] font-medium leading-none">You haven&apos;t added anything to favorites.</p>
               </div>
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

      {/* Bet Container - attached but separate column */}
      {(isAuthenticated || user) && (
        <div className="hidden lg:block lg:w-[480px] sticky top-[80px] max-h-[calc(100vh-100px)] overflow-y-auto self-start shrink-0 lg:border-none lg:rounded-lg lg:overflow-hidden border-l border-white/5 bg-[#111] z-30">
          <BetContainer />
        </div>
      )}
    </div>
  )
}

