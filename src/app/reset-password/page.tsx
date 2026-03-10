'use client'
import React, { useState } from 'react'
import { KeyRound, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function ResetPasswordPage() {
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      <div className="flex items-center gap-3 mb-6">
        <KeyRound size={24} className="text-primary" />
        <h1 className="text-xl font-bold text-white uppercase tracking-tight">Security Center</h1>
      </div>

      <div className="bg-card border border-cardBorder rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
          <ShieldCheck size={24} className="text-primary" />
          <div>
            <p className="text-sm font-bold text-white uppercase tracking-tight">Change Password</p>
            <p className="text-[10px] text-textMuted uppercase tracking-widest font-black">Keep your account secure</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Input 
              label="Old Password" 
              type={showCurrent ? 'text' : 'password'}
              placeholder="Enter your current password" 
            />
            <button 
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-10 text-textMuted hover:text-white"
            >
              {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="relative">
            <Input 
              label="New Password" 
              type={showNew ? 'text' : 'password'}
              placeholder="Min. 8 characters" 
            />
            <button 
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-10 text-textMuted hover:text-white"
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="relative">
            <Input 
              label="Confirm New Password" 
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repeat your new password" 
            />
             <button 
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-10 text-textMuted hover:text-white"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <Button fullWidth size="lg">UPDATE PASSWORD</Button>
          <div className="p-3 rounded-lg border border-red-500/10 bg-red-500/5 text-center">
            <button className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-500 transition-colors">
              Request OTP Reset
            </button>
          </div>
        </div>
      </div>

      <div className="bg-orange-500/5 border border-orange-500/10 rounded-xl p-4">
        <p className="text-[10px] text-orange-400 font-black uppercase tracking-widest mb-2 leading-relaxed">
          🚨 Security Tip: Use a strong password with letters, numbers, and symbols. Never share your password with anyone.
        </p>
      </div>
    </div>
  )
}
