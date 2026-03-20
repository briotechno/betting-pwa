'use client'
import React, { useState, useEffect } from 'react'
import { Gift, ChevronRight, Loader2, Info, CheckCircle2 } from 'lucide-react'
import { userController } from '@/controllers'
import { useAuthStore } from '@/store/authStore'
import { useSnackbarStore } from '@/store/snackbarStore'
import Button from '@/components/ui/Button'

interface Offer {
  Id: string
  Title: string
  Description: string
  Banner?: string
  Status?: string
}

export default function PromotionsPage() {
  const { isAuthenticated } = useAuthStore()
  const { show: showSnackbar } = useSnackbarStore()
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [claiming, setClaiming] = useState(false)

  useEffect(() => {
    const fetchOffers = async () => {
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

        const response = await userController.getOffers(token)
        if (response.error === '0') {
          setOffers(response.offers || [])
        }
      } catch (error) {
        console.error('Failed to fetch offers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOffers()
  }, [isAuthenticated])

  const handleOfferClick = async (offer: Offer) => {
    setSelectedOffer(offer)
    setDetailLoading(true)
    try {
      const token = localStorage.getItem('fairbet-auth') ? 
        JSON.parse(localStorage.getItem('fairbet-auth')!).state.user?.loginToken : null
      
      if (!token) return

      const response = await userController.getOfferDetail(token, offer.Id)
      if (response.error === '0') {
        setSelectedOffer({
          ...offer,
          Description: response.description || offer.Description,
          Banner: response.image // API says base64 image
        })
      }
    } catch (error) {
      console.error('Failed to fetch offer detail:', error)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleClaimOffer = async () => {
    if (!selectedOffer || claiming) return
    
    setClaiming(true)
    try {
      const token = localStorage.getItem('fairbet-auth') ? 
        JSON.parse(localStorage.getItem('fairbet-auth')!).state.user?.loginToken : null
      
      if (!token) return

      const response = await userController.claimOffer(token, selectedOffer.Id)
      if (response.error === '0') {
        showSnackbar('Offer claimed successfully!', 'success')
        setSelectedOffer(null)
      } else {
        showSnackbar(response.msg || 'Failed to claim offer', 'error')
      }
    } catch (error) {
      showSnackbar('An error occurred while claiming the offer', 'error')
    } finally {
      setClaiming(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Gift size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">Promotions</h1>
          <p className="text-[10px] text-textMuted uppercase tracking-widest font-black">Exclusive offers just for you</p>
        </div>
      </div>

      {!isAuthenticated ? (
        <div className="bg-card border border-cardBorder rounded-2xl p-10 text-center">
          <Info size={48} className="mx-auto text-textMuted mb-4 opacity-20" />
          <h3 className="text-lg font-bold text-white mb-2">Login to View Offers</h3>
          <p className="text-textMuted text-sm mb-6">You need to be logged in to see and claim exclusive promotions.</p>
          <Button href="/auth/login" className="px-10">LOGIN NOW</Button>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary mb-4" size={40} />
          <p className="text-textMuted font-bold uppercase tracking-widest text-xs">Loading Offers...</p>
        </div>
      ) : offers.length === 0 ? (
        <div className="bg-card border border-cardBorder rounded-2xl p-10 text-center">
          <Gift size={48} className="mx-auto text-textMuted mb-4 opacity-20" />
          <h3 className="text-lg font-bold text-white mb-2">No Active Offers</h3>
          <p className="text-textMuted text-sm">Check back later for new and exciting promotions!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.map((offer) => (
            <div 
              key={offer.Id}
              onClick={() => handleOfferClick(offer)}
              className="bg-card border border-cardBorder rounded-2xl overflow-hidden hover:border-primary/50 transition-all cursor-pointer group"
            >
              <div className="aspect-[2/1] bg-surface relative overflow-hidden">
                {offer.Banner ? (
                  <img src={offer.Banner.startsWith('data:') ? offer.Banner : `data:image/png;base64,${offer.Banner}`} alt={offer.Title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface to-black">
                    <Gift size={40} className="text-white/10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                   <h3 className="text-lg font-black text-white uppercase tracking-tight leading-tight">{offer.Title}</h3>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <p className="text-[10px] text-textMuted font-bold uppercase tracking-widest truncate max-w-[200px]">
                  {offer.Description?.slice(0, 50)}...
                </p>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white group-hover:bg-primary group-hover:text-white transition-colors">
                  <ChevronRight size={18} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Offer Detail Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => !detailLoading && setSelectedOffer(null)} />
          <div className="relative w-full max-w-lg bg-card border border-cardBorder rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {detailLoading ? (
               <div className="h-[400px] flex flex-col items-center justify-center">
                  <Loader2 className="animate-spin text-primary mb-4" size={32} />
                  <p className="text-textMuted font-bold uppercase tracking-widest text-[10px]">Fetching Details...</p>
               </div>
            ) : (
              <>
                <div className="aspect-[2/1] bg-surface relative">
                  {selectedOffer.Banner && (
                    <img src={selectedOffer.Banner.startsWith('data:') ? selectedOffer.Banner : `data:image/png;base64,${selectedOffer.Banner}`} alt={selectedOffer.Title} className="w-full h-full object-cover" />
                  )}
                  <button 
                    onClick={() => setSelectedOffer(null)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black transition-colors"
                  >
                    ×
                  </button>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-black text-white uppercase tracking-tight mb-4">{selectedOffer.Title}</h2>
                  <div className="prose prose-invert prose-sm max-h-[200px] overflow-y-auto no-scrollbar mb-8">
                    <p className="text-textMuted leading-relaxed">{selectedOffer.Description}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      fullWidth 
                      className="flex-1"
                      onClick={handleClaimOffer}
                      disabled={claiming}
                    >
                      {claiming ? <Loader2 className="animate-spin mr-2" size={18} /> : <CheckCircle2 size={18} className="mr-2" />}
                      CLAIM OFFER
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedOffer(null)}
                      className="px-6"
                    >
                      CLOSE
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
