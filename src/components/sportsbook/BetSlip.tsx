'use client'
import React, { useState, useEffect } from 'react'
import { X, Minus, Plus, ChevronDown, ChevronUp, Info } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useBetSlipStore } from '@/store/betSlipStore'
import Button from '@/components/ui/Button'

const QUICK_STAKES = [100, 500, 1000, 5000, 10000, 25000]

export default function BetSlip() {
  const { isOpen, selections, stakes, removeSelection, setStake, closeSlip, clearAll } = useBetSlipStore()
  const pathname = usePathname()
  const [confirmBets, setConfirmBets] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'betslip' | 'openbets'>('betslip')

  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Guard returns must come AFTER all hooks
  if (!mounted || pathname?.startsWith('/auth')) return null
  if (!isOpen && selections.length === 0) return null

  const selection = selections[0] // Single bet mode for now
  const currentStake = selection ? (stakes[selection.id] || 0) : 0
  const profit = selection ? (currentStake * (selection.odds - 1)).toFixed(2) : '0.00'

  const handleStakeInput = (val: string) => {
    if (!selection) return
    const num = parseFloat(val) || 0
    setStake(selection.id, num)
  }

  const handleAdjustStake = (delta: number) => {
    if (!selection) return
    const newStake = Math.max(0, currentStake + delta)
    setStake(selection.id, newStake)
  }

  return (
    <>
      {/* Bet slip panel - shows on right side desktop, bottom sheet mobile */}
      <div className={`
        fixed z-50 bg-surface border border-cardBorder shadow-2xl
        transition-all duration-300
        ${isOpen
          ? 'bottom-14 lg:bottom-0 right-0 lg:right-0 left-0 lg:left-auto lg:w-[380px] rounded-t-2xl lg:rounded-none lg:top-[120px]'
          : 'translate-y-full lg:translate-x-full'
        }
        ${isOpen ? 'animate-slide-up lg:animate-none' : ''}
      `}>
        {/* Tabs */}
        <div className="flex border-b border-cardBorder">
          <button
            onClick={() => setActiveTab('betslip')}
            className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
              activeTab === 'betslip' ? 'text-primary border-b-2 border-primary bg-primary/10' : 'text-textSecondary'
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
            className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
              activeTab === 'openbets' ? 'text-primary border-b-2 border-primary bg-primary/10' : 'text-textSecondary'
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
                      {/* Header */}
                      <div className={`px-3 py-2 flex items-center justify-between ${
                        sel.betType === 'back' ? 'bg-backBet/20' : 'bg-layBet/20'
                      }`}>
                        <div>
                          <p className="text-xs font-semibold text-textPrimary">{sel.matchName}</p>
                          <p className="text-[10px] text-textSecondary">{sel.marketName}</p>
                        </div>
                        <button
                          onClick={() => removeSelection(sel.id)}
                          className="text-textMuted hover:text-danger transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      {/* Selection Name + Odds */}
                      <div className="px-3 py-3">
                        <p className="text-sm font-black text-textPrimary mb-3 uppercase tracking-tight">{sel.selectionName}</p>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          {/* Odds */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-textMuted uppercase tracking-[0.1em]">Odds</label>
                            <div className="flex items-center bg-headerBg border border-cardBorder rounded-xl overflow-hidden shadow-inner">
                              <button
                                onClick={() => {}} // In a real app, this would nudge the odds
                                className="px-3 py-2 text-textSecondary hover:text-textPrimary bg-surfaceLight/50 hover:bg-surfaceLight transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <input
                                type="number"
                                value={sel.odds}
                                readOnly
                                className="w-full text-center text-sm font-black text-textPrimary bg-transparent py-2 outline-none"
                              />
                              <button
                                onClick={() => {}} // In a real app, this would nudge the odds
                                className="px-3 py-2 text-textSecondary hover:text-textPrimary bg-surfaceLight/50 hover:bg-surfaceLight transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>

                          {/* Stake */}
                          <div className="space-y-1.5 text-right">
                            <label className="text-[10px] font-black text-textMuted uppercase tracking-[0.1em] text-right block">Stake (₹)</label>
                            <div className="relative group">
                              <input
                                type="number"
                                value={stake || ''}
                                onChange={(e) => handleStakeInput(e.target.value)}
                                placeholder="0"
                                className="w-full bg-headerBg border border-primary/40 focus:border-primary rounded-xl px-4 py-2 text-sm font-black text-textPrimary focus:outline-none focus:ring-1 focus:ring-primary text-right transition-all"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Quick stakes */}
                        <div className="mb-2">
                          <div className="flex items-center justify-between mb-1.5">
                            <p className="text-[10px] text-textMuted">or Choose Your Stake Size</p>
                            <button className="text-[10px] text-primary hover:underline">EDIT STAKES</button>
                          </div>
                          <div className="grid grid-cols-3 gap-1.5">
                            {QUICK_STAKES.map((qs) => (
                              <button
                                key={qs}
                                onClick={() => setStake(sel.id, qs)}
                                className="py-1.5 bg-primary/20 hover:bg-primary text-textPrimary text-xs font-semibold rounded-lg border border-primary/30 hover:border-primary transition-all active:scale-95"
                              >
                                +{qs >= 1000 ? `${qs / 1000}K` : qs}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Profit preview */}
                        {stake > 0 && (
                          <div className="bg-success/10 border border-success/30 rounded-lg px-3 py-2 mb-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-textMuted">Potential Profit:</span>
                              <span className="text-success font-bold">₹{selProfit}</span>
                            </div>
                            <div className="flex justify-between text-xs mt-0.5">
                              <span className="text-textMuted">Total Return:</span>
                              <span className="text-textPrimary font-semibold">₹{(stake + parseFloat(selProfit)).toFixed(2)}</span>
                            </div>
                          </div>
                        )}

                        {/* Info */}
                        <div className="flex items-start gap-1.5 mb-3">
                          <Info size={12} className="text-warn mt-0.5 flex-shrink-0" />
                          <p className="text-[10px] text-textMuted">Min Bet: 100 Max Bet: 200000 Max Winning: 5000000</p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={() => removeSelection(sel.id)}
                            className="flex-1 py-3.5 rounded-xl text-xs font-black text-textPrimary bg-surface border border-cardBorder hover:bg-surfaceLight transition-all uppercase tracking-widest active:scale-95"
                          >
                            CANCEL
                          </button>
                          <button
                            disabled={stake === 0}
                            className={`flex-1 py-3.5 rounded-xl text-xs font-black text-textPrimary transition-all uppercase tracking-widest active:scale-95 shadow-lg ${
                                stake > 0 
                                ? 'bg-gradient-orange shadow-primary/20' 
                                : 'bg-surfaceLight opacity-50 cursor-not-allowed'
                            }`}
                          >
                            PLACE BET
                          </button>
                        </div>

                        {/* Confirm toggle */}
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Confirm bets before placing</span>
                          <button
                            onClick={() => setConfirmBets(!confirmBets)}
                            className={`w-10 h-5 rounded-full transition-all relative ${
                              confirmBets ? 'bg-primary' : 'bg-surface'
                            } border border-cardBorder`}
                          >
                            <span className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform ${
                              confirmBets ? 'translate-x-5.5' : 'translate-x-1'
                            }`} />
                          </button>
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
