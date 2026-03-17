'use client'
import React, { useState } from 'react'
import { toTitleCase } from '@/utils/format'
import { Info, Lock } from 'lucide-react'

import InlineBetContainer from './InlineBetContainer'

export interface OddValue {
  price: number | '-'
  size?: string
}

export interface Runner {
  name: string
  back: [OddValue, OddValue, OddValue]
  lay: [OddValue, OddValue, OddValue]
  suspended?: boolean
}

interface MarketSelection {
  runner: string
  price: number
  type: 'back' | 'lay'
  market?: string
}

interface MarketSectionProps {
  title: string
  runners: Runner[]
  matchName?: string
  activeSelection: MarketSelection | null
  setActiveSelection: (selection: MarketSelection | null) => void
}

export default function MarketSection({
  title,
  runners,
  matchName = 'Event',
  activeSelection,
  setActiveSelection
}: MarketSectionProps) {

  const handleOddsClick = (runner: string, price: number, type: 'back' | 'lay') => {
    if (activeSelection?.runner === runner && activeSelection?.type === type && activeSelection.price === price && activeSelection.market === title) {
      setActiveSelection(null)
    } else {
      setActiveSelection({ runner, price, type, market: title })
    }
  }

  return (
    <div className="bg-white overflow-hidden mb-1 rounded-[16px]">
      {/* Market Header - Precise Match to Image 1 */}
      <div className="flex h-10 lg:h-11 rounded-t-[16px] overflow-hidden">
        {/* Left Side: Orange block with title */}
        <div className="bg-[#e15b24] flex items-center px-3 flex-1">
          <span className="text-white font-black text-[10px] lg:text-[12px] leading-tight">
            {toTitleCase(title)}
          </span>

        </div>

        {/* Right Side: Dark background for labels */}
        <div className="bg-[#333] flex items-center w-[160px] lg:w-[180px]">
          {/* Stopwatch Icon */}
          <div className="flex items-center justify-center w-10 border-r border-white/10 h-full">
            <div className="relative w-4 h-4 rounded-full border border-white/40">
              <div className="absolute top-[3px] right-[2px] w-[5px] h-[1px] bg-white rotate-[-45deg] origin-right" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t border-r border-white/80 rotate-45 mt-[1px] ml-[-1px]" />
            </div>
          </div>
          {/* Column Titles */}
          <div className="flex-1 flex items-center justify-around h-full">
            <span className="text-white font-bold text-[11px] uppercase">Back</span>
            <span className="text-white font-bold text-[11px] uppercase">Lay</span>
          </div>
        </div>
      </div>

      {/* Runners Grid */}
      <div className="">
        {runners.map((runner) => (
          <React.Fragment key={runner.name}>
            <div className={`flex items-center h-12 bg-white ${activeSelection?.runner === runner.name && activeSelection?.market === title ? 'bg-gray-50' : ''}`}>
              <div className="flex-1 px-3 flex items-center h-full min-w-0">
                <div className="text-[#333] font-bold text-[13px] tracking-tight truncate leading-tight w-full">{runner.name}</div>
              </div>

              <div className="flex items-center h-full w-[160px] lg:w-[180px] bg-white">
                {runner.suspended && (
                  <div className="absolute inset-x-0 inset-y-0 z-10 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                    <Lock size={14} className="text-gray-400" />
                  </div>
                )}

                {/* Odds Cells Row */}
                <div className="flex items-center justify-around w-full px-1">
                  {/* Back Cell */}
                  <button
                    onClick={() => typeof runner.back[2].price === 'number' && handleOddsClick(runner.name, runner.back[2].price, 'back')}
                    className={`w-[60px] h-[40px] rounded-[0.4rem] flex flex-col items-center justify-center transition-all ${runner.back[2].price === '-'
                        ? 'bg-[#f2f2f2] text-[#ccc]'
                        : activeSelection?.runner === runner.name && activeSelection?.type === 'back' && activeSelection?.market === title
                          ? 'bg-[#1a91eb] text-white'
                          : 'bg-[#a5d9fe] text-black font-black'
                      }`}
                  >
                    <span className="text-[12px] font-black">{runner.back[2].price}</span>
                    {runner.back[2].size !== '-' && <span className="text-[8px] font-bold">{runner.back[2].size}</span>}
                  </button>

                  {/* Lay Cell */}
                  <button
                    onClick={() => typeof runner.lay[0].price === 'number' && handleOddsClick(runner.name, runner.lay[0].price, 'lay')}
                    className={`w-[60px] h-[40px] rounded-[0.4rem] flex flex-col items-center justify-center transition-all ${typeof runner.lay[0].price === 'number'
                        ? activeSelection?.runner === runner.name && activeSelection?.type === 'lay' && activeSelection?.market === title
                          ? 'bg-[#f2708b] text-white shadow-inner'
                          : 'bg-[#f8d0ce] text-black font-black'
                        : 'bg-[#e2e2e2] text-[#999]'
                      }`}
                  >
                    <span className="text-[12px] font-black">{runner.lay[0].price || '-'}</span>
                    {runner.lay[0].size !== '-' && runner.lay[0].size && (
                      <span className="text-[8px] font-bold">{runner.lay[0].size}</span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Inline Bet Box */}
            {activeSelection?.runner === runner.name && activeSelection?.market === title && (
              <div className="animate-in slide-in-from-top-2 duration-200">
                <InlineBetContainer
                  selection={runner.name}
                  matchName={matchName}
                  odds={activeSelection.price}
                  type={activeSelection.type}
                  onCancel={() => setActiveSelection(null)}
                  onPlaceBet={(stake) => {
                    console.log('Place bet:', { runner: runner.name, stake, odds: activeSelection.price })
                    // Handle placing bet logic
                    setActiveSelection(null)
                  }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

