'use client'
import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { Star } from 'lucide-react'
import { toTitleCase } from '@/utils/format'
import BetContainer from '@/components/sportsbook/BetContainer'

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

export default function SportDetailPage() {
  const params = useParams()
  const sportName = params.sport as string
  const [activeSubTab, setActiveSubTab] = useState('LIVE & UPCOMING')

  const subTabs = ['LIVE & UPCOMING', 'LEAGUES', 'RESULTS']

  return (
    <div className="flex min-h-screen bg-[#1a1a1a]">
      {/* Main Content Area */}
      <div className="flex-1 pb-20 overflow-hidden">
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
        <div className="p-2 space-y-4">
          {matches.map((match) => (
            <div key={match.id} className="bg-white rounded-lg overflow-hidden shadow-md">
              {/* Header */}
              <div className="bg-[#e15b24] h-[65px] flex items-center justify-between relative overflow-hidden">
                <div className="flex flex-col relative z-10 pl-3">
                    {match.isUpcoming && (
                      <div className="bg-[#00aef0] px-2 py-[2px] rounded-[2px] inline-block w-fit mb-1 shadow-sm">
                          <span className="text-white text-[9px] font-black uppercase tracking-tight leading-none">UPCOMING</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <div className="w-[8px] h-[2px] bg-white opacity-60 rounded-full" />
                        <span className="text-white text-[14px] font-bold leading-none tracking-tight">
                          {toTitleCase(match.teamA)} V {toTitleCase(match.teamB)}
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

              {/* Odds Table */}
              <div className="bg-white overflow-x-auto">
                <table className="w-full border-collapse">
                  <tbody>
                    {/* Team A */}
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 min-w-[150px]">
                        <span className="text-[14px] font-bold text-gray-800 tracking-tight">{toTitleCase(match.teamA)}</span>
                      </td>
                      <td className="p-0">
                        <div className="flex justify-end h-14">
                          {[
                            { val: match.odds[0].back3, vol: match.odds[0].backVol3, bg: 'bg-[#a5d9fe]' },
                            { val: match.odds[0].back2, vol: match.odds[0].backVol2, bg: 'bg-[#a5d9fe]' },
                            { val: match.odds[0].back, vol: match.odds[0].backVol, bg: 'bg-[#a5d9fe]' },
                            { val: match.odds[0].lay, vol: match.odds[0].layVol, bg: 'bg-[#f8d0ce]' },
                            { val: match.odds[0].lay2, vol: match.odds[0].layVol2, bg: 'bg-[#f8d0ce]' },
                            { val: match.odds[0].lay3, vol: match.odds[0].layVol3, bg: 'bg-[#f8d0ce]' }
                          ].map((cell, idx) => (
                            <div key={idx} className={`w-[60px] lg:w-[70px] h-full flex flex-col items-center justify-center ${cell.bg} border-l border-white/40`}>
                              <span className="text-[13px] font-black text-[#2e2e2e] leading-none mb-0.5">{cell.val}</span>
                              <span className="text-[9px] text-[#4a4a4a] font-bold leading-none">{cell.vol}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                    {/* Team B */}
                    <tr>
                      <td className="px-4 py-3 min-w-[150px]">
                        <span className="text-[14px] font-bold text-gray-800 tracking-tight">{toTitleCase(match.teamB)}</span>
                      </td>
                      <td className="p-0">
                        <div className="flex justify-end h-14">
                          {[
                            { val: match.odds[1].back3, vol: match.odds[1].backVol3, bg: 'bg-[#a5d9fe]' },
                            { val: match.odds[1].back2, vol: match.odds[1].backVol2, bg: 'bg-[#a5d9fe]' },
                            { val: match.odds[1].back, vol: match.odds[1].backVol, bg: 'bg-[#a5d9fe]' },
                            { val: match.odds[1].lay, vol: match.odds[1].layVol, bg: 'bg-[#f8d0ce]' },
                            { val: match.odds[1].lay2, vol: match.odds[1].layVol2, bg: 'bg-[#f8d0ce]' },
                            { val: match.odds[1].lay3, vol: match.odds[1].layVol3, bg: 'bg-[#f8d0ce]' }
                          ].map((cell, idx) => (
                            <div key={idx} className={`w-[60px] lg:w-[70px] h-full flex flex-col items-center justify-center ${cell.bg} border-l border-white/40`}>
                              <span className="text-[13px] font-black text-[#2e2e2e] leading-none mb-0.5">{cell.val}</span>
                              <span className="text-[9px] text-[#4a4a4a] font-bold leading-none">{cell.vol}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bet Container - attached but separate column */}
      <BetContainer />
    </div>
  )
}
