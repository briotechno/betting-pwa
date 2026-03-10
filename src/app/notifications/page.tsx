'use client'
import React from 'react'
import { Bell, Settings, Trash2, CheckCheck, Clock, Bookmark } from 'lucide-react'
import Badge from '@/components/ui/Badge'

export default function NotificationsPage() {
  const notifications = [
    { id: 1, title: 'Bet Placed Successfully', desc: 'Your bet on Ind vs Aus for ₹500.00 is confirmed.', time: '2 mins ago', type: 'bet' },
    { id: 2, title: 'Withdrawal Successful', desc: '₹2,000.00 has been credited to your bank account.', time: '1 hour ago', type: 'wallet' },
    { id: 3, title: 'New Bonus Available!', desc: 'Get 50% extra on your next deposit. Limited time offer.', time: '5 hours ago', type: 'promo' },
    { id: 4, title: 'Upcoming Match Alert', desc: 'Real Madrid vs Barcelona starts in 30 minutes.', time: 'Yesterday', type: 'match' },
    { id: 5, title: 'Security Update', desc: 'Your password was successfully updated.', time: '2 days ago', type: 'security' },
  ]

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell size={24} className="text-primary" />
          <h1 className="text-xl font-bold text-white uppercase tracking-tight">Notification Center</h1>
        </div>
        <div className="flex gap-2">
            <button className="p-2 bg-card border border-cardBorder rounded-lg text-textMuted hover:text-white transition-colors">
                <Settings size={18} />
            </button>
            <button className="p-2 bg-card border border-cardBorder rounded-lg text-textMuted hover:text-white transition-colors">
                <Trash2 size={18} />
            </button>
        </div>
      </div>

       <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {['All Alerts', 'Bets', 'Wallet', 'Promos'].map((tab, idx) => (
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

      <div className="space-y-3">
        {notifications.map((n) => (
            <div key={n.id} className="relative bg-card border border-cardBorder rounded-2xl p-5 hover:border-primary/30 transition-all cursor-pointer group overflow-hidden">
                <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        n.type === 'bet' ? 'bg-primary/10 text-primary' :
                        n.type === 'wallet' ? 'bg-success/10 text-success' :
                        n.type === 'promo' ? 'bg-orange-500/10 text-orange-400' :
                        n.type === 'match' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-slate-500/10 text-slate-400'
                    }`}>
                        {n.type === 'bet' && <CheckCheck size={18} />}
                        {n.type === 'wallet' && <Bookmark size={18} />}
                        {n.type === 'promo' && <Bell size={18} />}
                        {n.type === 'match' && <Clock size={18} />}
                        {n.type === 'security' && <Bell size={18} />}
                    </div>
                    <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-sm font-black text-white uppercase tracking-tight truncate">{n.title}</h3>
                            <span className="text-[9px] text-[#444] font-black uppercase tracking-widest whitespace-nowrap">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-textMuted font-bold leading-relaxed">{n.desc}</p>
                    </div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>
        ))}
      </div>

      <div className="mt-8 text-center text-[10px] text-[#444] font-black uppercase tracking-widest flex items-center justify-center gap-2">
            No more recent notifications 
      </div>
    </div>
  )
}
