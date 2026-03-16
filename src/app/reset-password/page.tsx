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
    <div className="bg-[#181818] min-h-screen text-white pb-20 font-sans">
      {/* Sub Header */}
      <div className="flex items-center px-4 py-3 bg-[#222222]">
        <button onClick={() => router.back()} className="text-[#e8612c] pr-3">
          <ChevronLeft size={22} className="stroke-[3]" />
        </button>
        <h1 className="text-[15px] font-bold text-white">Reset Password</h1>
      </div>

      <div className="p-4 pt-6">
        <div className="bg-[#222222] rounded-[4px] p-5 shadow-lg space-y-8 border flex flex-col border-white/5">
          
          {/* Old Password */}
          <div className="relative group flex items-center border-b border-gray-400 pb-1">
            <Lock className="text-white mr-3 flex-shrink-0" size={18} fill="currentColor" strokeWidth={0} />
            <input 
              type={showOld ? 'text' : 'password'} 
              placeholder="Old Password*" 
              className="w-full bg-transparent h-8 text-[13px] font-medium text-white outline-none placeholder-gray-300"
            />
            <button 
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="text-white ml-2 flex-shrink-0"
            >
              {showOld ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          {/* New Password */}
          <div className="relative group flex items-center border-b border-gray-400 pb-1">
            <Lock className="text-white mr-3 flex-shrink-0" size={18} fill="currentColor" strokeWidth={0} />
            <input 
              type={showNew ? 'text' : 'password'} 
              placeholder="New Password*" 
              className="w-full bg-transparent h-8 text-[13px] font-medium text-white outline-none placeholder-gray-300"
            />
            <button 
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="text-white ml-2 flex-shrink-0"
            >
              {showNew ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative group flex items-center border-b border-gray-400 pb-1">
            <Lock className="text-white mr-3 flex-shrink-0" size={18} fill="currentColor" strokeWidth={0} />
            <input 
              type={showConfirm ? 'text' : 'password'} 
              placeholder="Confirm New Password*" 
              className="w-full bg-transparent h-8 text-[13px] font-medium text-white outline-none placeholder-gray-300"
            />
            <button 
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="text-white ml-2 flex-shrink-0"
            >
              {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button className="w-full h-10 bg-[#e8612c] text-white rounded-full text-[13px] font-bold tracking-wide active:scale-[0.98] transition-all">
              RESET PASSWORD
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
