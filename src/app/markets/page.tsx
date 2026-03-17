'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useSnackbarStore } from '@/store/snackbarStore'

const mainCategories = [
  { id: 'sportsbook', label: 'Sportsbook', iconClass: 'iconpe-sportsbook' },
  { id: 'livecasino', label: 'Livecasino', iconClass: 'iconpe-live-casino' },
  { id: 'livecard', label: 'Livecard', iconClass: 'iconpe-live-cards' },
]

const sportsSubCategories = [
  { id: 'cricket', label: 'Cricket', icon: 'https://www.fairplay247.vip/markets/sportsbook/undefined/sportsbook-categories/cricket.png' },
  { id: 'football', label: 'Football', icon: 'https://www.fairplay247.vip/markets/sportsbook/undefined/sportsbook-categories/soccer.png' },
  { id: 'tennis', label: 'Tennis', icon: 'https://www.fairplay247.vip/markets/sportsbook/undefined/sportsbook-categories/tennis.png' },
  { id: 'horse-racing', label: 'Horse Racing', icon: 'https://www.fairplay247.vip/markets/sportsbook/undefined/sportsbook-categories/horse-racing.png' },
]

export default function MarketsPage() {
  const router = useRouter()
  const { show: showSnackbar } = useSnackbarStore()
  const [activeMain, setActiveMain] = useState('sportsbook')
  const [activeSport, setActiveSport] = useState('horse-racing')

  return (
    <div className="flex flex-col h-screen bg-[#000] text-white">
      {/* Header - Height 42px as per HTML */}
      <div className="flex items-center px-0 h-[42px] bg-[#1a1a1a] shadow-md relative z-20">
        <div className="flex items-center w-full max-w-7xl mx-auto px-1">
          <button onClick={() => router.back()} className="text-[#e8612c] w-[35px] h-[35px] flex items-center justify-center">
            <ChevronLeft size={28} />
          </button>
          <h1 className="text-[14px] font-bold text-white pl-0 capitalize tracking-tight ml-2">Markets</h1>
          <div className="flex-1" />
          <button 
            onClick={() => showSnackbar('Snackbar Test Successful!', 'success')}
            className="text-[10px] text-white/40 border border-white/10 px-2 py-1 rounded"
          >
            Test
          </button>
        </div>
      </div>

      {/* Main Categories Tabs - Icons and Text, Height ~55px */}
      <div className="flex bg-[#212121] border-b border-white/5 relative z-10 w-full overflow-hidden">
        {mainCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveMain(cat.id)}
            className="flex-1 flex flex-col items-center justify-center h-[55px] relative transition-all"
          >
            <div className="mb-0.5">
              <i 
                className={`v-icon notranslate icon-color v-icon--left iconpe ${cat.iconClass} theme--dark ${activeMain === cat.id ? 'primary--text' : 'text-white/60 opacity-60'}`} 
                style={{ fontSize: '16px' }} 
              />
            </div>
            <span className={`text-[11px] font-bold tracking-tight leading-none ${activeMain === cat.id ? 'text-[#e8612c]' : 'text-[#888]'}`}>
              {cat.label}
            </span>
            {activeMain === cat.id && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#e8612c] z-10" />
            )}
          </button>
        ))}
      </div>

      {/* Sub Categories Tabs - Height ~55px */}
      <div className="flex bg-[#212121] overflow-x-auto no-scrollbar border-b border-white/5 w-full">
        <div className="flex min-w-full">
          {sportsSubCategories.map((sport) => (
            <button
              key={sport.id}
              onClick={() => setActiveSport(sport.id)}
              className="flex-1 min-w-[100px] flex flex-col items-center justify-center h-[55px] relative"
            >
              <div className="mb-0.5">
                <img
                  src={sport.icon}
                  alt={sport.label}
                  className={`w-[22px] h-[22px] object-contain transition-all ${activeSport === sport.id ? 'brightness-100' : 'opacity-60 grayscale'}`}
                />
              </div>
              <span className={`text-[11px] font-bold tracking-tight leading-none ${activeSport === sport.id ? 'text-white' : 'text-[#888]'}`}>
                {sport.label}
              </span>
              {activeSport === sport.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#e8612c] z-10" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-[#0f0f0f] relative overflow-y-auto">
        {/* Empty state or list of markets would go here */}

        {/* WhatsApp Floating Button (simulating the one in the screenshot) */}
        <a
          href="https://wa.me/..."
          className="fixed bottom-24 left-4 z-50 transition-transform active:scale-90"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp"
            className="w-12 h-12 drop-shadow-lg"
          />
        </a>
      </div>
    </div>
  )
}
