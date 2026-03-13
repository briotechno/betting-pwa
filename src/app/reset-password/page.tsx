'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Lock, Eye, EyeOff } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div className="bg-[#121212] min-h-screen text-white pb-20">
      {/* Sub Header */}
      <div className="flex items-center px-4 py-3 bg-[#1a1a1a] shadow-md">
        <button onClick={() => router.back()} className="text-white/80 pr-3">
          <ChevronLeft size={24} color="#e15b24" />
        </button>
        <h1 className="text-[17px] font-bold">Reset Password</h1>
      </div>

      <div className="p-4 pt-10">
        <div className="bg-[#1a1a1a] rounded-xl p-8 border border-white/5 shadow-2xl space-y-8">
          
          {/* Old Password */}
          <div className="relative group">
            <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-[#e15b24] transition-colors" size={24} />
            <input 
              type={showOld ? 'text' : 'password'} 
              placeholder="Old Password*" 
              className="w-full bg-transparent border-b border-white/20 h-12 pl-10 pr-10 text-[16px] outline-none focus:border-[#e15b24] transition-all"
            />
            <button 
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-white/50"
            >
              {showOld ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          {/* New Password */}
          <div className="relative group">
            <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-[#e15b24] transition-colors" size={24} />
            <input 
              type={showNew ? 'text' : 'password'} 
              placeholder="New Password*" 
              className="w-full bg-transparent border-b border-white/20 h-12 pl-10 pr-10 text-[16px] outline-none focus:border-[#e15b24] transition-all"
            />
            <button 
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-white/50"
            >
              {showNew ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative group">
            <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-[#e15b24] transition-colors" size={24} />
            <input 
              type={showConfirm ? 'text' : 'password'} 
              placeholder="Confirm New Password*" 
              className="w-full bg-transparent border-b border-white/20 h-12 pl-10 pr-10 text-[16px] outline-none focus:border-[#e15b24] transition-all"
            />
            <button 
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-white/50"
            >
              {showConfirm ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          {/* Action Button */}
          <button className="w-full h-12 bg-[#e15b24] text-white rounded-xl text-[14px] font-black uppercase tracking-widest shadow-lg active:scale-[0.98] transition-all mt-6">
            RESET PASSWORD
          </button>
        </div>
      </div>
    </div>
  )
}
