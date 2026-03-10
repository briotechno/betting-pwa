'use client'
import React, { useState, useEffect } from 'react'
import { X, Minus, Plus, ChevronDown, ChevronUp, Info } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useBetSlipStore } from '@/store/betSlipStore'
import Button from '@/components/ui/Button'

const QUICK_STAKES = [100, 500, 1000, 5000, 10000, 25000]

export default function BetSlip() {
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

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || pathname?.startsWith('/auth')) return null
  if (!isOpen && selections.length === 0) return null

  const handleStakeInput = (id: string, val: string) => {
    const num = parseFloat(val) || 0
    setStake(id, num)
  }

  return (
    <>
      <div className={`
        fixed z-50 bg-surface border border-cardBorder shadow-2xl
        transition-all duration-300
        ${isOpen
          ? 'bottom-14 lg:bottom-0 right-0 lg:right-0 left-0 lg:left-auto lg:w-[380px] rounded-t-2xl lg:rounded-none lg:top-[120px]'
          : 'translate-y-full lg:translate-x-full'
        }
        ${isOpen ? 'animate-slide-up lg:animate-none' : ''}
      `}>
        <div className="flex border-b border-cardBorder">
          <button
            onClick={() => setActiveTab('betslip')}
            className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${activeTab === 'betslip' ? 'text-primary border-b-2 border-primary bg-primary/10' : 'text-textSecondary'
              }`}
          >
            BETSLIP
            {selections.length > 0 && (
              <span className="ml-1 bg-primary text-textPrimary text-[9px] rounded-full px-1.5 py-0.5">
                {selections.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('openbets')}
            className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${activeTab === 'openbets' ? 'text-primary border-b-2 border-primary bg-primary/10' : 'text-textSecondary'
              }`}
          >
            OPEN BETS
          </button>
          <button
            onClick={closeSlip}
            className="px-3 text-textMuted hover:text-textPrimary transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {activeTab === 'betslip' ? (
          <div className="overflow-y-auto max-h-[70vh] lg:max-h-[calc(100vh-200px)]">
            {selections.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <div className="text-4xl mb-3">🏏</div>
                <p className="text-sm text-textMuted">Your bet slip is empty.</p>
                <p className="text-xs text-textMuted mt-1">Click on odds to add bets</p>
              </div>
            ) : (
              <div className="p-3 space-y-3">
                {selections.map((sel) => {
                  const stake = stakes[sel.id] || 0
                  const selProfit = (stake * (sel.odds - 1)).toFixed(2)

                  return (
                    <div key={sel.id} className="bg-card rounded-xl border border-cardBorder overflow-hidden">
                      <div className={`px-3 py-2 flex items-center justify-between ${sel.betType === 'back' ? 'bg-backBet/20' : 'bg-layBet/20'
                        }`}>
                        <div>
                          <p className="text-xs font-semibold text-textPrimary uppercase tracking-tight">{sel.matchName}</p>
                          <p className="text-[10px] text-textSecondary">{sel.marketName}</p>
                        </div>
                        <button
                          onClick={() => removeSelection(sel.id)}
                          className="text-textMuted hover:text-danger transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      <div className="px-3 py-3">
                        <p className="text-sm font-black text-white mb-3 uppercase tracking-tight">{sel.selectionName}</p>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                          {/* Odds */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-textMuted uppercase tracking-widest pl-1">Odds</label>
                            <div className="flex items-center h-[42px] bg-[#0d0d0d] border border-cardBorder rounded-xl overflow-hidden shadow-inner">
                              <button
                                onClick={() => updateOdds(sel.id, -0.01)}
                                className="h-full px-3 text-textSecondary hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <input
                                type="number"
                                value={sel.odds}
                                readOnly
                                className="w-full h-full text-center text-sm font-black text-white bg-transparent outline-none"
                              />
                              <button
                                onClick={() => updateOdds(sel.id, 0.01)}
                                className="h-full px-3 text-textSecondary hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>

                          {/* Stake */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-textMuted uppercase tracking-widest pl-1">Stake (₹)</label>
                            <div className="flex items-center h-[42px] bg-[#0d0d0d] border border-cardBorder rounded-xl overflow-hidden shadow-inner transition-all hover:border-primary/50 focus-within:border-primary">
                              <button
                                onClick={() => updateStake(sel.id, -100)}
                                className="h-full px-3 text-textSecondary hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <input
                                type="number"
                                value={stake || ''}
                                onChange={(e) => handleStakeInput(sel.id, e.target.value)}
                                placeholder="0"
                                className="w-full h-full text-center text-sm font-black text-white bg-transparent outline-none"
                              />
                              <button
                                onClick={() => updateStake(sel.id, 100)}
                                className="h-full px-3 text-textSecondary hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2 px-1">
                            <p className="text-[10px] text-textMuted font-bold uppercase tracking-tighter">or Choose Your Stake Size</p>
                            <button className="text-[10px] text-primary font-black uppercase tracking-widest hover:underline">EDIT STAKES</button>
                          </div>
                          <div className="grid grid-cols-3 gap-1.5">
                            {QUICK_STAKES.map((qs) => (
                              <button
                                key={qs}
                                onClick={() => updateStake(sel.id, qs)}
                                className="py-2 bg-white/5 hover:bg-primary text-white text-[11px] font-black uppercase tracking-tight rounded-lg border border-white/5 hover:border-primary transition-all active:scale-95"
                              >
                                +{qs >= 1000 ? `${qs / 1000}K` : qs}
                              </button>
                            ))}
                          </div>
                        </div>

                        {stake > 0 && (
                          <div className="bg-success/5 border border-success/20 rounded-xl px-4 py-2.5 mb-4">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-textMuted font-medium">Potential Profit:</span>
                              <span className="text-success font-black text-sm">₹{selProfit}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs mt-1">
                              <span className="text-textMuted font-medium">Total Return:</span>
                              <span className="text-white font-black">₹{(stake + parseFloat(selProfit)).toFixed(2)}</span>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start gap-1.5 mb-5 px-1">
                          <Info size={12} className="text-warn mt-0.5 flex-shrink-0" />
                          <p className="text-[10px] text-textMuted font-medium leading-tight">Min Bet: 100 Max Bet: 200000 Max Winning: 5000000</p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => removeSelection(sel.id)}
                            className="flex-1 py-3.5 rounded-xl text-[11px] font-black text-white bg-surface border border-cardBorder hover:bg-white/5 transition-all uppercase tracking-widest active:scale-95"
                          >
                            CANCEL
                          </button>
                          <button
                            disabled={stake === 0}
                            className={`flex-1 py-3.5 rounded-xl text-[11px] font-black text-white transition-all uppercase tracking-widest active:scale-95 shadow-lg ${stake > 0
                              ? 'bg-gradient-to-r from-[#e8612c] to-[#f97316] shadow-orange-900/20'
                              : 'bg-[#222] opacity-50 cursor-not-allowed'
                              }`}
                          >
                            PLACE BET
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* Confirm Toggle - Outside selections for better usability */}
                <div className="mt-2 flex items-center justify-between px-3 py-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-black text-textSecondary uppercase tracking-widest px-1">Confirm bets before placing</span>
                  <button
                    onClick={toggleConfirmBeforePlace}
                    className={`w-11 h-6 rounded-full transition-all relative ${confirmBeforePlace ? 'bg-[#e8612c]' : 'bg-[#333]'
                      } border border-white/10`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${confirmBeforePlace ? 'translate-x-[1.375rem]' : 'translate-x-0'
                      }`} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Open Bets Tab */
          <div className="p-3 space-y-2">
            {['Unmatched Bets', 'Matched Bets'].map((tab) => (
              <div key={tab} className="bg-card rounded-xl border border-cardBorder overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm font-medium text-textPrimary">{tab}</span>
                  <ChevronDown size={16} className="text-textMuted" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={closeSlip}
        />
      )}
    </>
  )
}
