'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Plus, Minus, ChevronDown } from 'lucide-react'

type FAQ = {
  q: string
  a?: React.ReactNode
}

type Category = {
  id: string
  title: string
  faqs: FAQ[]
}

const categories: Category[] = [
  {
    id: 'registration',
    title: 'Registration and Login',
    faqs: [
      {
        q: 'Q1. How do I register?',
        a: (
          <ul className="list-disc pl-5 space-y-1 text-gray-300 text-[13px]">
            <li>Click on "Join Now"</li>
            <li>Fill out the form</li>
            <li>Enter the verification code you receive</li>
            <li>Enter your referral code (if any)</li>
            <li>Read and accept the terms and conditions</li>
            <li>Click on "Register", congratulations you are now a FairPlay Club member!</li>
          </ul>
        ),
      },
      { q: "Q2. I'm having trouble signing up!" },
      { q: 'Q3. Forgot your password?' },
      { q: 'Q4. How old do I have to be to be eligible for FairPlay Club membership?' },
      { q: 'Q5. Do I need to be an Indian citizen to register on FairPlay?' },
      { q: 'Q6. Can I open or operate an account for a friend or relative?' },
      { q: "Q7. I'm unable to register because it says my credentials already exist. What do I do?" },
      { q: 'Q8. Can I hold more than one account on FairPlay?' },
      { q: 'Q9. My account got locked, Why and What do I do?' },
    ],
  },
  {
    id: 'general',
    title: 'General',
    faqs: [
      { q: 'Q1. What is FairPlay?' },
      { q: 'Q2. Is FairPlay legal in India?' },
      { q: 'Q3. How do I contact customer support?' },
    ],
  },
  {
    id: 'bonus',
    title: 'Bonus',
    faqs: [
      { q: 'Q1. What bonuses are available?' },
      { q: 'Q2. How do I claim my welcome bonus?' },
      { q: 'Q3. What are the wagering requirements?' },
    ],
  },
  {
    id: 'banking',
    title: 'Banking',
    faqs: [
      { q: 'Q1. How do I deposit funds?' },
      { q: 'Q2. How do I withdraw my winnings?' },
      { q: 'Q3. How long does withdrawal take?' },
      { q: 'Q4. What payment methods are accepted?' },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy and Security',
    faqs: [
      { q: 'Q1. How is my data protected?' },
      { q: 'Q2. Is my personal information shared with third parties?' },
      { q: 'Q3. How do I change my password?' },
    ],
  },
  {
    id: 'sports',
    title: 'SportsExch',
    faqs: [
      { q: 'Q1. What is a sports exchange?' },
      { q: 'Q2. How do odds work on the exchange?' },
      { q: 'Q3. What is a Back bet vs a Lay bet?' },
    ],
  },
]

export default function FAQsPage() {
  // Track which category accordion is open (-1 = first open by default)
  const [openCategory, setOpenCategory] = useState<string>('registration')
  // Track which question is expanded within a category
  const [openQuestion, setOpenQuestion] = useState<string>('registration-0')

  const toggleCategory = (id: string) => {
    setOpenCategory(prev => prev === id ? '' : id)
    setOpenQuestion('') // close any open Q when switching categories
  }

  const toggleQuestion = (key: string) => {
    setOpenQuestion(prev => prev === key ? '' : key)
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Page Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#1a1a1a] border-b border-white/10 sticky top-0 z-10">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">
          <ChevronLeft size={22} />
        </Link>
        <h1 className="text-white text-[15px] font-bold tracking-widest uppercase">FAQs</h1>
      </div>

      {/* Category Accordions */}
      <div className="max-w-3xl mx-auto px-4 py-6 pb-16 space-y-4">
        {categories.map((category) => {
          const isCatOpen = openCategory === category.id

          return (
            <div key={category.id} className="bg-[#1a1a1a] rounded-sm overflow-hidden">

              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className={`w-full flex items-center justify-between px-4 py-4 text-left transition-colors ${
                  isCatOpen ? 'bg-[#1a1a1a]' : 'bg-[#1a1a1a]'
                }`}
              >
                <span className={`text-[15px] font-bold ${isCatOpen ? 'text-[#e8612c]' : 'text-white'}`}>
                  {category.title}
                </span>
                <span className="text-gray-400">
                  {isCatOpen ? <Minus size={18} /> : <Plus size={18} />}
                </span>
              </button>

              {/* Category Content — list of sub-questions */}
              {isCatOpen && (
                <div className="border-t border-white/5">
                  {category.faqs.map((faq, qi) => {
                    const qKey = `${category.id}-${qi}`
                    const isQOpen = openQuestion === qKey

                    return (
                      <div key={qKey} className="border-b border-white/5 last:border-0">
                        {/* Question Row */}
                        <button
                          onClick={() => toggleQuestion(qKey)}
                          className={`w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors group ${
                            isQOpen ? 'bg-[#111]' : 'hover:bg-white/[0.03]'
                          }`}
                        >
                          <span className={`text-[13px] font-semibold leading-snug flex-1 pr-4 ${
                            isQOpen ? 'text-white' : 'text-gray-200'
                          }`}>
                            {faq.q}
                          </span>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                            isQOpen ? 'bg-[#e8612c]' : 'bg-[#e8612c]/80'
                          }`}>
                            <ChevronDown
                              size={14}
                              className={`text-white transition-transform duration-200 ${isQOpen ? 'rotate-180' : ''}`}
                            />
                          </div>
                        </button>

                        {/* Answer */}
                        {isQOpen && faq.a && (
                          <div className="px-6 pb-4 pt-2 bg-[#111] border-t border-white/5">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
