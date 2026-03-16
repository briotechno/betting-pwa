'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { Star } from 'lucide-react'

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
            className={`flex-1 h-full text-[11px] font-black uppercase tracking-tight relative ${
              activeSubTab === tab ? 'text-[#e8612c]' : 'text-gray-400'
            }`}
          >
            {tab}
            {activeSubTab === tab && (
              <div className="absolute bottom-0 left-[20%] right-[20%] h-[2px] bg-[#e8612c]" />
            )}
          </button>
        ))}
      </div>

      {/* Match List */}
      <div className="p-2 space-y-3">
        {matches.map((match) => (
          <div key={match.id} className="bg-white rounded-lg overflow-hidden shadow-md">
            {/* specialized header */}
            <div className="bg-[#e15b24] h-[65px] flex items-center justify-between relative overflow-hidden">
               {/* Slanted background for star area */}
               <div className="absolute right-0 top-0 bottom-0 w-[80px] bg-white/10 skew-x-[20deg] translate-x-10" />

               <div className="flex flex-col relative z-10 pl-3">
                  {match.isUpcoming && (
                    <div className="bg-[#00aef0] px-2 py-[2px] rounded-[2px] inline-block w-fit mb-1 shadow-sm">
                       <span className="text-white text-[9px] font-black uppercase tracking-tight leading-none">UPCOMING</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                     <div className="w-[8px] h-[2px] bg-white opacity-60 rounded-full" />
                     <span className="text-white text-[14px] font-bold leading-none tracking-tight">
                       {match.teamA} V {match.teamB}
                     </span>
                  </div>
                  <span className="text-white/90 text-[11px] font-medium leading-none mt-1 ml-[14px]">
                    {match.startTime}
                  </span>
               </div>
               <div className="flex items-center pr-3 relative z-10">
                 <button className="text-white">
                   <Star size={24} className="fill-[#ffd300] text-[#ffd300] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
                 </button>
               </div>
            </div>

            {/* Odds Rows */}
            <div className="bg-white">
              {/* Row 1 */}
              <div className="flex items-center border-b border-gray-100 h-14">
                <div className="flex-1 px-4">
                  <span className="text-[14px] font-bold text-gray-800 tracking-tight">{match.teamA}</span>
                </div>
                <div className="flex h-full">
                  {/* Back Box */}
                  <div className="w-[75px] h-full flex flex-col items-center justify-center bg-[#a5d9fe] border-l border-white/30">
                    <span className="text-[14px] font-black text-[#2e2e2e] leading-none mb-0.5">{match.odds[0].back}</span>
                    <span className="text-[9px] text-[#4a4a4a] font-bold leading-none">{match.odds[0].backVol}</span>
                  </div>
                  {/* Lay Box */}
                  <div className="w-[75px] h-full flex flex-col items-center justify-center bg-[#f8d0ce] border-l border-white/30">
                    <span className="text-[14px] font-black text-[#2e2e2e] leading-none mb-0.5">{match.odds[0].lay}</span>
                    <span className="text-[9px] text-[#4a4a4a] font-bold leading-none">{match.odds[0].layVol}</span>
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex items-center h-14">
                <div className="flex-1 px-4">
                  <span className="text-[14px] font-bold text-gray-800 tracking-tight">{match.teamB}</span>
                </div>
                <div className="flex h-full">
                   <div className="w-[75px] h-full flex flex-col items-center justify-center bg-[#a5d9fe] border-l border-white/30">
                    <span className="text-[14px] font-black text-[#2e2e2e] leading-none mb-0.5">{match.odds[1].back}</span>
                    <span className="text-[9px] text-[#4a4a4a] font-bold leading-none">{match.odds[1].backVol}</span>
                  </div>
                  <div className="w-[75px] h-full flex flex-col items-center justify-center bg-[#f8d0ce] border-l border-white/30">
                    <span className="text-[14px] font-black text-[#2e2e2e] leading-none mb-0.5">{match.odds[1].lay}</span>
                    <span className="text-[9px] text-[#4a4a4a] font-bold leading-none">{match.odds[1].layVol}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
