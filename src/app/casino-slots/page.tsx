'use client'
import React, { useState } from 'react'

const mainTabs = [
  { id: 'lobby', label: 'Lobby' },
  { id: 'crash_games', label: 'Crash Games' },
  { id: 'fishing_games', label: 'Fishing Games' },
  { id: 'video_slots', label: 'Video Slots' },
  { id: 'lottery', label: 'Lottery' },
  { id: 'casual_games', label: 'Casual Games' },
  { id: 'virtual_sports', label: 'Virtual Sports' },
  { id: 'scratch_card', label: 'Scratch Card' },
  { id: 'craps', label: 'Craps' },
  { id: 'baccarat', label: 'Baccarat' },
  { id: 'dragon_tiger', label: 'Dragon Tiger' },
  { id: 'blackjack', label: 'Blackjack' },
  { id: 'roulette', label: 'Roulette' },
  { id: 'table_games', label: 'Table Games' },
  { id: 'poker', label: 'Poker' },
  { id: 'top_card', label: 'Top Card' },
  { id: 'buy_bonus', label: 'Buy Bonus' },
  { id: 'virtual', label: 'Virtual' },
  { id: 'fast_games', label: 'Fast Games' },
  { id: 'originals', label: 'Originals' },
]

const providers = [
  'Aura gaming', 'Evolution Gaming', 'Red Tiger', 'NetEnt', 'Pascal Gaming', 'Creed Roomz', 
  'Smartsoft Gaming', 'Spribe', 'Ezugi', 'Aviatrix', 'Play\'n Go', 'Betsolutions'
]

const categories = [
  {
    id: 'crash_games',
    title: 'Crash Games',
    games: [
      { img: 'https://luckmedia.link/btsl_zeppelin/thumb_3_4_custom.webp', label: 'ZEPPELIN', provider: 'BETSOLUTIONS' },
      { img: 'https://luckmedia.link/pgp_spaceman/thumb_3_4_custom.webp', label: 'SPACEMAN', provider: 'PRAGMATIC PLAY' },
      { img: 'https://luckmedia.link/spb_aviator/thumb_3_4_custom.webp', label: 'AVIATOR', provider: 'SPRIBE' },
      { img: 'https://luckmedia.link/gmz_pilot/thumb_3_4_custom.webp', label: 'PILOT', provider: 'GAMZIX' },
      { img: 'https://luckmedia.link/gmz_pilot_cup/thumb_3_4_custom.webp', label: 'PILOT CUP', provider: 'GAMZIX' },
      { img: 'https://luckmedia.link/sms_footballx/thumb_3_4_custom.webp', label: 'FOOTBALLX', provider: 'SMARTSOFT' },
    ]
  },
  {
    id: 'fishing_games',
    title: 'Fishing Games',
    games: [
      { img: 'https://luckmedia.link/jil_royal_fishing/thumb_3_4_custom.webp', label: 'ROYAL FISHING', provider: 'JILI GAMES' },
      { img: 'https://luckmedia.link/jil_allstar_fishing/thumb_3_4_custom.webp', label: 'ALL-STAR FISHING', provider: 'JILI GAMES' },
      { img: 'https://luckmedia.link/jil_bombing_fishing/thumb_3_4_custom.webp', label: 'BOMBING FISHING', provider: 'JILI GAMES' },
      { img: 'https://luckmedia.link/jil_dinosaur_tycoon/thumb_3_4_custom.webp', label: 'DINOSAUR TYCOON', provider: 'JILI GAMES' },
      { img: 'https://luckmedia.link/jil_happy_fishing/thumb_3_4_custom.webp', label: 'HAPPY FISHING', provider: 'JILI GAMES' },
      { img: 'https://luckmedia.link/jil_jackpot_fishing/thumb_3_4_custom.webp', label: 'JACKPOT FISHING', provider: 'JILI GAMES' },
    ]
  },
  {
    id: 'video_slots',
    title: 'Video Slots',
    games: [
      { img: 'https://luckmedia.link/rtg_atlantis/thumb_3_4_custom.webp', label: 'ATLANTIS', provider: 'RED TIGER' },
      { img: 'https://luckmedia.link/rtg_rainbow_jackpots/thumb_3_4_custom.webp', label: 'RAINBOW JACKPOTS', provider: 'RED TIGER' },
      { img: 'https://luckmedia.link/rtg_elven_magic/thumb_3_4_custom.webp', label: 'ELVEN MAGIC', provider: 'RED TIGER' },
      { img: 'https://luckmedia.link/rtg_wild_wild_chest/thumb_3_4_custom.webp', label: 'WILD WILD CHEST', provider: 'RED TIGER' },
      { img: 'https://luckmedia.link/rtg_clash_of_the_beasts/thumb_3_4_custom.webp', label: 'CLASH OF THE BEASTS', provider: 'RED TIGER' },
      { img: 'https://luckmedia.link/rtg_10001_nights/thumb_3_4_custom.webp', label: '10001 NIGHTS', provider: 'RED TIGER' },
    ]
  },
  {
    id: 'lottery',
    title: 'Lottery',
    games: [
      { img: 'https://luckmedia.link/evo_first_person_mega_ball/thumb_3_4_custom.webp', label: 'FIRST PERSON MEGA BALL', provider: 'EVOLUTION' },
      { img: 'https://luckmedia.link/png_keno/thumb_3_4_custom.webp', label: 'KENO', provider: 'PLAY\'N GO' },
      { img: 'https://luckmedia.link/spb_keno/thumb_3_4_custom.webp', label: 'KENO', provider: 'SPRIBE' },
      { img: 'https://luckmedia.link/jdb_happy_lottery/thumb_3_4_custom.webp', label: 'HAPPY LOTTERY', provider: 'JDB' },
      { img: 'https://luckmedia.link/kng_color_game/thumb_3_4_custom.webp', label: 'COLOR GAME', provider: 'KINGMIDAS' },
      { img: 'https://luckmedia.link/jdb_gold_rooster_lottery/thumb_3_4_custom.webp', label: 'GOLD ROOSTER LOTTERY', provider: 'JDB' },
    ]
  },
  {
    id: 'casual_games',
    title: 'Casual Games',
    games: [
      { img: 'https://luckmedia.link/btsl_mines/thumb_3_4_custom.webp', label: 'MINES', provider: 'BETSOLUTIONS' },
      { img: 'https://luckmedia.link/btsl_hilo/thumb_3_4_custom.webp', label: 'HILO', provider: 'BETSOLUTIONS' },
      { img: 'https://luckmedia.link/btsl_dice/thumb_3_4_custom.webp', label: 'DICE', provider: 'BETSOLUTIONS' },
      { img: 'https://luckmedia.link/jil_crazy_hunter/thumb_3_4_custom.webp', label: 'CRAZY HUNTER', provider: 'JILI GAMES' },
      { img: 'https://luckmedia.link/sms_plinkox/thumb_3_4_custom.webp', label: 'PLINKOX', provider: 'SMARTSOFT' },
      { img: 'https://luckmedia.link/jil_win_drop/thumb_3_4_custom.webp', label: 'WIN DROP', provider: 'JILI GAMES' },
    ]
  }
]

export default function SlotGamesPage() {
  const [activeTab, setActiveTab] = useState('lobby')
  const [activeProvider, setActiveProvider] = useState('')

  return (
    <div className="bg-[#000] min-h-screen text-white">
      {/* Category Tabs - Main horizontal scroll */}
      <div className="flex overflow-x-auto no-scrollbar bg-[#3d3d3d] h-[45px] items-stretch sticky top-20 lg:top-[92px] z-[40]">
        {mainTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 h-full text-[12px] font-black uppercase tracking-tight whitespace-nowrap transition-all border-r border-black/20 ${
              activeTab === tab.id ? 'bg-[#e15b24] text-white shadow-inner' : 'text-gray-200 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Provider Tabs - Secondary horizontal scroll */}
      <div className="flex overflow-x-auto no-scrollbar bg-[#1a1a1a] h-[42px] items-stretch border-b border-white/5 sticky top-[125px] lg:top-[137px] z-[40]">
        {providers.map((p) => (
          <button
            key={p}
            onClick={() => setActiveProvider(p)}
            className={`px-4 h-full text-[10px] font-black uppercase tracking-tight whitespace-nowrap border-r border-white/5 transition-all ${
              activeProvider === p ? 'text-white bg-white/5' : 'text-white/60 hover:text-white'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Lobby Sections */}
      <div className="p-3 space-y-8 mt-2">
        {categories.map((cat) => (
          <div key={cat.id} id={cat.id} className="w-full">
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-[18px] font-bold text-white tracking-tight">{cat.title}</h2>
              <button className="bg-[#4caf50] text-[#fff] px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-lg active:scale-95 transition-all">
                See All
              </button>
            </div>

            {/* Games Grid - 3 items per row as in image */}
            <div className="grid grid-cols-3 gap-2 px-0.5">
              {cat.games.map((game, idx) => (
                <div key={idx} className="relative aspect-[3/4.2] group active:scale-95 transition-transform overflow-hidden rounded-md border border-white/5 bg-[#1a1a1a]">
                  <img 
                    src={game.img} 
                    alt={game.label} 
                    className="w-full h-full object-cover rounded-md shadow-lg"
                    loading="lazy"
                  />
                  {/* Text Overlay matching reference style */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent p-2 flex flex-col justify-end h-1/2">
                    <span className="text-[9px] font-black text-white leading-tight uppercase line-clamp-2 text-center drop-shadow-md">
                      {game.label}
                    </span>
                    <span className="text-[7px] font-black text-white/70 uppercase text-center mt-auto opacity-80">
                      {game.provider}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Space for bottom nav */}
      <div className="h-24" />
    </div>
  )
}
