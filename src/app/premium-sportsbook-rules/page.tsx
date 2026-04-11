'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Plus, Minus } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

const accordionItems = [
  {
    id: 1,
    title: '1. Introduction',
    content: [
      'This set of terms and conditions govern the use of the Sportsbook platform. When placing a bet with Sportsbook platform, the Account Holder is therefore agreeing that the Account Holder has read, understood and will be adhering to these Terms and Conditions including the general Terms and Conditions at any time applicable to Sportsbook platform, click.',
      'The use of this Sportsbook platform is subject to the regulations imposed by the (лицензия).',
      'Any dispute relating in any way to the use of this Sportsbook platform should be emailed to (почта саппорта) Should the reply not be considered satisfactory, a request for confidential arbitration can be sent to the (лицензия). Their decision shall be binding and may be entered as a judgment in any court of competent jurisdiction.',
      'Sportsbook platform reserves the right to make changes to the site, betting limits, payout limits and offerings.',
      'Sportsbook platform may update, amend, edit and supplement these Terms and Conditions at any time.',
      'Any reference in these Terms and Conditions to words/objects that appear in singular also applies to plural. References to gender are nonbinding and to be treated for information purposes only.'
    ]
  },
  {
    id: 2,
    title: '2. Definition',
    content: [
      'Specific definitions for terms used across the sportsbook platform are detailed here to ensure clarity for all account holders.'
    ]
  },
  {
    id: 3,
    title: '3. Betting rules:',
    content: [
      'Comprehensive rules governing the placement, acceptance, and settlement of bets on the platform.'
    ]
  },
  {
    id: 4,
    title: '4. Bets types',
    content: [
      'Explaining the various types of bets available including singles, multiples, and system bets.'
    ]
  },
  {
    id: 5,
    title: '5. Markets',
    content: [
      'Details on the specific markets offered, including odds calculation and market-specific regulations.'
    ]
  },
  {
    id: 6,
    title: '6. Special rules for sports.',
    content: [
      'Specific rules applicable to different sports such as Tennis, Cricket, and Soccer.'
    ]
  }
]

export default function PremiumSportsbookRules() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [openId, setOpenId] = useState<number | null>(1)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated])

  const toggleAccordion = (id: number) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white font-sans pb-10">
      {/* Header */}
      <div className="flex items-center px-4 py-4 bg-[#1a1a1a] border-b border-white/5 sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-white/80 pr-2 active:scale-95 transition-all">
          <ChevronLeft size={20} color="#e15b24" />
        </button>
        <h1 className="text-[15px] font-bold tracking-wide">Premium Sports Book</h1>
      </div>

      <div className="max-w-[1400px] mx-auto p-4 md:px-10 lg:px-20 space-y-3">
        {accordionItems.map((item) => {
          const isOpen = openId === item.id
          return (
            <div key={item.id} className="w-full">
              {/* Accordion Header */}
              <button
                onClick={() => toggleAccordion(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3.5 transition-all rounded-md shadow-md ${
                  isOpen ? 'bg-[#e15b24]' : 'bg-[#e15b24]/90'
                }`}
              >
                <span className="text-[15px] font-bold text-white tracking-tight">{item.title}</span>
                <div className="bg-white rounded-full p-0.5 flex items-center justify-center shrink-0">
                  {isOpen ? (
                    <Minus size={16} className="text-[#e15b24]" strokeWidth={4} />
                  ) : (
                    <Plus size={16} className="text-[#e15b24]" strokeWidth={4} />
                  )}
                </div>
              </button>

              {/* Accordion Content */}
              {isOpen && (
                <div className="mt-2 border-2 border-[#e15b24] rounded-lg p-5 bg-[#1a1a1a] shadow-inner">
                  <div className="space-y-4">
                    {item.content.map((text, idx) => (
                      <div key={idx} className="flex gap-4 items-start text-[14px] leading-relaxed">
                        <span className="font-bold text-white shrink-0">{idx + 1}.</span>
                        <p className="text-gray-200">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
