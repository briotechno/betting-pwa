'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { Search, Filter, Grid3X3, List } from 'lucide-react'
import Badge from '@/components/ui/Badge'

const casinoTabs = ['All', 'Live Casino', 'Slots', 'Live Cards', 'Crash Games', 'Table Games']

const casinoGames = [
  { id: 'roulette', name: 'Roulette', provider: 'Evolution', category: 'Live Casino', emoji: '🎡', players: 342 },
  { id: 'thunder', name: 'Lightning Dice', provider: 'Evolution', category: 'Live Casino', emoji: '⚡', players: 156 },
  { id: 'crazytime', name: 'Crazy Time', provider: 'Evolution', category: 'Live Casino', emoji: '🎪', players: 891 },
  { id: 'dealnodeal', name: 'Deal No Deal', provider: 'Evolution', category: 'Live Casino', emoji: '💼', players: 234 },
  { id: 'moneywheel', name: 'Money Wheel', provider: 'Pragmatic', category: 'Live Casino', emoji: '🎡', players: 445 },
  { id: 'dragontiger', name: 'Dragon Tiger', provider: 'Evolution', category: 'Live Casino', emoji: '🐉', players: 678 },
  { id: 'blackjack', name: 'Blackjack VIP', provider: 'Evolution', category: 'Table Games', emoji: '🃏', players: 123 },
  { id: 'baccarat', name: 'Baccarat Pro', provider: 'Pragmatic', category: 'Table Games', emoji: '🎴', players: 287 },
  { id: 'teenpatti', name: 'Teenpatti', provider: 'Ezugi', category: 'Live Cards', emoji: '🃏', players: 1234 },
  { id: 'andarbahar', name: 'Andar Bahar', provider: 'Ezugi', category: 'Live Cards', emoji: '🎴', players: 567 },
  { id: 'aviator', name: 'Aviator', provider: 'Spribe', category: 'Crash Games', emoji: '✈️', players: 2345 },
  { id: 'jetx', name: 'JetX', provider: 'SmartSoft', category: 'Crash Games', emoji: '🚀', players: 789 },
  { id: 'mines', name: 'Mines', provider: 'Spribe', category: 'Crash Games', emoji: '💣', players: 456 },
  { id: 'dice', name: 'Dice', provider: 'Spribe', category: 'Crash Games', emoji: '🎲', players: 234 },
  { id: 'hilo', name: 'Hi-Lo', provider: 'Spribe', category: 'Crash Games', emoji: '📈', players: 345 },
  { id: 'gates', name: 'Gates of Olympus', provider: 'Pragmatic', category: 'Slots', emoji: '⚡', players: 678 },
  { id: 'sweetbonanza', name: 'Sweet Bonanza', provider: 'Pragmatic', category: 'Slots', emoji: '🍭', players: 891 },
  { id: 'book', name: 'Book of Ra', provider: 'Novomatic', category: 'Slots', emoji: '📖', players: 234 },
]

const categoryColors: Record<string, string> = {
  'Live Casino': 'bg-red-500/20 text-red-400 border-red-500/30',
  'Slots': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Live Cards': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Crash Games': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Table Games': 'bg-green-500/20 text-green-400 border-green-500/30',
}

export default function CasinoPage() {
  const [activeTab, setActiveTab] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = casinoGames.filter((game) => {
    const matchesTab = activeTab === 'All' || game.category === activeTab
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.provider.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <div className="max-w-full">
      {/* Casino Header */}
      <div className="relative bg-gradient-to-r from-purple-900/80 via-indigo-900/80 to-blue-900/80 border-b border-cardBorder">
        <div className="px-4 py-6 md:py-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🎰</span>
            <div>
              <h1 className="text-2xl font-black text-white">Live Casino</h1>
              <p className="text-sm text-purple-300">Premium gaming experience</p>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute right-0 top-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Search + Filter */}
      <div className="px-4 py-3 border-b border-cardBorder bg-surface/30 flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
          <input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-cardBorder rounded-lg pl-8 pr-4 py-2 text-xs text-textPrimary placeholder-textMuted focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-textMuted hover:text-textPrimary'}`}
          >
            <Grid3X3 size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'text-textMuted hover:text-textPrimary'}`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto no-scrollbar px-4 py-2 gap-2 border-b border-cardBorder">
        {casinoTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`sport-pill flex-shrink-0 ${activeTab === tab ? 'active' : 'inactive'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Games Grid */}
      <div className="p-4">
        <p className="text-xs text-textMuted mb-3">{filtered.length} games</p>
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3'
          : 'flex flex-col gap-2'
        }>
          {filtered.map((game) => (
            viewMode === 'grid' ? (
              <div
                key={game.id}
                className="bg-card border border-cardBorder rounded-xl overflow-hidden cursor-pointer game-card-hover group"
              >
                {/* Game image placeholder */}
                <div className="aspect-[4/3] bg-gradient-to-br from-surface to-background flex items-center justify-center relative overflow-hidden">
                  <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                    {game.emoji}
                  </span>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <button className="bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 -translate-y-2 group-hover:translate-y-0">
                      PLAY NOW
                    </button>
                  </div>
                  {/* Live badge */}
                  {game.category === 'Live Casino' || game.category === 'Live Cards' ? (
                    <div className="absolute top-1.5 left-1.5">
                      <Badge variant="live" size="xs">LIVE</Badge>
                    </div>
                  ) : null}
                  {/* Players count */}
                  <div className="absolute bottom-1.5 right-1.5 bg-black/60 rounded px-1.5 py-0.5 text-[9px] text-white">
                    👥 {game.players.toLocaleString()}
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs font-semibold text-textPrimary truncate">{game.name}</p>
                  <p className="text-[10px] text-textMuted">{game.provider}</p>
                </div>
              </div>
            ) : (
              <div
                key={game.id}
                className="bg-card border border-cardBorder rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:border-primary/50 transition-all"
              >
                <div className="w-12 h-12 bg-surface rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  {game.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-textPrimary truncate">{game.name}</p>
                  <p className="text-xs text-textMuted">{game.provider}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${categoryColors[game.category] || ''}`}>
                    {game.category}
                  </span>
                  <span className="text-[10px] text-textMuted">👥 {game.players.toLocaleString()}</span>
                </div>
                <button className="bg-primary hover:bg-primaryHover text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex-shrink-0">
                  PLAY
                </button>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  )
}
