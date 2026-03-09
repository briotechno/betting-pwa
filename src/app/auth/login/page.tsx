'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Eye, EyeOff, Lock, User, Phone, CheckCircle2, ShieldCheck, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  
  const [loginMode, setLoginMode] = useState<'mobile' | 'userId'>('mobile')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    identifier: '', // Can be phone or userId
    password: ''
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500))
    
    login({
      id: '1',
      username: loginMode === 'mobile' ? `user_${formData.identifier.slice(-4)}` : formData.identifier,
      email: '', // No email required
      balance: 10000,
      tier: 'Beginner'
    })
    
    setLoading(false)
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[#000] flex items-center justify-center p-4 lg:p-8 font-sans">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#e8612c] opacity-[0.03] blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#e8612c] opacity-[0.03] blur-[120px]" />
      </div>

      <div className="w-full max-w-[1100px] grid lg:grid-cols-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] relative z-10">
        
        {/* Left Side: Branding & Info */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#0d0d0d] to-[#000] border-r border-[#1a1a1a]">
          <div>
            <Link href="/" className="inline-flex items-center gap-1.5 mb-12 group">
              <span className="text-4xl font-black italic tracking-tighter text-[#e8612c] group-hover:scale-105 transition-transform">fair</span>
              <span className="text-4xl font-black italic tracking-tighter text-white">play</span>
            </Link>
            
            <h2 className="text-4xl font-black text-white leading-tight mb-6">
              Experience the <br />
              <span className="text-[#e8612c]">Premium</span> Edge of <br />
              Live Betting.
            </h2>
            
            <div className="space-y-6 mt-12">
               {[
                 { title: 'Secure Gateway', desc: 'End-to-end encrypted transactions', icon: <ShieldCheck className="text-[#e8612c]" size={20}/> },
                 { title: 'Instant Payouts', desc: 'Withdraw your winnings in minutes', icon: <CheckCircle2 className="text-[#e8612c]" size={20}/> },
               ].map((item, i) => (
                 <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#e8612c10] flex items-center justify-center shrink-0 border border-[#e8612c20]">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-widest">{item.title}</h4>
                      <p className="text-xs text-[#555] mt-0.5 font-bold">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="pt-8 border-t border-[#1a1a1a]">
             <p className="text-[10px] font-black text-[#333] tracking-[0.4em] uppercase">Trusted by millions globally</p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 lg:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center lg:text-left">
             <h1 className="text-3xl font-black text-white mb-2">Login to Account</h1>
             <p className="text-xs text-[#555] font-bold">Access your dashboard and start winning today.</p>
          </div>

          {/* Login Mode Toggle */}
          <div className="flex p-1.5 bg-[#050505] border border-[#1a1a1a] rounded-2xl mb-8">
            <button 
              onClick={() => setLoginMode('mobile')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                loginMode === 'mobile' ? 'bg-[#e8612c] text-white shadow-lg' : 'text-[#444] hover:text-[#777]'
              }`}
            >
              <Phone size={14} /> Mobile
            </button>
            <button 
              onClick={() => setLoginMode('userId')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                loginMode === 'userId' ? 'bg-[#e8612c] text-white shadow-lg' : 'text-[#444] hover:text-[#777]'
              }`}
            >
              <User size={14} /> User ID
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Identifier Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#444] uppercase tracking-widest ml-1">
                {loginMode === 'mobile' ? 'Mobile Number' : 'User ID / Username'}
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444] group-focus-within:text-[#e8612c] transition-colors">
                   {loginMode === 'mobile' ? <Phone size={18} /> : <User size={18} />}
                </div>
                {loginMode === 'mobile' && (
                  <span className="absolute left-12 top-1/2 -translate-y-1/2 text-sm font-black text-[#555] border-r border-[#1a1a1a] pr-3">+91</span>
                )}
                <input 
                  type={loginMode === 'mobile' ? 'tel' : 'text'}
                  required
                  placeholder={loginMode === 'mobile' ? '70000 00000' : 'Enter your User ID'}
                  className={`w-full bg-[#111] border border-[#1a1a1a] focus:border-[#e8612c] rounded-2xl py-4 ${loginMode === 'mobile' ? 'pl-24' : 'pl-12'} pr-4 text-sm text-white placeholder-[#2a2a2a] outline-none transition-all`}
                  value={formData.identifier}
                  onChange={(e) => setFormData({...formData, identifier: e.target.value})}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-[#444] uppercase tracking-widest">Password</label>
                <Link href="/auth/forgot-password" className="text-[10px] font-black text-[#e8612c] uppercase hover:underline">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444] group-focus-within:text-[#e8612c] transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#111] border border-[#1a1a1a] focus:border-[#e8612c] rounded-2xl py-4 pl-12 pr-12 text-sm text-white placeholder-[#2a2a2a] outline-none transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#444] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-gradient-to-r from-[#e8612c] to-[#f97316] text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Secure Login
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Social Logins */}
          <div className="mt-10">
             <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-[#1a1a1a]" />
                <span className="text-[10px] font-black text-[#333] uppercase tracking-widest">Social Gateway</span>
                <div className="flex-1 h-px bg-[#1a1a1a]" />
             </div>
             
             <button className="w-full bg-[#111] border border-[#1a1a1a] hover:bg-[#1a1a1a] py-4 rounded-2xl flex items-center justify-center gap-3 transition-all group">
                <Image src="https://www.google.com/favicon.ico" alt="Google" width={16} height={16} className="grayscale group-hover:grayscale-0 transition-all" />
                <span className="text-[10px] font-black text-[#888] group-hover:text-white uppercase tracking-widest">Connect with Google</span>
             </button>
          </div>

          <p className="mt-10 text-center text-xs text-[#555] font-bold">
            New to Fairplay? {' '}
            <Link href="/auth/signup" className="text-[#e8612c] font-black uppercase hover:underline tracking-tight">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
