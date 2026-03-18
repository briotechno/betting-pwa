'use client'
import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Star, ChevronLeft } from 'lucide-react'
import { toTitleCase } from '@/utils/format'
import BetContainer from '@/components/sportsbook/BetContainer'

const matches = [
  {
    id: 1,
    teamA: 'Warriors',
    teamB: 'Titans',
    startTime: 'Today At 4:30 PM',
    isUpcoming: true,
    odds: [
      { back: '1.67', backVol: '1,003', back2: '1.68', backVol2: '340', back3: '1.69', backVol3: '74', lay: '1.72', layVol: '2,396', lay2: '1.73', layVol2: '353', lay3: '1.79', layVol3: '494' },
      { back: '2.26', backVol: '2,054', back2: '2.28', backVol2: '388', back3: '2.38', backVol3: '1,988', lay: '2.48', layVol: '281', lay2: '2.50', layVol2: '901', lay3: '2.52', layVol3: '2,362' },
    ]
  },
  {
      id: 2,
      teamA: 'Kwazulu Natal Inland',
      teamB: 'Lions',
      startTime: 'Today At 1:30 PM',
      isUpcoming: true,
      odds: [
        { back: '3.35', backVol: '702', back2: '3.40', backVol2: '208', back3: '3.50', backVol3: '155', lay: '3.60', layVol: '127', lay2: '3.65', layVol2: '156', lay3: '3.90', layVol3: '155' },
        { back: '1.35', backVol: '447', back2: '1.38', backVol2: '412', back3: '1.39', backVol3: '329', lay: '1.40', layVol: '388', lay2: '1.41', layVol2: '438', lay3: '1.42', layVol3: '820' },
      ]
  }
]

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [activeSubTab, setActiveSubTab] = useState('LIVE & UPCOMING')

  const subTabs = ['LIVE & UPCOMING', 'RESULTS']

  return (
    <div className="flex min-h-screen bg-[#1a1a1a]">
      {/* Main Content Area */}
      <div className="flex-1 pb-20 overflow-hidden">
        {/* Header with League Name */}
        <div className="flex items-center gap-4 bg-[#1a1a1a] p-3 border-b border-white/10">
           <button onClick={() => router.back()} className="text-gray-400 hover:text-white">
              <ChevronLeft size={24} />
           </button>
           <h1 className="text-white text-[14px] font-bold uppercase tracking-tight">
             CSA PROVINCIAL ONE-DAY CHALLENGE DIV 1
           </h1>
        </div>

        {/* Sub tabs nav */}
        <div className="flex bg-[#1a1a1a] border-b border-white/5 h-10">
          <div className="flex-1 flex justify-center">
            {subTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-4 h-full text-[11px] font-black uppercase tracking-tight relative ${
                  activeSubTab === tab ? 'text-[#e8612c]' : 'text-gray-400'
                }`}
              >
                {tab}
                {activeSubTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#e8612c]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Match List */}
        <div className="p-2 space-y-4">
          {matches.map((match) => (
            <div key={match.id} className="bg-white rounded-lg overflow-hidden shadow-md">
              {/* Specialized Header for Detail View */}
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

              {/* Match Odds Label */}
              <div className="bg-[#2a2a2a] flex items-center justify-between px-3 py-2 border-b border-[#333]">
                 <div className="flex items-center gap-2">
                    <span className="bg-[#e8612c] text-white text-[10px] font-black px-2 py-1 rounded-sm tracking-tighter">MATCH ODDS</span>
                    <div className="bg-[#ffecb3] text-[#bf8300] text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-1">
                       <span className="text-[10px]">₹</span> 0 CASH OUT
                    </div>
                 </div>
                 <div className="flex gap-[60px] lg:gap-[70px] pr-[110px] lg:pr-[120px]">
                    <span className="text-white text-[10px] font-bold opacity-70">Back</span>
                    <span className="text-white text-[10px] font-bold opacity-70">Lay</span>
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

      {/* Bet Container */}
      <BetContainer />
    </div>
  )
}
