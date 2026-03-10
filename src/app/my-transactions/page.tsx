'use client'
import React from 'react'
import { Landmark, ArrowUpCircle, ArrowDownCircle, Search, Filter } from 'lucide-react'
import Badge from '@/components/ui/Badge'

const transactions = [
  { id: 1, type: 'deposit', amount: 5000, status: 'success', date: '2024-01-15 14:32', method: 'UPI' },
  { id: 2, type: 'bet', amount: -500, status: 'success', date: '2024-01-15 15:10', method: 'Cricket - IND vs AUS' },
  { id: 3, type: 'win', amount: 1240, status: 'success', date: '2024-01-15 17:45', method: 'Cricket - IND vs AUS' },
  { id: 4, type: 'withdrawal', amount: -2000, status: 'pending', date: '2024-01-16 09:15', method: 'Bank Transfer' },
  { id: 5, type: 'deposit', amount: 3000, status: 'success', date: '2024-01-16 10:00', method: 'PhonePe' },
  { id: 6, type: 'bet', amount: -200, status: 'success', date: '2024-01-16 11:20', method: 'Soccer - MU vs ARS' },
  { id: 7, type: 'withdrawal', amount: -1500, status: 'failed', date: '2024-01-16 12:00', method: 'Bank Transfer' },
]

export default function MyTransactionsPage() {
  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Landmark size={24} className="text-primary" />
          <h1 className="text-xl font-bold text-white">Transactions</h1>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-card border border-cardBorder rounded-lg text-textMuted hover:text-white transition-colors">
            <Search size={18} />
          </button>
          <button className="p-2 bg-card border border-cardBorder rounded-lg text-textMuted hover:text-white transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {['All', 'Deposits', 'Withdrawals', 'Bets', 'Bonus'].map((tab, idx) => (
          <button
            key={tab}
            className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-colors border ${
              idx === 0 
              ? 'bg-primary/10 border-primary/50 text-primary' 
              : 'bg-card border-cardBorder text-textMuted hover:text-white hover:border-textMuted'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="group bg-card border border-cardBorder rounded-xl p-4 flex items-center justify-between hover:border-primary/30 transition-all cursor-pointer">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                tx.type === 'deposit' ? 'bg-success/10 text-success' :
                tx.type === 'win' ? 'bg-success/10 text-success' :
                tx.type === 'bet' ? 'bg-primary/10 text-primary' :
                'bg-danger/10 text-danger'
              }`}>
                {tx.type === 'deposit' && <ArrowDownCircle size={20} />}
                {tx.type === 'win' && <ArrowDownCircle size={20} />}
                {tx.type === 'bet' && <ArrowUpCircle size={20} />}
                {tx.type === 'withdrawal' && <ArrowUpCircle size={20} />}
              </div>
              <div>
                <p className="text-xs font-black text-white uppercase tracking-tight">{tx.type}</p>
                <p className="text-[10px] text-textMuted mt-0.5">{tx.method}</p>
                <p className="text-[9px] text-[#444] mt-0.5 font-bold uppercase tracking-widest">{tx.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-black tracking-tight ${tx.amount > 0 ? 'text-success' : 'text-danger'}`}>
                {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
              </p>
              <div className={`mt-1 inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                tx.status === 'success' ? 'bg-success/10 text-success' :
                tx.status === 'pending' ? 'bg-warn/10 text-warn' :
                'bg-danger/10 text-danger'
              }`}>
                {tx.status}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button className="text-[10px] font-black uppercase tracking-widest text-textMuted hover:text-primary transition-colors">
          Download Statement (PDF)
        </button>
      </div>
    </div>
  )
}
