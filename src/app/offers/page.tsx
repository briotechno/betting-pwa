'use client'
import React, { useState, useEffect } from 'react'
import { Gift, ChevronRight, Loader2, Info, CheckCircle2, ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
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

export default function OffersPage() {
  const router = useRouter()
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
          Banner: response.image // API returns base64
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
    <div className="min-h-screen bg-[#121212] pb-20">
      {/* Sub Header */}
      <div className="flex items-center px-4 py-3 bg-[#222222] border-b border-white/5 sticky top-0 z-10 transition-all">
        <button onClick={() => router.back()} className="text-[#e8612c] pr-3">
          <ChevronLeft size={22} className="stroke-[3]" />
        </button>
        <h1 className="text-[15px] font-bold text-white uppercase tracking-tight">Offers</h1>
      </div>

      <div className="max-w-4xl mx-auto p-4 lg:pt-6">

        {!isAuthenticated ? (
          <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-12 text-center shadow-xl">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Info size={40} className="text-white/20" />
            </div>
            <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Access Restricted</h3>
            <p className="text-white/50 text-sm mb-8 max-w-xs mx-auto">Please login to your account to view and claim exclusive promotions available to you.</p>
            <Button href="/auth/login" className="px-12 h-12 rounded-full font-black tracking-widest bg-[#e8612c] hover:bg-[#ff7a45]">LOGIN TO CONTINUE</Button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative">
              <Loader2 className="animate-spin text-[#e8612c]" size={48} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Gift size={16} className="text-[#e8612c]" />
              </div>
            </div>
            <p className="text-white/30 font-black uppercase tracking-[0.3em] text-[10px] mt-6">Loading exclusive offers</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-16 text-center shadow-xl">
            <Gift size={64} className="mx-auto text-white/10 mb-6" />
            <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">No Offers Available</h3>
            <p className="text-white/40 text-sm">We're curating new rewards for you. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offers.map((offer) => (
              <div 
                key={offer.Id}
                onClick={() => handleOfferClick(offer)}
                className="bg-[#1a1a1a] border border-white/5 rounded-[2rem] overflow-hidden hover:border-[#e8612c]/50 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-[#e8612c]/5"
              >
                <div className="aspect-[16/9] bg-black relative overflow-hidden">
                  {offer.Banner ? (
                    <img 
                      src={offer.Banner.startsWith('data:') ? offer.Banner : `data:image/png;base64,${offer.Banner}`} 
                      alt={offer.Title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-black">
                      <Gift size={48} className="text-[#e8612c]/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="inline-block px-3 py-1 bg-[#e8612c] text-white text-[9px] font-black uppercase tracking-widest rounded-full mb-2">Limited Time</span>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none group-hover:text-[#e8612c] transition-colors">{offer.Title}</h3>
                  </div>
                </div>
                <div className="p-6 flex items-center justify-between gap-4">
                  <p className="text-[11px] text-white/40 font-bold uppercase tracking-wider line-clamp-1">
                    {offer.Description || 'Tap to view details and claim your reward'}
                  </p>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white group-hover:bg-[#e8612c] group-hover:text-white transition-all transform group-hover:translate-x-1 shadow-inner">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Offer Detail Modal */}
        {selectedOffer && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6">
            <div 
              className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300" 
              onClick={() => !detailLoading && setSelectedOffer(null)} 
            />
            <div className="relative w-full max-w-xl bg-[#111] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-400">
              {detailLoading ? (
                <div className="h-[450px] flex flex-col items-center justify-center p-10">
                  <div className="relative mb-6">
                    <Loader2 className="animate-spin text-[#e8612c]" size={48} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Gift size={16} className="text-[#e8612c]" />
                    </div>
                  </div>
                  <p className="text-white/20 font-black uppercase tracking-[0.4em] text-[10px]">Preparing your reward</p>
                </div>
              ) : (
                <>
                  <div className="aspect-[2/1] bg-black relative">
                    {selectedOffer.Banner && (
                      <img 
                        src={selectedOffer.Banner.startsWith('data:') ? selectedOffer.Banner : `data:image/png;base64,${selectedOffer.Banner}`} 
                        alt={selectedOffer.Title} 
                        className="w-full h-full object-cover" 
                      />
                    )}
                    <button 
                      onClick={() => setSelectedOffer(null)}
                      className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-black transition-all active:scale-90 border border-white/10"
                    >
                      <X size={20} />
                    </button>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
                    <div className="absolute bottom-6 left-8">
                       <span className="block text-[#e8612c] text-[10px] font-black uppercase tracking-[0.3em] mb-2">Claim your exclusive offer</span>
                       <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{selectedOffer.Title}</h2>
                    </div>
                  </div>
                  <div className="p-8 pt-2">
                    <div className="max-h-[250px] overflow-y-auto no-scrollbar mb-10">
                      <p className="text-white/60 text-sm leading-relaxed font-medium whitespace-pre-wrap">{selectedOffer.Description}</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        fullWidth 
                        size="lg"
                        className="flex-1 rounded-2xl h-14 font-black tracking-widest bg-[#e8612c] hover:bg-[#ff7a45] shadow-lg shadow-[#e8612c]/20"
                        onClick={handleClaimOffer}
                        disabled={claiming}
                      >
                        {claiming ? (
                          <Loader2 className="animate-spin" size={24} />
                        ) : (
                          <div className="flex items-center gap-3">
                            <CheckCircle2 size={22} />
                            <span>CLAIM OFFER NOW</span>
                          </div>
                        )}
                      </Button>
                      <button 
                        onClick={() => setSelectedOffer(null)}
                        className="px-8 h-14 rounded-2xl border border-white/10 text-white font-black tracking-widest uppercase text-xs hover:bg-white/5 transition-all"
                      >
                        NOT NOW
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function X({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  )
}
