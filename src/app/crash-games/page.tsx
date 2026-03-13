'use client'
import React, { useState } from 'react'
import { Search } from 'lucide-react'

const crashGames = [
  { img: 'https://luckmedia.link/hcw_speed_crash/thumb_3_4_custom.webp', label: 'SPEED CRASH', provider: 'HACKSAW GAMING' },
  { img: 'https://luckmedia.link/bgm_top_gun/thumb_3_4_custom.webp', label: 'TOP EAGLE', provider: 'BGAMING' },
  { img: 'https://luckmedia.link/dwg_penalty_crash/thumb_3_4_custom.webp', label: 'PENALTY CRASH', provider: 'DARWIN GAMING' },
  { img: 'https://luckmedia.link/kng_iron_dome/thumb_3_4_custom.webp', label: 'IRON DOME', provider: 'KINGMIDAS' },
  { img: 'https://luckmedia.link/kng_toon_crash/thumb_3_4_custom.webp', label: 'TOON CRASH', provider: 'KINGMIDAS' },
  { img: 'https://luckmedia.link/jil_keno_bonus_number/thumb_3_4_custom.webp', label: 'KENO BONUS NUMBER', provider: 'JILI GAMES' },
  { img: 'https://luckmedia.link/onl_cosmox/thumb_3_4_custom.webp', label: 'COSMOX', provider: 'ONLYPLAY' },
  { img: 'https://luckmedia.link/onl_goalx/thumb_3_4_custom.webp', label: 'GOALX', provider: 'ONLYPLAY' },
  { img: 'https://luckmedia.link/onl_scorex/thumb_3_4_custom.webp', label: 'SCOREX', provider: 'ONLYPLAY' },
  { img: 'https://luckmedia.link/onl_cricx/thumb_3_4_custom.webp', label: 'CRICX', provider: 'ONLYPLAY' },
  { img: 'https://luckmedia.link/qbt_rocket_blast/thumb_3_4_custom.webp', label: 'ROCKET BLAST', provider: 'QUBIT GAMES' },
  { img: 'https://luckmedia.link/dwg_charles_raider__the_temple_escape/thumb_3_4_custom.webp', label: 'TEMPLE ESCAPE', provider: 'DARWIN GAMING' },
  { img: 'https://luckmedia.link/jil_crash_touchdown/thumb_3_4_custom.webp', label: 'TOUCHDOWN', provider: 'JILI GAMES' },
  { img: 'https://luckmedia.link/spb_aviator/thumb_3_4_custom.webp', label: 'AVIATOR', provider: 'SPRIBE' },
]

export default function CrashGamesPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredGames = crashGames.filter(game => 
    game.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.provider.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="bg-[#121212] min-h-screen text-white pb-24">
      {/* Title Section */}
      <div className="px-4 pt-6 pb-2">
        <h1 className="text-[24px] font-black tracking-tight mb-4">Crash Games</h1>
        
        {/* Search Bar */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={18} className="text-white/40" />
          </div>
          <input
            type="text"
            placeholder="Search games"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 bg-[#2a2a2a] border-none rounded-full pl-12 pr-4 text-[14px] placeholder:text-white/40 focus:ring-2 focus:ring-[#e15b24]/50 outline-none transition-all"
          />
        </div>
      </div>

      {/* Games Grid - 2 columns as in image */}
      <div className="px-3 mt-4 grid grid-cols-2 gap-3">
        {filteredGames.map((game, idx) => (
          <div 
            key={idx} 
            className="relative aspect-[3/4] rounded-xl overflow-hidden active:scale-95 transition-all group overflow-hidden border-[1.5px] border-[#e15b24]/40 bg-[#1a1a1a] shadow-lg"
          >
            <img 
              src={game.img} 
              alt={game.label} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            {/* Overlay Text Overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent p-3 flex flex-col justify-end h-1/2">
              <span className="text-[13px] font-black text-white leading-tight uppercase line-clamp-2 text-center drop-shadow-md tracking-tighter">
                {game.label}
              </span>
              <span className="text-[9px] font-black text-white/70 uppercase text-center mt-auto opacity-80 tracking-widest">
                {game.provider}
              </span>
            </div>
            
            {/* High-fidelity orange border effect on active/hover */}
            <div className="absolute inset-0 border-2 border-transparent group-active:border-[#e15b24] rounded-xl pointer-events-none transition-colors" />
          </div>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-10 text-center opacity-40">
          <Search size={48} className="mb-4" />
          <p className="text-[14px] font-bold">No games found for "{searchQuery}"</p>
        </div>
      )}
    </div>
  )
}
