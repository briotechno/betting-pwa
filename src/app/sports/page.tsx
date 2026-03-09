'use client'
import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Home, Info } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import OddsTable from '@/components/sportsbook/OddsTable'
import BetSlip from '@/components/sportsbook/BetSlip'
import { useBetSlipStore } from '@/store/betSlipStore'

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

  return (
    <div className="flex h-full">
      {/* Center - matches list */}
      <div className={`flex-1 min-w-0 overflow-y-auto transition-all ${showBetSlipMargin ? 'lg:mr-[380px]' : ''}`}>
        {/* Sub-tabs */}
        <div className="flex sticky top-0 z-10" style={{ background: '#000', borderBottom: '1px solid #1a1a1a' }}>
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
            <div className="flex items-center gap-2 px-3 pr-5 py-2" style={{ background: '#111', borderBottom: '1px solid #1a1a1a' }}>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: '#e8612c', color: '#fff' }}>UPCOMING</span>
              <span className="text-xs text-white font-medium">← {activeCompetition}</span>
              <span className="ml-auto text-yellow-400 text-xs">★</span>
            </div>

            {/* Odds table */}
            <div className="overflow-x-auto pr-4">
              <OddsTable
                matchId="icc-t20-wc"
                matchName={activeCompetition}
                competition={activeCompetition}
                marketName="Winner - ICC T20 World Cup"
                columns={['1', '2', '3', '4', '5', '6']}
                rows={iccT20Teams}
              />
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
