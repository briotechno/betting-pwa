'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { toTitleCase } from '@/utils/format'

const sportsList = [
  { id: 'cricket', name: 'Cricket', count: 22, icon: 'https://www.fairplay247.vip/_nuxt/img/cricket.5c05f66.png' },
  { id: 'soccer', name: 'Soccer', count: 21, icon: 'https://www.fairplay247.vip/_nuxt/img/soccer.9f718cc.png' },
  { id: 'tennis', name: 'Tennis', count: 18, icon: 'https://www.fairplay247.vip/_nuxt/img/tennis.fc30791.png' },
]

const subTabs = ['LIVE & UPCOMING', 'LEAGUES', 'RESULTS']

const matches = [
  {
    id: 1,
    teamA: 'Bangladesh',
    teamB: 'Pakistan',
    startTime: 'Today At 1:45 PM',
    isUpcoming: true,
    odds: [
      { back: '2.14', backVol: '14,080', lay: '2.18', layVol: '3,15,195' },
      { back: '1.86', backVol: '46,544', lay: '1.87', layVol: '3,859' },
    ]
  },
  {
    id: 2,
    teamA: 'Faisalabad Region',
    teamB: 'Peshawar Region',
    startTime: 'Today At 4:45 PM',
    isUpcoming: true,
    odds: [
      { back: '2.16', backVol: '269', lay: '2.18', layVol: '90' },
      { back: '1.86', backVol: '106', lay: '1.87', layVol: '2,158' },
    ]
  },
  {
    id: 3,
    teamA: 'Bahawalpur Region',
    teamB: 'Lahore Region Whites',
    startTime: 'Today At 9:45 PM',
    isUpcoming: true,
    odds: [
      { back: '2.52', backVol: '194', lay: '2.90', layVol: '1,788' },
      { back: '1.53', backVol: '3,390', lay: '1.65', layVol: '297' },
    ]
  },
  {
    id: 4,
    teamA: 'Boland',
    teamB: 'Warriors',
    startTime: 'Tomorrow At 1:30 PM',
    isUpcoming: true,
    odds: [
      { back: '1.62', backVol: '205', lay: '2.62', layVol: '142' },
      { back: '1.62', backVol: '205', lay: '2.62', layVol: '142' },
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
      <div className="absolute -top-[10px] -left-[4px] bg-[#28a745] text-white text-[9px] lg:text-[11px] font-black px-2.5 py-[3px] rounded-[6px] italic leading-tight uppercase z-30 shadow-md transform transition-transform duration-200 cursor-default flex items-center gap-1 border border-[#238a3a]">
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

export default function SportsbookPage() {
  const [activeSport, setActiveSport] = useState('cricket')
  const [activeSubTab, setActiveSubTab] = useState('LIVE & UPCOMING')

  return (
    <div className="bg-[#1a1a1a] min-h-screen pb-20">
      {/* Sports Navigation Bar */}
      <div className="bg-[#1a1a1a] px-2 pt-2 pb-0">
        <div className="flex items-stretch justify-center h-[72px] mx-[-8px]">
          {sportsList.map((sport) => (
            <button
              key={sport.id}
              onClick={() => setActiveSport(sport.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 relative ${
                activeSport === sport.id ? 'after:content-[""] after:absolute after:bottom-0 after:left-1/4 after:right-1/4 after:h-[2px] after:bg-[#e8612c]' : ''
              }`}
            >
              <div className="relative mb-1">
                <img src={sport.icon} alt={sport.name} className="w-8 h-8 object-contain" />
                <div className="absolute -top-1 -right-4 bg-[#e8612c] text-white text-[10px] font-black rounded-full min-w-[20px] h-5 flex items-center justify-center border border-[#1a1a1a] px-1 shadow-sm z-10">
                  {sport.count}
                </div>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-tight ${
                activeSport === sport.id ? 'text-white' : 'text-gray-400 opacity-80'
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
  )
}
