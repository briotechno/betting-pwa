'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, AlertTriangle } from 'lucide-react'

export default function RulesRegulationsPage() {
  const router = useRouter()

  return (
    <div className="bg-[#121212] min-h-screen text-white pb-20 font-sans">
      {/* Sub Header */}
      <div className="flex items-center px-4 py-3 bg-[#1a1a1a] shadow-md border-b border-white/5 sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-white/80 pr-3">
          <ChevronLeft size={24} color="#e15b24" />
        </button>
        <h1 className="text-[17px] font-bold">Rules And Regulations</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Note Alert */}
        <div className="bg-[#ff5252] rounded-md p-4 flex gap-4">
          <AlertTriangle size={24} color="white" className="shrink-0 mt-1" />
          <div className="text-white text-[14px] font-bold leading-normal">
            NOTE:<br />
            Players using VPN and login from different IP frequently may result to
            void bets.<br />
            And on the basis of different IP from multiple city we can suspend the
            account and void bets.
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button className="bg-[#e15b24] text-white px-5 py-2 rounded-md text-[11px] font-black uppercase tracking-wider shadow-lg">
            Premium Sportsbook Rules
          </button>
        </div>

        {/* Content Section */}
        <div className="space-y-8 pb-4">
          {/* Part A */}
          <section className="space-y-4">
            <h2 className="text-[#e15b24] text-[18px] font-black uppercase tracking-tight">PART A - INTRODUCTION</h2>
            <h3 className="text-[#e15b24] text-[15px] font-bold">Use and interpretation</h3>
            <div className="text-[14px] text-white/90 leading-relaxed font-bold space-y-4">
              <p>
                These Rules and Regulations (" <span className="text-[#e15b24]">Rules</span>") are part of the Site's
                terms and conditions.
              </p>
              <p>
                The Rules apply to all bets placed on this online betting platform
                ("<span className="text-[#e15b24]">Site</span>"). The Rules consist of the following:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>This INTRODUCTION section (Part A);</li>
                <li>The GENERAL RULES (set out in Part B below); and</li>
                <li>
                  The SPECIFIC SPORTS RULES (set out in Part C below - these apply
                  to certain sports).
                </li>
              </ul>
              <p>
                The General Rules apply to all bets unless stated otherwise in the
                Specific Sports Rules. If there is any inconsistency between the
                Specific Sports Rules and the General Rules, the Specific Sports
                Rules shall prevail.
              </p>
              <p>
                The rules governing how markets are offered, managed and/or settled
                are not the same for every market on each product. In certain
                circumstances, a bet that is settled as a winner on one product may
                be settled as a loser on the other product (and vice versa).
              </p>
            </div>
            
            <h3 className="text-[#e15b24] text-[15px] font-bold mt-6">Customer responsibility</h3>
            <div className="text-[14px] text-white/90 leading-relaxed font-bold space-y-4">
              <ul className="list-disc pl-6 space-y-2">
                <li>Customers should make themselves aware of all of the Rules affecting any market on which they wish to place a bet.</li>
                <li>In particular, customers who use the "one-click" option to place bets are solely responsible for their actions.</li>
              </ul>
            </div>
          </section>

          {/* Part B Section Peek */}
          <section className="space-y-4 pt-4 border-t border-white/5">
             <h2 className="text-[#e15b24] text-[18px] font-black uppercase tracking-tight">PART B - GENERAL RULES</h2>
             <div className="text-[14px] text-white/80 leading-relaxed">
                (Information extracted from terms and conditions regarding malfunctions, in-play management, and settlement rules...)
             </div>
             {/* Note: In a real app we'd map all the text, but keeping it concise for the UI demo as requested */}
             <div className="text-[13px] text-white/60">
                Please refer to the Desktop version for the full list of Part B & C rules.
             </div>
          </section>
        </div>
      </div>
    </div>
  )
}
