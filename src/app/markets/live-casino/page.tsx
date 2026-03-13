'use client'
import React, { useState } from 'react'

const mainTabs = [
  { id: 'lobby', label: 'Lobby' },
  { id: 'live_roulette', label: 'Live Roulette' },
  { id: 'indian_tables', label: 'Indian Tables' },
  { id: 'money_wheel', label: 'Money Wheel' },
  { id: 'game_show', label: 'Game Show' },
  { id: 'live_sic_bo', label: 'Live Sic Bo' },
  { id: 'live_dragon_tiger', label: 'Live Dragon Tiger' },
  { id: 'live_dealer', label: 'Live Dealer' },
  { id: 'live_baccarat', label: 'Live Baccarat' },
  { id: 'live_blackjack', label: 'Live Blackjack' },
  { id: 'live_lottery', label: 'Live Lottery' },
  { id: 'live_poker', label: 'Live Poker' },
  { id: 'live_lobby', label: 'Live Lobby' },
]

const providers = [
  'Aura gaming', 'Evolution Gaming', 'Red Tiger', 'NetEnt', 'Pascal Gaming', 'Creed Roomz', 
  'Smartsoft Gaming', 'Spribe', 'Ezugi', 'Aviatrix', 'Play\'n Go', 'Betsolutions'
]

const categories = [
  {
    id: 'live_roulette',
    title: 'Live Roulette',
    games: [
      { img: 'https://luckmedia.link/ezg_trke_rulet/thumb_3_4_custom.webp', label: 'TURKISH ROULETTE', provider: 'EZUGI' },
      { img: 'https://luckmedia.link/evo_speed_roulette/thumb_3_4_custom.webp', label: 'SPEED ROULETTE', provider: 'EVOLUTION GAMING' },
      { img: 'https://luckmedia.link/ezg_speed_roulette/thumb_3_4_custom.webp', label: 'SPEED ROULETTE', provider: 'EZUGI' },
      { img: 'https://luckmedia.link/evo_emperor_roulette/thumb_3_4_custom.webp', label: 'EMPEROR ROULETTE', provider: 'EVOLUTION GAMING' },
      { img: 'https://luckmedia.link/ezg_prestige_auto_roulette/thumb_3_4_custom.webp', label: 'PRESTIGE AUTO ROULETTE', provider: 'EZUGI' },
      { img: 'https://luckmedia.link/evo_immersive_roulette/thumb_3_4_custom.webp', label: 'IMMERSIVE ROULETTE', provider: 'EVOLUTION GAMING' },
    ]
  },
  {
    id: 'money_wheel',
    title: 'Money Wheel',
    games: [
      { img: 'https://luckmedia.link/evo_first_person_dream_catcher/thumb_3_4_custom.webp', label: 'FIRST PERSON DREAM CATCHER', provider: 'EVOLUTION GAMING' },
      { img: 'https://luckmedia.link/evo_imperial_quest/thumb_3_4_custom.webp', label: 'IMPERIAL QUEST', provider: 'EVOLUTION GAMING' },
      { img: 'https://luckmedia.link/raw_mad_joker_superslice_zones/thumb_3_4_custom.webp', label: 'MAD JOKER SUPERSLICE ZONES', provider: 'RAW GAMING' },
      { img: 'https://luckmedia.link/raw_joker__the_thief/thumb_3_4_custom.webp', label: 'JOKER THE THIEF', provider: 'RAW GAMING' },
      { img: 'https://luckmedia.link/raw_blackbeards_superslice_rings/thumb_3_4_custom.webp', label: 'BLACKBEARDS SUPERSLICE RINGS', provider: 'RAW GAMING' },
      { img: 'https://luckmedia.link/raw_lucky_mcgees_superslice_swirl/thumb_3_4_custom.webp', label: 'LUCKY MCGEES SUPERSLICE SWIRL', provider: 'RAW GAMING' },
    ]
  },
  {
    id: 'game_show',
    title: 'Game Show',
    games: [
      { img: 'https://luckmedia.link/evo_crazy_time/thumb_3_4_custom.webp', label: 'CRAZY TIME', provider: 'EVOLUTION GAMING' },
      { img: 'https://luckmedia.link/evo_crazy_coin_flip/thumb_3_4_custom.webp', label: 'CRAZY COIN FLIP', provider: 'EVOLUTION GAMING' },
      { img: 'https://luckmedia.link/pltl_buffalo_blitz_live_slots/thumb_3_4_custom.webp', label: 'BUFFALO BLITZ LIVE SLOTS', provider: 'PLAYTECH LIVE' },
      { img: 'https://luckmedia.link/pltl_the_greatest_cards_show/thumb_3_4_custom.webp', label: 'THE GREATEST CARDS SHOW', provider: 'PLAYTECH LIVE' },
      { img: 'https://luckmedia.link/atm_cocktail_roulette/thumb_3_4_custom.webp', label: 'COCKTAIL ROULETTE', provider: 'ATMOSFERA' },
      { img: 'https://luckmedia.link/evo_stock_market/thumb_3_4_custom.webp', label: 'STOCK MARKET', provider: 'EVOLUTION GAMING' },
    ]
  }
]

export default function LiveCasinoPage() {
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
