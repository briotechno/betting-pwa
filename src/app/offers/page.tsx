'use client'
import React, { useState, useEffect } from 'react'
import { Gift, ChevronRight, Loader2, Info, CheckCircle2, ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Footer from '@/components/layout/Footer'
import { userController } from '@/controllers'
import { useAuthStore } from '@/store/authStore'
import { useSnackbarStore } from '@/store/snackbarStore'
import Button from '@/components/ui/Button'

interface Offer {
  OfferId: string
  Title: string
  Category: string
  Banner?: string
  Status?: string
  Description?: string
  Eligible?: string
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
        if (response && typeof response === 'object' && !response.error) {
          // Transform object keys "0", "1"... into an array
          const rawOffers = Object.values(response).filter(v => v && typeof v === 'object' && (v as any).OfferId)
          setOffers(rawOffers as Offer[])
        } else if (response && response.error === '0') {
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

      const response = await userController.getOfferDetail(token, offer.OfferId)
      if (response) {
        // Try to find the data - either the response itself or the first object value (for keyed responses)
        let data = response;
        if (response && typeof response === 'object' && !response.detail && !response.Description) {
          const firstVal = Object.values(response).find(v => v && typeof v === 'object' && ((v as any).detail || (v as any).Description || (v as any).OfferId));
          if (firstVal) data = firstVal;
        }

        if (data.detail || data.Description || data.description || (data.error === '0' || data.error === null)) {
          // Clean the HTML from unused '?' characters and replacement chars
          const rawHtml = data.detail || data.Description || data.description || '';
          const cleanedHtml = rawHtml
            .replace(/[\?\uFFFD]/g, '') // Remove literal ? and replacement characters
            .replace(/&ndash;/g, '–')
            .trim();

          setSelectedOffer({
            ...offer,
            Description: cleanedHtml,
            Banner: data.Banner || data.image || offer.Banner,
            Eligible: data.eligible || data.Eligible
          })
        }
      }
    } catch (error) {
      console.error('Failed to fetch offer detail:', error)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleClaimOffer = async () => {
    if (!selectedOffer || claiming) return
    
    // Check eligibility before attempting claim
    if (selectedOffer.Eligible?.toUpperCase() !== 'Y') {
      showSnackbar('You are not eligible for this offer.', 'error')
      return
    }

    setClaiming(true)
    try {
      const token = localStorage.getItem('fairbet-auth') ? 
        JSON.parse(localStorage.getItem('fairbet-auth')!).state.user?.loginToken : null
      
      if (!token) return

      const response = await userController.claimOffer(token, selectedOffer.OfferId)
      
      // Handle both string '0' and null as success based on previous API patterns
      if (response.error === '0' || response.error === null) {
        showSnackbar(response.msg || 'Offer claimed successfully!', 'success')
        setSelectedOffer(null)
      } else {
        showSnackbar(response.msg || 'Failed to claim offer. Please try again later.', 'error')
      }
    } catch (error) {
      showSnackbar('An error occurred while claiming the offer', 'error')
    } finally {
      setClaiming(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#121212]">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
            {offers.map((offer) => (
              <div 
                key={offer.OfferId}
                className="bg-white rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 group flex flex-col"
              >
                <div className="aspect-[2/1] bg-gray-100 relative overflow-hidden">
                  {offer.Banner ? (
                    <img 
                      src={offer.Banner.startsWith('data:') ? offer.Banner : `data:image/png;base64,${offer.Banner}`} 
                      alt={offer.Title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                      <Gift size={48} />
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex-1 flex flex-col gap-3">
                  <div>
                    <span className="inline-block px-3 py-0.5 bg-[#fff2ed] text-[#e8612c] text-[10px] font-black uppercase rounded-md mb-2">
                      {offer.Category || 'Welcome'}
                    </span>
                    <h3 className="text-xl font-bold text-[#111] leading-snug">{offer.Title}</h3>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-gray-500 font-bold text-[11px]">
                      <Info size={14} className="fill-gray-500 text-white" />
                      <span>Terms Applied</span>
                    </div>
                    <button 
                      onClick={() => handleOfferClick(offer)}
                      className="px-6 py-2 bg-[#e8612c] text-white text-[13px] font-black uppercase rounded-lg shadow-md active:scale-95 transition-all"
                    >
                      VIEW OFFER
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Offer Detail Modal */}
        {selectedOffer && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/80 animate-in fade-in duration-300" 
              onClick={() => !detailLoading && setSelectedOffer(null)} 
            />
            <div className="relative w-full max-w-lg bg-white rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
              {/* Theme Header */}
              <div className="h-12 bg-[#e8612c] flex items-center justify-between px-4">
                <span className="text-sm font-black text-white uppercase tracking-tight truncate max-w-[80%]">
                  {selectedOffer.Title}
                </span>
                <button 
                  onClick={() => setSelectedOffer(null)}
                  className="text-white/60 hover:text-white"
                >
                  <X size={22} />
                </button>
              </div>

              {detailLoading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <Loader2 className="animate-spin text-[#d19b4b]" size={40} />
                </div>
              ) : (
                <div className="p-5 flex flex-col gap-4">
                  <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100">
                    {selectedOffer.Banner && (
                      <img 
                        src={selectedOffer.Banner.startsWith('data:') ? selectedOffer.Banner : `data:image/png;base64,${selectedOffer.Banner}`} 
                        alt={selectedOffer.Title} 
                        className="w-full h-auto" 
                      />
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="inline-block px-3 py-1 bg-[#fff2ed] text-[#e8612c] text-[10px] font-black uppercase rounded-md">
                      {selectedOffer.Category || 'Welcome'}
                    </span>
                    <div className={`flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase rounded-md ${
                      selectedOffer.Eligible?.toUpperCase() === 'Y' 
                        ? 'bg-[#e1f5e8] text-[#2d6a4f]' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {selectedOffer.Eligible?.toUpperCase() === 'Y' ? (
                        <CheckCircle2 size={12} className="fill-[#2d6a4f] text-white" />
                      ) : (
                        <Info size={12} />
                      )}
                      <span>{selectedOffer.Eligible?.toUpperCase() === 'Y' ? 'YOU ARE ELIGIBLE' : 'NOT ELIGIBLE'}</span>
                    </div>
                  </div>

                  <h2 className="text-2xl font-black text-[#111] uppercase tracking-tight truncate">
                    {selectedOffer.Title}
                  </h2>

                  <div className="max-h-[35vh] overflow-y-auto no-scrollbar py-2 text-[#333]">
                    <style>{`
                      .offer-detail-content p { margin-bottom: 12px; }
                      .offer-detail-content ul { margin-bottom: 12px; padding-left: 15px; }
                      .offer-detail-content li { margin-bottom: 6px; }
                      .offer-detail-content strong { color: #111; }
                    `}</style>
                    <div 
                      className="text-[13px] font-medium leading-[1.7] offer-detail-content"
                      dangerouslySetInnerHTML={{ __html: selectedOffer.Description || 'No detailed description found.' }}
                    />
                  </div>

                  <div className="pt-2">
                    <button 
                      className={`w-full h-12 text-white text-sm font-black uppercase rounded-lg shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 ${
                        selectedOffer.Eligible?.toUpperCase() === 'Y'
                          ? 'bg-[#e8612c] cursor-pointer'
                          : 'bg-gray-200 cursor-not-allowed text-gray-400'
                      }`}
                      onClick={handleClaimOffer}
                      disabled={claiming || selectedOffer.Eligible?.toUpperCase() !== 'Y'}
                    >
                      {claiming ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : selectedOffer.Eligible?.toUpperCase() === 'Y' ? (
                        'CLAIM OFFER NOW'
                      ) : (
                        'NOT ELIGIBLE'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
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
