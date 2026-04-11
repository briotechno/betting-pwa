'use client'
import React, { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Star } from 'lucide-react'
import { toTitleCase } from '@/utils/format'
import BetContainer from '@/components/sportsbook/BetContainer'

const sportsList = [
  { id: 'Cricket', name: 'Cricket', count: 14, icon: 'https://www.fairplay247.vip/_nuxt/img/cricket.5c05f66.png' },
  { id: 'Football', name: 'Football', count: 29, icon: 'https://www.fairplay247.vip/_nuxt/img/soccer.9f718cc.png' },
  { id: 'Tennis', name: 'Tennis', count: 41, icon: 'https://www.fairplay247.vip/_nuxt/img/tennis.fc30791.png' },
]

const subTabs = ['LIVE & UPCOMING', 'LEAGUES', 'RESULTS']

const matches = [
  {
    id: 1,
    teamA: 'Border',
    teamB: 'Mpumalanga Rhinos',
    startTime: 'Today At 1:30 PM',
    isUpcoming: true,
    odds: [
      { back: '1.59', backVol: '156', back2: '1.64', backVol2: '178', back3: '2.12', backVol3: '105', lay: '2.18', layVol: '22,690', lay2: '2.20', layVol2: '149', lay3: '2.28', layVol3: '110' },
      { back: '1.79', backVol: '139', back2: '1.84', backVol2: '26,961', back3: '1.85', backVol3: '100', lay: '1.90', layVol: '118', lay2: '2.58', layVol2: '114', lay3: '2.70', layVol3: '93' },
    ]
  },
  {
    id: 2,
    teamA: 'Kwazulu Natal Inland',
    teamB: 'Lions',
    startTime: 'Today At 1:30 PM',
    isUpcoming: true,
    odds: [
      { back: '3.05', backVol: '978', back2: '3.10', backVol2: '170', back3: '3.15', backVol3: '61', lay: '3.60', layVol: '147', lay2: '3.65', layVol2: '156', lay3: '3.95', layVol3: '121' },
      { back: '1.34', backVol: '357', back2: '1.38', backVol2: '412', back3: '1.39', backVol3: '379', lay: '1.46', layVol: '130', lay2: '1.47', layVol2: '357', lay3: '1.48', layVol3: '614' },
    ]
  },
  {
    id: 3,
    teamA: 'Warriors',
    teamB: 'Titans',
    startTime: 'Today At 4:30 PM',
    isUpcoming: true,
    odds: [
      { back: '1.67', backVol: '1,003', back2: '1.68', backVol2: '340', back3: '1.69', backVol3: '74', lay: '1.72', layVol: '2,399', lay2: '1.73', layVol2: '353', lay3: '1.79', layVol3: '495' },
      { back: '2.26', backVol: '2,055', back2: '2.28', backVol2: '388', back3: '2.38', backVol3: '1,990', lay: '2.48', layVol: '281', lay2: '2.50', layVol2: '902', lay3: '2.52', layVol3: '2,362' },
    ]
  }
]

const OddsBox = ({ val, vol, type, intensity = 'high' }: { val: string, vol: string, type: 'back' | 'lay', intensity?: 'low' | 'medium' | 'high' }) => {
  const bgColor = type === 'back'
    ? (intensity === 'high' ? 'bg-[#a5d9fe]' : intensity === 'medium' ? 'bg-[#bce4ff]' : 'bg-[#d1eeff]')
    : (intensity === 'high' ? 'bg-[#f8d0ce]' : intensity === 'medium' ? 'bg-[#fbe3e2]' : 'bg-[#fff0f0]')

  return (
    <button className={`w-[65px] lg:w-[60px] h-[40px] rounded-[0.4rem] flex flex-col items-center justify-center transition-all shadow-sm border border-black/5 ${bgColor} hover:brightness-95 active:scale-95`}>
      <span className="text-[12px] lg:text-[12px] font-black text-[#2e2e2e] leading-none mb-0.5">{val || '-'}</span>
      <span className="text-[8.5px] lg:text-[9px] text-[#4a4a4a] font-bold leading-none">{vol || ''}</span>
    </button>
  )
}

const MatchTable = ({ match }: { match: any }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="bg-white rounded-b-[12px] shadow-sm border border-[#f36c21] mt-3 relative">
      {/* Live Badge - Overlapping Corner */}
      <div className="absolute -top-[10px] text-normal -left-[4px] bg-[#28a745] text-white text-[9px] lg:text-[11px] font-black px-2.5 py-[3px] rounded-[6px] italic leading-tight uppercase z-30 shadow-md transform transition-transform duration-200 cursor-default flex items-center gap-1 border border-[#238a3a]">
        LIVE
      </div>

      {/* Header */}
      <div
        className="h-10 lg:h-12 flex items-center relative cursor-pointer select-none bg-[#e0e0e0]"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {/* Left Side - Orange with slanted edge */}
        <div className="relative h-full flex items-center pl-2 lg:pl-3 bg-[#e8612c] pr-10 lg:pr-12 z-10 transition-all duration-300" style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)' }}>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-white text-[18px] lg:text-[20px] font-medium leading-none mb-1">
              {isCollapsed ? '+' : '−'}
            </span>
            <span className="text-white text-[12px] lg:text-[14px] font-bold whitespace-nowrap uppercase tracking-tight">
              {toTitleCase(match.teamA)} V {toTitleCase(match.teamB)}
            </span>
          </div>
        </div>

        {/* Right Side - Gray with icons */}
        <div className="flex-1 h-full flex items-center justify-start pl-2 gap-3 z-0">
          <div className="w-4 h-4 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#28a745] fill-current">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <Star size={18} className="text-[#ffd700] fill-none stroke-[2px]" />
        </div>

        {/* Time - Desktop Only */}
        <div className="hidden lg:flex mr-4 text-[11px] font-bold text-gray-500 italic uppercase">
          {match.startTime}
        </div>
      </div>

      {/* Table Body */}
      {!isCollapsed && (
        <div className="overflow-x-auto lg:overflow-visible rounded-b-[11px]">
          <table className="w-full border-collapse">
            <tbody>
              {/* Team Rows */}
              {[match.teamA, match.teamB].map((team, tIdx) => (
                <tr key={team} className={tIdx === 0 ? "border-b border-gray-100" : ""}>
                  <td className="py-3 px-3 lg:px-4 min-w-[140px]">
                    <span className="text-[13px] lg:text-[14px] font-bold text-[#333] tracking-tight whitespace-nowrap">
                      {toTitleCase(team)}
                    </span>
                  </td>
                  <td className="p-1 px-2">
                    <div className="flex justify-end gap-1">
                      {/* Odds columns - Responsive */}
                      <div className="flex gap-1 py-1">
                        {/* Mobile: Only show 2 columns; Desktop: Show all 6 */}

                        {/* Back Columns */}
                        <div className="hidden lg:flex gap-1">
                          <OddsBox val={(match.odds[tIdx] as any).back3 || ''} vol={(match.odds[tIdx] as any).backVol3 || ''} type="back" intensity="low" />
                          <OddsBox val={(match.odds[tIdx] as any).back2 || ''} vol={(match.odds[tIdx] as any).backVol2 || ''} type="back" intensity="medium" />
                        </div>
                        <OddsBox val={match.odds[tIdx].back} vol={match.odds[tIdx].backVol} type="back" intensity="high" />

                        {/* Lay Columns */}
                        <OddsBox val={match.odds[tIdx].lay} vol={match.odds[tIdx].layVol} type="lay" intensity="high" />
                        <div className="hidden lg:flex gap-1">
                          <OddsBox val={(match.odds[tIdx] as any).lay2 || ''} vol={(match.odds[tIdx] as any).layVol2 || ''} type="lay" intensity="medium" />
                          <OddsBox val={(match.odds[tIdx] as any).lay3 || ''} vol={(match.odds[tIdx] as any).layVol3 || ''} type="lay" intensity="low" />
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

import { useAuthStore } from '@/store/authStore'

export default function SportsbookPage() {
  const { user } = useAuthStore()
  const [activeSubTab, setActiveSubTab] = useState('LIVE & UPCOMING')
  const router = useRouter()
  const pathname = usePathname()

  // Find active sport based on URL path or default to Cricket on /sportsbook
  const activeSport = sportsList.find(s =>
    pathname.includes(s.id)
  )?.id || 'Cricket'

  return (
    <div className="flex min-h-screen bg-[#1a1a1a] lg:gap-4 lg:bg-transparent">
      {/* Main Content Area */}
      <div className="flex-1 pb-20 bg-[#1a1a1a] rounded-lg overflow-hidden">
        {/* Sports Navigation Bar - Mobile Only */}
        <div className="md:hidden bg-[#1a1a1a] px-2 pt-2 pb-0">
          <div className="flex items-stretch justify-center h-[72px] mx-[-8px]">
            {sportsList.map((sport) => (
              <button
                key={sport.id}
                onClick={() => {
                  if (sport.id === 'Cricket') {
                    router.push('/sportsbook')
                  } else {
                    router.push('/sportsbook/' + sport.id)
                  }
                }}
                className={`flex-1 flex flex-col items-center justify-center py-2 px-1 relative ${activeSport === sport.id ? 'after:content-[""] after:absolute after:bottom-0 after:left-1/4 after:right-1/4 after:h-[2px] after:bg-[#e8612c]' : ''
                  }`}
              >
                <div className="relative mb-1">
                  <img src={sport.icon} alt={sport.name} className="w-8 h-8 object-contain" />
                  <div className="absolute -top-1 -right-4 bg-[#e8612c] text-white text-[10px] font-black rounded-full min-w-[20px] h-5 flex items-center justify-center border border-[#1a1a1a] px-1 shadow-sm z-10">
                    {sport.count}
                  </div>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-tight ${activeSport === sport.id ? 'text-white' : 'text-gray-400 opacity-80'
                  }`}>
                  {sport.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Sub tabs nav */}
        <div className="flex bg-[#1a1a1a] border-b border-white/5 h-10">
          {subTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`flex-1 h-full text-[11px] font-black uppercase tracking-tight relative ${activeSubTab === tab ? 'text-[#e8612c]' : 'text-gray-400'}`}
            >
              {tab}
              {activeSubTab === tab && (
                <div className="absolute bottom-0 left-[15%] right-[15%] h-[2px] bg-[#e8612c]" />
              )}
            </button>
          ))}
        </div>

        {/* Match List */}
        <div className="p-2 space-y-4">
          {matches.map((match) => (
            <MatchTable key={match.id} match={match} />
          ))}
        </div>
      </div>

      {/* Bet Container - attached but separate column */}
      {user && (
        <div className="hidden lg:block lg:w-[480px] sticky top-[80px] max-h-[calc(100vh-100px)] overflow-y-auto self-start shrink-0 lg:border-none lg:rounded-lg lg:overflow-hidden border-l border-white/5 bg-[#111] z-30">
          <BetContainer />
        </div>
      )}
    </div>
  )
}
