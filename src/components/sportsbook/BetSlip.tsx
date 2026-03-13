'use client'
import React, { useState, useEffect } from 'react'
import { X, Minus, Plus, ChevronDown, ChevronUp, Info } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useBetSlipStore } from '@/store/betSlipStore'
import Button from '@/components/ui/Button'

const QUICK_STAKES = [100, 500, 1000, 5000, 10000, 25000]

interface BetSlipProps {
  inline?: boolean
}

export default function BetSlip({ inline = false }: BetSlipProps) {
  const {
    isOpen,
    selections,
    stakes,
    removeSelection,
    setStake,
    updateStake,
    updateOdds,
    confirmBeforePlace,
    toggleConfirmBeforePlace,
    closeSlip,
    clearAll
  } = useBetSlipStore()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'betslip' | 'openbets'>('betslip')
  
  // State for dropdowns in Open Bets tab
  const [expandedMatch, setExpandedMatch] = useState<string | null>('Matched Bets')

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-close overlay when navigating away from detail page
  useEffect(() => {
    const isDetailPage = pathname?.match(/\/sports\/[^/]+\/[^/]+/)
    if (!isDetailPage && !inline && isOpen) {
       closeSlip() 
    }
  }, [pathname, inline, isOpen, closeSlip])

  if (!mounted || pathname?.startsWith('/auth')) return null
  
  // Prevent double slip on detail pages: 
  // If we are the global overlay slip (not inline) and we are on a match detail page,
  // we hide ourselves on large screens because the page has its own inline slip.
  const isDetailPage = pathname?.match(/\/sports\/[^/]+\/[^/]+/)
  if (!inline && isDetailPage && typeof window !== 'undefined' && window.innerWidth >= 1024) {
    return null
  }
  
  // In overlay mode, hide if not open and no selections
  if (!inline && !isOpen && selections.length === 0) return null

  const handleStakeInput = (id: string, val: string) => {
    const num = parseFloat(val) || 0
    setStake(id, num)
  }

  const toggleDropdown = (name: string) => {
    setExpandedMatch(expandedMatch === name ? null : name)
  }

  return (
    <>
      <div className={`
        bg-surface flex flex-col
        ${inline 
          ? 'relative w-full h-full border-0 shadow-none' 
          : `fixed z-50 border border-cardBorder shadow-2xl transition-all duration-300 ${isOpen
              ? 'bottom-14 lg:bottom-0 right-0 lg:right-0 left-0 lg:left-auto lg:w-[380px] rounded-t-2xl lg:rounded-none lg:top-[120px] lg:h-[calc(100vh-120px)] shadow-orange-950/20'
              : 'translate-y-full lg:translate-x-full'
            }`
        }
        ${!inline && isOpen ? 'animate-slide-up lg:animate-none' : ''}
      `}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 h-11 border-b border-cardBorder bg-[#111]">
              <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em]">Bet Order</span>
              {!inline && (
                <button 
                  onClick={closeSlip}
                  className="p-1 hover:bg-white/5 rounded-full text-textMuted hover:text-white transition-all"
                >
                  <X size={14} />
                </button>
              )}
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-cardBorder bg-surface">
            <button
              onClick={() => setActiveTab('betslip')}
              className={`flex-1 py-3 text-[10px] font-black tracking-[0.1em] transition-all relative ${activeTab === 'betslip' ? 'text-primary' : 'text-textSecondary hover:text-white'
                }`}
            >
              BET SLIP
              {selections.length > 0 && (
                <span className="ml-2 bg-primary text-white text-[9px] font-bold rounded-full w-4 h-4 inline-flex items-center justify-center">
                  {selections.length}
                </span>
              )}
              {activeTab === 'betslip' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(232,97,44,0.5)]" />}
            </button>
            <button
              onClick={() => setActiveTab('openbets')}
              className={`flex-1 py-3 text-[10px] font-black tracking-[0.1em] transition-all relative ${activeTab === 'openbets' ? 'text-primary' : 'text-textSecondary hover:text-white'
                }`}
            >
              OPEN BETS
              {activeTab === 'openbets' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(232,97,44,0.5)]" />}
            </button>
          </div>

        <div className="flex-1 overflow-hidden">
            {activeTab === 'betslip' ? (
              <div className="h-full overflow-y-auto custom-scrollbar">
                {selections.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                    <div className="text-4xl mb-4 opacity-20">🏏</div>
                    <p className="text-xs font-black text-textMuted uppercase tracking-widest">Your bet slip is empty</p>
                    <p className="text-[10px] text-textMuted/60 mt-2 uppercase">Select odds to start betting</p>
                  </div>
                ) : (
                  <div className="p-3 space-y-3 pb-24">
                    {selections.map((sel) => {
                      const stake = stakes[sel.id] || 0
                      const selProfit = (stake * (sel.odds - 1)).toFixed(2)

                      return (
                        <div key={sel.id} className="bg-card rounded-xl border border-cardBorder overflow-hidden shadow-lg hover:border-white/10 transition-colors">
                          {/* Selection Header */}
                          <div className={`px-3 py-2 flex items-center justify-between ${sel.betType === 'back' ? 'bg-[#a5d9fe]/20' : 'bg-[#f8d0ce]/20'
                            }`}>
                            <div className="flex-1 min-w-0">
                              <p className="text-[9px] font-black text-white/40 uppercase tracking-tighter truncate">{sel.matchName}</p>
                              <p className="text-[10px] font-bold text-textSecondary uppercase tracking-tight">{sel.marketName}</p>
                            </div>
                            <button
                              onClick={() => removeSelection(sel.id)}
                              className="ml-2 p-1.5 text-textMuted hover:text-danger hover:bg-danger/10 rounded-full transition-all"
                            >
                              <X size={14} />
                            </button>
                          </div>

                          <div className="p-3">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-black text-white uppercase tracking-tight">{sel.selectionName}</p>
                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${sel.betType === 'back' ? 'bg-[#a5d9fe] text-black' : 'bg-[#f8d0ce] text-black'}`}>
                                    {sel.betType}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                              {/* Odds */}
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[9px] font-black text-textMuted uppercase tracking-[0.1em] pl-1">Odds</label>
                                <div className="flex items-center h-10 bg-[#0d0d0d] border border-cardBorder rounded-lg overflow-hidden shadow-inner">
                                  <button
                                    onClick={() => updateOdds(sel.id, -0.01)}
                                    className="h-full px-2.5 text-textSecondary hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <input
                                    type="number"
                                    value={sel.odds}
                                    readOnly
                                    className="w-full h-full text-center text-xs font-black text-white bg-transparent outline-none"
                                  />
                                  <button
                                    onClick={() => updateOdds(sel.id, 0.01)}
                                    className="h-full px-2.5 text-textSecondary hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                              </div>

                              {/* Stake */}
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[9px] font-black text-textMuted uppercase tracking-[0.1em] pl-1">Stake (₹)</label>
                                <div className="flex items-center h-10 bg-[#0d0d0d] border border-cardBorder rounded-lg overflow-hidden shadow-inner transition-all hover:border-primary/50 focus-within:border-primary">
                                  <button
                                    onClick={() => updateStake(sel.id, -100)}
                                    className="h-full px-2.5 text-textSecondary hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <input
                                    type="number"
                                    value={stake || ''}
                                    onChange={(e) => handleStakeInput(sel.id, e.target.value)}
                                    placeholder="0"
                                    className="w-full h-full text-center text-xs font-black text-white bg-transparent outline-none placeholder:opacity-20"
                                  />
                                  <button
                                    onClick={() => updateStake(sel.id, 100)}
                                    className="h-full px-2.5 text-textSecondary hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2 px-1">
                                <p className="text-[9px] text-textMuted font-bold uppercase tracking-tight">Quick Stakes</p>
                                <button className="text-[9px] text-primary font-black uppercase tracking-widest hover:underline">Edit</button>
                              </div>
                              <div className="grid grid-cols-3 gap-1.5">
                                {QUICK_STAKES.map((qs) => (
                                  <button
                                    key={qs}
                                    onClick={() => updateStake(sel.id, qs)}
                                    className="py-1.5 bg-white/5 hover:bg-primary/20 text-white/80 hover:text-white text-[10px] font-black uppercase tracking-tight rounded-md border border-white/5 hover:border-primary/50 transition-all active:scale-95"
                                  >
                                    +{qs >= 1000 ? `${qs / 1000}K` : qs}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {stake > 0 && (
                              <div className="bg-success/5 border border-success/10 rounded-lg px-3 py-2 mb-4">
                                <div className="flex justify-between items-center text-[10px]">
                                  <span className="text-textSecondary font-bold uppercase tracking-tighter">Profit:</span>
                                  <span className="text-success font-black">₹{selProfit}</span>
                                </div>
                              </div>
                            )}

                            <div className="flex items-start gap-1.5 mb-2 px-1">
                              <Info size={10} className="text-warn mt-0.5 flex-shrink-0" />
                              <p className="text-[9px] text-textMuted font-medium leading-tight uppercase">Limits: 100 - 200,000</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Open Bets Tab */
              <div className="p-3 space-y-3 overflow-y-auto h-full custom-scrollbar">
                {['Unmatched Bets', 'Matched Bets'].map((tab) => (
                  <div key={tab} className="bg-card rounded-xl border border-cardBorder overflow-hidden">
                    <button 
                      onClick={() => toggleDropdown(tab)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">{tab}</span>
                      {expandedMatch === tab ? <ChevronUp size={14} className="text-primary" /> : <ChevronDown size={14} className="text-textMuted" />}
                    </button>
                    
                    {expandedMatch === tab && (
                      <div className="p-4 border-t border-cardBorder">
                         <div className="flex flex-col items-center justify-center py-6 text-center opacity-40">
                            <p className="text-[10px] font-bold text-textMuted uppercase tracking-widest">No {tab.toLowerCase()} found</p>
                         </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* Global Footer Actions (Stick to bottom of panel) */}
        {selections.length > 0 && activeTab === 'betslip' && (
             <div className="p-3 bg-surface border-t border-cardBorder shadow-[0_-10px_20px_rgba(0,0,0,0.4)]">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-[10px] font-black text-textSecondary uppercase tracking-widest">Confirm before place</span>
                  <button
                    onClick={toggleConfirmBeforePlace}
                    className={`w-9 h-5 rounded-full transition-all relative ${confirmBeforePlace ? 'bg-primary' : 'bg-[#333]'
                      } border border-white/10`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${confirmBeforePlace ? 'translate-x-[1rem]' : 'translate-x-0'
                      }`} />
                  </button>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={clearAll}
                    className="flex-1 py-3 rounded-lg text-[10px] font-black text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-cardBorder transition-all uppercase tracking-widest active:scale-95"
                  >
                    CLEAR ALL
                  </button>
                  <button
                    className="flex-[2] py-3 rounded-lg text-[10px] font-black text-white bg-gradient-to-r from-[#e8612c] to-[#f97316] shadow-lg shadow-orange-900/20 active:scale-95 uppercase tracking-[0.2em]"
                  >
                    PLACE BET
                  </button>
                </div>
             </div>
        )}
      </div>

      {/* Mobile overlay backdrop */}
      {isOpen && !inline && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={closeSlip}
        />
      )}
    </>
  )
}
