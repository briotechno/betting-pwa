'use client'
import React from 'react'
import { User, Mail, Phone, Shield, ChevronRight, Camera } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import Button from '@/components/ui/Button'

export default function ProfilePage() {
  const { user } = useAuthStore()

  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 pb-20">
      <div className="flex items-center gap-3 mb-2">
        <User size={24} className="text-primary" />
        <h1 className="text-xl font-bold text-textPrimary text-white">My Profile</h1>
      </div>

      {/* Profile Header */}
      <div className="bg-card border border-cardBorder rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/50">
              <span className="text-3xl font-black text-primary">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-background text-white">
              <Camera size={14} />
            </button>
          </div>
          <h2 className="text-xl font-bold text-white uppercase tracking-tight">{user.username}</h2>
          <div className="mt-1 flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
              {user.tier} Tier Player
            </span>
          </div>
        </div>
      </div>

      {/* Account Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-cardBorder rounded-xl p-4">
          <p className="text-[10px] text-textMuted uppercase font-bold tracking-widest mb-1">Total Bets</p>
          <p className="text-lg font-black text-white">124</p>
        </div>
        <div className="bg-card border border-cardBorder rounded-xl p-4">
          <p className="text-[10px] text-textMuted uppercase font-bold tracking-widest mb-1">Member Since</p>
          <p className="text-lg font-black text-white">Jan 2024</p>
        </div>
      </div>

      {/* Account Settings */}
      <div className="space-y-3">
        <p className="text-xs font-bold text-textMuted uppercase tracking-widest px-1">Account Details</p>
        <div className="bg-card border border-cardBorder rounded-2xl overflow-hidden">
          {[
            { icon: <Mail size={16} />, label: 'Email Address', value: 'user@example.com' },
            { icon: <Phone size={16} />, label: 'Phone Number', value: '+91 98765 43210' },
            { icon: <Shield size={16} />, label: 'KYC Status', value: 'Verified', color: 'text-success' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 border-b border-cardBorder/50 last:border-none hover:bg-white/5 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="text-textMuted">{item.icon}</div>
                <div>
                  <p className="text-[10px] text-textMuted font-bold uppercase tracking-tighter">{item.label}</p>
                  <p className={`text-sm font-bold ${item.color || 'text-white'}`}>{item.value}</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-textMuted" />
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <Button fullWidth variant="outline" className="text-red-500 border-red-500/20 hover:bg-red-500/10">
          LOGOUT FROM ALL DEVICES
        </Button>
      </div>
    </div>
  )
}
