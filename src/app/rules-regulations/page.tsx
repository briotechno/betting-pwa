'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, AlertTriangle } from 'lucide-react'

export default function RulesRegulationsPage() {
  const router = useRouter()

  return (
    <div className="bg-[#121212] min-h-screen text-white pb-20 font-sans tracking-tight">
      {/* Sub Header */}
      <div className="flex items-center px-4 py-3 bg-[#1a1a1a] shadow-md border-b border-white/5 sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-white/80 pr-3">
          <ChevronLeft size={24} color="#e15b24" />
        </button>
        <h1 className="text-[17px] font-bold">Rules And Regulations</h1>
      </div>

      <div className="max-w-[1400px] mx-auto p-4 md:px-10 lg:px-20 space-y-6">
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
          <button 
            onClick={() => router.push('/premium-sportsbook-rules')}
            className="bg-[#e15b24] text-white px-5 py-2 rounded-md text-[11px] font-black uppercase tracking-wider shadow-lg active:scale-95 transition-all"
          >
            Premium Sportsbook Rules
          </button>
        </div>

        {/* Content Section */}
        <div className="space-y-8 pb-4 text-justify font-medium">
          {/* PART A */}
          <section className="space-y-4">
            <h3 className="text-[18px] font-black uppercase text-white border-b-2 border-[#e15b24] inline-block pb-1">PART A - INTRODUCTION</h3>
            
            <div className="space-y-4">
              <h4 className="text-[15px] font-black text-white">Use and interpretation</h4>
              <p className="text-[14px] text-gray-300 leading-relaxed">
                These Rules and Regulations (" <b className="text-white italic">Rules</b>") are part of the Site's
                terms and conditions.
              </p>
              <p className="text-[14px] text-gray-300 leading-relaxed">
                The Rules apply to all bets placed on this online betting platform
                ("<b className="text-white">Site</b>"). The Rules consist of the following:
              </p>
              <ul className="list-disc pl-6 text-[14px] text-gray-300 space-y-1">
                <li>This INTRODUCTION section (Part A);</li>
                <li>The GENERAL RULES (set out in Part B below); and</li>
                <li>
                  The SPECIFIC SPORTS RULES (set out in Part C below - these apply
                  to certain sports).
                </li>
              </ul>
              <p className="text-[14px] text-gray-300 leading-relaxed">
                The General Rules apply to all bets unless stated otherwise in the
                Specific Sports Rules. If there is any inconsistency between the
                Specific Sports Rules and the General Rules, the Specific Sports
                Rules shall prevail.
              </p>
              <p className="text-[14px] text-gray-300 leading-relaxed">
                The rules governing how markets are offered, managed and/or settled
                are not the same for every market on each product. In certain
                circumstances, a bet that is settled as a winner on one product may
                be settled as a loser on the other product (and vice versa).
                Additionally, different settlement rules may apply so that, for
                example, bets that are a winner on one product may be settled as a
                dead heat or be voided on the other product. Customers must ensure
                that they familiarise themselves with the relevant rules that apply
                to the bets that they place on the Site.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-[15px] font-black text-white pt-2">Customer responsibility</h4>
              <ul className="list-disc pl-6 text-[14px] text-gray-300 space-y-3">
                <li>
                  Customers should make themselves aware of all of the Rules
                  affecting any market on which they wish to place a bet.
                </li>
                <li>
                  In particular, customers who use the "one-click" option to place
                  bets are solely responsible for their actions and the Site shall
                  have no liability to such customers for any errors made by
                  customers when using this option.
                </li>
              </ul>
            </div>
          </section>

          {/* PART B */}
          <section className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-[18px] font-black uppercase text-white border-b-2 border-[#e15b24] inline-block pb-1">PART B - GENERAL RULES</h3>
            
            <div className="space-y-4">
              <h4 className="text-[15px] font-black text-white">Matters beyond the Site's reasonable control and malfunctions</h4>
              <p className="text-[14px] text-gray-300 leading-relaxed">
                The Site is not liable for any loss or damage you may suffer because
                of any: act of God; power cut; trade or labour dispute; act, failure
                or omission of any government or authority; obstruction or failure
                of telecommunication services; or any other delay or failure caused
                by a third party or otherwise outside of our control. In such an
                event, the Site reserves the right to cancel or suspend access to
                the Site without incurring any liability.
              </p>
              <p className="text-[14px] text-gray-300 leading-relaxed">
                The Site is not liable for the failure of any equipment or software
                howsoever caused, wherever located or administered, or whether under
                its direct control or not, that may prevent the operation of the
                Site.
              </p>
              <p className="text-[14px] text-gray-300 leading-relaxed">
                In the event of a technological failure or error which is apparent
                to the customer, the customer is obliged to notify the Site of such
                failure/error immediately. If the customer continues to place a bet
                in these circumstances, they shall take reasonable action to
                minimise any potential loss. In the absence of such action, the Site
                reserves the right to void a bet.
              </p>
              <p className="text-[14px] text-gray-300 leading-relaxed">
                The Site reserves the right in its absolute discretion to restrict
                access to the Site, or withhold funds or void any bets outstanding
                to a customer’s account in its absolute discretion in the event of a
                technological failure or other malfunction which affects the
                integrity of the Site whether this is under its direct control or
                otherwise. Customers will be notified on the Site of any such
                malfunction which may operate to prevent the placing of further bets
                or which may result in outstanding bets being voided.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-[15px] font-black text-white pt-2">Managing markets In-Play</h4>
              <h5 className="text-[14px] font-bold text-gray-100">General</h5>
              <ul className="list-disc pl-6 text-[14px] text-gray-300 space-y-3">
                <li>
                  For everything other than horseracing and greyhound racing, if a
                  market is not scheduled to be turned in-play but the Site fails to
                  suspend the market at the relevant time, then:
                  <ul className="list-circle pl-6 mt-2 space-y-1">
                    <li>if the event has a scheduled 'off' time, all bets matched after that scheduled off time will be void; and</li>
                    <li>if the event does not have a scheduled 'off' time, the Site will use its reasonable endeavours to ascertain the time of the actual 'off' and all bets after the time of the 'off' determined by the Site will be void.</li>
                  </ul>
                </li>
                <li>The Site aims to use its reasonable endeavours to suspend in-play markets at the start of and at the end of the event. However, the Site does not guarantee that such markets will be suspended at the relevant time.</li>
                <li>Customers are responsible for managing their in-play bets at all times.</li>
                <li>For the purposes of in-play betting, customers should be aware that transmissions described as "live" by some broadcasters may actually be delayed or pre-recorded.</li>
              </ul>
            </div>
          </section>

          {/* PART C */}
          <section className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-[18px] font-black uppercase text-white border-b-2 border-[#e15b24] inline-block pb-1">PART C - SPECIFIC SPORTS RULES</h3>
            
            <div className="space-y-4">
              <h4 className="text-[15px] font-black text-white">Cricket</h4>
              <h5 className="text-[14px] font-bold text-gray-100 underline">General</h5>
              <ul className="list-disc pl-6 text-[14px] text-gray-300 space-y-3">
                <li>If a ball is not bowled during a competition, series or match then all bets will be void except for those on any market that has been unconditionally determined.</li>
                <li>If a match is shortened by weather, all bets will be settled according to the official result (including Duckworth Lewis method).</li>
              </ul>

              <h5 className="text-[14px] font-bold text-gray-100 underline pt-2">Sessions/Innings/Player Runs</h5>
              <ul className="list-disc pl-6 text-[14px] text-gray-300 space-y-3">
                <li>All session/innings/player runs are based on Haar-Jeet odds format.</li>
                <li>In any session market, in the event a session is not completed in full because a team is all out or declared, all bets will remain valid and the market will be settled at the innings score.</li>
                <li>Lambi Paari: In 20-20 match entire twenty overs should be bowled; in case of rain or any delay if even one over is deducted the bets will be cancelled. In One Day match entire 50 overs should be bowled.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-[15px] font-black text-white pt-4">Soccer</h4>
              <ul className="list-disc pl-6 text-[14px] text-gray-300 space-y-3">
                <li>If the Site does not suspend a market on time for the occurrence of a Material Event, the Site reserves the right to void bets unfairly matched after the Material Event has occurred.</li>
                <li>Match odds bets apply to the full duration of play according to the match officials, plus any stoppage time. They do not include any result given after Extra Time or Penalties.</li>
                <li>Definition of "Material Event": For the purpose of these Rules, a "Material Event" shall mean a goal being scored, a penalty being awarded or a player being sent off.</li>
              </ul>
            </div>
            
            <div className="pt-6">
              <p className="text-[12px] text-gray-500 italic">
                Although every effort is made to ensure data displayed on our site
                is accurate, this data is for information purposes and should be
                used as a guide only. In the event of any particular information
                being incorrect, we assume no liability for it.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
