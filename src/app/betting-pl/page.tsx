'use client'
import React from 'react'
import { LineChart, ArrowUpRight, TrendingUp, TrendingDown, Target, History } from 'lucide-react'
import Badge from '@/components/ui/Badge'

export default function BettingPLPage() {
  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      <div className="flex items-center gap-3 mb-6">
        <LineChart size={24} className="text-primary" />
        <h1 className="text-xl font-bold text-white uppercase tracking-tight">Betting P&L</h1>
      </div>

      {/* P&L Overview */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-success/5 border border-success/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success mb-3">
                <TrendingUp size={20} />
            </div>
            <p className="text-[10px] text-success/80 font-black uppercase tracking-widest mb-1">Total Profit</p>
            <p className="text-2xl font-black text-white">₹12,450.00</p>
        </div>
        <div className="bg-danger/5 border border-danger/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center text-danger mb-3">
                <TrendingDown size={20} />
            </div>
            <p className="text-[10px] text-danger/80 font-black uppercase tracking-widest mb-1">Total Loss</p>
            <p className="text-2xl font-black text-white">₹4,200.00</p>
        </div>
      </div>

      <div className="bg-card border border-cardBorder rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-tighter">Net Profit / Loss</h3>
                    <p className="text-[10px] text-textMuted uppercase tracking-widest mt-0.5">Last 30 Days</p>
                </div>
                <div className="px-3 py-1 bg-success/10 border border-success/30 rounded-full">
                    <span className="text-xs font-black text-success">+ ₹8,250.00</span>
                </div>
          </div>
          <div className="h-32 flex items-end gap-1 px-1">
                {[40, 70, 45, 90, 65, 80, 50, 60, 95, 75, 85, 40].map((h, i) => (
                    <div key={i} className="flex-1 bg-primary/20 rounded-t-sm hover:bg-primary/50 transition-colors cursor-pointer" style={{ height: `${h}%` }} />
                ))}
          </div>
      </div>

      {/* Breakdown by Sport */}
      <h3 className="text-xs font-black text-textMuted uppercase tracking-widest mb-4 px-1">Performance by Sport</h3>
      <div className="space-y-3">
        {[
            { sport: 'Cricket', won: 45, lost: 12, profit: 8400, icon: '🏏' },
            { sport: 'Soccer', won: 12, lost: 8, profit: 2100, icon: '⚽' },
            { sport: 'Tennis', won: 5, lost: 10, profit: -1200, icon: '🎾' },
        ].map((item) => (
            <div key={item.sport} className="bg-card border border-cardBorder rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                        <p className="text-xs font-black text-white uppercase tracking-tight">{item.sport}</p>
                        <p className="text-[10px] text-textMuted mt-0.5 uppercase tracking-tighter font-bold">
                            Win: {item.won} | Loss: {item.lost}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className={`text-sm font-black tracking-tight ${item.profit > 0 ? 'text-success' : 'text-danger'}`}>
                        {item.profit > 0 ? '+' : ''}₹{item.profit.toLocaleString()}
                    </p>
                </div>
            </div>
        ))}
      </div>

       <div className="mt-8">
        <button className="w-full py-4 rounded-2xl bg-surface border border-cardBorder text-[10px] font-black uppercase tracking-widest text-[#666] hover:text-white hover:border-primary/50 transition-all">
          <History size={14} className="inline-block mr-2" /> View Detailed Statement
        </button>
      </div>

    </div>
  )
}
