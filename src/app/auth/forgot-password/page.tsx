'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Phone, ArrowLeft, ChevronRight, Lock, Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<'phone' | 'otp' | 'reset'>('phone')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [newPassword, setNewPassword] = useState('')

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setStep('otp')
    setLoading(false)
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 font-sans overflow-hidden">
      {/* Dynamic Stadium Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ 
          backgroundImage: 'url("/signup-bg.png")',
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
      </div>

      <div className="w-full max-w-[440px] relative z-10 flex flex-col items-center">
        {/* Top Logo */}
        <div className="mb-8 scale-125">
          <Link href="/" className="flex items-center gap-1 group">
            <span className="text-4xl font-black italic tracking-tighter text-[#e8612c]">fair</span>
            <span className="text-4xl font-black italic text-white tracking-tighter">play</span>
            <div className="ml-1.5 px-2 py-1 rounded bg-[#e8612c] text-white text-[10px] font-black uppercase tracking-widest leading-none">
              VIP
            </div>
          </Link>
          <p className="text-[10px] text-center text-white/40 font-black uppercase tracking-[0.3em] mt-1 pl-1">Greater Luck Greater Wins</p>
        </div>

        {/* Forgot Password Container */}
        <div className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-8 shadow-2xl relative group">
          <Link href="/auth/login" className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-6 text-xs font-bold transition-colors">
            <ArrowLeft size={14} />
            Back to Login
          </Link>

          <div className="mb-8">
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              {step === 'phone' ? 'Reset Password' : step === 'otp' ? 'Verify OTP' : 'New Password'}
            </h2>
            <p className="text-[11px] text-white/40 font-bold uppercase tracking-widest mt-1">
              {step === 'phone' ? 'Enter your phone number to receive OTP' : step === 'otp' ? `OTP sent to ${phone}` : 'Create a strong new password'}
            </p>
          </div>

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-8">
              <div className="relative border-b border-white/20 pb-1 focus-within:border-white transition-colors">
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-white" />
                  <span className="text-sm font-black text-white/60">+91</span>
                  <input 
                    type="tel"
                    required
                    placeholder="Mobile Number*"
                    className="flex-1 bg-transparent text-sm font-medium text-white placeholder-white/40 outline-none py-1"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#5cb85c] text-white rounded-lg text-sm font-black uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-50 shadow-lg shadow-green-900/20"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Send OTP"
                )}
              </button>
            </form>
          ) : step === 'otp' ? (
            <div className="space-y-8">
              <div className="flex gap-3 justify-center">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    className="w-10 h-10 text-center text-sm font-black bg-white/5 border-b border-white/20 text-white focus:outline-none focus:border-[#e8612c] transition-colors"
                  />
                ))}
              </div>
              <button 
                onClick={() => setStep('reset')}
                className="w-full h-11 bg-[#5cb85c] text-white rounded-lg text-sm font-black uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center shadow-lg shadow-green-900/20"
              >
                Verify & Continue
              </button>
              <p className="text-center text-[10px] font-bold text-white/40 uppercase tracking-widest">
                Didn't receive code? <button className="text-[#e8612c] hover:underline">Resend</button>
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative border-b border-white/20 pb-1 focus-within:border-white transition-colors">
                <div className="flex items-center gap-3">
                  <Lock size={16} className="text-white" />
                  <input 
                    type="password"
                    required
                    placeholder="New Password*"
                    className="flex-1 bg-transparent text-sm font-medium text-white placeholder-white/40 outline-none py-1"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="relative border-b border-white/20 pb-1 focus-within:border-white transition-colors">
                <div className="flex items-center gap-3">
                  <Lock size={16} className="text-white" />
                  <input 
                    type="password"
                    required
                    placeholder="Confirm New Password*"
                    className="flex-1 bg-transparent text-sm font-medium text-white placeholder-white/40 outline-none py-1"
                  />
                </div>
              </div>
              <button 
                className="w-full h-11 bg-[#5cb85c] text-white rounded-lg text-sm font-black uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center shadow-lg shadow-green-900/20"
                onClick={() => router.push('/auth/login')}
              >
                Reset Password
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
