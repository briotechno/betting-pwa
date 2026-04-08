'use client'
import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Home, Info } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import OddsTable from '@/components/sportsbook/OddsTable'
import SportsMarketTable from '@/components/sportsbook/SportsMarketTable'
import BetSlip from '@/components/sportsbook/BetSlip'
import { useBetSlipStore } from '@/store/betSlipStore'

const sportsMatches = {
  cricket: [
    {
      id: 'cricket-1',
      title: 'Warriors V North West Dragons',
      startTime: 'LIVE',
      status: 'LIVE' as const,
      teams: [
        {
          teamName: 'Warriors',
          back: [{ price: 1.42, size: '518' }, { price: 1.43, size: '1,472' }, { price: 1.44, size: '678' }],
          lay: [{ price: 1.45, size: '23' }, { price: 1.46, size: '268' }, { price: 1.47, size: '96' }]
        },
        {
          teamName: 'North West Dragons',
          back: [{ price: 3.10, size: '46' }, { price: 3.15, size: '124' }, { price: 3.20, size: '10' }],
          lay: [{ price: 3.30, size: '297' }, { price: 3.35, size: '627' }, { price: 3.40, size: '216' }]
        }
      ]
    },
    {
      id: 'cricket-2',
      title: 'Abbottabad Region V Karachi Region Blues',
      startTime: 'LIVE',
      status: 'LIVE' as const,
      teams: [
        {
          teamName: 'Abbottabad Region',
          back: [{ price: 1.85, size: '973' }, { price: 1.86, size: '30' }, { price: 1.87, size: '1,166' }],
          lay: [{ price: 1.88, size: '727' }, { price: 1.91, size: '12' }, { price: 1.92, size: '53' }]
        },
        {
          teamName: 'Karachi Region Blues',
          back: [{ price: 2.06, size: '67' }, { price: 2.08, size: '76' }, { price: 2.12, size: '645' }],
          lay: [{ price: 2.16, size: '1,890' }, { price: 2.18, size: '853' }, { price: 2.20, size: '39' }]
        }
      ]
    },
    {
      id: 'cricket-3',
      title: 'Multan Region V Lahore Region Blues',
      startTime: 'Today At 9:45 PM',
      status: 'UPCOMING' as const,
      teams: [
        {
          teamName: 'Multan Region',
          back: [{ price: 1.76, size: '40' }, { price: 1.80, size: '4' }, { price: 1.82, size: '1' }],
          lay: [{ price: 1.89, size: '1' }, { price: 1.90, size: '43' }, { price: 1.92, size: '13' }]
        },
        {
          teamName: 'Lahore Region Blues',
          back: [{ price: 2.06, size: '8' }, { price: 2.08, size: '15' }, { price: 2.10, size: '39' }],
          lay: [{ price: 2.22, size: '1' }, { price: 2.26, size: '3' }, { price: 2.32, size: '30' }]
        }
      ]
    },
    {
      id: 'cricket-4',
      title: 'New Zealand W V Zimbabwe W',
      startTime: 'Tomorrow At 3:30 AM',
      status: 'UPCOMING' as const,
      teams: [
        {
          teamName: 'New Zealand W',
          back: [{ price: '-', size: '-' }, { price: '-', size: '-' }, { price: '-', size: '-' }],
          lay: [{ price: 1.01, size: '3,405' }, { price: 1.02, size: '13,099' }, { price: 1.03, size: '115' }]
        },
        {
          teamName: 'Zimbabwe W',
          back: [{ price: 85, size: '2' }, { price: 90, size: '1' }, { price: 100, size: '34' }],
          lay: [{ price: 140, size: '2' }, { price: 790, size: '1' }, { price: 880, size: '1' }]
        }
      ]
    }
  ],
  soccer: [
    {
      id: 'soccer-1',
      title: 'Arsenal V Manchester City',
      startTime: 'LIVE',
      status: 'LIVE' as const,
      teams: [
        {
          teamName: 'Arsenal',
          back: [{ price: 2.10, size: '12k' }, { price: 2.12, size: '5k' }, { price: 2.14, size: '1k' }],
          lay: [{ price: 2.18, size: '3k' }, { price: 2.20, size: '8k' }, { price: 2.24, size: '2k' }]
        },
        {
          teamName: 'Manchester City',
          back: [{ price: 3.40, size: '1k' }, { price: 3.45, size: '4k' }, { price: 3.50, size: '9k' }],
          lay: [{ price: 3.60, size: '5k' }, { price: 3.70, size: '2k' }, { price: 3.80, size: '1k' }]
        }
      ]
    }
  ],
  tennis: [
    {
      id: 'tennis-1',
      title: 'Djokovic V Alcaraz',
      startTime: 'LIVE',
      status: 'LIVE' as const,
      teams: [
        {
          teamName: 'Djokovic',
          back: [{ price: 1.90, size: '5k' }, { price: 1.91, size: '2k' }, { price: 1.92, size: '1k' }],
          lay: [{ price: 1.95, size: '3k' }, { price: 1.96, size: '4k' }, { price: 1.98, size: '2k' }]
        },
        {
          teamName: 'Alcaraz',
          back: [{ price: 2.02, size: '1k' }, { price: 2.04, size: '3k' }, { price: 2.06, size: '5k' }],
          lay: [{ price: 2.10, size: '2k' }, { price: 2.12, size: '4k' }, { price: 2.14, size: '1k' }]
        }
      ]
    }
  ]
}

const sports = [
  { id: 'cricket', label: 'Cricket', emoji: '🏏', count: 15 },
  { id: 'soccer', label: 'Soccer', emoji: '⚽', count: 109 },
  { id: 'tennis', label: 'Tennis', emoji: '🎾', count: 34 },
  { id: 'kabaddi', label: 'Kabaddi', emoji: '🤼', count: 4 },
  { id: 'horse-racing', label: 'Horse Racing', emoji: '🏇', count: 8 },
  { id: 'greyhound', label: 'Greyhound', emoji: '🐕', count: 6 },
]

const competitions = {
  cricket: [
    { id: 'icc-t20', label: "ICC Men's T20 World Cup", isLive: true },
    { id: 'csa-prov', label: 'CSA Provincial One-Day Challenge Div 1', isLive: false },
    { id: 'aus-odc', label: 'Australia One Day Cup', isLive: false },
    { id: 'odi-intl', label: 'One Day Internationals', isLive: false },
    { id: 'test-aus', label: 'Test Series Australia vs India, Women', isLive: true },
    { id: 'csa-div2', label: 'CSA One-Day Challenge Div 2', isLive: false },
    { id: 'plunket', label: 'Plunket Shield', isLive: false },
    { id: 'bigbash', label: 'Big Bash League SRL', isLive: true },
    { id: 'odi-hk', label: 'ODI Series Hong Kong vs Kuwait', isLive: false },
    { id: 'senior-women', label: 'Senior Womens Inter Zonal One Day Tro...', isLive: false },
    { id: 'womens-test', label: "Women's Test Matches", isLive: false },
    { id: 'supersmash', label: 'Super Smash SRL', isLive: true },
    { id: 'womens-odi', label: 'Womens One Day Internationals', isLive: false },
  ],
  soccer: [
    { id: 'premier', label: 'English Premier League', isLive: true },
    { id: 'laliga', label: 'La Liga', isLive: false },
    { id: 'bundesliga', label: 'Bundesliga', isLive: false },
    { id: 'seriea', label: 'Serie A', isLive: true },
    { id: 'ligue1', label: 'Ligue 1', isLive: false },
  ],
  tennis: [
    { id: 'wimbledon', label: 'Wimbledon Championships', isLive: true },
    { id: 'usopen', label: 'US Open', isLive: false },
    { id: 'rolandgarros', label: 'Roland Garros', isLive: false },
  ],
}

// ICC T20 World Cup teams
const iccT20Teams = [
  {
    teamName: 'India',
    odds: [
      { back: 1.42, backSize: '1on', lay: 1.43, laySize: '1on' },
      { back: 1.44, backSize: '8.89492', lay: 1.45, laySize: '1on' },
      { back: 1.46, backSize: '5.27702', lay: 1.47, laySize: '46.248' },
    ],
  },
  {
    teamName: 'Australia',
    odds: [
      { back: 0, backSize: '', lay: 0, laySize: '' },
      { back: 0, backSize: '', lay: 0, laySize: '' },
      { back: 0, backSize: '', lay: 0, laySize: '' },
    ],
  },
  { teamName: 'South Africa', odds: Array(3).fill({ back: 0, lay: 0 }) },
  { teamName: 'England', odds: Array(3).fill({ back: 0, lay: 0 }) },
  {
    teamName: 'New Zealand',
    odds: [
      { back: 3.10, backSize: '10,769', lay: 3.15, laySize: '1,40,500' },
      { back: 3.20, backSize: '2,34,023', lay: 3.25, laySize: '87,698' },
      { back: 3.30, backSize: '3,14,014', lay: 3.35, laySize: '1,42,902' },
    ],
  },
  { teamName: 'Pakistan', odds: Array(3).fill({ back: 0, lay: 0 }) },
  { teamName: 'West Indies', odds: Array(3).fill({ back: 0, lay: 0 }) },
  { teamName: 'Afghanistan', odds: Array(3).fill({ back: 0, lay: 0 }) },
  { teamName: 'Sri Lanka', odds: Array(3).fill({ back: 0, lay: 0 }) },
  { teamName: 'UAE', odds: Array(3).fill({ back: 0, lay: 0 }) },
  { teamName: 'Ireland', odds: Array(3).fill({ back: 0, lay: 0 }) },
  { teamName: 'USA', odds: Array(3).fill({ back: 0, lay: 0 }) },
  { teamName: 'Zimbabwe', odds: Array(3).fill({ back: 0, lay: 0 }) },
  { teamName: 'Scotland', odds: Array(3).fill({ back: 0, lay: 0 }) },
  { teamName: 'Netherlands', odds: Array(3).fill({ back: 0, lay: 0 }) },
  { teamName: 'Namibia', odds: Array(3).fill({ back: 0, lay: 0 }) },
]

const tabTypes = ['LIVE & UPCOMING', 'LEAGUES', 'RESULTS'] as const
type TabType = typeof tabTypes[number]

function SportsPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sportId = searchParams.get('sport') || 'cricket'
  const [activeTab, setActiveTab] = useState<TabType>('LIVE & UPCOMING')
  const [activeCompetition, setActiveCompetition] = useState("")
  const { isOpen: betSlipOpen, selections } = useBetSlipStore()

  // Sync activeCompetition when sportId changes
  useEffect(() => {
    const sportCompetitions = competitions[sportId as keyof typeof competitions] || competitions.cricket
    if (sportCompetitions.length > 0) {
      setActiveCompetition(sportCompetitions[0].label)
    }
  }, [sportId])
  
  // Only show margin if betslip is actually open AND has selections
  const showBetSlipMargin = betSlipOpen && selections.length > 0

  const sportCompetitions = competitions[sportId as keyof typeof competitions] || competitions.cricket
  
  const currentSportMatches = (sportsMatches as any)[sportId] || sportsMatches.cricket

  return (
    <div className="flex h-full">
      {/* Center - matches list */}
      <div className={`flex-1 min-w-0 overflow-y-auto transition-all ${showBetSlipMargin ? 'lg:mr-[380px]' : ''}`}>
        {/* Sub-tabs */}
        <div className="flex relative z-10" style={{ background: '#000', borderBottom: '1px solid #1a1a1a' }}>
          {tabTypes.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2.5 text-xs font-semibold transition-colors"
              style={{
                color:        activeTab === tab ? '#e8612c' : '#888',
                borderBottom: activeTab === tab ? '2px solid #e8612c' : '2px solid transparent',
                background:   activeTab === tab ? 'rgba(232,97,44,0.07)' : 'transparent',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Competition list */}
        <div className="p-2 md:hidden">
          <select
            value={activeCompetition}
            onChange={e => setActiveCompetition(e.target.value)}
            className="w-full bg-surface border border-cardBorder rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-primary"
          >
            {sportCompetitions.map(c => (
              <option key={c.id} value={c.label}>{c.label}</option>
            ))}
          </select>
        </div>

          {/* Competition sidebar - visible on medium+ */}
          <div className="flex">
          <div className="hidden md:block w-44 shrink-0 overflow-y-auto" style={{ borderRight: '1px solid #1a1a1a' }}>
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 px-3 py-2 w-full hover:bg-white/5 transition-colors" 
              style={{ color: '#666', borderBottom: '1px solid #1a1a1a' }}
            >
              <ChevronLeft size={14} />
              <span className="text-xs">Previous</span>
            </button>
            <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
              {sportCompetitions.map((comp) => (
                <button
                  key={comp.id}
                  onClick={() => setActiveCompetition(comp.label)}
                  className="w-full text-left px-3 py-2 text-xs transition-all"
                  style={{
                    color:      activeCompetition === comp.label ? '#e8612c' : comp.isLive ? '#e8612c' : '#888',
                    background: activeCompetition === comp.label ? 'rgba(232,97,44,0.1)' : 'transparent',
                    fontWeight: activeCompetition === comp.label ? '600' : '400',
                    borderBottom: '1px solid #1a1a1a',
                  }}
                >
                  {comp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main odds content */}
          <div className="flex-1 min-w-0">
            {/* Competition header */}
            <div className="flex items-center gap-2 px-3 pr-0 py-0 h-10 lg:h-12 bg-[#1a1a1a] border-b border-white/5">
              <div className="bg-[#e8612c] h-full flex items-center px-4 gap-2 pr-8 relative"
                  style={{ clipPath: 'polygon(0 0, 90% 0, 100% 100%, 0% 100%)' }}
              >
                <span className="text-[10px] font-black text-white uppercase tracking-wider">Upcoming</span>
              </div>
              
              <div className="flex-1 flex items-center px-4 overflow-hidden">
                <span className="text-xs text-white/70 font-black uppercase truncate tracking-tight">{activeCompetition}</span>
              </div>

              {/* Labels 1 X 2 */}
              <div className="h-full flex items-center pr-0 gap-0 ml-auto" style={{ backgroundImage: 'linear-gradient(to right, #000 50%, #444)' }}>
                <div className="flex w-20 md:w-[122px] justify-center">
                  <span className="text-[10px] font-black text-[#888] uppercase tracking-widest">1</span>
                </div>
                <div className="flex w-20 md:w-[122px] justify-center border-l border-white/5">
                  <span className="text-[10px] font-black text-[#888] uppercase tracking-widest">X</span>
                </div>
                <div className="flex w-20 md:w-[122px] justify-center border-l border-white/5">
                  <span className="text-[10px] font-black text-[#888] uppercase tracking-widest">2</span>
                </div>
              </div>
            </div>

            {/* Odds table */}
            <div className="bg-white">
              <SportsMarketTable matches={currentSportMatches} />
            </div>
          </div>
          </div>
      </div>
    </div>
  )
}



export default function SportsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64 text-textMuted text-sm">Loading...</div>}>
      <SportsPageContent />
    </Suspense>
  )
}
