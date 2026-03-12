'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLayoutStore } from '@/store/layoutStore'

const sportsItems = [
  { name: 'Formula 1', icon: 'formula1.694035b.png' },
  { name: 'Basketball', icon: 'basketball.2393027.png' },
  { name: 'Badminton', icon: 'badminton.fdfeeb2.png' },
  { name: 'Golf', icon: 'golf.6f52b62.png' },
  { name: 'Counter Strike', icon: 'counter_strike.0ae278c.png' },
  { name: 'Baseball', icon: 'baseball.5a270fc.png' },
  { name: 'Rugby', icon: 'rugby.582bf30.png' },
  { name: 'Boxing', icon: 'boxing.6f048b8.png' },
  { name: 'FIFA', icon: 'fifa.e9e8e65.png' },
  { name: 'Volleyball', icon: 'volleyball.854c0d1.png' },
  { name: 'Fifa22-volta', icon: 'fifa_volta.b3ec6d8.png' },
  { name: 'Dota 2', icon: 'dota_2.2446e69.png' },
  { name: 'Ecricket', icon: 'e_cricket.ab7b648.png' },
  { name: 'Ice-hockey', icon: 'ice_hokey.f348c8f.png' },
  { name: 'Handball', icon: 'handball.477befc.png' },
  { name: 'Cycling', icon: 'cycling.565031a.png' },
  { name: 'Darts', icon: 'darts.30c0230.png' },
  { name: 'Efighting', icon: 'e_fighting.549a768.png' },
  { name: 'American-football', icon: 'american_football.fd7946b.png' },
  { name: 'NBA2k19', icon: 'nba2k19.7ebeab0.png' },
  { name: 'Waterpolo', icon: 'waterpolo.3118f03.png' },
  { name: 'Bowls', icon: 'bowls.087be2e.png' },
  { name: 'Table-tennis', icon: 'tabletennis.e584580.png' },
  { name: 'Motorcycle-racing', icon: 'motorcycle_racing.502119f.png' },
  { name: 'Cricekt', icon: 'cricket.13c45ec.png' },
  { name: 'Soccer', icon: 'soccer.edef26e.png' },
  { name: 'Tennis', icon: 'tennis.61acaee.png' },
  { name: 'Snooker', icon: 'snooker.89e1f8a.png' },
]

export default function CategoryMoreDrawer() {
  const { moreMenuOpen, setMoreMenuOpen } = useLayoutStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          moreMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMoreMenuOpen(false)} 
      />

      {/* Drawer */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-[101] bg-[#000] border-t border-white/10 rounded-t-3xl p-4 shadow-2xl transition-transform duration-350 ease-out flex flex-col max-h-[85vh] ${
          moreMenuOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6 shrink-0" />
        
        <div className="overflow-y-auto no-scrollbar pb-6 px-2">
          <div className="grid grid-cols-4 gap-y-6 gap-x-2">
            {sportsItems.map((item) => (
              <Link
                key={item.name}
                href={`/sports/${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setMoreMenuOpen(false)}
                className="flex flex-col items-center gap-2 group transition-all"
              >
                <div className="w-12 h-12 flex items-center justify-center transition-transform active:scale-90">
                  <img 
                    src={`/sports-icons/${item.icon}`} 
                    alt={item.name} 
                    className="w-10 h-10 object-contain drop-shadow-lg"
                  />
                </div>
                <span className="text-[10px] font-bold text-white/90 group-hover:text-[#e8612c] text-center leading-tight transition-colors">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <button 
          onClick={() => setMoreMenuOpen(false)}
          className="mt-2 w-full py-4 text-[11px] font-black text-white/40 uppercase tracking-widest border-t border-white/[0.03] hover:text-white transition-colors"
        >
          Close Menu
        </button>
      </div>
    </>
  )
}
